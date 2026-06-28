# BUG-DEMO-002 - Stale total after back navigation from Confirmation

> Synthetic example for portfolio demonstration.

| Field | Value |
| --- | --- |
| ID | BUG-DEMO-002 |
| Severity | Medium |
| Priority | P2 |
| Status | Open |
| Module | demo-store-checkout |
| Found by | Exploratory session S-02 |
| Date | 2026-06-15 |

## Description

After placing an order and reaching the Confirmation page, pressing the browser Back button returns to the Payment page. The order total shown is stale (from the completed order) for approximately 1 second before the page redirects to the cart.

## Reproduction Steps

1. Complete a checkout with coupon `WELCOME10` applied.
2. Reach the Confirmation page.
3. Press browser Back.
4. Observe the Payment page total.

## Expected

The Payment page should either redirect immediately or show an empty cart state. It should not display the completed order's total.

## Actual

The stale total from the completed order ($22.50) is visible for ~1 second before the redirect fires.

## Evidence

- Trace: `traces/bug-demo-002.zip`
- Network log: `network/bug-demo-002.har`

## Risk

A shopper might attempt to re-submit the order. The `Place Order` button is disabled during this window, but the stale total could cause confusion.

## Environment

- Build: `1.0.0-demo`
- Browser: Chromium 125
- Environment: `demo`
