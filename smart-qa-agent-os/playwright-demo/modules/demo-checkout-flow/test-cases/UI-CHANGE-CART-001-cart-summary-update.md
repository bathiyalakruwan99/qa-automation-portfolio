# UI-CHANGE-CART-001 - Cart Summary Layout Update

> Synthetic demo example.

## Context

A planned UI change updates the layout of the cart summary card and the position of the total price.

## QA risk

- Existing tests target the previous total-price position.
- Customers rely on the total being clearly visible before they continue to payment.

## QA actions

1. Update `CartSummary` component object to use the new `data-testid=cart-summary-total`.
2. Re-snapshot the Cart DOM via the diagnostic spec.
3. Re-run regression and confirm no new flake is introduced.
4. Update affected test cases (`TC002`, `TC007`) if the visible layout changes.

## Linked specs

- `specs/demo-checkout.add-to-cart.spec.ts`
- `specs/demo-checkout.diagnostic.spec.ts`
