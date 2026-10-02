"""Fictional job / load / activity export model, invented for this portfolio."""

from __future__ import annotations

import csv
from dataclasses import dataclass
from pathlib import Path

JOB_STATUSES = ("PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED")
LOAD_STATUSES = ("PLANNED", "IN_TRANSIT", "DELIVERED", "CANCELLED")
ACTIVITY_STATUSES = ("PENDING", "DONE", "SKIPPED")

FILES = {
    "jobs": ("job_ref", "customer_code", "status", "progress_pct"),
    "loads": ("load_ref", "job_ref", "status", "vehicle_id"),
    "activities": ("activity_id", "load_ref", "sequence", "activity_type", "status"),
}


@dataclass(frozen=True)
class Record:
    file: str
    line: int  # file line number (header = 1)
    values: dict[str, str]

    def __getitem__(self, key: str) -> str:
        return self.values.get(key, "")


@dataclass
class Export:
    jobs: list[Record]
    loads: list[Record]
    activities: list[Record]


class ExportError(Exception):
    """The export cannot be reconciled (missing file or column)."""


def read_export(directory: str | Path) -> Export:
    directory = Path(directory)
    data: dict[str, list[Record]] = {}
    problems: list[str] = []
    for name, columns in FILES.items():
        path = directory / f"{name}.csv"
        if not path.is_file():
            problems.append(f"{path.name} is missing")
            continue
        with path.open(encoding="utf-8-sig", newline="") as handle:
            reader = csv.DictReader(handle)
            missing = [c for c in columns if c not in (reader.fieldnames or [])]
            if missing:
                problems.append(f"{path.name} lacks column(s) {', '.join(missing)}")
                continue
            data[name] = [
                Record(name, i + 2, {k: (v or "").strip() for k, v in row.items() if k}) for i, row in enumerate(reader)
            ]
    if problems:
        raise ExportError("; ".join(problems))
    return Export(jobs=data["jobs"], loads=data["loads"], activities=data["activities"])
