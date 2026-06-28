# QA Strategy

A simple, repeatable strategy for the modules covered by this reference framework.

## Coverage layers

| Layer | Purpose | Examples | Tag |
|---|---|---|---|
| Smoke | Fast confidence after every push | Login, dashboard loads, key API health | `@smoke` |
| Regression | Broader product coverage | All POM-backed flows, API contracts | `@regression` |
| API | Backend contract + negative scenarios | Auth, CRUD, validation, error codes | `@api` |
| Hybrid | Realistic user journeys | API-prepared data + UI verification | `@hybrid` |
| Performance | Smoke / load / stress / soak | k6 scripts in `k6-performance/` | n/a |

## Test pyramid (used in this repo)

- **Many** API tests — fast, stable, contract-focused.
- **Several** hybrid tests — realistic flows with low flakiness.
- **Few but critical** UI tests — guard the most valuable user paths.

## Quality signals

- Smoke pass rate on PR
- Regression pass rate per nightly run
- Newman API regression pass rate
- k6 performance trend (p95 latency, error rate)
- Manual UAT and exploratory charter summary

## Authoring rules

- Tests are **independent**: no order dependency.
- Tests are **deterministic**: no time-of-day or environment-coupled assumptions.
- Test data is **isolated**: each test creates and cleans up what it needs.
- Locators use **role / label / data-testid** before CSS or XPath.
- Evidence is always captured on failure.
