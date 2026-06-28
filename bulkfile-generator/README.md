# Bulk Upload Data Quality (Case Study)

> Synthetic example for portfolio demonstration. No real code, Excel templates, validation logic, or sample uploads are included.

## Business Problem

Customers uploading bulk data (organizations, vehicles, drivers, locations) to a TMS regularly hit validation errors: wrong formats, missing fields, duplicate IDs, invalid districts. The support team is then flooded with tickets that are really data-quality problems, not product defects.

## QA Challenge

- Catch data issues before they reach the platform
- Auto-correct common, deterministic mistakes
- Highlight errors that need human attention
- Validate large files quickly enough to use in QA and support workflows

## Solution

A Python validator and corrector exposed via three interfaces:

- Desktop GUI (Tkinter)
- Web interface (Flask) with drag-and-drop upload
- Command-line batch processing

## Key Capabilities

- Validates organization details, divisions, HR data, vehicles, and locations
- Auto-corrects status fields, district names, missing NICs, and duplicates
- Produces detailed correction reports and timestamped output files
- Error highlighting for fields that need manual review

## Tech Stack

Python 3.7+, Pandas, OpenPyXL, Tkinter, Flask, Werkzeug

## QA Value

- Removes a common class of false defects driven by bad upload data
- Cuts support load by 50%+ for upload-related tickets
- Provides QA with a reusable validator to harden new ingestion flows

## Related Data Quality Utilities

Two additional Excel utilities were built for QA data workflows:

- **Excel Diff Tool**: Sheet-by-sheet comparison of two Excel files with cell-level difference detection, markdown report generation, and side-by-side Excel export with highlighted differences. Useful for data migration validation and regression testing.
- **Excel Job Highlighter**: Colour-codes Excel rows by job ID categories for visual analysis of large datasets during manual review. Handles large files and preserves original data.

A **test-data generator** was also built to produce realistic synthetic order data (1,000+ records) using Faker for performance and workflow testing, with multiple export formats (Excel, JSON, CSV).

## Limitations

- Source code is not included in this public portfolio
- Validation rules are tuned for specific TMS schemas
- District mapping is Sri Lanka focused

## Confidentiality Note

No real code, Excel templates, validation logic, correction rules, or sample uploads are included. This case study describes the approach at a high level only. See [`../docs/confidentiality.md`](../docs/confidentiality.md).
