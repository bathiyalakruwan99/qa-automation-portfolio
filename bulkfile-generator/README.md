# Bulk File Generator

Excel file validation and correction tools for TMS data uploads. Reduces customer upload errors by 50%+.

---

## What's Here

**Excel File Corrector** - Main tool with desktop GUI, web interface, and command-line options

[See detailed docs →](excel-corrector/README.md)

![Excel Corrector GUI](excel-corrector/screenshots/main-gui.png)

---

## Why I Built This

Customers uploading bulk data to our TMS (organizations, vehicles, drivers, locations) kept hitting validation errors. Wrong formats, missing fields, duplicate IDs, invalid districts - the support team was flooded with tickets.

**Solution:** Build a validator that checks Excel files before upload and auto-corrects common issues.

**Impact:** Upload errors dropped by 50%+. Support tickets significantly reduced.

---

## Quick Start

### Desktop GUI (Recommended)

```bash
cd excel-corrector
pip install -r requirements.txt
python excel_corrector_gui.py
```

### Web Interface

```bash
cd excel-corrector
pip install -r requirements.txt
python app.py
# Open http://localhost:5000
```

### Command Line

```bash
cd excel-corrector
python excel_corrector.py
```

---

## What It Does

**Validates and auto-corrects:**
- Organization details (status, verticals, country/state)
- Division information
- Human Resources (names, NIC, email, gender)
- Vehicle details (division, type, category)
- Location data
- Duplicate detection (NIC, email)
- Format standardization

**Example corrections:**
- "Gampaha" → "Gampaha District"
- Empty NIC → "DUMMYNIC001+org_name"
- Duplicate email → "DUPLICATE1+original@email.com"
- Status fields → "Create"

[See full correction rules →](excel-corrector/README.md)

---

## Features

- Desktop GUI with file browser and progress tracking
- Web interface with drag-and-drop upload
- Command-line batch processing
- Detailed correction reports
- Multiple processing options
- Error highlighting
- Automatic timestamped output files

---

## Tech Stack

- Python 3.7+
- Pandas (data processing)
- OpenPyXL (Excel manipulation)
- Tkinter (desktop GUI)
- Flask (web interface)

---

## Requirements

```bash
pip install pandas openpyxl flask werkzeug
```

Or use requirements.txt:
```bash
pip install -r excel-corrector/requirements.txt
```

---

## Project Structure

```
bulkfile-generator/
└── excel-corrector/
    ├── excel_corrector.py          # Core engine
    ├── excel_corrector_gui.py      # Desktop GUI
    ├── app.py                      # Web interface
    ├── givenFile/                  # Input files
    ├── Created new one/            # Output files
    ├── Error file/                 # Error logs
    ├── screenshots/                # Tool screenshots
    └── README.md                   # Detailed docs
```

---

## Output

Corrected files saved as:
```
original_name_corrected_file_YYYYMMDD_HHMMSS.xlsx
```

Located in `Created new one/` directory

---

## What I Learned

**Challenges:**
- Handling multiple sheet types with different validation rules
- Detecting and preventing duplicates without breaking existing data
- Making district name mapping comprehensive for Sri Lanka
- Building both GUI and web interfaces

**What I'd do differently:**
- Should've built web version first (most users prefer browsers)
- Could add more customizable validation rules
- Export validation report separately

---

*Built to reduce TMS upload errors. Saves support team hours every week.*
