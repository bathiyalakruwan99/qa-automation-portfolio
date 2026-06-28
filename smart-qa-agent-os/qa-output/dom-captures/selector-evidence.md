# DOM Capture - Selector Evidence

> Synthetic example for portfolio demonstration. No real DOM or selectors from any product.

## Capture Context

- Module: `demo-store-checkout`
- Page: Payment page
- Date: 2026-06-15
- Method: Browser MCP DOM extraction

## Captured Selectors

| Element | Selector | Stable? | Notes |
| --- | --- | --- | --- |
| Coupon input | `getByLabel('Coupon code')` | Yes | Label text consistent across builds |
| Apply coupon button | `getByTestId('coupon-panel').getByRole('button', { name: 'Apply' })` | Yes | Scoped to coupon panel to avoid ambiguity |
| Order total | `getByTestId('order-total')` | Yes | Updates async; wait for value to settle |
| Place Order button | `getByTestId('place-order')` | Yes | Disabled until validation passes |
| Error alert | `getByRole('alert')` | Yes | Used for coupon error messages |
| Remove coupon | `getByRole('button', { name: 'Remove coupon' })` | Yes | Only visible when coupon is applied |

## Capture Method

1. Navigate to the payment page with one item in the cart.
2. Use browser MCP to extract the DOM tree.
3. Identify stable locators using the strategy: role+name > data-testid > label > text > CSS.
4. Record findings for the selector memory.

## Evidence

- DOM extract saved to: `dom-captures/payment-page-dom.txt` (not included in public portfolio)
- Screenshot: `screenshots/payment-page.png` (not included in public portfolio)

## Confidentiality

Selector names and DOM structure are synthetic placeholders for demonstration only.
