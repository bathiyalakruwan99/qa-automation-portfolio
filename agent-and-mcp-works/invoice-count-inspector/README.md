# Invoice Count Inspector

## Overview

Minimal prompt set for counting jobs and invoices across multiple data sources within an agent/MCP session. Helpful when you need quick verification without opening spreadsheets.

## Contents

- `cursor_extract_job_files_from_platform.md` – Guide prompt for retrieving job files via an MCP-enabled cursor.
- `platform_analysis_prompt.md` – Template for analyzing discrepancies.
- `job_comparison.md`, `jobs.md`, `jobslistsFOund.md` – Reference notes and outputs from earlier runs.
- `txt` – Scratchpad for ad-hoc notes.

## Usage

1. Feed the extraction prompt to the agent to gather the latest files.
2. Use the analysis prompt to calculate counts or identify missing rows.
3. Record findings in the comparison markdown files for future reference.

