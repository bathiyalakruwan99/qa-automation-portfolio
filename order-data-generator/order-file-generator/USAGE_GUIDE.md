# Detailed Usage Guide

## Table of Contents
1. [Installation](#installation)
2. [Understanding the Files](#understanding-the-files)
3. [Column Mapping](#column-mapping)
4. [Generation Parameters](#generation-parameters)
5. [Test Scenarios](#test-scenarios)
6. [Output Format](#output-format)
7. [Common Use Cases](#common-use-cases)
8. [Troubleshooting](#troubleshooting)

---

## Installation

### Option 1: Automated (Recommended)
1. Double-click `install.bat`
2. Wait for installation to complete
3. Double-click `run.bat` to launch

### Option 2: Manual
```bash
# Create virtual environment
python -m venv .venv

# Activate (Windows)
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run
python src/app.py
```

### Option 3: Global Installation
```bash
pip install -r requirements.txt
python src/app.py
```

---

## Understanding the Files

### Order Spec File
**Location**: `data/specs/Order List Spec - D7 Cash Customer-Kithulgala-OK DEMO.xlsx`

This file defines the **exact schema** of your output. The generator will:
- Preserve all column names exactly as they appear
- Keep the same column order
- Fill in known columns (OrderID, PickupLocationId, etc.)
- Leave unknown columns blank

**Important**: Any column in the spec will appear in the output, even if empty.

### Location Master File
**Location**: `data/locations/Centrics 3PL (7).xlsx`

This file contains:
- **Location Reference ID**: Unique identifier for each location
- **Organization Short Name**: Used for Consignee field
- **Other location data**: Address, coordinates, etc.

**The tool needs**:
1. A column with unique location identifiers (Location Reference ID)
2. A column with organization/customer names (Organization Short Name)

---

## Column Mapping

### Auto-Detection
The tool automatically looks for columns matching these patterns:

**Location Reference ID**:
- "Location Reference ID"
- "LocationReferenceID"
- "Location Ref ID"
- "Location ID"
- "Reference ID"

**Organization Short Name**:
- "Organization Short Name"
- "Org Short Name"
- "Organization Name"
- "Customer Name"
- "Customer"

### Manual Override
If auto-detection fails or selects the wrong column:
1. Use the dropdown menus in the "Map Location Columns" section
2. Select the correct columns from the list
3. The tool will validate your selection before generating

---

## Generation Parameters

### Pickup Location
- Select ONE location that will be the pickup point for all orders
- This will populate the `PickupLocationId` field
- Must be a valid Location Reference ID from the master

### Number of Unloading Locations
- How many **different** drop-off locations to use
- The tool randomly selects this many locations (excluding the pickup)
- Default: 5
- Range: 1 to (total locations - 1)

### Orders per Location
Two modes:

**Fixed Mode** (default):
- Every location gets exactly N orders
- Example: 3 orders per location = predictable output
- Total orders = (Unloading Locations) × (Orders per Location)

**Random Mode**:
- Each location gets between 1 and N orders (inclusive)
- Check "Use random (1 to N)"
- More realistic test data with variation

### Shipper Name
- Name that appears in the `Shipper` or `ShipperName` column
- Default: "Default Shipper"
- Can be any text

### Order ID Prefix & Start Index
**Prefix**: Text that appears before the number (e.g., "ORD")
**Start Index**: Starting number (e.g., 1)

Examples:
- Prefix "ORD", Start 1 → ORD0001, ORD0002, ORD0003...
- Prefix "TEST", Start 100 → TEST0100, TEST0101, TEST0102...
- Prefix "2024-", Start 500 → 2024-0500, 2024-0501, 2024-0502...

---

## Test Scenarios

### Duplicate Order IDs
**What it does**: Appends 2 duplicate rows with the same Order ID

**Purpose**: Test if your TMS:
- Detects duplicate Order IDs
- Auto-generates suffixes (e.g., ORD0001-1, ORD0001-2)
- Rejects duplicates with error

**When to use**: Testing import validation

### Bad Time Windows
**What it does**: Creates rows where `DeliveryEnd` < `DeliveryStart`

**Purpose**: Test if your TMS:
- Validates time window logic
- Shows error messages for invalid windows
- Auto-corrects or rejects bad data

**When to use**: Testing time validation

### Whitespace/Case Sensitivity
**What it does**: Adds leading/trailing spaces to some Location IDs

**Purpose**: Test if your TMS:
- Trims whitespace from IDs
- Matches locations case-insensitively
- Handles data entry errors gracefully

**When to use**: Testing data cleaning

---

## Output Format

### File Structure
```
Orders_YYYYMMDD_HHMMSS.xlsx
└─ Sheet: "Orders"
   ├─ Row 1: Headers (exact match to spec)
   └─ Row 2+: Generated order data
```

### Default Save Location
```
D:\ordermanger optimizer check\order file creation\Created file
```

You can also choose a custom location using the Save dialog.

### Generated Fields

**Always Filled**:
- OrderID / Order / Order Number
- PickupLocationId / Pickup Location
- DropOffLocationId / Delivery Location / Drop Off Location
- Consignee / Customer Name
- Shipper / Shipper Name

**Randomly Generated**:
- Quantity / Qty: 1-8
- Weight / WeightKg: 10.0-80.0 kg
- Volume / CBM: 0.1-2.0 m³
- Priority: Low/Normal/High (20%/60%/20%)

**Calculated**:
- PickupTimeWindow: Now + 4-6 hours
- DeliveryTimeWindow: Now + 8-10 hours
- Each order gets a slight time offset

**Left Blank**:
- Any column not matching known patterns
- Optional fields in the spec

---

## Common Use Cases

### Case 1: Test Basic Import
**Setup**:
- 5 unloading locations
- 3 orders per location
- No test scenarios
- Result: 15 clean orders

**Purpose**: Verify basic import functionality

### Case 2: Test Validation
**Setup**:
- 3 unloading locations
- 2 orders per location
- Enable: Duplicate IDs, Bad Time Windows
- Result: Mix of valid and invalid orders

**Purpose**: Test error detection and handling

### Case 3: Stress Test
**Setup**:
- 50 unloading locations
- 10 orders per location (random)
- No test scenarios
- Result: ~250-500 orders

**Purpose**: Test performance with large files

### Case 4: Test Data Cleaning
**Setup**:
- 10 unloading locations
- 5 orders per location
- Enable: Whitespace/Case Sensitivity
- Result: Mix of clean and messy IDs

**Purpose**: Test data normalization

---

## Troubleshooting

### Problem: "The spec file has no columns"
**Solution**: 
- Make sure the Excel file has data in the first sheet
- Check that the first row contains headers
- Try opening the file in Excel to verify

### Problem: "Location Reference ID column not found"
**Solution**:
- Check the "Map Location Columns" section
- Manually select the correct column from the dropdown
- Make sure the column exists in your location master

### Problem: "Pickup location not found in master"
**Solution**:
- Refresh the pickup location dropdown
- Make sure you've selected a valid Location Reference ID column
- Verify the location exists in the master file

### Problem: "Not enough locations"
**Solution**:
- Reduce "Number of Unloading Locations"
- Check that your location master has enough valid locations
- Remove the pickup location from your count (it's excluded)

### Problem: Generated file has empty columns
**This is expected**:
- The tool preserves ALL columns from the spec
- Unknown columns are left blank
- You can fill these manually after generation
- Or update the column patterns in `builder.py`

### Problem: Time windows are in wrong format
**Solution**:
- Check your spec file's time columns
- The tool detects format automatically:
  - Combined: "PickupTimeWindow" → "2024-01-01 10:00–2024-01-01 12:00"
  - Split: "PickupStart" + "PickupEnd" → Two separate columns
- Update the spec to match your TMS format

### Problem: Consignee is wrong
**Solution**:
- Check the "Organization Short Name" mapping
- The Consignee is derived from the drop location's org name
- Make sure the location master has correct organization names

### Problem: Application won't start
**Solutions**:
1. Run `install.bat` again
2. Try `run_direct.bat` if you have packages globally installed
3. Manually activate virtual environment:
   ```
   .venv\Scripts\activate
   python src/app.py
   ```
4. Check Python version: `python --version` (need 3.10+)

### Problem: Import errors even after install
**Solutions**:
1. Delete `.venv` folder
2. Run `install.bat` again
3. Or manually:
   ```
   python -m venv .venv
   .venv\Scripts\activate
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

---

## Advanced Tips

### Customizing Column Patterns
Edit `src/generator/builder.py`, function `_create_order_row`:
```python
field_mappings = {
    'your_custom_column': 'your_value',
    # Add more mappings
}
```

### Changing Time Offsets
Edit `src/generator/builder.py`, function `_create_order_row`:
```python
pickup_offset = 4  # Change pickup window
delivery_offset = 8  # Change delivery window
```

### Adding New Scenarios
1. Add checkbox in `src/generator/ui.py`
2. Add scenario logic in `src/generator/builder.py`
3. Create a helper function like `_add_your_scenario()`

### Batch Generation
Create a Python script:
```python
import sys
sys.path.insert(0, 'src')
from generator import loaders, builder

# Load files
spec_cols = loaders.load_spec_columns('data/specs/...')
loc_df = loaders.load_location_master('data/locations/...')

# Generate multiple files in a loop
for i in range(10):
    df = builder.generate_dataframe(...)
    df.to_excel(f'output_{i}.xlsx', index=False)
```

---

## Need More Help?

1. Check `README.md` for general information
2. Check `QUICKSTART.md` for quick setup
3. Run `python test_setup.py` to diagnose issues
4. Look at the code in `src/generator/` for implementation details

