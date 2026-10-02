# Acme Demo Store - Checkout Locator Knowledge

> Synthetic demo example. No real selectors from any real product.

## Locator Strategy

Order of preference for the checkout flow:

1. Stable role + accessible name (Playwright `getByRole`).
2. `data-testid` set explicitly by the demo app for test stability.
3. Visible label (`getByLabel`).
4. Visible text (`getByText`), only when unique.
5. CSS as a last resort, never `:nth-child` chains.

## Stability Observations

| Element | Preferred Locator | Notes |
| --- | --- | --- |
| Checkout button | `getByRole('button', { name: 'Checkout' })` | Stable. Same name on cart and mini-cart. |
| Place Order button | `getByTestId('place-order')` | Disabled until validation passes. |
| Coupon input | `getByLabel('Coupon code')` | Label stable. |
| Apply coupon | `getByRole('button', { name: 'Apply' })` | Apply text used in multiple places. Scope to coupon panel. |
| Shipping method | `getByRole('radio', { name: 'Standard' })` | Names vary between locales. Use translation key when localised. |
| Order total | `getByTestId('order-total')` | Updates async, wait for value to settle. |

## Healing Notes

- If `Place Order` becomes flaky, the demo app sometimes swaps it for `getByTestId('submit-order')` after a redesign. Promote that locator only after human QA confirms.
- Coupon error banner moved from a toast to inline once; locator `getByRole('alert')` is stable across both.
- Avoid coordinate-based clicks for the Country dropdown; the listbox virtualises items.

## Auto-healing Guardrails

- Do not auto-apply locator changes that affect monetary fields.
- Locator updates for `place-order`, `order-total`, or coupon controls require human QA review.

## Confidentiality

Locator names and stability notes are synthetic for demonstration only.
