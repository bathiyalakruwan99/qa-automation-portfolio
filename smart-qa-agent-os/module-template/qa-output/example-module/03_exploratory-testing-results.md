# 03 - Exploratory Testing Results

> Synthetic example. Fictional `example-module`.

## Session Charter

Explore coupon behaviour under change-of-state conditions (shipping change, item removal, back navigation).

## Time-boxed Sessions

| Session | Duration | Tester |
| --- | --- | --- |
| S-01 | 45 min | QA Engineer |
| S-02 | 30 min | QA Engineer |

## Observations

- Coupon stays applied after changing shipping from Standard to Express, but total update lags ~500 ms.
- Removing the last cart item while a coupon is applied leaves a "coupon active" badge for a frame before clearing.
- Back navigation from `Confirmation` to `Payment` shows stale total.

## Candidate Defects

| ID | Title | Severity |
| --- | --- | --- |
| BUG-DEMO-001 | Total update lag after shipping change | Low |
| BUG-DEMO-002 | Stale total after back navigation | Medium |

See `defects/` for full reports.

## Follow-ups

- Add a hybrid UI + API test that asserts total parity across navigation events.
