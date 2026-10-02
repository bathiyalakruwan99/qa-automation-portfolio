"""Runs every check over an upload file and returns a structured result."""

from __future__ import annotations

from collections import Counter
from dataclasses import dataclass, field
from pathlib import Path

from .issues import Issue
from .readers import Table, read_reference_lists, read_table
from .schema import SHIPMENT_UPLOAD_V1, Schema
from .validators.cross_field import RULES
from .validators.duplicates import DuplicateTracker
from .validators.formats import check_formats
from .validators.references import check_references
from .validators.required_fields import check_required
from .validators.structure import check_header, classify_row, strip_whitespace


@dataclass
class ValidationResult:
    source: str
    schema: str
    rows_checked: int = 0
    valid_rows: int = 0
    issues: list[Issue] = field(default_factory=list)

    @property
    def fatal(self) -> bool:
        return any(i.severity == "FATAL" for i in self.issues)

    @property
    def rows_with_errors(self) -> int:
        return len({i.row for i in self.issues if i.severity == "ERROR"})

    @property
    def rows_with_warnings_only(self) -> int:
        errors = {i.row for i in self.issues if i.severity == "ERROR"}
        return len({i.row for i in self.issues if i.severity == "WARNING" and i.row > 1} - errors)

    def counts(self) -> Counter[str]:
        return Counter(i.code for i in self.issues)

    def summary(self) -> dict[str, object]:
        return {
            "source": self.source,
            "schema": self.schema,
            "fatal": self.fatal,
            "rows_checked": self.rows_checked,
            "valid_rows": self.valid_rows,
            "rows_with_errors": self.rows_with_errors,
            "rows_with_warnings_only": self.rows_with_warnings_only,
            "issue_counts": dict(sorted(self.counts().items())),
        }


def validate_table(
    table: Table, references: dict[str, set[str]], schema: Schema = SHIPMENT_UPLOAD_V1
) -> ValidationResult:
    result = ValidationResult(source=table.source, schema=schema.name)
    result.issues.extend(check_header(table, schema))
    if result.fatal:
        return result

    header = [h.strip() for h in table.header]
    duplicates = DuplicateTracker(schema)
    for row_number, cells in table.rows:
        shape = classify_row(row_number, cells, header)
        if shape is not None:
            result.issues.append(shape)
            continue
        result.rows_checked += 1
        record, row_issues = strip_whitespace(row_number, dict(zip(header, cells, strict=True)))
        row_issues += check_required(row_number, record, schema)
        format_issues = check_formats(row_number, record, schema)
        row_issues += format_issues
        row_issues += check_references(row_number, record, schema, references)
        row_issues += duplicates.check(row_number, record)
        # A rule whose input cells already failed is skipped: one bad date is one finding, not three.
        bad_cells = {i.column for i in format_issues}
        for rule_name in schema.cross_field_rules:
            columns, rule = RULES[rule_name]
            if not bad_cells.intersection(columns):
                row_issues += rule(row_number, record)
        result.issues.extend(row_issues)
        if not any(i.severity == "ERROR" for i in row_issues):
            result.valid_rows += 1
    return result


def validate_file(path: str | Path, reference_dir: str | Path, schema: Schema = SHIPMENT_UPLOAD_V1) -> ValidationResult:
    return validate_table(read_table(path), read_reference_lists(reference_dir), schema)
