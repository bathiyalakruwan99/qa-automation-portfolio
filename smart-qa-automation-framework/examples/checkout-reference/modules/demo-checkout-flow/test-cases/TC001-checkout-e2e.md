# TC001 - Checkout End-to-End

> Synthetic demo example.

## Summary

Verify a registered customer can take items through every sub-flow (sign in, add to cart, shipping, coupon, payment) and end with a confirmed order that appears in account history.

## Priority

High - smoke + regression.

## Pre-conditions

- Demo environment is reachable.
- Demo customer `demo.user@example.com` exists.
- Coupon `WELCOME10` is active.

## Data

- Items: 2 of `SKU-001` (Demo Notebook), 1 of `SKU-002` (Demo Pen Set).
- Shipping: Demo Customer, 1 Demo Street, Demo City, Demoland.
- Coupon: `WELCOME10` (10% off).
- Payment: card ending `4242`, expiry `12/30`.

## Steps

1. Sign in as the demo customer.
2. Open Shop and add the items to the cart.
3. Open the cart and start checkout.
4. Enter the shipping address.
5. Apply coupon `WELCOME10`.
6. Continue to payment, fill the demo card, and place the order.
7. Read the order ref from the confirmation page.
8. Open Account &rarr; Orders and verify the order is visible with status `Confirmed`.

## Expected results

- Cart shows the expected items.
- Discount `-10%` shown after applying the coupon.
- Order is placed and the confirmation page shows status `Confirmed`.
- Account order history shows the same order with status `Confirmed`.

## Linked specs

- `specs/demo-checkout.e2e.spec.ts`
