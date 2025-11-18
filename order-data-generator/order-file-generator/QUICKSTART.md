# Quick Start Guide

## For Windows Users (Easiest Way)

### Step 1: Install
1. Double-click `install.bat`
2. Wait for the installation to complete (may take a few minutes)
3. Press any key when prompted

### Step 2: Run
1. Double-click `run.bat`
2. The Order File Generator window will open

## What's Already Set Up

The following files have been pre-loaded into the data directories:

- **Location Master**: `data/locations/Centrics 3PL (7).xlsx`
- **Order Spec**: `data/specs/Order List Spec - D7 Cash Customer-Kithulgala-OK DEMO.xlsx`

## Usage Instructions

### 1. Load Files
- Click "Browse..." next to "Order Spec File"
- Navigate to `data/specs/` and select the order spec file
- Click "Browse..." next to "Location Master"
- Navigate to `data/locations/` and select the location master file

### 2. Verify Column Mappings
The tool will auto-detect the column mappings. Verify that:
- **Location Reference ID**: Is correctly mapped
- **Organization Short Name**: Is correctly mapped

If not correct, use the dropdown menus to select the right columns.

### 3. Configure Parameters
- **Pickup Location**: Select from the dropdown
- **Number of Unloading Locations**: How many different drop-off locations (default: 5)
- **Orders per Location**: How many orders per drop (default: 3)
  - Check "Use random (1 to N)" for random variation
- **Shipper Name**: Enter the shipper name (default: "Default Shipper")
- **Order ID Prefix**: Prefix for order IDs (default: "ORD")
- **Start Index**: Starting number for order IDs (default: 1)

### 4. Optional Test Scenarios
Check any scenarios you want to test:
- ☐ **Duplicate Order IDs**: Adds duplicate order IDs to test the system's handling
- ☐ **Bad Time Windows**: Creates invalid time windows (end before start)
- ☐ **Whitespace/Case Sensitivity**: Adds spaces to test trimming logic

### 5. Generate
1. Click "Generate Order File"
2. Choose where to save (defaults to `D:\ordermanger optimizer check\order file creation\Created file`)
3. The file will be created with a timestamp

## Output Location

Generated files will be saved to:
```
D:\ordermanger optimizer check\order file creation\Created file
```

Files are named: `Orders_YYYYMMDD_HHMMSS.xlsx`

## Troubleshooting

### "Python is not installed"
- Download and install Python 3.10 or later from https://www.python.org/
- Make sure to check "Add Python to PATH" during installation

### "Virtual environment not found"
- Run `install.bat` first before running `run.bat`

### "Column not found" errors
- Check that your location master has the expected columns
- Use the dropdown menus to manually map columns

### Generated file has wrong columns
- The tool preserves the EXACT columns from your Order Spec file
- If the spec file is wrong, update the spec file first

### Orders not appearing correctly
- Check that your Location Master has valid Location Reference IDs
- Ensure the Organization Short Name column contains data

## Tips

1. **Column Names Matter**: The tool tries to match common column patterns (OrderID, PickupLocationId, etc.)
2. **Random is Good for Testing**: Use "random orders per location" to get varied test data
3. **Test Scenarios**: Enable scenarios to test edge cases in your TMS
4. **Backup Spec Files**: Keep a backup of your working spec file

## Need Help?

Check the main README.md for detailed documentation about:
- File structure
- Column mapping logic
- Time window generation
- Scenario details

