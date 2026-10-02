# 08 - Final Test Execution Report

> Synthetic example. Fictional `example-module`.

## Summary

| Metric | Value |
| --- | --- |
| Total cases | 7 |
| Passed | 6 |
| Failed | 1 |
| Blocked | 0 |
| Coverage | UI + API |
| Evidence | Traces, screenshots, network logs |

## Per-case Results

| ID | Title | Result | Evidence |
| --- | --- | --- | --- |
| TC-01 | Apply valid coupon updates total | Pass | `traces/tc-01.zip` |
| TC-02 | Apply invalid coupon shows error | Pass | `screenshots/tc-02.png` |
| TC-03 | Apply below-minimum coupon rejected | Pass | `network/tc-03.har` |
| TC-04 | Remove applied coupon restores total | Pass | `traces/tc-04.zip` |
| TC-05 | Re-apply removed coupon works | Pass | `traces/tc-05.zip` |
| TC-06 | Coupon survives shipping change | Fail | `defects/BUG-DEMO-002.md` |
| TC-07 | Order with applied coupon decrements usage | Pass | `network/tc-07.har` |

## Defects

- `BUG-DEMO-002` Stale total after back navigation - Medium - Open.

## Release Recommendation

- Conditional Go: P1 pass, one P2 outstanding (`BUG-DEMO-002`), tracked for the next sprint.

## Sign-off

- Tester: QA Engineer
- Date: TBD
