# Acme Demo Store - Coupon Validation Rules (Manual Knowledge)

> Synthetic demo example. Fictional rules only.

## Rule Set

| ID | Rule |
| --- | --- |
| C-01 | A coupon is only valid between its start and end date in store timezone. |
| C-02 | A coupon below its minimum spend is rejected with a specific error. |
| C-03 | A percentage coupon never reduces the order total below zero. |
| C-04 | A free-shipping coupon overrides the selected shipping fee but not taxes. |
| C-05 | Only one coupon can be applied per order. |
| C-06 | A coupon can be removed before payment and re-applied. |
| C-07 | A removed coupon must not appear on the final order summary. |
| C-08 | Coupon usage decrements once on `Place Order`, not on apply. |
| C-09 | Coupon usage is rolled back if `Place Order` fails. |
| C-10 | Coupons are case-insensitive on input, stored in uppercase. |

## Edge Cases QA Cares About

- Cart total exactly equals coupon minimum.
- Cart total drops below coupon minimum after item removal (coupon must auto-detach).
- Two browser tabs apply the same single-use coupon (only first wins).
- Currency rounding when discount is a percentage.
- Coupon applied, then shipping method changed, then re-applied.

## Expected Errors

| Case | Message |
| --- | --- |
| Unknown code | `That coupon code is not recognised.` |
| Expired | `This coupon has expired.` |
| Below minimum | `Spend at least $X to use this coupon.` |
| Already used | `This coupon has already been used.` |
| Wrong customer segment | `This coupon is not available for your account.` |

## Confidentiality

Rules are illustrative and not taken from any real product or merchant.
