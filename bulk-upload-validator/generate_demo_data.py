"""Synthetic shipment-upload generator with deliberate, recorded faults.

python generate_demo_data.py --rows 1000 --error-rate 0.05 --seed 7 --out output/generated.csv

Every injected fault is written to a manifest (<out>.faults.json): which row, which fault, which finding the
validator is expected to raise. Tests reconcile the manifest against the validator's output, so the validator
is checked against an independent oracle instead of against itself.
"""

from __future__ import annotations

import argparse
import csv
import json
import random
from datetime import date, timedelta
from pathlib import Path

from openpyxl import Workbook

from bulk_validator.schema import SHIPMENT_UPLOAD_V1

CUSTOMERS = ["CUST-ALPHA", "CUST-BETA", "CUST-GAMMA"]
LOCATIONS = ["WAREHOUSE-ALPHA", "CUSTOMER-SITE-BETA", "CENTRAL-HUB", "SITE-DELTA"]

# fault name -> finding code the validator must raise for it
FAULTS: dict[str, str] = {
    "missing_customer": "REQUIRED_MISSING",
    "duplicate_ref": "DUPLICATE_VALUE",
    "bad_date": "INVALID_DATE",
    "bad_coordinate": "OUT_OF_RANGE",
    "unknown_location": "UNKNOWN_REFERENCE",
    "bad_vehicle_type": "INVALID_ENUM",
    "reefer_without_temperature": "REEFER_TEMPERATURE_MISSING",
    "delivery_before_pickup": "DELIVERY_BEFORE_PICKUP",
    "padded_whitespace": "WHITESPACE",
    "not_a_number": "INVALID_NUMBER",
}


def valid_row(rng: random.Random, index: int) -> dict[str, str]:
    vehicle = rng.choice(["TRUCK", "TRUCK", "VAN", "REEFER"])
    origin, destination = rng.sample(LOCATIONS, 2)
    pickup = date(2026, 1, 5) + timedelta(days=rng.randint(0, 60))
    has_coords = rng.random() < 0.7
    return {
        "shipment_ref": f"SHP-{10000 + index}",
        "customer_code": rng.choice(CUSTOMERS),
        "origin_code": origin,
        "destination_code": destination,
        "vehicle_type": vehicle,
        "weight_kg": str(rng.randint(50, 9000)),
        "pickup_date": pickup.isoformat(),
        "delivery_date": (pickup + timedelta(days=rng.randint(0, 3))).isoformat(),
        "dest_lat": f"{37.70 + rng.random() * 0.1:.5f}" if has_coords else "",
        "dest_lng": f"{-122.45 + rng.random() * 0.1:.5f}" if has_coords else "",
        "temperature_c": str(rng.randint(-18, 5)) if vehicle == "REEFER" else "",
        "contact_email": f"ops{index}@example.test" if rng.random() < 0.5 else "",
    }


def inject(fault: str, row: dict[str, str], previous_ref: str) -> None:
    if fault == "missing_customer":
        row["customer_code"] = ""
    elif fault == "duplicate_ref":
        row["shipment_ref"] = previous_ref
    elif fault == "bad_date":
        row["pickup_date"] = "2026-02-30"
        row["delivery_date"] = "2026-03-02"
    elif fault == "bad_coordinate":
        row["dest_lat"], row["dest_lng"] = "137.71", "-122.40"
    elif fault == "unknown_location":
        row["destination_code"] = "SITE-NOWHERE"
    elif fault == "bad_vehicle_type":
        row["vehicle_type"] = "BICYCLE"
        row["temperature_c"] = ""
    elif fault == "reefer_without_temperature":
        row["vehicle_type"], row["temperature_c"] = "REEFER", ""
    elif fault == "delivery_before_pickup":
        row["pickup_date"], row["delivery_date"] = "2026-03-10", "2026-03-08"
    elif fault == "padded_whitespace":
        row["customer_code"] = f"  {row['customer_code']} "
    elif fault == "not_a_number":
        row["weight_kg"] = "heavy"


def generate(rows: int, error_rate: float, seed: int) -> tuple[list[dict[str, str]], list[dict[str, object]]]:
    if rows < 1 or not 0 <= error_rate <= 1:
        raise ValueError("rows must be >= 1 and error-rate between 0 and 1")
    rng = random.Random(seed)
    data: list[dict[str, str]] = []
    manifest: list[dict[str, object]] = []
    for i in range(rows):
        row = valid_row(rng, i)
        # duplicate_ref needs an earlier row to copy
        if i > 0 and rng.random() < error_rate:
            fault = rng.choice(list(FAULTS))
            inject(fault, row, data[i - 1]["shipment_ref"])
            manifest.append({"row": i + 2, "fault": fault, "expected_code": FAULTS[fault]})
        data.append(row)
    return data, manifest


def write(data: list[dict[str, str]], path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    header = SHIPMENT_UPLOAD_V1.names
    if path.suffix.lower() == ".xlsx":
        wb = Workbook()
        ws = wb.active
        ws.title = "shipments"
        ws.append(header)
        for row in data:
            ws.append([row[h] for h in header])
        wb.save(path)
    else:
        with path.open("w", newline="", encoding="utf-8") as handle:
            writer = csv.DictWriter(handle, fieldnames=header)
            writer.writeheader()
            writer.writerows(data)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--rows", type=int, default=1000)
    parser.add_argument("--error-rate", type=float, default=0.05)
    parser.add_argument("--seed", type=int, default=7)
    parser.add_argument("--out", default="output/generated.csv")
    args = parser.parse_args()
    data, manifest = generate(args.rows, args.error_rate, args.seed)
    out = Path(args.out)
    write(data, out)
    manifest_path = out.with_suffix(out.suffix + ".faults.json")
    manifest_path.write_text(json.dumps({"seed": args.seed, "rows": args.rows, "faults": manifest}, indent=2) + "\n")
    print(f"Wrote {args.rows} rows ({len(manifest)} with injected faults) to {out}; manifest: {manifest_path}")


if __name__ == "__main__":
    main()
