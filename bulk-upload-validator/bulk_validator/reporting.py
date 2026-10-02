from __future__ import annotations

import csv
import json
from pathlib import Path

from .validate import ValidationResult

FORMAT_CODES = ("INVALID_NUMBER", "INVALID_DATE", "INVALID_EMAIL", "PATTERN_MISMATCH", "OUT_OF_RANGE", "INVALID_ENUM")
CROSS_FIELD_CODES = (
    "SAME_ORIGIN_DESTINATION",
    "DELIVERY_BEFORE_PICKUP",
    "COORDINATE_PAIR_INCOMPLETE",
    "REEFER_TEMPERATURE_MISSING",
)


def format_summary(result: ValidationResult) -> str:
    counts = result.counts()
    lines = [
        "Validation Summary",
        "",
        f"File: {Path(result.source).name}   Schema: {result.schema}",
        "",
    ]
    if result.fatal:
        lines.append("FILE REJECTED - fix these before any row can be checked:")
        lines += [f"  {i.code}: {i.message}" for i in result.issues if i.severity == "FATAL"]
        return "\n".join(lines)
    warnings = sum(1 for i in result.issues if i.severity == "WARNING")
    errors = sum(1 for i in result.issues if i.severity == "ERROR")
    lines += [
        f"Rows checked: {result.rows_checked}",
        "",
        f"Valid rows: {result.valid_rows}",
        f"Rows with errors: {result.rows_with_errors}",
        f"Warnings: {warnings}",
        f"Errors: {errors}",
        "",
        f"Duplicate IDs: {counts['DUPLICATE_VALUE']}",
        f"Missing required fields: {counts['REQUIRED_MISSING']}",
        f"Invalid formats: {sum(counts[c] for c in FORMAT_CODES)}",
        f"Invalid references: {counts['UNKNOWN_REFERENCE']}",
        f"Cross-field rule breaks: {sum(counts[c] for c in CROSS_FIELD_CODES)}",
        f"Structural (blank rows, repeated header): {counts['BLANK_ROW'] + counts['REPEATED_HEADER']}",
        "",
        "By code: " + ", ".join(f"{code} {n}" for code, n in sorted(counts.items())) if counts else "By code: none",
    ]
    return "\n".join(lines)


def write_reports(result: ValidationResult, out_dir: str | Path) -> tuple[Path, Path]:
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    stem = Path(result.source).stem
    csv_path = out / f"{stem}.validation-report.csv"
    json_path = out / f"{stem}.validation-summary.json"
    with csv_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=["row", "column", "code", "severity", "message", "value"])
        writer.writeheader()
        for issue in sorted(result.issues, key=lambda i: (i.row, i.column, i.code)):
            writer.writerow(issue.to_dict())
    json_path.write_text(json.dumps(result.summary(), indent=2) + "\n", encoding="utf-8")
    return csv_path, json_path
