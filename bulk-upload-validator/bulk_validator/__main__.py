"""CLI: python -m bulk_validator FILE [--reference-dir DIR] [--out DIR]

Exit codes: 0 no errors, 1 row errors found, 2 file rejected (fatal) or bad arguments.
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from .reporting import format_summary, write_reports
from .validate import validate_file

HERE = Path(__file__).resolve().parent.parent


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="bulk_validator", description="Validate a shipment upload file.")
    parser.add_argument("file", help=".csv or .xlsx upload file")
    parser.add_argument("--reference-dir", default=str(HERE / "sample-data" / "reference"))
    parser.add_argument("--out", default="output", help="directory for the CSV report and JSON summary")
    args = parser.parse_args(argv)

    if not Path(args.file).is_file():
        print(f"File not found: {args.file}", file=sys.stderr)
        return 2
    result = validate_file(args.file, args.reference_dir)
    print(format_summary(result))
    csv_path, json_path = write_reports(result, args.out)
    print(f"\nOutput:\n  {csv_path}\n  {json_path}")
    if result.fatal:
        return 2
    return 1 if result.rows_with_errors else 0


if __name__ == "__main__":
    sys.exit(main())
