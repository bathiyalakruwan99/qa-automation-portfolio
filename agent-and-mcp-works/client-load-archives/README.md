# Client Load Archives

## Overview

Prompts and reference lists used to cross-check client load files inside conversational agents or MCP tooling. These documents help agents answer “is a specific job available?” questions without opening spreadsheets manually.

## Contents

- `client_jobs_reference.md` – Raw list of job identifiers supplied by the client.
- `completed_job_ids.md` – Catalog of loads already confirmed as completed.
- `missing_jobs_reference_diff.md` – Delta between the client reference list and completed data.
- `pmt` – Prompt/metadata snippets shared with the agent.

## Usage

1. Feed the relevant markdown file to the agent/MCP session.
2. Ask the agent to search for the job ID or compare two lists.
3. Use `missing_jobs_reference_diff.md` when you need mismatch summaries.

## Notes

These files are static references—no scripts are required. Update them whenever a new export arrives from the client.

