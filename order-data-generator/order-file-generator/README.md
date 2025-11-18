# Order File Generator (Exact-Schema, Location-Aware)

A Tkinter tool to generate test order files that strictly preserve the **exact column set and order** of your provided Order Spec. It reads a Location Master to source valid `PickupLocationId`/`DropOffLocationId` and derives `Consignee` from the drop's **Organization Short Name**.

## Why
- Guarantees importer-friendly files with **no column drift**
- Quickly produce many scenarios: duplicate IDs, bad time windows, whitespace/case gotchas, random orders per drop

## Setup

### Windows (Easy Way)
1. Double-click `install.bat` to create a virtual environment and install dependencies
2. Double-click `run.bat` to launch the application

### Manual Setup
```bash
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

## Run
```bash
python src/app.py
```

Or simply double-click `run.bat` on Windows.

## Usage
1. **Load Order Spec** from `data/specs/...xlsx`
2. **Load Location Master** from `data/locations/...xlsx`
3. **Map columns** (Location Ref ID, Org Short Name)
4. Choose **pickup location**, **#unloading locations**, **orders per location** (or random), **shipper**, **ID prefix**
5. Toggle **scenarios** as needed:
   - Duplicate Order IDs
   - Bad Time Windows
   - Whitespace/Case Sensitivity
6. Click **Generate Order File**
7. Output defaults to `data/output/` (you can also choose a custom path)

## Features
- **Exact Schema Preservation**: Output columns match the Order Spec file exactly
- **Location-Aware**: Uses real Location Reference IDs from your master
- **Flexible Mapping**: Auto-detects common column names but allows manual override
- **Test Scenarios**: Generate edge cases to test your TMS importer
- **Random Generation**: Configurable random orders per location
- **Time Windows**: Automatically generates realistic pickup and delivery windows

## Notes
- Columns in the output are identical to the Order Spec's first sheet
- Non-critical columns remain present but may be left blank
- Time windows are written to either combined or split fields depending on the Spec file
- Consignee is automatically derived from the drop location's Organization Short Name

## File Structure
```
order-file-generator/
├─ README.md
├─ requirements.txt
├─ install.bat              # Windows installer
├─ run.bat                  # Windows launcher
├─ .gitignore
├─ .cursor/
│  └─ cursor.rule
├─ src/
│  ├─ app.py               # Entry point
│  ├─ generator/
│  │  ├─ __init__.py
│  │  ├─ ui.py             # Tkinter UI
│  │  ├─ loaders.py        # Load spec + location master
│  │  ├─ builder.py        # Row generation logic
│  │  ├─ validators.py     # Schema/format checks
│  │  └─ utils.py          # Helpers
├─ data/
│  ├─ specs/               # Your Order Spec files
│  ├─ locations/           # Your Location Master files
│  └─ output/              # Generated order files
└─ scripts/
   └─ run_local.sh         # Unix launcher
```

## Troubleshooting
- **Import errors**: Make sure you've run `install.bat` or installed requirements.txt
- **File not found**: Check that your files are in the correct data/ subfolders
- **Column mapping issues**: Use the dropdown menus to manually select the correct columns
- **Generated file looks wrong**: The tool preserves the exact spec schema - verify your spec file is correct

