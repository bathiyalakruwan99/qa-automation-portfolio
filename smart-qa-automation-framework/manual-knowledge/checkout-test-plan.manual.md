# Acme Demo Store - Checkout Test Plan (Manual Knowledge)

> Synthetic demo example. Fictional product.

## Scope

End-to-end checkout flow on the Acme Demo Store: cart, shipping, payment, coupon, review, confirmation.

## Test Strategy

Risk-based. Prioritise flows where money, totals, or order state change. Combine manual exploratory testing with Playwright UI, API contract checks, and a small k6 smoke profile.

## Risk Register

| ID | Risk | Likelihood | Impact | Priority |
| --- | --- | --- | --- | --- |
| R-01 | Wrong total after coupon + shipping change | Medium | High | P1 |
| R-02 | Place Order succeeds twice from back navigation | Low | High | P1 |
| R-03 | Coupon below minimum still applies | Low | High | P1 |
| R-04 | Shipping fee shown before country selection | Medium | Low | P3 |
| R-05 | Confirmation email not triggered | Low | Medium | P2 |

## Coverage Matrix

| Area | Manual | UI Automation | API | Performance |
| --- | --- | --- | --- | --- |
| Cart math | Yes | Yes | Yes | Smoke |
| Coupons | Yes | Yes | Yes | - |
| Shipping | Yes | Yes | Yes | - |
| Payment validation | Yes | Yes | - | - |
| Order placement | Yes | Yes | Yes | Smoke |
| Confirmation page | Yes | Yes | - | - |

## Entry Criteria

- Demo build deployed to `demo` environment.
- Seed data loaded (5 products, 2 coupons, 2 shipping methods).
- Mock payment gateway returning deterministic responses.

## Exit Criteria

- All P1 cases pass.
- No open P1 or P2 defects.
- Evidence collected: traces, screenshots, network HARs for at least the happy path and one negative path.

## Test Cases (high level)

1. Happy path place order (signed-in).
2. Happy path place order (guest).
3. Apply valid coupon, total updates correctly.
4. Apply invalid coupon, error shown, total unchanged.
5. Apply coupon below minimum spend, rejected.
6. Change shipping method after coupon applied.
7. Try to submit with invalid card, blocked.
8. Submit valid order, confirmation page shown, order id returned.
9. Press browser back from confirmation, re-submit attempt blocked.
10. Place order with cart empty, blocked.

## Confidentiality

Synthetic. No real test plan or product is described.
