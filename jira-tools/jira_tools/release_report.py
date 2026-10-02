"""Release readiness: one state per work item in a release, and a recommendation that is never an approval."""

from __future__ import annotations

from dataclasses import dataclass

from .model import DONE_STATUSES, WorkItem

SEVERE = ("Blocker", "Critical")


@dataclass(frozen=True)
class Readiness:
    key: str
    state: str  # READY | READY_WITH_RISK | NOT_READY | BLOCKED
    reason: str


def assess(item: WorkItem, items_by_key: dict[str, WorkItem]) -> Readiness:
    open_defects = [items_by_key[k] for k in item.open_defects if k in items_by_key]
    severe = [d.key for d in open_defects if d.priority in SEVERE]
    if severe:
        return Readiness(item.key, "BLOCKED", f"open {'/'.join(SEVERE).lower()} defect(s): {', '.join(severe)}")
    if item.status not in DONE_STATUSES:
        return Readiness(item.key, "NOT_READY", f"status is {item.status}")
    if item.type == "Bug" and item.status != "Verified":
        return Readiness(item.key, "NOT_READY", "bug fix is Done but not Verified by QA")
    if open_defects or "known-issue" in item.labels:
        detail = ", ".join(d.key for d in open_defects) or "labelled known-issue"
        return Readiness(item.key, "READY_WITH_RISK", f"accepted known issue(s): {detail}")
    return Readiness(item.key, "READY", f"status is {item.status}")


@dataclass(frozen=True)
class ReleaseReport:
    release: str
    rows: list[Readiness]

    def count(self, state: str) -> int:
        return sum(1 for r in self.rows if r.state == state)

    @property
    def recommendation(self) -> str:
        if self.count("BLOCKED") or self.count("NOT_READY"):
            return "HOLD"
        if self.count("READY_WITH_RISK"):
            return "READY WITH KNOWN RISK - needs explicit sign-off"
        return "READY FOR HUMAN SIGN-OFF"


def release_report(items: list[WorkItem], release: str) -> ReleaseReport:
    by_key = {i.key: i for i in items}
    scope = [i for i in items if i.fix_version == release]
    order = {"BLOCKED": 0, "NOT_READY": 1, "READY_WITH_RISK": 2, "READY": 3}
    rows = sorted((assess(i, by_key) for i in scope), key=lambda r: (order[r.state], r.key))
    return ReleaseReport(release, rows)


def format_release_report(report: ReleaseReport) -> str:
    lines = [f"Release readiness: {report.release}", "", f"Items in scope: {len(report.rows)}"]
    for state in ("READY", "READY_WITH_RISK", "NOT_READY", "BLOCKED"):
        lines.append(f"  {state}: {report.count(state)}")
    lines.append("")
    for r in report.rows:
        lines.append(f"  {r.key:<9} {r.state:<16} {r.reason}")
    lines += ["", f"Recommendation: {report.recommendation}", "The go/hold decision is made by the release owner."]
    return "\n".join(lines)
