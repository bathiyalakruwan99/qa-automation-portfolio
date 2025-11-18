# Invoice Completion Audit

## Overview

Prompt packs used to ensure every completed job appears in invoice deliverables. Analysts load these markdown files into an agent session, ask the agent to reconcile lists, and capture any missing records.

## Contents

- Completion snapshots: `completed_job_files.md`, `jobs_in_completed_but_not_in_myjobs.md`
- Comparison helpers: `job_name_comparison.md`, `missing_job_entries_report.md`, `missing_job_names_only.md`, `missing_jobs_simple.md`
- Raw data sets: `invoice_job_data.md`, `myjobs.md`
- Workflow prompt: `cursor_retrieve_pending_job_files_for_u.md`
- Scratchpad: `New Text Document.txt`

## Usage

1. Provide `invoice_job_data.md` and `myjobs.md` to the agent.
2. Run the instructions from `cursor_retrieve_pending_job_files_for_u.md`.
3. Log differences using the “missing_*.md” files.
4. Update `completed_job_files.md` after each audit cycle.


