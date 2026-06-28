# Selector Stability Notes

A short, public-safe note explaining the selector strategy used in this demo module.

> Pure demo example. No private selectors. All examples are illustrative.

## Preferred order

1. **Role + accessible name** &mdash; `role=button[name=Place order]`
2. **`data-testid`** &mdash; `data-testid=cart-row`
3. **Visible label** &mdash; `label=Email`
4. Generic CSS only as a last resort, and only for layout/anchor elements.

## Why

- Role and label selectors track user-visible behaviour and survive most refactors.
- `data-testid` is owned by QA and product engineering together; renames are intentional, not accidental.
- Brittle selectors (deep CSS, nth-child, generated class names) are explicitly avoided.

## Review checklist

- Is the selector stable across releases and themes?
- Does it describe what the user perceives, not what the framework renders?
- Is the same selector reused across pages, or duplicated locally?
- If the selector changes, do tests still describe a real user expectation?

## Maintenance

- Selectors live in `demo-checkout.selectors.json` so they can be reviewed as data.
- Healing recommendations go through the **Locator Healing** memory category, not silent edits.
