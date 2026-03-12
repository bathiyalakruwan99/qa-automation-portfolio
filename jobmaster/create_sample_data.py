"""
Create sample Excel/data files for portfolio (no real client data).
Run from jobmaster folder: python create_sample_data.py
"""
import os
from pathlib import Path

import pandas as pd

# Paths relative to this script (jobmaster root)
BASE = Path(__file__).resolve().parent
DATA = BASE / "data"
INPUT_DIR = DATA / "input"
SAMPLES_DIR = DATA / "samples"
EXPORTS_DIR = DATA / "exports"

def create_sample_job_master():
    """Minimal Job Master Excel with expected columns (dummy data only)."""
    INPUT_DIR.mkdir(parents=True, exist_ok=True)
    df = pd.DataFrame({
        "Job ID": ["SAMPLE-JOB-001", "SAMPLE-JOB-002", "SAMPLE-JOB-003"],
        "Job Name": ["Sample Delivery 1", "Sample Delivery 2", "Sample Delivery 3"],
        "Job Date": pd.to_datetime(["2025-01-15", "2025-01-16", "2025-01-17"]),
        "GPS Executed": [120.5, 85.0, 200.0],
        "Job Status": ["COMPLETED", "COMPLETED", "SCHEDULED"],
        "Start Time": pd.to_datetime(["2025-01-15 08:00", "2025-01-16 09:30", "2025-01-17 07:00"]),
        "End Time": pd.to_datetime(["2025-01-15 14:00", "2025-01-16 16:00", None]),
        "Load Count": [1, 1, 1],
        "Job Count": [5, 3, 0],
        "Invoice Status": ["Ready to Invoice", "Invoiced", None],
        "Payment Schedule Status": ["Scheduled", "Scheduled", None],
    })
    out = INPUT_DIR / "sample_job_master.xlsx"
    df.to_excel(out, index=False, sheet_name="Sheet1")
    print(f"Created {out}")

def create_sample_job_ids():
    """Sample job ID lists for bulk checker (csv, txt, xlsx)."""
    SAMPLES_DIR.mkdir(parents=True, exist_ok=True)
    ids = ["SAMPLE-JOB-001", "SAMPLE-JOB-002", "SAMPLE-JOB-003"]
    (SAMPLES_DIR / "sample_job_ids.txt").write_text("\n".join(ids))
    (SAMPLES_DIR / "sample_job_ids.csv").write_text("Job ID\n" + "\n".join(ids))
    df = pd.DataFrame({"Job ID": ids})
    df.to_excel(SAMPLES_DIR / "sample_job_ids.xlsx", index=False)
    print(f"Created {SAMPLES_DIR / 'sample_job_ids.txt'}, .csv, .xlsx")

def create_sample_export():
    """One minimal export-style Excel for demo."""
    EXPORTS_DIR.mkdir(parents=True, exist_ok=True)
    df = pd.DataFrame({
        "Job ID": ["SAMPLE-JOB-001", "SAMPLE-JOB-002"],
        "Job Status": ["COMPLETED", "COMPLETED"],
        "Job Date": pd.to_datetime(["2025-01-15", "2025-01-16"]),
    })
    out = EXPORTS_DIR / "sample_export.xlsx"
    df.to_excel(out, index=False, sheet_name="Export")
    print(f"Created {out}")

if __name__ == "__main__":
    create_sample_job_master()
    create_sample_job_ids()
    create_sample_export()
    print("Done. Sample files use dummy data only (no client/company data).")
