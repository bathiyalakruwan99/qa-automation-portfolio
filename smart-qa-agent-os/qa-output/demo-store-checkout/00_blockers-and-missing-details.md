# 00 - Blockers and Missing Details

> Synthetic example. Fictional `demo-store-checkout` module.

## Blockers

| ID | Description | Owner | Status |
| --- | --- | --- | --- |
| B-01 | Mock payment gateway returns 500 on Express shipping | Backend | Resolved |

## Missing Details

| ID | Question | Asked of | Status |
| --- | --- | --- | --- |
| Q-01 | Should coupon apply before or after shipping fee? | Product | Answered: before shipping |
| Q-02 | Is order id format documented? | API team | Answered: `ORD-XXXX-XXXX` |

## Resolved Answers

- **Q-01**: Coupon applies to cart subtotal before shipping. Shipping is added after discount.
- **Q-02**: Order id format is `ORD-` followed by 4 hex chars, a dash, and 4 more hex chars.
