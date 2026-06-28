# Run Notes - 2026-06-15 - Demo Checkout Run

> Synthetic example for portfolio demonstration.

## Run Summary

- Module: `demo-store-checkout`
- Build: `1.0.0-demo`
- Tests executed: 8
- Passed: 7
- Failed: 1 (TC-08 - back navigation re-submit)
- Duration: ~12 minutes

## What Went Well

- Coupon apply/remove/re-apply all stable across UI and API.
- Shipping method change with coupon applied works correctly (total updates).
- Mock payment gateway handled all card scenarios without issues.
- Evidence collection (traces, screenshots, network logs) worked end to end.

## Issues Found

- BUG-DEMO-001: Total update lag (~500 ms) after shipping change with coupon. Low severity, cosmetic.
- BUG-DEMO-002: Stale total visible for ~1 second after back navigation from Confirmation. Medium severity, tracked for fix.

## Memory Updates Proposed

- New flow verified: checkout -> coupon -> shipping change -> place order.
- New locator confirmed: `getByTestId('place-order')` stable across builds.
- New validation rule: coupon applies to subtotal before shipping.
- New flaky area: total display has async update lag when shipping changes with coupon active.
- New known bug: BUG-DEMO-002 (stale total after back navigation).

## Next Steps

- Track BUG-DEMO-002 for next sprint.
- Add hybrid test for total parity across navigation events.
- Run k6 smoke against the checkout endpoint.
