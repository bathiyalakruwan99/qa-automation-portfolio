# Excel Job Highlighter

Python scripts for color-coding Excel rows based on job IDs. Makes it easy to spot patterns in large datasets during manual review.

---

## What It Does

Automatically color-codes Excel rows by job ID categories. Helps quickly identify job status and categories when manually reviewing large datasets.

**Use case:** Visual analysis of job data, status tracking, pattern identification

---

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Run the color coding
python color_job_rows_flexible.py
```

---

## Features

- Automatic job ID column detection
- Color coding by category
- Multiple matching strategies (flexible, corrected, standard)
- Summary report generation
- Handles large Excel files
- Preserves original data

---

## Example

**Input:** Excel file with hundreds of job records  
**Output:** Same file with rows color-coded by job ID pattern  
**Benefit:** Instantly see which jobs belong to which categories

---

## Available Scripts

- `color_job_rows_flexible.py` - Main flexible matcher
- `color_job_rows_corrected.py` - Corrected matching logic
- `color_job_rows.py` - Standard matcher
- `summary_report.py` - Generate summary reports
- `examine_excel.py` - Inspect Excel structure

---

## Tech Stack

- Python 3.7+
- Pandas (data processing)
- OpenPyXL (Excel manipulation with colors)

---

*Quick utility for visual Excel analysis. Saves time when manually reviewing large datasets.*
