# Job Master Data Validation and Evidence Processor (Case Study)

> Synthetic example for portfolio demonstration. No real Python code, Excel data, exports, or screenshots are included.

## Business Problem

TMS releases must be validated against large job and work-order exports covering jobs, loads, GPS, invoices, and payments. Manual reconciliation is slow and error-prone, especially when load-counting methods vary across trip types and modules. A single release may involve 1,000+ job records with 200+ FTL-DISTRIBUTION trips, each with different stop quantities and counting rules.

## QA Challenge

- Validate large exports (1,000+ rows) across jobs, loads, GPS, invoices, and payments
- Apply multiple load-counting methods consistently across three separate categories
- Detect calculation defects in bulk status, GPS, payment, and invoice checks
- Handle column mapping variations across different export formats
- Produce evidence-ready outputs that travel cleanly into defect reports and release reviews

## Solution

A Python application suite with four components:

### 1. Desktop App (Tkinter)

Primary data processing tool with full GUI:
- Upload Excel files (.xlsx, .xls)
- Search and filter by Job ID, name, status, keywords, trip type
- View data in interactive tables with customizable columns
- Export to Excel (full, filtered, job-wise, operation-wise, count reports)
- Automatic job and load counting on file processing

### 2. Web App (Flask)

Browser-based interface for the same processing workflow:
- Upload, process, search, filter, export
- Share access across devices on the same network

### 3. Bulk Job Checker

Bulk status verification for multiple job IDs:
- Input: CSV, TXT, or Excel list of job IDs
- Checks: GPS execution, payment schedule, invoice status
- Colour-coded results and detailed export

### 4. Counting Logic Test

Validates load counting logic on Job Master Excel files:
- Compares Non FTL-DISTRIBUTION vs FTL-DISTRIBUTION loads
- Tests three calculation methods
- Reports file structure, data separation, and totals

## Multi-Method Load Counting System

The core validation capability is a sophisticated multi-method counting system with three separate categories and three calculation methods for each.

### Three Main Categories

| Category | What It Counts | Method |
|---|---|---|
| Non FTL-DISTRIBUTION | All records where Trip Type is not FTL-DISTRIBUTION | Count unique, non-empty Load ID values (fallback: unique Job ID + Vehicle + Driver) |
| FTL-DISTRIBUTION | Records where Trip Type = FTL-DISTRIBUTION | Based on Planned Stops: Qty value with three calculation methods |
| FTL-DOMESTIC Route Optimiser | Records where Trip Type = FTL-DOMESTIC with Route Optimiser value | Based on Route Optimiser value (not Planned Stops) |

### Route Optimiser Exclusion

Records with a "Count: Load and Route Optimiser" value are completely excluded from Non FTL-DISTRIBUTION and FTL-DISTRIBUTION counting. They are only counted in the FTL-DOMESTIC Route Optimiser category.

### Three Calculation Methods

| Method | Formula | Result Type | Example |
|---|---|---|---|
| Current (Prorated) | Stops <= 8: 1.0 load. Stops > 8: base_loads + (remaining / 8) | Decimal (3 dp) | 5 stops = 1.000, 9 stops = 1.125, 17 stops = 2.125 |
| 8x Multiplication | ceil(stops / 8) | Whole number | 1-8 stops = 1, 9-16 = 2, 17-24 = 3 |
| 10x Multiplication | ceil(stops / 10) | Whole number | 1-10 stops = 1, 11-20 = 2, 21-30 = 3 |

### Total Calculation

```
Total Current = Non FTL-DIST + FTL-DIST (Current) + Route Optimiser (Current)
Total 8x     = Non FTL-DIST + FTL-DIST (8x)     + Route Optimiser (8x)
Total 10x    = Non FTL-DIST + FTL-DIST (10x)    + Route Optimiser (10x)
```

## Column Mapping

The applications use tolerant column mapping to handle export format variations:

| Internal Field | Possible Excel Column Names |
|---|---|
| Job ID | Job ID, job_id, JobID, ID |
| Job Date | Job Creation DateTime, job_date, Job Date |
| GPS Executed | Distance: GPS, gps_distance, GPS Distance |
| Job Status | Status, job_status, Job Status |
| Job Count | Job Count, job_count, Jobs Count |
| Load Count | Load Count, load_count, Loads Count |
| Trip Type | Trip Type, trip_type |
| Load ID | Load ID, load_id |
| Planned Stops | Planned Stops: Qty |
| Invoice Status | Invoice Status, invoice_status |
| Payment Schedule | Payment Schedule Status |

## Export Options

### Excel Exports
- Full data export with summary
- Filtered export (by status, invoice, payment, trip type, etc.)
- Job-wise export (individual jobs)
- Operation-wise reports
- Count reports with job analysis, load analysis, and status distribution

### Bulk Checker Exports
- Detailed status report with colour-coded results

## Dummy Scenario Example

| Input | Value |
|---|---|
| Total records | 1,200 |
| Non FTL-DISTRIBUTION records | 1,000 (954 unique Load IDs) |
| FTL-DISTRIBUTION records | 200 (average 10 stops per record) |
| Route Optimiser records | 4 (values: 6, 3, 4, 3) |

| Metric | Current (Prorated) | 8x | 10x |
|---|---|---|---|
| Non FTL-DIST | 954 | 954 | 954 |
| FTL-DIST | 250.000 | 400 | 200 |
| Route Optimiser | 4.000 | 4 | 4 |
| **Total** | **1,208.000** | **1,358** | **1,158** |

This shows why three methods matter: the same dataset produces three different total load counts depending on the calculation method used. QA needs to verify which method the product uses and whether the numbers match.

## Tech Stack

Python 3.8+ (3.11 recommended), Pandas, OpenPyXL, Tkinter (desktop GUI), Flask (web app), Werkzeug

## QA Value

- Cuts data verification from minutes per check to seconds
- Detects calculation defects that manual review would miss
- Three counting methods catch discrepancies between how different teams count loads
- Route Optimiser exclusion prevents double-counting across categories
- Tolerant column mapping handles export format variations without code changes
- Produces clean evidence for defect reports and release reviews
- Bulk checker verifies GPS, payment, and invoice status for hundreds of jobs in one pass

## Limitations

- Source code is not included in this public portfolio
- Validation rules are tuned for specific TMS export schemas
- Column mapping patterns are specific to known export variants
- Sample data and screenshots are not included

## Confidentiality Note

No real Python code, Excel data, exports, validation rules, calculations, sample reports, or screenshots containing real structure or data are included. This case study describes the approach and counting logic at a high level with dummy data only. See [`../docs/confidentiality.md`](../docs/confidentiality.md).
