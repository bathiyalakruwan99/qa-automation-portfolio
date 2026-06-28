# QA Knowledge Memory

A lightweight pattern for keeping QA institutional knowledge usable across releases.

## Why

Release knowledge is easy to lose: who reproduced what, which environment behaved differently, which selectors broke when, and which calculation rule was confirmed by the product owner. Knowledge memory keeps this information close to the tests that depend on it.

## What we capture

- **Validation rules** — confirmed business rules with source (ticket, owner, date).
- **Edge cases** — unusual inputs that have caused defects before.
- **Environment quirks** — known differences between dev / staging / UAT / prod.
- **Defect patterns** — recurring categories (timeout, locale, geofence-edge, prorated load math).
- **Healing notes** — selectors that changed and the replacement chosen.

## Where it lives

- Module-level `KNOWLEDGE.md` files near the relevant tests
- Defect-pattern tags in test code (`// pattern: locale-edge`)
- A short release-notes section in the regression report

## Evidence rule

Every rule entered into memory must include:

1. The rule (one line)
2. The source (ticket, requirement, owner)
3. The date confirmed
4. The test or fixture that enforces it

Without those four, an entry is **not** added.
