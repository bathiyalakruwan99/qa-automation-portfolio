from __future__ import annotations

import csv
import time
from pathlib import Path

import pytest

from bulk_validator.__main__ import main
from bulk_validator.readers import Table, read_reference_lists, read_table
from bulk_validator.schema import SHIPMENT_UPLOAD_V1
from bulk_validator.validate import validate_file, validate_table
from generate_demo_data import FAULTS, generate, write

ROOT = Path(__file__).resolve().parent.parent
SAMPLES = ROOT / "sample-data"
REFS = read_reference_lists(SAMPLES / "reference")
HEADER = SHIPMENT_UPLOAD_V1.names
GOOD = {
    "shipment_ref": "SHP-30001",
    "customer_code": "CUST-ALPHA",
    "origin_code": "WAREHOUSE-ALPHA",
    "destination_code": "SITE-DELTA",
    "vehicle_type": "TRUCK",
    "weight_kg": "1200",
    "pickup_date": "2026-01-10",
    "delivery_date": "2026-01-11",
    "dest_lat": "",
    "dest_lng": "",
    "temperature_c": "",
    "contact_email": "",
}


def table(*records: dict[str, str], header: list[str] | None = None) -> Table:
    header = header or HEADER
    return Table(
        header=header, rows=[(i + 2, [r.get(h, "") for h in header]) for i, r in enumerate(records)], source="t.csv"
    )


def codes(*records: dict[str, str]) -> list[str]:
    return sorted(i.code for i in validate_table(table(*records), REFS).issues)


def row(**changes: str) -> dict[str, str]:
    return {**GOOD, **changes}


def test_val_000_a_good_row_is_valid():
    result = validate_table(table(row()), REFS)
    assert result.issues == [] and result.valid_rows == 1


def test_val_001_required_field():
    assert codes(row(customer_code="")) == ["REQUIRED_MISSING"]
    assert codes(row(customer_code="   ")) == ["REQUIRED_MISSING"], "whitespace-only counts as empty"


def test_val_002_duplicate_id_points_to_first_row():
    result = validate_table(table(row(), row(shipment_ref="shp-30001"), row(shipment_ref="SHP-30001")), REFS)
    dups = [i for i in result.issues if i.code == "DUPLICATE_VALUE"]
    assert [i.row for i in dups] == [3, 4] and all("row 2" in i.message for i in dups)


@pytest.mark.parametrize("value", ["2026-02-30", "10/01/2026", "2026-1-5", "tomorrow"])
def test_val_003_invalid_date(value):
    assert codes(row(pickup_date=value)) == ["INVALID_DATE"]


def test_val_003b_leap_day_is_a_real_date():
    assert codes(row(pickup_date="2028-02-29", delivery_date="2028-03-01")) == []


@pytest.mark.parametrize(
    "lat,lng,expected",
    [
        ("90", "180", []),
        ("90.0001", "0", ["OUT_OF_RANGE"]),
        ("0", "-180.5", ["OUT_OF_RANGE"]),
        ("north", "0", ["INVALID_NUMBER"]),
        ("37.7", "", ["COORDINATE_PAIR_INCOMPLETE"]),
    ],
)
def test_val_004_coordinates(lat, lng, expected):
    assert codes(row(dest_lat=lat, dest_lng=lng)) == expected


def test_val_004b_bad_coordinate_does_not_cascade():
    # An out-of-range latitude is one finding; the pair rule must not also fire.
    assert codes(row(dest_lat="137.7", dest_lng="-122.4")) == ["OUT_OF_RANGE"]


def test_val_005_invalid_reference():
    assert codes(row(destination_code="SITE-NOWHERE")) == ["UNKNOWN_REFERENCE"]
    assert codes(row(customer_code="CUST-OMEGA")) == ["UNKNOWN_REFERENCE"]


def test_val_006_unsupported_enum_with_case_hint():
    result = validate_table(table(row(vehicle_type="truck")), REFS)
    assert [i.code for i in result.issues] == ["INVALID_ENUM"]
    assert "case-sensitive" in result.issues[0].message
    assert codes(row(vehicle_type="BICYCLE")) == ["INVALID_ENUM"]


@pytest.mark.parametrize(
    "changes,expected",
    [
        ({"vehicle_type": "REEFER"}, ["REEFER_TEMPERATURE_MISSING"]),
        ({"vehicle_type": "REEFER", "temperature_c": "-18"}, []),
        ({"vehicle_type": "REEFER", "temperature_c": "12"}, ["OUT_OF_RANGE"]),
        ({"temperature_c": "4"}, ["TEMPERATURE_NOT_APPLICABLE"]),
        ({"pickup_date": "2026-01-12", "delivery_date": "2026-01-11"}, ["DELIVERY_BEFORE_PICKUP"]),
        ({"pickup_date": "2026-01-12", "delivery_date": "2026-01-12"}, []),
        ({"destination_code": "WAREHOUSE-ALPHA"}, ["SAME_ORIGIN_DESTINATION"]),
    ],
)
def test_val_007_cross_field_dependencies(changes, expected):
    assert codes(row(**changes)) == expected


