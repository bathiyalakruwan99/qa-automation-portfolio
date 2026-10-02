# Tests - example-module (Template)

> Synthetic example for portfolio demonstration.

Reusable Playwright test structure for a single business workflow. Copy this folder, rename to your module slug, and fill in the pieces.

## Layout

- `api/` - API client wrappers used by hybrid tests.
- `components/` - Reusable component objects shared across pages.
- `data/` - Static test data files (JSON, CSV).
- `features/` - BDD `.feature` files.
- `fixtures/` - Playwright fixtures for sign-in, demo data, mocks.
- `pages/` - Page Object Models.
- `specs/` - Plain Playwright spec files.
- `steps/` - BDD step definitions for the `.feature` files.
- `test-cases/` - Markdown test case docs that mirror QA test plan ids.
- `utils/` - Helpers (waits, formatters, builders).

## Naming Conventions

- `pages/<page-name>.page.ts`
- `components/<component-name>.component.ts`
- `api/<resource>.api.ts`
- `features/<scenario>.feature`
- `specs/<area>.spec.ts`
- `test-cases/TC-<id>.md`
