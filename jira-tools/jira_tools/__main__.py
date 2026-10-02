"""CLI over offline sample data.

python -m jira_tools release-report --release 2026.10
python -m jira_tools regression-plan --release 2026.10
python -m jira_tools status-history [--now 2026-10-02T12:00:00Z]

Exit codes: release-report returns 1 on HOLD; all commands return 2 on unusable data.
"""

from __future__ import annotations

import argparse
import sys
from datetime import UTC, datetime
from pathlib import Path

from .model import DataError, load_items
from .regression_mapper import format_regression_plan, load_map, regression_plan
from .release_report import format_release_report, release_report
from .status_history import format_history, summarize

DATA = Path(__file__).resolve().parent.parent / "sample-data"


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="jira_tools")
    parser.add_argument("command", choices=["release-report", "regression-plan", "status-history"])
    parser.add_argument("--issues", default=str(DATA / "sample-issues.json"))
    parser.add_argument("--map", default=str(DATA / "regression-map.json"))
    parser.add_argument("--release", default="2026.10")
    parser.add_argument("--now", help="ISO time used as 'now' for durations (default: current time)")
    args = parser.parse_args(argv)
    try:
        items = load_items(args.issues)
    except (DataError, OSError, ValueError) as e:
        print(e, file=sys.stderr)
        return 2

    if args.command == "release-report":
        report = release_report(items, args.release)
        print(format_release_report(report))
        return 1 if report.recommendation == "HOLD" else 0
    if args.command == "regression-plan":
        print(format_regression_plan(regression_plan(items, args.release, load_map(args.map))))
        return 0
    now = datetime.fromisoformat(args.now.replace("Z", "+00:00")) if args.now else datetime.now(UTC)
    print(format_history([summarize(i, now) for i in items if i.history]))
    return 0


if __name__ == "__main__":
    sys.exit(main())
