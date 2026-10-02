from __future__ import annotations

from ..issues import Issue, error
from ..schema import Schema


def check_required(row: int, record: dict[str, str], schema: Schema) -> list[Issue]:
    return [
        error(row, c.name, "REQUIRED_MISSING", f"{c.name} is required")
        for c in schema.columns
        if c.required and record.get(c.name, "") == ""
    ]
