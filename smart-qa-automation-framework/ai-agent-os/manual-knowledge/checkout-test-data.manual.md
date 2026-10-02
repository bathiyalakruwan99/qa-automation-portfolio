# Acme Demo Store - Checkout Test Data (Manual Knowledge)

> Synthetic demo example. Fictional data only.

## Positive Data

| Case | Data |
| --- | --- |
| Single item cart | SKU `ACME-SKU-001`, qty 1 |
| Multi item cart | `ACME-SKU-001` x 2, `ACME-SKU-002` x 1 |
| Valid coupon | `WELCOME10` (10% off, min $20) |
| Valid card | `4242 4242 4242 4242`, exp `12/30`, cvv `123` (mock) |
| Standard shipping | Country: `Demoland`, method: `Standard` |

## Negative Data

| Case | Data |
| --- | --- |
| Empty cart | Cart with 0 items |
| Expired coupon | `EXPIRED50` |
| Below-minimum coupon | `WELCOME10` with $5 cart |
| Invalid card | `4000 0000 0000 0002` (declined in mock) |
| Bad postal code | `00000` |

## Boundary Data

| Case | Data |
| --- | --- |
| Coupon at exactly min spend | Cart total = $20.00, coupon = `WELCOME10` |
| Single-digit quantity | qty 9 |
| Multi-digit quantity | qty 10 |
| Long shipping name | 64 chars |
| Long shipping name (overflow) | 65 chars (should reject) |

## Dependency Data

- Product catalog must contain `ACME-SKU-001` and `ACME-SKU-002`.
- Coupon engine must contain `WELCOME10` (active) and `EXPIRED50` (expired).
- Shipping table must include `Demoland` with `Standard` and `Express`.

## Cleanup

- Demo orders are wiped nightly by the demo environment cron.
- No test data is shared with production stores.

## Confidentiality

All values above are synthetic. No real card numbers, customer records, or coupon codes are used.
