# Retries, Locators, Evidence and Cleanup

The engineering rules this framework follows, and where the code enforces each one.

## Retries

- **Retries never stand in for investigation.** `retries: 0` in `playwright.config.ts`: the system under test
  is local and deterministic, so a failure is a finding, not noise.
- **Retry only known transient infrastructure failures.** For a shared remote environment, a single retry for
  network-level errors can be justified. Record each one as flaky, with run IDs; never hide it.
- **Product-state failures fail immediately.** Assertions are not wrapped in loops that wait for "any" state.
- **Destructive actions are never retried blindly.** The state engine performs each action once and repeats
  only reads (`awaitChange`). If an action throws, the run stops with `ACTION_FAILED`.

## Locators

Preferred, in order: `getByRole` → `getByLabel` → `getByPlaceholder` → `getByTestId`.

Avoided: deep CSS chains, `nth-child`, layout-bound XPath, generated class names. The one compound locator
(`[data-testid="shipment-row"][data-shipment-id="…"]`) is built from stable data attributes, not layout.

**Wait for real readiness.** Views expose `data-state="loading|ready"`, and the demo app sets `loading`
synchronously when an action starts. Page objects wait for `ready` instead of sleeping or checking visibility
once.

## Evidence

For a failed browser test:

- trace (`retain-on-failure`), screenshot, video;
- the URL and the test data used (the seed is printed per worker; `DEMO_SEED` replays it);
- the workflow state before and after each step (`workflow-evidence.json` for engine runs);
- a suggested failure classification (`test-results/failure-classification.json`).

For a failed API assertion, the message carries:

- the method's path and query, and the status (expected vs actual);
- a **redacted, truncated** body summary: tokens, passwords and keys are masked by `src/api/helpers/redact.ts`;
- the schema errors, if a contract check failed.

Credentials are never logged.

## Failure classification

`src/utils/failure-classifier.ts` suggests one of:

- `PRODUCT_DEFECT`
- `TEST_DEFECT`
- `LOCATOR_CHANGE`
- `TIMING`
- `TEST_DATA`
- `ENVIRONMENT`
- `NETWORK`
- `REQUIREMENT_GAP`
- `UNKNOWN`

Rules check the most specific evidence first. A plain assertion mismatch stays `UNKNOWN`, because it can be
product or test, and is triaged from the trace. Every result has `confirmed: false`: a human confirms the
category from the evidence before filing a defect or changing a test.

## Cleanup

- Tests that create data register it with the `cleanup` fixture (`createShipment` does this automatically),
  which deletes it after the test even when the test fails. Problems are attached as a `cleanup` annotation.
- Global setup resets the demo store once per run. Tests never reset it mid-run, so parallel workers are
  never affected.
- k6 and Newman runs delete every shipment they create.
