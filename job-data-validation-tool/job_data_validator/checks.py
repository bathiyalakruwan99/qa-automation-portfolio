"""Reconciliation checks across jobs, loads and activities.

These are consistency rules that hold whatever formula the product uses for progress. The tool deliberately does
NOT recompute progress from activity counts: an inferred formula that holds on one job shape can be wrong on another,
so it is only asserted once the product owner has specified it.
"""

from __future__ import annotations

from collections import defaultdict
from dataclasses import asdict, dataclass

from .model import ACTIVITY_STATUSES, JOB_STATUSES, LOAD_STATUSES, Export, Record


@dataclass(frozen=True)
class Finding:
    code: str
    severity: str  # "ERROR" (data is inconsistent) | "WARNING" (suspicious, needs a look)
    file: str
    line: int
    ref: str
    message: str

    def to_dict(self) -> dict[str, object]:
        return asdict(self)


def _x(code: str, severity: str, record: Record, ref: str, message: str) -> Finding:
    return Finding(code, severity, record.file, record.line, ref, message)


def check_duplicates(export: Export) -> list[Finding]:
    found = []
    for records, key, code in (
        (export.jobs, "job_ref", "DUPLICATE_JOB_REF"),
        (export.loads, "load_ref", "DUPLICATE_LOAD_REF"),
        (export.activities, "activity_id", "DUPLICATE_ACTIVITY_ID"),
    ):
        first: dict[str, int] = {}
        for r in records:
            ref = r[key]
            if ref in first:
                found.append(_x(code, "ERROR", r, ref, f"{ref} already appears on line {first[ref]}"))
            else:
                first[ref] = r.line
    return found


def check_values(export: Export) -> list[Finding]:
    found = []
    for records, allowed, key in (
        (export.jobs, JOB_STATUSES, "job_ref"),
        (export.loads, LOAD_STATUSES, "load_ref"),
        (export.activities, ACTIVITY_STATUSES, "activity_id"),
    ):
        for r in records:
            if r["status"] not in allowed:
                found.append(
                    _x(
                        "UNKNOWN_STATUS",
                        "ERROR",
                        r,
                        r[key],
                        f'status "{r["status"]}" is not one of {", ".join(allowed)}',
                    )
                )
    for job in export.jobs:
        progress = _number(job["progress_pct"])
        if progress is None or not 0 <= progress <= 100:
            found.append(
                _x(
                    "PROGRESS_OUT_OF_RANGE",
                    "ERROR",
                    job,
                    job["job_ref"],
                    f'progress_pct "{job["progress_pct"]}" must be a number from 0 to 100',
                )
            )
    return found


def check_relationships(export: Export) -> list[Finding]:
    job_refs = {j["job_ref"] for j in export.jobs}
    load_refs = {load["load_ref"] for load in export.loads}
    found = []
    for load in export.loads:
        if load["job_ref"] not in job_refs:
            found.append(
                _x(
                    "ORPHAN_LOAD",
                    "ERROR",
                    load,
                    load["load_ref"],
                    f"parent job {load['job_ref'] or '(blank)'} not found",
                )
            )
    for activity in export.activities:
        if activity["load_ref"] not in load_refs:
            found.append(
                _x(
                    "ORPHAN_ACTIVITY",
                    "ERROR",
                    activity,
                    activity["activity_id"],
                    f"parent load {activity['load_ref'] or '(blank)'} not found",
                )
            )
    loads_by_job = defaultdict(list)
    for load in export.loads:
        loads_by_job[load["job_ref"]].append(load)
    for job in export.jobs:
        if job["status"] != "CANCELLED" and not loads_by_job.get(job["job_ref"]):
            found.append(_x("JOB_WITHOUT_LOADS", "WARNING", job, job["job_ref"], "active job has no loads"))
    return found


