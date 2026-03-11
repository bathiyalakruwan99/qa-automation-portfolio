"""
Job Master Load Counting Logic - Test & Analysis Script

Validates and compares load counting methods for Job Master Excel files:
- Non FTL-DISTRIBUTION: Unique Load IDs
- FTL-DISTRIBUTION: Prorated (current), 8x, and 10x methods

See CURRENT_COUNTING_LOGIC.md for full documentation.
"""

import argparse
import math
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

import pandas as pd

import config


# -----------------------------------------------------------------------------
# Configuration
# -----------------------------------------------------------------------------

DEFAULT_INPUT_FILE = Path(config.DEFAULT_INPUT_FILE)
REQUIRED_COLUMNS = {
    "Job ID": "Job identification",
    "Load ID": "Load identification",
    "Trip Type": "Trip classification",
    "Planned Stops: Qty": "Stops count for FTL-DISTRIBUTION",
    "Count: Load and Route Optimiser": "Route optimiser count (optional)",
}


# -----------------------------------------------------------------------------
# Data Structures
# -----------------------------------------------------------------------------

@dataclass
class FileAnalysis:
    """Summary of input file structure and content."""
    total_records: int
    total_columns: int
    columns_present: dict[str, bool]
    ftl_distribution_count: int
    non_ftl_count: int


@dataclass
class NonFtlLoads:
    """Non FTL-DISTRIBUTION load counting results."""
    unique_load_ids: int
    has_load_id_column: bool


@dataclass
class FtlDistributionLoads:
    """FTL-DISTRIBUTION load counting results (all three methods)."""
    trips_with_load_id: int
    trips_without_load_id: int
    current_prorated: float
    method_8x: float
    method_10x: float


@dataclass
class LoadCountSummary:
    """Complete load count summary across all categories."""
    non_ftl: int
    ftl_current: float
    ftl_8x: float
    ftl_10x: float
    total_current: float
    total_8x: float
    total_10x: float


@dataclass
class CountingTestResult:
    """Full result of a counting logic test run."""
    file_path: Path
    file_analysis: FileAnalysis
    non_ftl_loads: NonFtlLoads
    ftl_loads: FtlDistributionLoads
    summary: LoadCountSummary
    route_optimiser_status: Optional[str] = None


# -----------------------------------------------------------------------------
# Core Logic Functions
# -----------------------------------------------------------------------------

def analyze_file(df: pd.DataFrame) -> FileAnalysis:
    """Analyze file structure and basic statistics."""
    columns_present = {
        col: col in df.columns for col in REQUIRED_COLUMNS
    }
    ftl_data = df[df["Trip Type"] == "FTL-DISTRIBUTION"] if "Trip Type" in df.columns else pd.DataFrame()
    non_ftl_data = df[df["Trip Type"] != "FTL-DISTRIBUTION"] if "Trip Type" in df.columns else df

    return FileAnalysis(
        total_records=len(df),
        total_columns=len(df.columns),
        columns_present=columns_present,
        ftl_distribution_count=len(ftl_data),
        non_ftl_count=len(non_ftl_data),
    )


def count_non_ftl_loads(df: pd.DataFrame) -> NonFtlLoads:
    """Count unique loads for non FTL-DISTRIBUTION records."""
    non_ftl = df[df["Trip Type"] != "FTL-DISTRIBUTION"] if "Trip Type" in df.columns else df

    if "Load ID" not in non_ftl.columns:
        return NonFtlLoads(unique_load_ids=0, has_load_id_column=False)

    load_ids = non_ftl["Load ID"].astype(str).str.strip()
    load_ids = load_ids[load_ids.ne("") & load_ids.ne("nan")]
    return NonFtlLoads(
        unique_load_ids=load_ids.nunique(),
        has_load_id_column=True,
    )


def count_ftl_distribution_loads(df: pd.DataFrame) -> FtlDistributionLoads:
    """Count FTL-DISTRIBUTION loads using all three methods."""
    ftl_data = df[df["Trip Type"] == "FTL-DISTRIBUTION"] if "Trip Type" in df.columns else pd.DataFrame()

    trips_with_load_id = 0
    trips_without_load_id = 0
    ftl_current = 0.0
    ftl_8x = 0.0
    ftl_10x = 0.0

    if ftl_data.empty or "Planned Stops: Qty" not in ftl_data.columns:
        return FtlDistributionLoads(
            trips_with_load_id=0,
            trips_without_load_id=0,
            current_prorated=0.0,
            method_8x=0.0,
            method_10x=0.0,
        )

    for _, row in ftl_data.iterrows():
        has_load_id = _row_has_valid_load_id(row)
        if not has_load_id:
            trips_without_load_id += 1
            continue

        if pd.isna(row["Planned Stops: Qty"]):
            continue

        stops_qty = int(row["Planned Stops: Qty"])
        loads_current = _prorated_loads(stops_qty)
        loads_8x = math.ceil(stops_qty / 8)
        loads_10x = math.ceil(stops_qty / 10)

        ftl_current += loads_current
        ftl_8x += loads_8x
        ftl_10x += loads_10x
        trips_with_load_id += 1

    return FtlDistributionLoads(
        trips_with_load_id=trips_with_load_id,
        trips_without_load_id=trips_without_load_id,
        current_prorated=ftl_current,
        method_8x=ftl_8x,
        method_10x=ftl_10x,
    )


def _row_has_valid_load_id(row: pd.Series) -> bool:
    """Check if row has a valid non-empty Load ID."""
    if "Load ID" not in row:
        return False
    load_id_str = str(row["Load ID"]).strip()
    return load_id_str != "" and load_id_str.lower() != "nan"


