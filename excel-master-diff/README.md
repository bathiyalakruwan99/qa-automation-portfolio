# Excel Master Diff

Excel file comparison tool that performs sheet-by-sheet analysis. Saved me hours when validating data migrations.

---

## What It Does

Compares two Excel files sheet-by-sheet and generates detailed diff reports showing:
- Added rows
- Deleted rows
- Modified cells
- Schema differences

**Use case:** Data migration validation, regression testing, Excel comparison

---

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Run the comparison
python run_app.py
```

Or use GUI:
```bash
python app/main.py
```

---

## Features

- Sheet-by-sheet comparison
- Cell-level difference detection
- Markdown report generation
- Side-by-side Excel export (with differences highlighted)
- Key-based row matching
- Handles large Excel files

---

## Output

**Markdown Report:**
- Summary of changes per sheet
- Detailed diff tables
- Statistics (added/deleted/modified)

**Excel Export:**
- Side-by-side comparison
- Differences highlighted in color
- Easy visual inspection

---

## Tech Stack

- Python 3.7+
- Pandas (data processing)
- OpenPyXL (Excel manipulation)
- Markdown generation

---

*Quick utility for Excel comparison. Useful for data migration validation and regression testing.*
