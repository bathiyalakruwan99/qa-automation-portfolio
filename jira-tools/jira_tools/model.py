"""Offline work-item model. Fields mirror what a ticketing system exports; all sample data is fictional."""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path

DONE_STATUSES = ("Verified", "Done")
OPEN_STATUSES = ("To Do", "In Progress", "In Review", "In QA", "Reopened")
ALL_STATUSES = OPEN_STATUSES + DONE_STATUSES


@dataclass(frozen=True)
class Transition:
    at: datetime
    from_status: str | None
    to_status: str


@dataclass(frozen=True)
class WorkItem:
    key: str
    summary: str
    type: str  # Story | Bug | Task
    status: str
    priority: str  # Blocker | Critical | Major | Minor
    fix_version: str
    components: tuple[str, ...] = ()
    labels: tuple[str, ...] = ()
    regression_required: bool = False
    # Keys of defects found against this item that are still open.
    open_defects: tuple[str, ...] = ()
    history: tuple[Transition, ...] = field(default_factory=tuple)


class DataError(ValueError):
    pass


def _parse_time(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def load_items(path: str | Path) -> list[WorkItem]:
    raw = json.loads(Path(path).read_text(encoding="utf-8"))
    items: list[WorkItem] = []
    problems: list[str] = []
    for i, entry in enumerate(raw.get("issues", [])):
        key = entry.get("key", f"#{i}")
        missing = [f for f in ("key", "summary", "type", "status", "priority", "fixVersion") if not entry.get(f)]
        if missing:
            problems.append(f"{key}: missing {', '.join(missing)}")
            continue
        if entry["status"] not in ALL_STATUSES:
            problems.append(f"{key}: unknown status {entry['status']!r}")
            continue
        history = tuple(
            Transition(_parse_time(t["at"]), t.get("from"), t["to"])
            for t in sorted(entry.get("history", []), key=lambda t: t["at"])
        )
        items.append(
            WorkItem(
                key=entry["key"],
                summary=entry["summary"],
                type=entry["type"],
                status=entry["status"],
                priority=entry["priority"],
                fix_version=entry["fixVersion"],
                components=tuple(entry.get("components", [])),
                labels=tuple(entry.get("labels", [])),
                regression_required=bool(entry.get("regressionRequired", False)),
                open_defects=tuple(entry.get("openDefects", [])),
                history=history,
            )
        )
    if problems:
        raise DataError("Sample data is not usable:\n  - " + "\n  - ".join(problems))
    return items
