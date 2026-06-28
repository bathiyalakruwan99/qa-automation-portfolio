# 08 - Final Test Execution Report

> Synthetic example. Fictional `demo-store-checkout` module.

## Summary

| Metric | Value |
| --- | --- |
| Total cases | 8 |
| Passed | 7 |
| Failed | 1 |
| Blocked | 0 |
| Coverage | UI + API |
| Evidence | Traces, screenshots, network logs |
| Date | 2026-06-15 |

## Per-case Results

| ID | Title | Result | Evidence |
| --- | --- | --- | --- |
| TC-01 | Apply valid coupon updates total | Pass | `traces/tc-01.zip` |
| TC-02 | Apply invalid coupon shows error | Pass | `screenshots/tc-02.png` |
| TC-03 | Apply below-minimum coupon rejected | Pass | `network/tc-03.har` |
| TC-04 | Remove applied coupon restores total | Pass | `traces/tc-04.zip` |
| TC-05 | Re-apply removed coupon works | Pass | `traces/tc-05.zip` |
| TC-06 | Coupon survives shipping change | Pass | `traces/tc-06.zip` |
| TC-07 | Order with applied coupon decrements usage | Pass | `network/tc-07.har` |
| TC-08 | Back navigation does not allow re-submit | Fail | `defects/BUG-DEMO-002.md` |

## Defects

| ID | Title | Severity | Status |
| --- | --- | --- | --- |
| BUG-DEMO-001 | Total update lag after shipping change | Low | Triaged |
| BUG-DEMO-002 | Stale total after back navigation | Medium | Open |

## Release Recommendation

**Conditional Go**: All P1 cases pass except TC-08 (back navigation re-submit), which has a Medium-severity defect tracked for the next sprint. No P1 defects remain open. One P2 defect (BUG-DEMO-001) is cosmetic and does not block release.

## Sign-off

- Tester: QA Engineer
- Date: 2026-06-15
