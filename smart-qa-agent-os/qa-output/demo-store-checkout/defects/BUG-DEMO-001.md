# BUG-DEMO-001 - Total update lag after shipping change with coupon

> Synthetic example for portfolio demonstration.

| Field | Value |
| --- | --- |
| ID | BUG-DEMO-001 |
| Severity | Low |
| Priority | P3 |
| Status | Triaged |
| Module | demo-store-checkout |
| Found by | Exploratory session S-01 |
| Date | 2026-06-15 |

## Description

When a coupon is applied and the shipping method is changed from Standard to Express, the order total takes approximately 500 ms to update. During this window, the old total is still displayed.

## Reproduction Steps

1. Add an item to the cart ($25.00).
2. Apply coupon `WELCOME10` (total becomes $22.50).
3. Change shipping from Standard to Express.
4. Observe the total for 1 second.

## Expected

Total should update immediately or show a loading state.

## Actual

Old total ($22.50) remains visible for ~500 ms before updating to $30.50 ($22.50 + $12.00 Express - $5.00 Standard removed).

## Evidence

- Screenshot: `screenshots/bug-demo-001.png`
- Trace: `traces/bug-demo-001.zip`

## Environment

- Build: `1.0.0-demo`
- Browser: Chromium 125
- Environment: `demo`
