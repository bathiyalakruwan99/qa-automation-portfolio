"""Status-history analysis: time in each status, reopen count, and items stuck in QA."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime

from .model import DONE_STATUSES, WorkItem


@dataclass(frozen=True)
class HistorySummary:
    key: str
    hours_in_status: dict[str, float]
    reopen_count: int
    flags: tuple[str, ...]


def summarize(item: WorkItem, now: datetime, long_in_qa_hours: float = 72) -> HistorySummary:
    hours: dict[str, float] = {}
    reopens = 0
    transitions = list(item.history)
    for i, t in enumerate(transitions):
        end = transitions[i + 1].at if i + 1 < len(transitions) else now
        hours[t.to_status] = hours.get(t.to_status, 0.0) + (end - t.at).total_seconds() / 3600
        if t.from_status in DONE_STATUSES and t.to_status not in DONE_STATUSES:
            reopens += 1
    flags: list[str] = []
    if reopens:
        flags.append(f"REOPENED x{reopens}")
    if hours.get("In QA", 0) > long_in_qa_hours:
        flags.append(f"LONG_IN_QA ({hours['In QA']:.0f} h > {long_in_qa_hours:.0f} h)")
    if transitions and transitions[-1].to_status != item.status:
        flags.append(f"HISTORY_MISMATCH (history ends in {transitions[-1].to_status}, status is {item.status})")
    return HistorySummary(item.key, {k: round(v, 1) for k, v in hours.items()}, reopens, tuple(flags))


def format_history(summaries: list[HistorySummary]) -> str:
    lines = ["Status history", ""]
    for s in summaries:
        spent = ", ".join(f"{status} {h:g} h" for status, h in s.hours_in_status.items())
        lines.append(f"  {s.key:<9} {spent}")
        for flag in s.flags:
            lines.append(f"            ! {flag}")
    return "\n".join(lines)
