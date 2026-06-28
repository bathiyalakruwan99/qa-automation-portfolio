# Job Master Validation Summary (Sanitized Sample)

> Fictional, synthetic data. Used only to illustrate the shape of a validation report. No real export columns, calculation rules, or data are included.

## Run context

- **Scope:** Fictional job/work-order export
- **Total rows:** 5
- **Generated:** 2026-01-01 08:00 UTC

## Totals

| Metric | Value |
| --- | --- |
| Jobs in scope | 3 |
| Jobs missing GPS | 1 |
| Jobs missing invoice | 2 |
| Jobs with payment pending | 2 |

## Sample rows

| Job ID | Load ID | Status | Invoice | Payment | GPS |
| --- | --- | --- | --- | --- | --- |
| DEMO-JOB-1001 | DEMO-LOAD-2001 | Completed | Pending | Scheduled | Available |
| DEMO-JOB-1002 | DEMO-LOAD-2002 | In Progress | Not Created | Pending | Missing |
| DEMO-JOB-1005 | DEMO-LOAD-2005 | Completed | Pending | Scheduled | Available |

## Exceptions detected

1. `DEMO-JOB-1002` — GPS missing on an in-progress job.
2. `DEMO-JOB-1002` — Invoice not created although status moved past pickup.

## QA action

- File sub-tasks against the affected jobs.
- Confirm expected readiness states with the product owner before sign-off.
- Re-run after fixes and attach the updated summary.
