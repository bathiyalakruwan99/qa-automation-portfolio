"""File-level and row-shape checks: empty files, header problems, blank rows, repeated headers, whitespace."""

from __future__ import annotations

from ..issues import Issue, error, fatal, warning
from ..readers import Table
from ..schema import Schema


def check_header(table: Table, schema: Schema) -> list[Issue]:
    if not table.header and not table.rows:
        return [fatal("EMPTY_FILE", "The file has no header and no rows")]
    issues: list[Issue] = []
    header = [h.strip() for h in table.header]
    seen: set[str] = set()
    for name in header:
        if name in seen:
            issues.append(fatal("DUPLICATE_COLUMN", f'Column "{name}" appears more than once'))
        seen.add(name)
    for column in schema.columns:
        if column.required and column.name not in header:
            issues.append(fatal("MISSING_COLUMN", f'Required column "{column.name}" is missing'))
    for name in header:
        if name and schema.column(name) is None:
            issues.append(warning(1, name, "UNKNOWN_COLUMN", f'Column "{name}" is not in {schema.name}; it is ignored'))
    if not table.rows:
        issues.append(fatal("EMPTY_FILE", "The file has a header but no data rows"))
    return issues


def classify_row(row_number: int, cells: list[str], header: list[str]) -> Issue | None:
    """Blank rows are skipped with a warning; a pasted second header row is an error."""
    if all(c.strip() == "" for c in cells):
        return warning(row_number, "", "BLANK_ROW", "Blank row skipped")
    normalized = [c.strip().lower() for c in cells]
    if normalized == [h.strip().lower() for h in header]:
        return error(row_number, "", "REPEATED_HEADER", "The header row is repeated inside the data")
    return None


def strip_whitespace(row_number: int, record: dict[str, str]) -> tuple[dict[str, str], list[Issue]]:
    """Leading/trailing spaces are corrected (and reported) before any other check sees the value."""
    issues: list[Issue] = []
    cleaned: dict[str, str] = {}
    for name, value in record.items():
        stripped = value.strip()
        if stripped != value and stripped != "":
            issues.append(warning(row_number, name, "WHITESPACE", "Leading/trailing spaces removed", value))
        cleaned[name] = stripped
    return cleaned, issues
