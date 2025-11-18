# Job Progress Checker (MCP)

## Overview

Minimal prompt bundle for querying job progress inside an MCP-enabled environment. Ideal for spot-checking a handful of jobs without loading the full job-progress checker application.

## Contents

- `platform_job_checker.md` – Primary prompt that instructs the agent to pull and analyze job progress.
- `100.md` – Snapshot of jobs that reached 100% progression.
- `New Text Document.txt` – Analyst scratchpad.

## Usage

Load `platform_job_checker.md` into your agent session, paste or attach the latest job IDs, and ask the agent to confirm their statuses. Record quick findings in `New Text Document.txt`.

