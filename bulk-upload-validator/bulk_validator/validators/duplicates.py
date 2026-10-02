from __future__ import annotations

from ..issues import Issue, error
from ..schema import Schema


class DuplicateTracker:
    """Flags the second and later occurrences of a unique value, pointing back at the first row."""

    def __init__(self, schema: Schema) -> None:
        self._first_seen: dict[str, dict[str, int]] = {c.name: {} for c in schema.columns if c.unique}

    def check(self, row: int, record: dict[str, str]) -> list[Issue]:
        issues = []
        for name, seen in self._first_seen.items():
            value = record.get(name, "")
            if value == "":
                continue
            # Compare case-insensitively: SHP-1 and shp-1 would collide in most target systems.
            key = value.upper()
            if key in seen:
                issues.append(
                    error(row, name, "DUPLICATE_VALUE", f"{name} {value} already used in row {seen[key]}", value)
                )
            else:
                seen[key] = row
        return issues
