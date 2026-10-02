from __future__ import annotations

import csv
import shutil
from pathlib import Path

import pytest

from job_data_validator.__main__ import main
from job_data_validator.checks import run_checks
from job_data_validator.model import ExportError, read_export

SAMPLES = Path(__file__).resolve().parent.parent / "sample-data"


@pytest.fixture
def export_dir(tmp_path: Path) -> Path:
    """A writable copy of the clean export; each test plants exactly one defect in it."""
    target = tmp_path / "export"
    shutil.copytree(SAMPLES / "clean", target)
    return target


def edit(directory: Path, file: str, ref: str, **changes: str) -> None:
    path = directory / f"{file}.csv"
    with path.open(encoding="utf-8", newline="") as handle:
        rows = list(csv.DictReader(handle))
    key = next(iter(rows[0]))
    for row in rows:
        if row[key] == ref:
            row.update(changes)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)


def append(directory: Path, file: str, *values: str) -> None:
    with (directory / f"{file}.csv").open("a", encoding="utf-8", newline="") as handle:
        csv.writer(handle).writerow(values)


def codes(directory: Path) -> list[str]:
    return [x.code for x in run_checks(read_export(directory))]


def test_jm_001_clean_export_has_no_exceptions(export_dir):
    assert codes(export_dir) == []
    assert main(["--data", str(export_dir), "--out", str(export_dir / "out")]) == 0


def test_jm_002_orphan_load(export_dir):
    append(export_dir, "loads", "DEMO-LOAD-2100", "DEMO-JOB-9999", "PLANNED", "TRUCK-001")
    assert codes(export_dir) == ["ORPHAN_LOAD"]


def test_jm_003_orphan_activity(export_dir):
    append(export_dir, "activities", "DEMO-ACT-0999", "DEMO-LOAD-9999", "1", "LOADING", "PENDING")
    assert codes(export_dir) == ["ORPHAN_ACTIVITY"]


@pytest.mark.parametrize("value", ["-1", "100.5", "abc", ""])
def test_jm_004_progress_out_of_range(export_dir, value):
    edit(export_dir, "jobs", "DEMO-JOB-1002", progress_pct=value)
    assert codes(export_dir) == ["PROGRESS_OUT_OF_RANGE"]


@pytest.mark.parametrize("value", ["0", "100"])
def test_jm_004b_progress_boundaries_are_valid(export_dir, value):
    edit(export_dir, "jobs", "DEMO-JOB-1003", progress_pct=value)
    found = codes(export_dir)
    assert "PROGRESS_OUT_OF_RANGE" not in found


def test_jm_005_completed_job_below_100(export_dir):
    edit(export_dir, "jobs", "DEMO-JOB-1001", progress_pct="99")
    assert codes(export_dir) == ["COMPLETED_JOB_BELOW_100"]


def test_jm_006_completed_job_with_open_load(export_dir):
    edit(export_dir, "loads", "DEMO-LOAD-2002", status="IN_TRANSIT")
    assert codes(export_dir) == ["COMPLETED_JOB_OPEN_LOADS"]


def test_jm_006b_cancelled_loads_do_not_block_completion(export_dir):
    edit(export_dir, "loads", "DEMO-LOAD-2002", status="CANCELLED")
    assert codes(export_dir) == []


def test_jm_007_duplicate_references(export_dir):
    append(export_dir, "jobs", "DEMO-JOB-1003", "CUST-ALPHA", "PLANNED", "0")
    append(export_dir, "loads", "DEMO-LOAD-2004", "DEMO-JOB-1003", "PLANNED", "REEFER-001")
    found = codes(export_dir)
    assert "DUPLICATE_JOB_REF" in found and "DUPLICATE_LOAD_REF" in found


def test_jm_008_state_conflicts(export_dir):
    edit(export_dir, "loads", "DEMO-LOAD-2004", status="IN_TRANSIT")  # job 1003 is PLANNED
    assert codes(export_dir) == ["STATE_CONFLICT"]


def test_jm_009_delivered_load_with_pending_activity(export_dir):
    edit(export_dir, "loads", "DEMO-LOAD-2003", status="DELIVERED")
    assert "DELIVERED_LOAD_PENDING_ACTIVITIES" in codes(export_dir)


def test_jm_010_unknown_status(export_dir):
    edit(export_dir, "jobs", "DEMO-JOB-1002", status="on hold")
    assert codes(export_dir) == ["UNKNOWN_STATUS"]


def test_jm_011_activity_sequence_problems(export_dir):
    append(export_dir, "activities", "DEMO-ACT-0901", "DEMO-LOAD-2004", "3", "INSPECTION", "PENDING")
    assert codes(export_dir) == ["DUPLICATE_SEQUENCE"]


def test_jm_012_warnings_do_not_fail_the_run(export_dir):
    append(export_dir, "jobs", "DEMO-JOB-1050", "CUST-BETA", "PLANNED", "0")  # active job, no loads
    edit(export_dir, "jobs", "DEMO-JOB-1002", progress_pct="100")  # 100% but still IN_PROGRESS
    found = run_checks(read_export(export_dir))
    assert {x.code for x in found} == {"JOB_WITHOUT_LOADS", "PROGRESS_100_NOT_COMPLETED"}
    assert all(x.severity == "WARNING" for x in found)
    assert main(["--data", str(export_dir), "--out", str(export_dir / "out")]) == 0


def test_jm_013_shipped_export_has_one_finding_per_planted_case():
    found = run_checks(read_export(SAMPLES / "with-exceptions"))
    counts: dict[str, int] = {}
    for x in found:
        counts[x.code] = counts.get(x.code, 0) + 1
    assert all(n == 1 for n in counts.values()), counts
    assert len(counts) == 14
    assert [x.severity for x in found] == sorted((x.severity for x in found), key=["ERROR", "WARNING"].index)


def test_jm_014_unusable_export(tmp_path):
    (tmp_path / "jobs.csv").write_text("job_ref,status\nDEMO-JOB-1,PLANNED\n")
    with pytest.raises(ExportError) as e:
        read_export(tmp_path)
    assert "loads.csv is missing" in str(e.value) and "lacks column(s) customer_code" in str(e.value)
    assert main(["--data", str(tmp_path)]) == 2


def test_jm_015_progress_formula_is_not_inferred(export_dir):
    # 1 of 3 activities done but 40% progress: the tool must not "correct" the product's own number.
    assert codes(export_dir) == []
