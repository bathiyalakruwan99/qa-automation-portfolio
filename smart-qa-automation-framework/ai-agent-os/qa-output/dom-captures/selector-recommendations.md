# DOM Capture - Selector Recommendations

> Synthetic example for portfolio demonstration.

## Purpose

Recommendations for locator improvements based on DOM capture evidence. All recommendations require human QA review before being applied to automation code.

## Current State

| Element | Current Locator | Issue | Recommended |
| --- | --- | --- | --- |
| Apply coupon | `getByRole('button', { name: 'Apply' })` | Ambiguous: "Apply" appears in multiple panels | Scope to `getByTestId('coupon-panel')` |
| Shipping method | `getByText('Standard')` | Breaks if text changes or localises | Use `getByRole('radio', { name: 'Standard' })` |
| Country dropdown | CSS: `.country-select` | Fragile, class name may change | Use `getByRole('combobox', { name: 'Country' })` |

## Healing Guardrails

- Locator changes for `place-order`, `order-total`, or coupon controls require human QA review.
- Do not auto-apply locator changes that affect monetary fields.
- Record every healed locator in the locator-healing memory with evidence.

## Approval Workflow

```
DOM capture -> Recommendation proposed -> Human QA reviews -> Approved -> Automation code updated -> Memory updated
```

## Confidentiality

All selectors are synthetic. No real product DOM is represented.
