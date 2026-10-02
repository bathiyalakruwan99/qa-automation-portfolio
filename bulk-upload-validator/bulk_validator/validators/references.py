from __future__ import annotations

from ..issues import Issue, error
from ..schema import Schema


def check_references(row: int, record: dict[str, str], schema: Schema, lists: dict[str, set[str]]) -> list[Issue]:
    issues = []
    for column in schema.columns:
        value = record.get(column.name, "")
        if not column.reference or value == "":
            continue
        known = lists.get(column.reference)
        if known is None:
            raise ValueError(f'Reference list "{column.reference}" was not provided')
        if value not in known:
            issues.append(
                error(row, column.name, "UNKNOWN_REFERENCE", f"{value} is not a known {column.reference[:-1]}", value)
            )
    return issues
