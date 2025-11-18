# Job Percentage Analytics

## Overview

Prompt kits and reference tables for tracking job completion percentages through an agent session. Primarily focused on ClientA loads but adaptable to other clients.

## Contents

- `100_percent_inprogress_jobs_clientA.md`, `100_percent_inprogress_jobs.md` – Lists of jobs stuck at 100% yet not closed.
- `job_status_report_clientA.md`, `job_status_report.md` – Detailed multi-status breakdowns.
- `clientA_jobs`, `JOBS.txt` – Supporting job identifiers.
- `prompt.md`, `prompt_dimo.md` – Prompt templates for the agent.
- `ClientC issue jobs 8/14` – Edge-case list preserved for context.

## Usage

Load the relevant prompt file into your agent session, then attach the matching job status markdown file. Ask the agent to surface jobs by status, highlight those requiring manual intervention, or summarize progress metrics for weekly reports.

