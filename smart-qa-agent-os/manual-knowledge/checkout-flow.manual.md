# Acme Demo Store - Checkout Flow (Manual Knowledge)

> Synthetic demo example. Fictional product. No real customer data, real selectors, real workflows, or proprietary domain rules.

## Purpose

Human-written workflow note used as approved background context by Smart QA Agent OS. Agents read this to plan coverage; they do not execute against it.

## Actors

- Shopper (signed-in or guest)
- Payment gateway (mocked in demo)
- Order service (demo backend)

## Happy Path

1. Shopper adds at least one product to the cart from the Product List page.
2. Shopper opens the Cart page and clicks `Checkout`.
3. Shopper fills shipping details (name, address, city, postal code, country).
4. Shopper picks a shipping method (Standard or Express).
5. Shopper enters payment details on the Payment page (demo gateway).
6. Shopper applies an optional coupon code.
7. Shopper reviews the Order Summary and clicks `Place Order`.
8. The Confirmation page shows `Order #` and an email is sent (mocked).

## Alternate Paths

- Guest checkout (no login).
- Apply coupon then remove it before payment.
- Change shipping method on the review step.
- Switch from card to demo `Pay Later` option.

## Key Business Rules

- Cart total recalculates on every quantity, shipping method, or coupon change.
- Coupons apply only when the cart total meets the coupon's minimum.
- Shipping fee is hidden until the shipper picks a country.
- Order `Place Order` button stays disabled until payment fields pass client validation.

## Known Risk Areas

- Currency rounding when coupon is percentage based.
- Race condition between coupon apply and shipping method change.
- Back-navigation from Confirmation page should not allow re-submission.

## Out of Scope

- Real payment processor integration.
- Real shipping carrier API.
- Tax engine specifics.

## Confidentiality

Synthetic content. Any resemblance to a real product or workflow is coincidental.
