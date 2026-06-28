# 01 - User Story Analysis

> Synthetic example. Fictional `example-module`.

## Story

> As a shopper, I want to apply a coupon during checkout so that I can pay less for my order.

## Acceptance Criteria (testable)

1. Valid coupon reduces order total by the coupon's amount.
2. Invalid coupon shows a clear, specific error.
3. Coupon below the minimum spend is rejected.
4. Only one coupon may be applied at a time.
5. Removing a coupon restores the original total.

## Out of Scope

- Stacking coupons.
- Loyalty point redemption.

## Risks

- Currency rounding when coupon is percentage based.
- Race condition between coupon apply and shipping change.

## Open Questions

See `00_blockers-and-missing-details.md`.
