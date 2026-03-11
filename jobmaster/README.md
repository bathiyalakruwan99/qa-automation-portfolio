# Job Master Suite

A comprehensive suite for processing and analyzing Job Master Excel files. Includes desktop and web interfaces, bulk status checking, and load counting validation tools.

---

## Overview

| Component | Purpose |
|-----------|---------|
| **Desktop App** | Main data processor — upload, search, filter, export job data |
| **Web App** | Browser-based interface for the same processing workflow |
| **Bulk Job Checker** | Check GPS, payment, and invoice status for multiple job IDs at once |
| **Counting Logic Test** | Validate load counting methods (Non-FTL, FTL-DISTRIBUTION prorated/8x/10x) |

---

## Quick Start

### Prerequisites

- **Python 3.8+** (3.11 recommended)
- **pip** package manager

### Installation

```bash
# Clone or download the project, then:
pip install -r requirements.txt
```

### Run Applications

| App | Command | Launcher |
|-----|---------|----------|
| Desktop | `python desktop_app.py` | `desktop_app.bat` |
| Web | `python app.py` | `web_app.bat` |
| Bulk Checker | `python bulk_job_checker.py` | `bulk_job_checker.bat` |
| Counting Test | `python test_counting_logic.py [file]` | — |

---

## Applications

### 1. Desktop App (`desktop_app.py`)

Primary data processing tool with full GUI.

- Upload Excel files (.xlsx, .xls)
- Search and filter by Job ID, name, status, keywords
- View data in interactive tables with customizable columns
- Export to Excel (full, filtered, job-wise)
- Generate operation-wise and count reports

**Use when:** You need comprehensive data processing and prefer a desktop GUI.

### 2. Web App (`app.py`)

Flask-based web interface for the same workflow.

- Browser access at `http://localhost:5000` (or configured port)
- Upload, process, search, filter, export
- Share access across devices on the same network

**Use when:** You prefer a browser interface or need remote access.

### 3. Bulk Job Checker (`bulk_job_checker.py`)

Bulk status verification for multiple job IDs.

- Input: CSV, TXT, or Excel list of job IDs
- Checks: GPS execution, payment schedule, invoice status
- Color-coded results and detailed export

**Use when:** You have a list of job IDs to verify quickly.

### 4. Counting Logic Test (`test_counting_logic.py`)

Validates load counting logic on Job Master Excel files.

- Compares Non FTL-DISTRIBUTION vs FTL-DISTRIBUTION loads
- Tests three methods: Current (prorated), 8x, 10x
- Reports file structure, data separation, and totals

```bash
# Default file: data/input/job-master.xlsx
python test_counting_logic.py

# Custom file
python test_counting_logic.py data/input/your-file.xlsx

# Minimal output (totals only)
python test_counting_logic.py -q
```

**Use when:** You need to verify or document load counting behaviour.

---

## Data & Column Mapping

### Sample Data

- **File:** `file/job-master.xlsx`
- Use this file to test all applications.

### Key Columns

The applications map Excel columns to internal fields. Common mappings:

| Internal Field | Possible Excel Column Names |
|----------------|----------------------------|
| Job ID | Job ID, job_id, JobID, ID |
| Job Date | Job Creation DateTime, job_date, Job Date |
| GPS Executed | Distance: GPS, gps_distance, GPS Distance |
| Job Status | Status, job_status, Job Status |
| Job Count | Job Count, job_count, Jobs Count |
| Load Count | Load Count, load_count, Loads Count |
| Trip Type | Trip Type, trip_type |
| Load ID | Load ID, load_id |
| Planned Stops: Qty | Planned Stops: Qty |
| Invoice Status | Invoice Status, invoice_status |
| Payment Schedule Status | Payment Schedule Status |

See the app UI or `docs/CURRENT_COUNTING_LOGIC.md` for full mapping and counting rules.

---

## Project Structure

```
jobmaster/
├── data/                      # All data files
│   ├── input/                 # Job Master Excel files
│   │   └── job-master.xlsx
│   ├── exports/               # Generated exports
│   ├── samples/               # Sample job IDs (csv, txt, xlsx)
│   ├── uploads/               # Web app uploads
│   ├── downloads/             # Web app downloads
│   └── reports/               # Reports
├── docs/                      # Documentation
│   ├── APP_OVERVIEW.md
│   ├── BULK_JOB_CHECKER_GUIDE.md
│   ├── CURRENT_COUNTING_LOGIC.md
│   ├── DESKTOP_APP_TROUBLESHOOTING.md
│   └── TROUBLESHOOTING.md
├── app.py                     # Web app (Flask)
├── desktop_app.py             # Desktop app (tkinter)
├── bulk_job_checker.py        # Bulk status checker
├── test_counting_logic.py     # Load counting test
├── config.py                  # Path configuration
├── desktop_app.bat
├── web_app.bat
├── bulk_job_checker.bat
├── requirements.txt
├── setup.py
└── README.md                  # This file
```

---

## Dependencies

| Package | Purpose |
|---------|---------|
| pandas | Data processing and Excel I/O |
| openpyxl | Excel file handling |
| flask | Web application framework |
| werkzeug | WSGI utilities |

---

## Export Options

### Excel

- Full data export with summary
- Filtered export (by status, invoice, payment, etc.)
- Job-wise export (individual jobs)
- Operation-wise reports
- Count reports

### Bulk Checker

- Detailed status report with color-coded results

---

## Troubleshooting

| Issue | Action |
|-------|--------|
| Import errors | Run `pip install -r requirements.txt` |
| Python version | Ensure Python 3.8+: `python --version` |
| File not found | Use correct path; default sample is `file/job-master.xlsx` |
| Column mapping | Check column names match expected patterns (see table above) |
| Desktop app issues | See `DESKTOP_APP_TROUBLESHOOTING.md` |
| Bulk checker | See `BULK_JOB_CHECKER_GUIDE.md` |

---

## Documentation

All guides are in the `docs/` folder:

- **docs/APP_OVERVIEW.md** — Which app to use and when
- **docs/CURRENT_COUNTING_LOGIC.md** — Load counting rules and formulas
- **docs/BULK_JOB_CHECKER_GUIDE.md** — Bulk status checker usage
- **docs/DESKTOP_APP_TROUBLESHOOTING.md** — Desktop app fixes
- **docs/TROUBLESHOOTING.md** — General troubleshooting

---

## Version

- **Version:** 1.0.0  
- **Platform:** Windows, macOS, Linux  
- **Python:** 3.8+

---

*Job Master Suite — Process, analyze, and export job data efficiently.*
