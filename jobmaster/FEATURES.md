# Job Master Data Processor - Complete Features Guide

## Overview

Job Master Data Processor is a comprehensive tool for processing and analyzing job data from Excel files. It includes desktop and web interfaces, advanced counting logic, bulk job checking, and intelligent file organization.

*See screenshots in `screenshots/` folder or view them in README.md*

---

## Desktop Application Features

### File Upload & Processing

The desktop app handles complex Excel files with intelligent column detection:

**What it does:**
- Browse and select .xlsx or .xls files
- Automatically maps 30+ Excel columns to standard field names
- Finds columns even if your naming differs slightly
- Cleans data: removes empty rows, converts dates/times, handles numeric fields
- Processes in background thread so the UI stays responsive

**Mapped fields include:**
Job ID, Load ID, Job Name, Job Date, GPS Executed Distance, Job Status, Start/End Times, Duration, Job Count, Load Count, Payment Schedule Status/Number, Invoice Status/Number/Items/Revenue, Vehicle details, Trip Type, Driver Name/Phone/NIC, Cost/Revenue amounts, Planned Stops Quantity, and more.

### Count Summary Dashboard

Real-time metrics displayed at the top of the app:

**Job counting:**
- Counts unique Job IDs (excluding empty entries)

**Load counting (three methods shown):**
- **Non FTL-DISTRIBUTION loads**: Counts unique Load IDs from regular trips
- **FTL-DISTRIBUTION (Current)**: Prorated calculation based on stops
  - 1-8 stops = 1 load
  - 9+ stops = base loads + (remaining stops / 8)
  - Example: 9 stops = 1.125 loads, 17 stops = 2.125 loads
- **FTL-DISTRIBUTION (8x)**: Simple ceiling division
  - ceil(stops / 8)
  - Example: 9 stops = 2 loads, 17 stops = 3 loads
- **FTL-DISTRIBUTION (10x)**: Alternative calculation
  - ceil(stops / 10)
  - Example: 11 stops = 2 loads, 21 stops = 3 loads

The app shows all three methods side-by-side for comparison. You can export detailed count reports with all calculations included.

### Search & Filter System

Real-time filtering that searches as you type:

**Available filters:**
- Job ID search
- Keyword search (searches ALL columns simultaneously)
- Job Status dropdown (Completed, In-Progress, etc.)
- Driver Name search
- Vehicle search
- Trip Type dropdown (FTL-DISTRIBUTION, etc.)
- Payment Schedule Status filter
- Invoice Status filter
- Date Range (From/To dates)
- GPS Executed Only checkbox

**Features:**
- Toggle real-time search on/off
- Shows "Found X of Y records" counter
- Clear all filters with one click
- Manual search button if you prefer

### Data Display & Table

Interactive table that shows filtered results:

- Displays ALL filtered data (no row limit)
- Choose which columns to display
- Quick presets: Select All, Clear All, Show Key Columns
- Horizontal and vertical scrollbars for navigation
- Dates formatted as "YYYY-MM-DD HH:MM:SS"
- Progress messages for large datasets ("Loading X rows...")

### Summary Metrics Panel

Updates automatically when you apply filters:

- Total Records (count of filtered rows)
- Completed Jobs (count with "Completed" status)
- Total Revenue (sum, formatted as currency)
- Total Costs (sum, formatted as currency)
- Total Profit (Revenue - Costs)
- Average Duration (in hours)

### Export Functions

**Excel Export:**
- Exports full filtered data
- Filename includes your filters automatically
  - Example: `JobMaster_Export_JobID-12345_Status-Completed_20250118_143022.xlsx`
- Creates multiple sheets: main data, summary statistics, applied filters
- Job-wise export for individual job data
- Export Count Report with all calculation methods

**PDF Export:**
- Currently disabled (use Excel instead)

### Status Log

Timestamped log at the bottom showing:
- Every action with time
- Processing updates
- Error messages (if any)
- Auto-scrolls to show latest message

### Technical Highlights

What makes this app work well:

**Data processing:**
- Background threading keeps the UI responsive during large file processing
- Smart column mapping finds fields even with different naming conventions
- Handles missing columns gracefully with fallback logic
- Converts data types automatically (dates, numbers, etc.)

**Performance:**
- Optimized for datasets with 1000+ records
- Efficient filtering algorithms
- Memory-conscious design

**User experience:**
- Color-coded metrics for easy reading
- Clear error messages when something goes wrong
- Scrollable panels for smaller screens
- Real-time feedback on all actions

---

## Bulk Job Checker Features

### Upload Options
- **Upload from File**: Text (.txt) or CSV (.csv) files
- **Upload from Excel**: Select column containing job IDs
- **Manual Entry**: Type or paste job IDs directly
- **Load Sample**: Pre-loaded example job IDs

### Status Checking
Checks multiple job IDs for:
- **GPS Execution**: Whether job has GPS tracking data
- **Payment Schedule Status**: Whether payment schedule is set up
- **Invoice Status**: Whether invoice has been created

