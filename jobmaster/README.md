# Job Master Data Validation and Evidence Processor (Case Study)

> Sanitized example for portfolio demonstration. No real code, data, export columns, calculation rules, exports, or screenshots are included. All records below are fictional.

## Business Problem

Releases must be validated against large job and work-order exports covering jobs, loads, GPS readiness, invoices, and payments. Manual reconciliation is slow and error-prone, especially when work items follow different statuses and readiness rules across workflow types. A single release review can involve hundreds of records where one inconsistent field is easy to miss by eye but expensive in production.

## QA Challenge

- Validate large exports across jobs, loads, GPS, invoices, and payments
- Detect missing or incomplete data before it reaches a release decision
- Confirm status consistency across related records
- Verify that downstream readiness (GPS, invoice, payment) matches the job state
- Produce evidence-ready outputs that travel cleanly into defect reports and release reviews

## Approach

A data-validation workflow that ingests an export, normalises it into a consistent internal view, and runs a set of QA checks. The goal is to turn a raw export into a short, trustworthy list of exceptions a QA engineer can act on.

### Validation checks

| Check | What it confirms | Example exception |
| --- | --- | --- |
| Status consistency | Related fields agree with the job state | A `Completed` job with no GPS record |
| Missing/incomplete data | Required fields are present and valid | A job with a blank load reference |
| GPS readiness | GPS data exists where the workflow expects it | In-progress job missing GPS |
| Invoice readiness | Invoice state matches the job stage | Completed job with no invoice created |
| Payment readiness | Payment state is consistent with invoicing | Invoice pending but payment marked done |
| Bulk verification | Many records checked in a single pass | One inconsistent record in a batch of hundreds |

### QA workflow

```
Export ingest
  -> Normalise to a consistent internal view
  -> Run consistency, completeness, and readiness checks
  -> Collect exceptions with evidence
  -> Produce a release-ready summary
  -> Human QA review and sign-off
```

## Fictional Record Examples

| Job ID | Load ID | Status | GPS | Invoice | Payment | QA result |
|---|---|---|---|---|---|---|
| DEMO-JOB-1001 | DEMO-LOAD-2001 | Completed | Available | Pending | Scheduled | Consistent |
| DEMO-JOB-1002 | DEMO-LOAD-2002 | In Progress | Missing | Not Created | Pending | Flagged: GPS missing |
| DEMO-JOB-1003 | DEMO-LOAD-2003 | Completed | Available | Created | Done | Consistent |

A QA check on `DEMO-JOB-1002` flags the record because an in-progress job is missing GPS data and has no invoice created, which is inconsistent with how the workflow should progress. `DEMO-JOB-1001` and `DEMO-JOB-1003` pass because their readiness states line up with the job status.

### Sample exception report (shape only)

```
Records reviewed: 3
Consistent: 2
Flagged: 1
  - DEMO-JOB-1002: GPS missing on an in-progress job; invoice not created past pickup
Action: file sub-task, confirm expected readiness with product owner, re-run after fix
```

## QA Value

- Cuts data verification from minutes per check to seconds
- Detects inconsistencies and missing data that manual review would miss
- Confirms downstream readiness matches the job state
- Produces clean evidence for defect reports and release reviews
- Supports regression, UAT, and reconciliation cycles with repeatable checks

## QA Skills Demonstrated

- Data validation and reconciliation across related records
- Designing tolerant checks that survive minor export variations
- Turning large datasets into short, actionable exception lists
- Evidence-based reporting for release decisions

## Limitations

- No source code is included in this public portfolio
- The approach is described at a workflow level only
- Sample data, export formats, and screenshots are not included

## Confidentiality Note

No real code, data, export columns, calculation formulas, validation rules, sample reports, or screenshots are included. This case study describes the QA approach at a high level with fictional data only. See [`../docs/confidentiality.md`](../docs/confidentiality.md).