def _prorated_loads(stops_qty: int) -> float:
    """Calculate prorated load count based on stops (≤8 = 1, else base + remainder/8)."""
    if stops_qty <= 8:
        return 1.0
    base_loads = stops_qty // 8
    remaining = stops_qty % 8
    return float(base_loads) if remaining == 0 else base_loads + (remaining / 8)


def check_route_optimiser_column(df: pd.DataFrame) -> Optional[str]:
    """Check status of Count: Load and Route Optimiser column."""
    col = "Count: Load and Route Optimiser"
    if col not in df.columns:
        return "Column not present"
    non_null = df[col].notna().sum()
    if non_null > 0:
        return f"WARNING: {non_null} non-null values - may affect counting logic"
    return "OK: Column empty, no impact on counting"


# -----------------------------------------------------------------------------
# Main Runner
# -----------------------------------------------------------------------------

def run_counting_test(file_path: Path) -> CountingTestResult:
    """Run full counting logic test on an Excel file."""
    df = pd.read_excel(file_path)
    file_analysis = analyze_file(df)
    non_ftl_loads = count_non_ftl_loads(df)
    ftl_loads = count_ftl_distribution_loads(df)
    route_status = check_route_optimiser_column(df)

    summary = LoadCountSummary(
        non_ftl=non_ftl_loads.unique_load_ids,
        ftl_current=ftl_loads.current_prorated,
        ftl_8x=ftl_loads.method_8x,
        ftl_10x=ftl_loads.method_10x,
        total_current=non_ftl_loads.unique_load_ids + ftl_loads.current_prorated,
        total_8x=non_ftl_loads.unique_load_ids + ftl_loads.method_8x,
        total_10x=non_ftl_loads.unique_load_ids + ftl_loads.method_10x,
    )

    return CountingTestResult(
        file_path=file_path,
        file_analysis=file_analysis,
        non_ftl_loads=non_ftl_loads,
        ftl_loads=ftl_loads,
        summary=summary,
        route_optimiser_status=route_status,
    )


# -----------------------------------------------------------------------------
# Output Formatting
# -----------------------------------------------------------------------------

def format_result(result: CountingTestResult) -> str:
    """Format test result as readable report."""
    lines = [
        "=" * 50,
        "JOB MASTER LOAD COUNTING - TEST REPORT",
        "=" * 50,
        f"Input file: {result.file_path}",
        "",
        "--- FILE ANALYSIS ---",
        f"Total records: {result.file_analysis.total_records}",
        f"Columns: {result.file_analysis.total_columns}",
        "Key columns present:",
    ]
    for col, present in result.file_analysis.columns_present.items():
        lines.append(f"  - {col}: {'✓' if present else '✗'}")

    lines.extend([
        "",
        "--- DATA SEPARATION ---",
        f"FTL-DISTRIBUTION records: {result.file_analysis.ftl_distribution_count}",
        f"Non FTL-DISTRIBUTION records: {result.file_analysis.non_ftl_count}",
        "",
        "--- NON FTL-DISTRIBUTION LOADS ---",
        f"Unique Load IDs: {result.non_ftl_loads.unique_load_ids}" if result.non_ftl_loads.has_load_id_column else "Load ID column not found",
        "",
        "--- FTL-DISTRIBUTION LOADS ---",
        f"Trips with Load ID: {result.ftl_loads.trips_with_load_id}",
        f"Trips without Load ID: {result.ftl_loads.trips_without_load_id}",
        f"Current (Prorated): {result.ftl_loads.current_prorated:.3f}",
        f"8x Logic: {result.ftl_loads.method_8x:.0f}",
        f"10x Logic: {result.ftl_loads.method_10x:.0f}",
        "",
        "--- TOTAL LOADS ---",
        f"Non FTL-DISTRIBUTION: {result.summary.non_ftl}",
        f"FTL-DISTRIBUTION Current: {result.summary.ftl_current:.3f}",
        f"FTL-DISTRIBUTION 8x: {result.summary.ftl_8x:.0f}",
        f"FTL-DISTRIBUTION 10x: {result.summary.ftl_10x:.0f}",
        "",
        f"Total Current: {result.summary.total_current:.3f}",
        f"Total 8x: {result.summary.total_8x:.0f}",
        f"Total 10x: {result.summary.total_10x:.0f}",
        "",
        "--- ROUTE OPTIMISER ---",
        result.route_optimiser_status or "N/A",
    ])
    return "\n".join(lines)


# -----------------------------------------------------------------------------
# CLI Entry Point
# -----------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Test Job Master load counting logic on Excel files.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="Example: python test_counting_logic.py data/input/job-master.xlsx",
    )
    parser.add_argument(
        "file",
        type=Path,
        nargs="?",
        default=DEFAULT_INPUT_FILE,
        help=f"Path to Excel file (default: {DEFAULT_INPUT_FILE})",
    )
    parser.add_argument(
        "-q", "--quiet",
        action="store_true",
        help="Only print total counts (minimal output)",
    )
    args = parser.parse_args()

    if not args.file.exists():
        print(f"Error: File not found: {args.file}")
        return

    result = run_counting_test(args.file)

    if args.quiet:
        print(f"Total Current: {result.summary.total_current:.3f}")
        print(f"Total 8x: {result.summary.total_8x:.0f}")
        print(f"Total 10x: {result.summary.total_10x:.0f}")
    else:
        print(format_result(result))


if __name__ == "__main__":
    main()
