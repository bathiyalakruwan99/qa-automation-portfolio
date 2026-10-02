# 03 - Exploratory Testing Results

> Synthetic example. Fictional `demo-store-checkout` module.

## Session Charter

Explore coupon behaviour under change-of-state conditions: shipping change, item removal, back navigation, and concurrent tabs.

## Time-boxed Sessions

| Session | Duration | Tester | Focus |
| --- | --- | --- | --- |
| S-01 | 45 min | QA Engineer | Coupon + shipping interaction |
| S-02 | 30 min | QA Engineer | Back navigation and re-submit |

## Observations

- Coupon stays applied after changing shipping from Standard to Express, but total update lags ~500 ms.
- Removing the last cart item while a coupon is applied leaves a "coupon active" badge for one render frame before clearing.
- Back navigation from Confirmation to Payment shows stale total for ~1 second before refreshing.
- Opening checkout in two tabs and applying the same single-use coupon: first tab succeeds, second tab shows "already used" correctly.

## Candidate Defects

| ID | Title | Severity |
| --- | --- | --- |
| BUG-DEMO-001 | Total update lag after shipping change with coupon | Low |
| BUG-DEMO-002 | Stale total after back navigation from Confirmation | Medium |

See `defects/` for full reports.

## Follow-ups

- Add a hybrid UI + API test that asserts total parity across navigation events.
- Add a test for concurrent coupon apply in two sessions.
