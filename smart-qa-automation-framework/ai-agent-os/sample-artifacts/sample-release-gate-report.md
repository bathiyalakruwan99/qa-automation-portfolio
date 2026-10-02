# Sample Release Gate Report (Synthetic example for portfolio demonstration)

> Synthetic example. Not from any real release or customer.

## Release

- Product (fictional): Northstar Retail Operations Platform
- Candidate: Sprint 42
- Date: 2026-06-28

## Recommendation

**Hold — verify and re-test.**

## Evidence summary

| Area                          | Status   | Notes                                              |
| ----------------------------- | -------- | -------------------------------------------------- |
| Order Dispatch UI scenarios   | Passed   | 12 scenarios, including capacity edges             |
| Order Dispatch API scenarios  | Passed   | 4 endpoints, schema valid                          |
| Hybrid UI vs API consistency  | Failed   | Capacity-conflict shows mismatched UI status        |
| Regression suite              | Passed   | No new failures vs last release                    |
| Performance smoke             | Passed   | Latency within baseline                            |
| Known defects                 | 1 open   | DEMO-BUG-204 capacity-conflict status mismatch     |

## Risks

- Status mismatch could cause downstream automated workflows to think an order was dispatched when it was not.

## Required actions before approval

1. Developers to verify status synchronisation fix.
2. QA to re-run hybrid scenarios and regression smoke after the fix.
3. Memory Curator to record verified learning post-fix.

## Confidentiality note

All names, IDs, statuses, and references are fictional.
