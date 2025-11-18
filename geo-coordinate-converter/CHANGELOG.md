# Changelog

All notable changes and updates to the Location Data Processor.

## Version 3.0 - Final Version (ONE JSON File)

### Changes
- **Changed output format** from individual JSON files per location to **ONE combined JSON file**
- All locations now saved in a single JSON array: `locations.json`
- Also creates Excel file: `locations.xlsx` with Google Maps format column

### Output Format
```json
[
  {
    "name": "Location Name",
    "locationReferenceId": "REF-ID",
    "latitude": 6.9271,
    "longitude": 79.8612
  }
]
```

### Benefits
- ✓ Easier to use in other applications
- ✓ Standard JSON array format
- ✓ One file to manage instead of many
- ✓ Compatible with route optimization tools

---

## Version 2.0 - Enhanced Matching & Debugging

### New Features
1. **Improved Column Detection**
   - More comprehensive column name variations
   - Works with many different naming conventions
   - Shows available columns if detection fails

2. **Enhanced Matching Logic**
   - Tries exact match first
   - Falls back to case-insensitive match
   - Then tries name-based matching
   - Shows which match type was used

3. **Detailed Logging**
   - Shows sample locations from location file
   - Displays each successful match with match type
   - Lists unmatched location IDs (first 10)
   - Color-coded messages (Green=Success, Orange=Warning, Red=Error)

4. **Better Error Reporting**
   - Shows exactly which columns were found/missing
   - Lists all available columns in files
   - Reports count of unmatched locations
   - Shows unique pickup/dropoff location counts

### Supported Column Name Variations
The tool now recognizes many variations:
- Location Reference ID: `LocationRefID`, `Location_Ref_ID`, `RefID`, `ID`, etc.
- Location Name: `LocationName`, `Location_Name`, `Name`, etc.
- Coordinates: `Google Coordinates`, `Coordinates`, `Latitude`+`Longitude`, etc.
- Pickup/Dropoff: `PickupLocationID`, `Pickup_Location_ID`, `Origin`, etc.

---

## Critical Fixes

### Fix: Column Name Normalization
**Issue:** Excel files with column names containing spaces (e.g., "Location Reference ID") were not detected.

**Solution:** Added column name normalization that removes spaces, underscores, and hyphens before matching.

**Result:** Now correctly detects:
- ✓ "Location Reference ID" → `locationreferenceid`
- ✓ "Location Name" → `locationname`
- ✓ "Google Coordinates" → `googlecoordinates`

---

### Fix: Google Coordinates Column Support
**Issue:** Script was looking for separate "Latitude" and "Longitude" columns, but files had combined "Google Coordinates" column (format: `lat,lng`).

**Solution:** Added support for combined coordinates column format.

**Result:** Now supports both:
- ✓ Combined format: "Google Coordinates" (`6.8412,80.2745`)
- ✓ Separate columns: "Latitude" + "Longitude"

---

### Fix: Multi-Sheet Excel Support
**Issue:** Could only use extracted single-sheet files, not the original multi-sheet Excel files.

**Solution:** Added automatic multi-sheet detection that finds the "5 - Locations" sheet and detects the correct header row.

**Result:** Now works with:
- ✓ Original multi-sheet files: `Centrics 3PL (7).xlsx`
- ✓ Extracted single-sheet files: `Centrics_3PL_Locations_Extracted.xlsx`
- ✓ Automatically detects and uses the Locations sheet
- ✓ Handles complex Excel structures

---

## Excel Output Feature

### New Feature: Excel Export
**Added:** Excel file export with Google Maps-ready coordinates.

**Output Files:**
1. **JSON file**: `locations.json` (for applications)
2. **Excel file**: `locations.xlsx` (for viewing and Google Maps)

**Excel File Columns:**
- Location Name
- Location Reference ID
- Latitude
- Longitude
- **Google Maps Format** (ready to copy-paste into Google Maps!)

**How to Use Google Maps Format:**
1. Copy value from "Google Maps Format" column (e.g., `6.5328,80.3989`)
2. Paste into Google Maps search box
3. Press Enter - location appears on map!

---

## Features Summary

### Current Features
- ✓ Multi-sheet Excel support (automatic sheet detection)
- ✓ Automatic header row detection
- ✓ Flexible column name matching (handles spaces, variations)
- ✓ Combined coordinates parsing ("Google Coordinates" format)
- ✓ Separate lat/lng columns support
- ✓ Case-insensitive matching
- ✓ Match by RefID first, then by Name
- ✓ GeoTag extraction for cash customers
- ✓ Duplicate prevention (each location only once)
- ✓ **ONE combined JSON file** output
- ✓ **Excel file** output with Google Maps format
- ✓ Detailed logging with color coding
- ✓ User-friendly Tkinter GUI

### Supported Formats

**Location File:**
- Multi-sheet Excel (finds "5 - Locations" sheet)
- Single-sheet Excel
- Various column name formats
- Combined or separate coordinate columns

**Order File:**
- Excel files with PickupLocationId/DropOffLocationId
- Various column name formats
- GeoTag column for cash customers

---

## Technical Details

### Column Name Normalization
The tool normalizes column names by:
1. Converting to lowercase
2. Removing spaces
3. Removing underscores
4. Removing hyphens

So these all match:
- "Location Reference ID"
- "location_reference_id"
- "location-reference-id"
- "locationreferenceid"

### Matching Strategy
1. **First**: Try exact match by Location Reference ID
2. **Second**: Try case-insensitive match by Reference ID
3. **Third**: Try match by Location Name
4. **Final**: Extract from GeoTag column (for cash customers)

---

## Future Improvements

- [ ] Support for CSV input files
- [ ] Batch processing multiple files
- [ ] Custom output format options
- [ ] Advanced filtering options
- [ ] Export to other formats (KML, GPX)

---

*For complete documentation, see [README.md](README.md)*

