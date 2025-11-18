# Quick Start Guide

**Location Data Processor** - Process location data from Excel files and create JSON/Excel outputs with geographic coordinates.

## 📸 Application Screenshot

![Location Data Processor GUI](screenshots/gro%20cordiante%20ui.png)

*Main application window - Easy to use with clear interface*

## 🚀 Get Started in 3 Steps

### Step 1: Launch the Application
Double-click: **`run_location_processor.bat`**

This will:
- ✓ Check if Python is installed
- ✓ Install required packages automatically
- ✓ Launch the application GUI

### Step 2: Use the Application

1. **In the application window:**
   - **[Location File]** → Click "Browse"
     - Select: `Centrics 3PL (7).xlsx` or `Centrics_3PL_Locations_Extracted.xlsx`
   
   - **[Order File]** → Click "Browse"
     - Select: `Order List Spec - D7 Cash Customer-Kithulgala-OK DEMO.xlsx`
   
   - **[Output JSON File]** → Default: `jason/locations.json`
     - Or click "Save As" to choose a different name

2. **Click "Process Files" button**

3. **Watch the log area** for processing progress

### Step 3: Check Your Results

After processing, you'll get **TWO files** in the `jason/` folder:
- ✓ **`locations.json`** - JSON format for applications
  ![JSON Output](screenshots/geo%20crodinate%20jason.png)
- ✓ **`locations.xlsx`** - Excel format with Google Maps coordinates
  ![Excel Output](screenshots/geo%20cordinate%20excel.png)

## 📋 Output Format

### JSON File (`locations.json`)
```json
[
  {
    "name": "Sathosa-Eheliyagoda-3",
    "locationReferenceId": "Sathosa-Eheliyagoda-3",
    "latitude": 6.8412,
    "longitude": 80.2745
  },
  {
    "name": "Sathosa-Kalawana",
    "locationReferenceId": "Sathosa-Kalawana",
    "latitude": 6.5328,
    "longitude": 80.3989
  }
]
```

### Excel File (`locations.xlsx`)
Contains columns:
- **Location Name** - Name of the location
- **Location Reference ID** - Unique identifier
- **Latitude** - GPS latitude coordinate
- **Longitude** - GPS longitude coordinate
- **Google Maps Format** - Ready to search! (format: `lat,lng`)

## 🎯 Using Google Maps Format

1. Open `locations.xlsx` in Excel
2. Find your location row
3. Copy the value from "Google Maps Format" column (e.g., `6.5328,80.3989`)
4. Go to [Google Maps](https://maps.google.com)
5. Paste in the search box and press Enter
6. The location appears on the map!

## ⚡ What It Does

- ✓ Reads location data from Excel file (multi-sheet or single-sheet)
- ✓ Reads order data with PickupLocationId and DropOffLocationId
- ✓ Matches locations by Reference ID first, then by Name
- ✓ Extracts GeoTag coordinates for cash customers
- ✓ Creates **ONE combined JSON file** with all unique locations
- ✓ Creates **Excel file** with Google Maps-ready coordinates
- ✓ Each location appears only once (no duplicates)

## 🔧 Troubleshooting

**Problem:** "Python is not installed"  
**Solution:** Install Python 3.7+ from [python.org](https://www.python.org) (check "Add to PATH")

**Problem:** "Missing packages"  
**Solution:** Run `install_dependencies.bat` first

**Problem:** "Can't open Excel file"  
**Solution:** Close the Excel file if it's open in another program

**Problem:** "Column not found"  
**Solution:** Check the log output - it shows which columns were detected. The tool supports many column name variations (see README.md for details)

**Problem:** "Only getting cash customers"  
**Solution:** Check the log carefully:
- Shows which columns were detected
- Shows sample locations loaded
- Lists unmatched location IDs (first 10)
- Use this info to verify your data matches

## 📁 Supported File Formats

**Location File:**
- ✓ Multi-sheet Excel (automatically finds "5 - Locations" sheet)
- ✓ Single-sheet Excel
- ✓ Supports column names with spaces: "Location Reference ID", "Location Name"
- ✓ Supports combined coordinates: "Google Coordinates" (format: `lat,lng`)
- ✓ Supports separate columns: "Latitude" + "Longitude"

**Order File:**
- ✓ Excel files with PickupLocationId and DropOffLocationId columns
- ✓ Supports various column name formats
- ✓ Extracts GeoTag coordinates for cash customers

## 🎨 Features

- **Smart Column Detection** - Handles many naming variations automatically
- **Flexible Matching** - Matches by RefID first, then by Name (case-insensitive)
- **Multi-Sheet Support** - Automatically detects and uses the Locations sheet
- **Google Maps Ready** - Excel output includes formatted coordinates
- **Detailed Logging** - Color-coded messages show exactly what's happening
- **User-Friendly GUI** - Easy to use with visual feedback

## 📖 For More Information

- See **README.md** for complete documentation
- See **CHANGELOG.md** for version history and updates
- Check the log output for detailed processing information

---

**Ready to go?** Just double-click `run_location_processor.bat`!

