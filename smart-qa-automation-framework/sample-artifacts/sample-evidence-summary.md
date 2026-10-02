# Sample Evidence and Run Summary (Synthetic example for portfolio demonstration)

> Synthetic example. Not from any real run.

## Run information

- Run ID: `run-2026-06-28-001`
- Trigger: Sprint 42 release candidate validation
- Environment: demo
- Test layers executed: UI, API, hybrid, performance smoke

## Counts

| Status                       | Count |
| ---------------------------- | ----- |
| Total scenarios executed     | 24    |
| Passed                       | 21    |
| Healed (timing/environment)  | 2     |
| Verified defects             | 1     |
| Performance smoke result     | OK    |

## Evidence captured

- Screenshots for all failed scenarios.
- Network traces for hybrid checks.
- Run video for the dispatch flow.
- API response payloads for the dispatch endpoint (sanitized).

## Stakeholder summary

- Core dispatch flow works as expected.
- One verified defect: capacity-conflict UI status mismatch (DEMO-BUG-204).
- Two timing-related flaky failures were classified, replaced with deterministic waits, and re-run successfully.
- Recommendation: Hold release until DEMO-BUG-204 is fixed and re-verified.

## Confidentiality note

All names, IDs, counts, and outcomes are fictional and used only for portfolio demonstration.