def test_val_008_whitespace_is_corrected_and_reported():
    result = validate_table(table(row(customer_code="  CUST-ALPHA ")), REFS)
    assert [i.code for i in result.issues] == ["WHITESPACE"]
    assert result.valid_rows == 1, "a corrected value must pass the later checks"


def test_val_009_empty_file(tmp_path):
    empty = tmp_path / "empty.csv"
    empty.write_text("")
    header_only = tmp_path / "header.csv"
    header_only.write_text(",".join(HEADER) + "\n")
    for f in (empty, header_only):
        result = validate_file(f, SAMPLES / "reference")
        assert result.fatal and [i.code for i in result.issues] == ["EMPTY_FILE"]
        assert main([str(f), "--out", str(tmp_path / "out")]) == 2


def test_val_009b_header_problems_are_fatal():
    missing = validate_table(table(row(), header=[h for h in HEADER if h != "weight_kg"]), REFS)
    assert [i.code for i in missing.issues] == ["MISSING_COLUMN"] and missing.rows_checked == 0
    doubled = validate_table(table(row(), header=HEADER + ["vehicle_type"]), REFS)
    assert "DUPLICATE_COLUMN" in [i.code for i in doubled.issues]


def test_val_010_large_file_is_validated_quickly(tmp_path):
    data, manifest = generate(rows=10_000, error_rate=0.05, seed=21)
    path = tmp_path / "big.csv"
    write(data, path)
    started = time.perf_counter()
    result = validate_file(path, SAMPLES / "reference")
    elapsed = time.perf_counter() - started
    assert result.rows_checked == 10_000
    assert result.rows_with_errors <= len(manifest)
    assert elapsed < 10, f"10k rows took {elapsed:.1f}s"


@pytest.mark.parametrize("seed", [1, 2, 3, 4, 5])
def test_generator_oracle_every_injected_fault_is_found_and_nothing_else(tmp_path, seed):
    data, manifest = generate(rows=1000, error_rate=0.05, seed=seed)
    path = tmp_path / "gen.csv"
    write(data, path)
    result = validate_file(path, SAMPLES / "reference")
    found = {(i.row, i.code) for i in result.issues}
    missed = [m for m in manifest if (m["row"], m["expected_code"]) not in found]
    assert missed == [], f"faults not detected: {missed}"
    faulty_rows = {m["row"] for m in manifest}
    false_errors = [i for i in result.issues if i.severity == "ERROR" and i.row not in faulty_rows]
    assert false_errors == [], f"errors on rows without injected faults: {false_errors[:3]}"
    assert len(manifest) > 20 and {m["fault"] for m in manifest} == set(FAULTS)


def test_csv_and_xlsx_give_identical_results(tmp_path):
    data, _ = generate(rows=200, error_rate=0.1, seed=9)
    write(data, tmp_path / "a.csv")
    write(data, tmp_path / "a.xlsx")
    as_csv = validate_file(tmp_path / "a.csv", SAMPLES / "reference")
    as_xlsx = validate_file(tmp_path / "a.xlsx", SAMPLES / "reference")
    assert [(i.row, i.code) for i in as_csv.issues] == [(i.row, i.code) for i in as_xlsx.issues]


def test_shipped_invalid_sample_raises_each_code_once():
    result = validate_file(SAMPLES / "invalid.csv", SAMPLES / "reference")
    counts = result.counts()
    assert all(n == 1 for n in counts.values()), counts
    assert {"BLANK_ROW", "REPEATED_HEADER", "UNKNOWN_COLUMN", "WHITESPACE", "PATTERN_MISMATCH", "INVALID_EMAIL"} <= set(
        counts
    )


def test_shipped_valid_sample_and_cli_exit_codes(tmp_path):
    assert main([str(SAMPLES / "valid.csv"), "--out", str(tmp_path)]) == 0
    assert main([str(SAMPLES / "invalid.csv"), "--out", str(tmp_path)]) == 1
    report = list(csv.DictReader((tmp_path / "invalid.validation-report.csv").open(encoding="utf-8")))
    assert {"row", "column", "code", "severity", "message", "value"} == set(report[0])
    assert main([str(tmp_path / "missing.csv")]) == 2


def test_unsupported_file_type(tmp_path):
    with pytest.raises(ValueError, match="Unsupported"):
        read_table(tmp_path / "upload.json")
