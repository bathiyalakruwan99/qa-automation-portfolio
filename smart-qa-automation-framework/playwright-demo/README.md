# Playwright Demo - Smart QA Agent OS

A clearly **demo-flavoured** Playwright + TypeScript layered-module reference for the Smart QA Agent OS portfolio. The demo centres on one professional, universally recognisable example - `modules/demo-checkout-flow/` - showing how a single business workflow is organised into discoverable, reusable, evidence-friendly layers.

> Pure demo example. Fictional product (`Acme Demo Store`) and fictional IDs (`USR-DEMO`, `CART-DEMO-001`, `ORD-DEMO-1001`, `SKU-001`, coupon `WELCOME10`). No private code, real selectors, real endpoints, or proprietary workflows are included.

## Structure

```
playwright-demo/
├── modules/
│   └── demo-checkout-flow/   # Layered demo module example
├── playwright.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Layered demo module

`modules/demo-checkout-flow/` demonstrates the full layering:

- `pages/` page objects, `components/` reusable sub-components
- `flows/` composable sub-flows (`signIn`, `addItemsToCart`, `enterShipping`, `applyCoupon`, `completePayment`, `verifyOrderInHistory`, `runEndToEnd`)
- `fixtures/` Playwright fixtures (POM + BDD)
- `data/` typed test data with `types.ts`
- `selectors/` selector catalog as JSON + stability notes
- `dom/` sanitized DOM snapshots captured as text
- `features/` + `steps/` BDD layer
- `specs/` specialised specs per sub-flow plus E2E, negative, and diagnostic
- `test-cases/` business-facing `TC###` markdown documents and UI-change notes
- `utils/` `domCapture` and demo-id helpers
- `api/` placeholder for module-specific API client

See [`modules/demo-checkout-flow/README.md`](modules/demo-checkout-flow/README.md) for the full walkthrough.

## Install

```bash
npm install
npx playwright install --with-deps
```

## Run

```bash
# Smoke (fast)
npm run test:smoke

# Full regression
npm run test:regression

# End-to-end composed flow
npm run test:e2e

# Negative and validation
npm run test:negative

# Diagnostic helpers (DOM capture etc.)
npm run test:diagnostic

# HTML report
npm run report
```

## Tags

- `@smoke` fast confidence checks
- `@regression` broader product coverage
- `@e2e` composed end-to-end flow
- `@negative` negative and validation scenarios
- `@diagnostic` DOM capture and other diagnostics

## Environment

Set `DEMO_BASE_URL` in `.env` (or your CI secrets) to point the demo at an environment you control. The default `https://demo.invalid` is intentionally invalid so the suite never targets a real system without explicit configuration.

## Evidence

- HTML report under `playwright-report/`
- Traces, screenshots, and videos on failure under `test-results/`

## Confidentiality

All identifiers in this demo are fictional. No private code, real selectors, real customer data, or proprietary workflows are included.
