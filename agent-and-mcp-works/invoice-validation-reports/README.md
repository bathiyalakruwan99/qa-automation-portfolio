# Invoice Validation Reports

## Overview

Collection of agent prompts, CSV extracts, and comparison notes used to validate invoice data for multiple clients. Designed for MCP sessions where the agent needs both natural-language context and structured files.

## Contents

- **Prompts & Guides**
  - `clientA_invoice_check_prompt.md`
  - `clientD_job_notes`
  - `comprehensive_job_search.md`
  - `prompt.md`
  - `cursorrules`
- **Reference Lists**
  - `clientA_job_names_and_companies.csv/.md`
  - `clientD_july-august.csv/.md`
  - `job_names_and_companies.csv/.md`
  - `job_search_summary.md`
  - `job_verification_summary.md`
  - `jobs_to_check.txt`, `remaining_jobs_to_check.txt`
- **Data Files**
  - `jobs.xlsx`
  - `clientA_jobs`, `clientA_jobs.bak`
  - `process_results.py` (utility script used alongside prompts)

## Usage

1. Start with `clientA_invoice_check_prompt.md` or `prompt.md` to frame the agent request.
2. Attach the relevant CSV/MD reference files to provide context.
3. When counts or transformation logic is needed, pair the prompts with the `process_results.py` helper.
4. Capture findings in the summary markdown files for future sessions.

## Notes

- Keep the CSV/Excel exports refreshed with the latest invoice data.
- The markdown prompts assume sanitized client identifiers (ClientA, ClientD).

