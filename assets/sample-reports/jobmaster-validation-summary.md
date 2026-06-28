# Job Master Validation Summary (Sanitized Sample)

> Fictional, synthetic data. Used only to illustrate the shape of a validation report.

## Run context

- **Export:** `JobMaster_Export_TripType-FTL-DISTRIBUTION_Stops-9to16_20260101.xlsx`
- **Total rows:** 5
- **Filter:** `Trip Type = FTL-DISTRIBUTION AND Planned Stops: Qty BETWEEN 9 AND 16`
- **Generated:** 2026-01-01 08:00 UTC

## Totals

| Metric                                | Value |
| ------------------------------------- | ----- |
| Jobs in scope                         | 3     |
| Unique loads (Non-distribution rule)  | 3     |
| Loads (FTL-DIST prorated)             | 4.0   |
| Loads (FTL-DIST 8x)                   | 4     |
| Loads (FTL-DIST 10x)                  | 3     |
| Jobs missing GPS                      | 1     |
| Jobs missing invoice                  | 2     |
| Jobs with payment schedule pending    | 2     |

## Sample rows

| Job ID   | Trip Type        | Stops | Load ID   | Status      | Invoice    | Payment   | GPS       |
| -------- | ---------------- | ----- | --------- | ----------- | ---------- | --------- | --------- |
| JOB-1001 | FTL-DISTRIBUTION | 9     | LOAD-2001 | Completed   | Pending    | Scheduled | Available |
| JOB-1002 | FTL-DISTRIBUTION | 12    | LOAD-2002 | In Progress | Not Created| Pending   | Missing   |
| JOB-1005 | FTL-DISTRIBUTION | 16    | LOAD-2005 | Completed   | Pending    | Scheduled | Available |

## Exceptions detected

1. `JOB-1002` — GPS missing on an in-progress distribution job.
2. `JOB-1002` — Invoice not created although status moved past pickup.
3. Load count differs between prorated (4.0) and 10x (3) methods. Confirm which method is expected for distribution trips with 9–16 stops.

## QA action

- File three sub-tasks against the affected jobs.
- Confirm the expected load-counting rule with the product owner before sign-off.
- Re-run after fixes and attach the updated export.
