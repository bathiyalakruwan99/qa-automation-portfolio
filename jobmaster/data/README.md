# Data folders (portfolio – no client data)

This project uses a structured layout:

- **input/** – Job Master Excel files. Includes `sample_job_master.xlsx` (dummy data) for testing.
- **exports/** – Generated exports. Includes `sample_export.xlsx` as an example.
- **samples/** – Sample job ID lists: `sample_job_ids.csv`, `sample_job_ids.txt`, `sample_job_ids.xlsx` (dummy IDs only).
- **uploads/** – Web app uploads
- **downloads/** – Web app downloads
- **reports/** – Reports

No client or company data is included. Sample files use dummy data only. Regenerate them with `python create_sample_data.py` from the jobmaster folder if needed.
