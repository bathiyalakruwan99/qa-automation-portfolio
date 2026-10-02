# 01 - User Story Analysis

> Synthetic example. Fictional `demo-store-checkout` module.

## Story

> As a shopper, I want to apply a coupon during checkout so that I can pay less for my order.

## Acceptance Criteria (testable)

1. Valid coupon reduces order total by the coupon's amount.
2. Invalid coupon shows a clear, specific error.
3. Coupon below the minimum spend is rejected.
4. Only one coupon may be applied at a time.
5. Removing a coupon restores the original total.
6. Coupon survives shipping method change.
7. Order placement decrements coupon usage exactly once.

## Out of Scope

- Stacking coupons.
- Loyalty point redemption.
- Tax engine integration.

## Risks

| ID | Risk | Priority |
| --- | --- | --- |
| R-01 | Currency rounding when coupon is percentage based | P2 |
| R-02 | Race between coupon apply and shipping change | P2 |
| R-03 | Back navigation allows re-submit | P1 |

## Open Questions

All resolved. See `00_blockers-and-missing-details.md`.
