# 02 - Test Plan

> Synthetic example. Fictional `example-module`.

## Scope

Coupon apply, remove, and re-apply during checkout for the demo store.

## Test Cases

| ID | Title | Priority | Type |
| --- | --- | --- | --- |
| TC-01 | Apply valid coupon updates total | P1 | UI + API |
| TC-02 | Apply invalid coupon shows error | P1 | UI |
| TC-03 | Apply below-minimum coupon rejected | P1 | UI + API |
| TC-04 | Remove applied coupon restores total | P2 | UI |
| TC-05 | Re-apply removed coupon works | P2 | UI |
| TC-06 | Coupon survives shipping method change | P2 | UI |
| TC-07 | Order with applied coupon decrements usage | P3 | API |

## Entry / Exit

- Entry: see `00_setup-and-readiness-check.md`.
- Exit: all P1 pass, no open P1/P2 defects, evidence collected for happy and negative paths.