def check_status_consistency(export: Export) -> list[Finding]:
    found = []
    loads_by_job: dict[str, list[Record]] = defaultdict(list)
    for load in export.loads:
        loads_by_job[load["job_ref"]].append(load)
    acts_by_load: dict[str, list[Record]] = defaultdict(list)
    for activity in export.activities:
        acts_by_load[activity["load_ref"]].append(activity)

    for job in export.jobs:
        ref, status, progress = job["job_ref"], job["status"], _number(job["progress_pct"])
        loads = [ld for ld in loads_by_job.get(ref, []) if ld["status"] != "CANCELLED"]
        if status == "COMPLETED" and progress is not None and progress < 100:
            found.append(_x("COMPLETED_JOB_BELOW_100", "ERROR", job, ref, f"COMPLETED but progress is {progress:g}%"))
        if progress == 100 and status not in ("COMPLETED", "CANCELLED"):
            found.append(
                _x("PROGRESS_100_NOT_COMPLETED", "WARNING", job, ref, f"progress is 100% but status is {status}")
            )
        open_loads = [ld["load_ref"] for ld in loads if ld["status"] != "DELIVERED"]
        if status == "COMPLETED" and open_loads:
            found.append(
                _x(
                    "COMPLETED_JOB_OPEN_LOADS",
                    "ERROR",
                    job,
                    ref,
                    f"COMPLETED but loads not delivered: {', '.join(open_loads)}",
                )
            )
        moving = [ld["load_ref"] for ld in loads if ld["status"] in ("IN_TRANSIT", "DELIVERED")]
        if status in ("PLANNED", "CANCELLED") and moving:
            found.append(
                _x("STATE_CONFLICT", "ERROR", job, ref, f"job is {status} but loads have moved: {', '.join(moving)}")
            )

    for load in export.loads:
        activities = sorted(acts_by_load.get(load["load_ref"], []), key=lambda a: _number(a["sequence"]) or 0)
        pending = [a["activity_id"] for a in activities if a["status"] == "PENDING"]
        if load["status"] == "DELIVERED" and pending:
            found.append(
                _x(
                    "DELIVERED_LOAD_PENDING_ACTIVITIES",
                    "ERROR",
                    load,
                    load["load_ref"],
                    f"DELIVERED but activities pending: {', '.join(pending)}",
                )
            )
        found += _check_sequence(load, activities)
    return found


def _check_sequence(load: Record, activities: list[Record]) -> list[Finding]:
    found = []
    sequences = [_number(a["sequence"]) for a in activities]
    seen: set[float] = set()
    for activity, seq in zip(activities, sequences, strict=True):
        if seq is None:
            found.append(_x("INVALID_SEQUENCE", "ERROR", activity, activity["activity_id"], "sequence is not a number"))
        elif seq in seen:
            found.append(
                _x("DUPLICATE_SEQUENCE", "ERROR", activity, activity["activity_id"], f"sequence {seq:g} used twice")
            )
        else:
            seen.add(seq)
    numbers = sorted(seen)
    if numbers and numbers != list(range(1, len(numbers) + 1)):
        found.append(
            _x(
                "SEQUENCE_GAP",
                "WARNING",
                load,
                load["load_ref"],
                f"activity sequence is {', '.join(f'{n:g}' for n in numbers)}; expected 1..{len(numbers)}",
            )
        )
    pending_seen = False
    for activity in activities:
        if activity["status"] == "PENDING":
            pending_seen = True
        elif activity["status"] == "DONE" and pending_seen:
            found.append(
                _x(
                    "ACTIVITY_DONE_OUT_OF_ORDER",
                    "WARNING",
                    activity,
                    activity["activity_id"],
                    "DONE while an earlier activity is still PENDING",
                )
            )
    return found


def _number(value: str) -> float | None:
    try:
        number = float(value)
    except ValueError:
        return None
    return number if number == number else None


CHECKS = (check_duplicates, check_values, check_relationships, check_status_consistency)


def run_checks(export: Export) -> list[Finding]:
    order = {"ERROR": 0, "WARNING": 1}
    found = [x for check in CHECKS for x in check(export)]
    return sorted(found, key=lambda x: (order[x.severity], x.code, x.file, x.line))
