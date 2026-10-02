from __future__ import annotations

import csv
import json
from collections import Counter
from pathlib import Path

from .checks import Finding
from .model import Export


def summary(export: Export, found: list[Finding]) -> dict[str, object]:
    errors = [x for x in found if x.severity == "ERROR"]
    return {
        "records": {"jobs": len(export.jobs), "loads": len(export.loads), "activities": len(export.activities)},
        "errors": len(errors),
        "warnings": len(found) - len(errors),
        "by_code": dict(sorted(Counter(x.code for x in found).items())),
        # Evidence for a release review, never an approval.
        "recommendation": "HOLD - resolve errors before release"
        if errors
        else "NO ERRORS - human review still required",
    }


def format_report(export: Export, found: list[Finding], limit: int = 25) -> str:
    s = summary(export, found)
    lines = [
        "Job Data Reconciliation",
        "",
        f"Records checked: {len(export.jobs)} jobs, {len(export.loads)} loads, {len(export.activities)} activities",
        f"Errors: {s['errors']}   Warnings: {s['warnings']}",
        "",
    ]
    if found:
        lines.append("Exceptions:")
        for x in found[:limit]:
            lines.append(f"  [{x.severity}] {x.code} {x.ref} ({x.file}.csv line {x.line}): {x.message}")
        if len(found) > limit:
            lines.append(f"  ... {len(found) - limit} more in the CSV report")
        lines.append("")
    lines.append(f"Recommendation: {s['recommendation']}")
    return "\n".join(lines)


def write_reports(export: Export, found: list[Finding], out_dir: str | Path) -> tuple[Path, Path]:
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    csv_path, json_path = out / "exceptions.csv", out / "summary.json"
    with csv_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=["severity", "code", "file", "line", "ref", "message"])
        writer.writeheader()
        writer.writerows(x.to_dict() for x in found)
    json_path.write_text(json.dumps(summary(export, found), indent=2) + "\n", encoding="utf-8")
    return csv_path, json_path
