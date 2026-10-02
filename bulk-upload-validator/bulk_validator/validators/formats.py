"""Type, pattern, range and enum checks for single cells. Empty optional cells are skipped."""

from __future__ import annotations

import re
from datetime import date

from ..issues import Issue, error
from ..schema import Column, Schema

EMAIL = re.compile(r"^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$")


def parse_number(value: str) -> float | None:
    try:
        number = float(value)
    except ValueError:
        return None
    return number if number == number and abs(number) != float("inf") else None


def parse_date(value: str) -> date | None:
    """Only ISO-8601 calendar dates (YYYY-MM-DD) are accepted: 03/04/2026 is ambiguous and is rejected."""
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", value):
        return None
    try:
        return date.fromisoformat(value)
    except ValueError:
        return None


def _check(row: int, column: Column, value: str) -> Issue | None:
    if column.kind == "number":
        number = parse_number(value)
        if number is None:
            return error(row, column.name, "INVALID_NUMBER", f"{column.name} must be a number", value)
        if (column.minimum is not None and number < column.minimum) or (
            column.maximum is not None and number > column.maximum
        ):
            return error(
                row,
                column.name,
                "OUT_OF_RANGE",
                f"{column.name} must be between {column.minimum:g} and {column.maximum:g}",
                value,
            )
    elif column.kind == "date":
        if parse_date(value) is None:
            return error(row, column.name, "INVALID_DATE", f"{column.name} must be a real date in YYYY-MM-DD", value)
    elif column.kind == "email":
        if not EMAIL.match(value):
            return error(row, column.name, "INVALID_EMAIL", f"{column.name} is not a valid e-mail address", value)
    elif column.kind == "enum":
        if value not in column.allowed:
            hint = " (values are case-sensitive)" if value.upper() in column.allowed else ""
            return error(
                row,
                column.name,
                "INVALID_ENUM",
                f"{column.name} must be one of {', '.join(column.allowed)}{hint}",
                value,
            )
    if column.pattern and not re.fullmatch(column.pattern, value):
        return error(row, column.name, "PATTERN_MISMATCH", f"{column.name} does not match {column.pattern}", value)
    return None


def check_formats(row: int, record: dict[str, str], schema: Schema) -> list[Issue]:
    issues = []
    for column in schema.columns:
        value = record.get(column.name, "")
        if value == "":
            continue
        found = _check(row, column, value)
        if found:
            issues.append(found)
    return issues