### Results Display
- **Color-coded Results**: Green (good), Red (issues)
- **Detailed Reports**: Export to Excel with full status breakdown
- **Bulk Processing**: Handle hundreds of job IDs at once

---

## File Organization

### Folder Structure
```
jobmaster/
├── uploads/       # Uploaded source files (web app)
├── downloads/     # Web app search results and exports
├── exports/       # Desktop app exports and reports
├── reports/       # Generated reports and summaries
├── file/          # Original Excel files
└── screenshots/   # Application screenshots
```

### Smart Filename Generation
Exports automatically include filter criteria:
- **Format**: `JobMaster_Export_[filters]_YYYYMMDD_HHMMSS.xlsx`
- **Examples**:
  - `JobMaster_Export_JobID-12345_Status-Completed_20241215_143022.xlsx`
  - `JobMaster_Export_DateRange-2024-01-01-to-2024-01-31_GPSExecutedOnly_20241215_143155.xlsx`

### Excel Export Structure
All exports include multiple sheets:
1. **Main Data Sheet**: Filtered data
2. **Summary Sheet**: Statistics and metrics
3. **Applied Filters Sheet**: List of all filters used (if filters applied)
4. **Job Summary Sheet**: Job-specific info (for individual exports)

---

## Usage Instructions

### Desktop Application

1. **Launch**: `desktop_app.bat` or `python desktop_app.py`
2. **Load Data**: Select Excel file → Click "Process File"
3. **View Counts**: Counts automatically calculated and displayed at top
4. **Search & Filter**: Use left panel filters for real-time search
5. **Export**: Click "Export to Excel" or "Export Count Report"

### Web Application

1. **Launch**: `web_app.bat` or `streamlit run app.py`
2. **Upload**: Use sidebar to upload Excel file
3. **Process**: Click "Process File"
4. **Search**: Use search options to filter data
5. **Export**: Download Excel reports

### Bulk Job Checker

1. **Launch**: `bulk_job_checker.bat` or `python bulk_job_checker.py`
2. **Load Main Data**: Select Excel file with all job data
3. **Enter Job IDs**: Upload from file/Excel or type manually
4. **Check Status**: Click "Check Job Status"
5. **Export Results**: Save detailed status report

---

## Column Mapping

The application automatically maps these Excel column names:

| Standard Field | Possible Excel Column Names |
|---------------|---------------------------|
| Job ID | Job ID, job_id, JobID, ID |
| Load ID | Load ID, load_id, LoadID, Shipment ID |
| Job Date | Job Creation DateTime, job_date, creation_date, Job Date |
| GPS Executed | Distance: GPS, gps_distance, GPS Distance, Distance |
| Job Status | Status, job_status, Job Status |
| Job Count | Job Count, job_count, Jobs Count, Number of Jobs |
| Load Count | Load Count, load_count, Loads Count, Number of Loads |
| Trip Type | Trip Type, trip_type, TripType |
| Planned Stops: Qty | Planned Stops: Qty, planned_stops_qty, Stops Qty |
| Payment Schedule Status | Payment Schedule Status, payment_schedule_status |
| Invoice Status | Invoice Status, invoice_status |
| Vehicle | Vehicle, vehicle_id, Vehicle ID |
| Driver Name | Driver Name, driver_name, Driver |

*See README.md for complete mapping table*

---

## Technical Details

### Counting Algorithm
- **Job Counting**: Excludes empty/null Job IDs
- **Load Counting**: Handles missing Load ID columns with fallback logic
- **FTL-DISTRIBUTION**: Only counts trips with valid Load ID
- **Performance**: Optimized for large datasets (1000+ records)

### Data Validation
- Handles missing columns gracefully
- Converts invalid numeric values to NaN
- Provides clear error messages
- Fallback methods for missing data

### UI Features
- **Scrollable Left Panel**: All controls accessible
- **Mouse Wheel Support**: Easy navigation
- **Real-time Updates**: Instant filter results
- **Progress Messages**: Shows processing status

---

## Troubleshooting

### Common Issues

**"N/A" for Job Count:**
- Check if Excel file has "Job ID" column
- Verify column name matches expected format

**"0" for Load Count:**
- Check if "Load Count" column exists
- Verify Load Count values are numeric
- Check for missing or invalid data

**Unexpected Counts:**
- Review data for duplicates
- Check column mapping in application
- Verify data quality and consistency

### Best Practices

1. **Use Unique Job IDs**: Ensure each job has a unique identifier
2. **Include Load Count Data**: Add Load Count column for precise calculations
3. **Filter Before Counting**: Apply filters to get counts for specific subsets
4. **Export Reports**: Generate count reports for documentation
5. **Check Data Quality**: Review results to ensure counts make sense

---

## Version History

- **v2.1.0** (Dec 2024): Advanced counting logic, FTL-DISTRIBUTION prorated calculation, UI improvements
- **v2.0.0** (Dec 2024): Job Count & Load Count filtering, bulk upload features
- **v1.0.0** (2024): Initial release with basic data processing

---

*For installation and setup instructions, see README.md*

