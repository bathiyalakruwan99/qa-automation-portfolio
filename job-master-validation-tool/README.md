# Job Master Data Validation & Release Evidence Tool

> **Internal QA Tool — Sanitized Public Overview**
> A data-validation utility I built to review job and work-order exports, identify exceptions, and produce release-evidence summaries.

## Business Problem

Job and work-order data flows through many states (created, assigned, in progress, completed) across large exports. Before a release, QA must confirm this data is complete, consistent, and reconciled, and produce evidence to back the go/hold decision. Doing this by hand across thousands of records is slow and error-prone.

## QA Challenge

- Validate completeness and consistency across large job/work-order exports
- Reconcile related records that must agree with each other
- Surface exceptions (missing fields, status/progress mismatches, orphan records)
- Produce release evidence that supports a defensible decision

## What the Tool Does

A data-validation tool that processes job and work-order exports, normalizes records, runs QA checks, and creates an actionable exception summary. It automates repeated consistency, completeness, and readiness checks across large job and work-order exports.

### Validation checks

| Check | What it verifies | Example exception |
| --- | --- | --- |
| Completeness | Required fields present on every record | A job with no assigned resource |
| Status consistency | Status agrees with related fields | Completed status but progress < 100% |
| Progress verification | Progress percentages are valid and consistent | Progress above 100% |
| Reconciliation | Linked records agree across sources | A load with no matching job |
| Orphan detection | No record points to something missing | A work order with no parent job |

### Workflow

```
Job / work-order export
  -> Normalize records
  -> Run completeness, consistency, progress, and reconciliation checks
  -> Produce an actionable exception summary
  -> QA reviews exceptions and forms a release recommendation
```

## Fictional Example Output

| Record | Check | Result |
| --- | --- | --- |
| DEMO-JOB-1001 | Completeness | Pass |
| DEMO-JOB-1002 | Status consistency | Exception: completed but progress 80% |
| DEMO-LOAD-2001 | Reconciliation | Exception: no matching job |
| DEMO-JOB-1003 | Progress verification | Pass |

```
Records checked: 4
Pass: 2
Exceptions: 2
  - DEMO-JOB-1002: status/progress mismatch
  - DEMO-LOAD-2001: unreconciled load (no parent job)
Recommendation: HOLD — resolve 2 exceptions before release
```

## QA Value

- Automates repeated consistency, completeness, and readiness checks across large exports
- Surfaces exceptions that would be missed in manual review
- Produces release evidence that supports a defensible go/hold decision
- Turns a large export into a short, actionable exception list

## QA Skills Demonstrated

- Data validation and reconciliation at scale
- Turning large exports into actionable exception summaries
- Release-evidence reporting and traceability
- Risk-based prioritisation of data exceptions

## Public Portfolio Scope

The public repository documents the capability and QA approach at a high level. The implementation, export schemas, calculation logic, and production examples remain private.

## Confidentiality Note

The original tool is real. No real source code, export schemas, internal column names, calculation logic, or production data is included. All records shown here are fictional. See [`../docs/confidentiality.md`](../docs/confidentiality.md).
