# Negative and Validation Scenarios

> Synthetic demo example.

## NEG-001 - Missing required shipping field

**Steps**

1. Sign in and add items.
2. Open the shipping step.
3. Leave `postcode` blank.
4. Click `Continue to payment`.

**Expected:** A clear inline error stating postcode is required. The flow does not move to payment.

## NEG-002 - Invalid coupon

**Steps**

1. Sign in, add items, and enter shipping.
2. Apply coupon `INVALID-CODE`.

**Expected:** A clear "Coupon is not valid" error is shown. No discount badge is applied.

## NEG-003 - Expired card

**Steps**

1. Sign in, add items, enter shipping.
2. Open the payment step.
3. Enter a card with expiry `01/20`.
4. Try to place the order.

**Expected:** A clear "Card is expired" error is shown. The order is not placed.

## Linked specs

- `specs/demo-checkout.negative.spec.ts`
