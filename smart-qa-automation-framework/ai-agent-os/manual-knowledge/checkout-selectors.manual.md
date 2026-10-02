# Acme Demo Store - Selector Catalog (Manual Knowledge)

> Synthetic demo example. Selectors are illustrative, not from any real product.

## Cart Page

| Element | Selector | Type |
| --- | --- | --- |
| Cart container | `[data-testid="cart"]` | testid |
| Line item | `[data-testid="cart-item"]` | testid (collection) |
| Quantity input | `getByLabel('Quantity')` | label |
| Remove button | `getByRole('button', { name: 'Remove' })` | role+name |
| Checkout button | `getByRole('button', { name: 'Checkout' })` | role+name |

## Shipping Page

| Element | Selector | Type |
| --- | --- | --- |
| Full name | `getByLabel('Full name')` | label |
| Address line 1 | `getByLabel('Address')` | label |
| City | `getByLabel('City')` | label |
| Postal code | `getByLabel('Postal code')` | label |
| Country | `getByRole('combobox', { name: 'Country' })` | role+name |
| Shipping method (Standard) | `getByRole('radio', { name: 'Standard' })` | role+name |
| Shipping method (Express) | `getByRole('radio', { name: 'Express' })` | role+name |
| Continue | `getByRole('button', { name: 'Continue to Payment' })` | role+name |

## Payment Page

| Element | Selector | Type |
| --- | --- | --- |
| Card number | `getByLabel('Card number')` | label |
| Expiry | `getByLabel('Expiry')` | label |
| CVV | `getByLabel('CVV')` | label |
| Coupon code | `getByLabel('Coupon code')` | label |
| Apply coupon | within(`couponPanel`).getByRole('button', { name: 'Apply' }) | scoped role |
| Order total | `[data-testid="order-total"]` | testid |
| Place Order | `[data-testid="place-order"]` | testid |
| Error alert | `getByRole('alert')` | role |

## Confirmation Page

| Element | Selector | Type |
| --- | --- | --- |
| Order id | `[data-testid="order-id"]` | testid |
| Confirmation header | `getByRole('heading', { name: 'Order confirmed' })` | role+name |

## Confidentiality

All selectors above are synthetic placeholders for portfolio demonstration. They do not represent any real product's DOM.
