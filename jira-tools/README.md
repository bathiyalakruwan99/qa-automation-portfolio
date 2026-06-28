# Jira QA Tools (Case Study)

> Synthetic example for portfolio demonstration. No real ticket data, credentials, or internal epic keys are included.

## Business Problem

QA teams spend meaningful time pulling Jira data into a shape that supports release decisions: which tickets are ready for release, which need regression tests, and what each ticket's status history looks like. Doing that by hand across many epics is slow and error-prone.

## QA Challenge

- Aggregate tickets from multiple epics into one consistent dataset
- Track ready-for-release status and status-change history
- Generate regression test cases from bug/task tickets
- Reuse a library of high-quality QA prompts across releases

## Solution

A small collection of focused Python scripts that:

- Sync Jira tickets to local JSON via the Jira REST API
- Build a manifest for quick lookup
- Export ticket data and status history to Excel
- Generate ready-for-release and regression-test-case reports
- Provide a curated library of 76+ QA prompts for API, security, and automation testing

## Key Capabilities

- **Ticket sync** from configured Jira epics into local JSON
- **Ticket history** Excel export with status changelog
- **Manifest builder** for fast indexing of all synced tickets
- **Report generators** for ready-for-release lists and regression test cases
- **QA prompt library** covering API, security, automation, and more

## Tech Stack

Python 3.8+, Jira REST API, Requests, OpenPyXL

## QA Value

- Provides repeatable, evidence-friendly views of release readiness
- Removes manual data-shaping work from the QA workflow
- Enables a reusable QA prompt library for consistent testing artefacts
- Produces Excel and markdown outputs that travel cleanly into reviews

## Limitations

- Requires valid Jira credentials to sync
- Reports are intentionally focused; deeper analytics belong in a BI tool
- Status-history depth depends on what Jira's changelog API returns

## Confidentiality Note

No real ticket data, customer references, internal epic keys, credentials, or proprietary prompts are included. This case study describes the approach at a high level only. See [`../docs/confidentiality.md`](../docs/confidentiality.md).
