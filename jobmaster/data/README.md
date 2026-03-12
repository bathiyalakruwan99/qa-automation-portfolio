# Data layout – what it is and how it’s used

Job Master works with Excel-based job and load data. This folder holds all inputs, outputs, and shared data in one place so every app (desktop, web, bulk checker, counting test) uses the same structure.

## What goes where

| Folder | Purpose | How the apps use it |
|--------|---------|----------------------|
| **input/** | Source Job Master Excel files (main data). | Desktop app and counting test use a default file from here; you can also open or upload any file from this folder. |
| **exports/** | Exported Excel reports (filtered data, job-wise exports, count reports). | Desktop and web apps write exports here; you open these files in Excel or share them. |
| **samples/** | Lists of job IDs (CSV, TXT, or XLSX). | Bulk Job Checker reads these lists and checks each ID against the main data (GPS, payment, invoice status). |
| **uploads/** | Files uploaded through the web app. | Web app stores uploads here before processing. |
| **downloads/** | Files the web app prepares for download (e.g. export Excel). | Web app writes here when you trigger an export or download. |
| **reports/** | Generated reports (e.g. operation-wise, count reports). | Desktop app (and any script that generates reports) saves here. |

## How it fits together

1. **Main data** lives in **input/** (e.g. `sample_job_master.xlsx`). It has jobs, loads, statuses, dates, and related columns.
2. **Desktop and web apps** read from input (or from an upload), let you search and filter, then **write** results to **exports/** or **reports/**.
3. **Bulk Job Checker** takes a **samples/** list of job IDs and checks each ID against the main data; results can be exported to **exports/**.
4. **Counting Logic Test** reads a Job Master file (from **input/** or a path you give), runs the load-count rules, and prints or reports the result.

Sample files in `input/`, `samples/`, and `exports/` are provided so you can run the apps without your own data. To recreate them: from the jobmaster folder run `python create_sample_data.py`.
