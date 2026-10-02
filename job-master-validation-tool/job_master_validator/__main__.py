"""CLI: python -m job_master_validator [--data DIR] [--out DIR]

Exit codes: 0 no errors, 1 errors found, 2 export unusable.
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from .checks import run_checks
from .model import ExportError, read_export
from .report import format_report, write_reports

HERE = Path(__file__).resolve().parent.parent


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="job_master_validator", description="Reconcile jobs, loads and activities.")
    parser.add_argument("--data", default=str(HERE / "sample-data" / "with-exceptions"))
    parser.add_argument("--out", default="output")
    args = parser.parse_args(argv)
    try:
        export = read_export(args.data)
    except ExportError as e:
        print(f"Export not usable: {e}", file=sys.stderr)
        return 2
    found = run_checks(export)
    print(format_report(export, found))
    csv_path, json_path = write_reports(export, found, args.out)
    print(f"\nOutput:\n  {csv_path}\n  {json_path}")
    return 1 if any(x.severity == "ERROR" for x in found) else 0


if __name__ == "__main__":
    sys.exit(main())
