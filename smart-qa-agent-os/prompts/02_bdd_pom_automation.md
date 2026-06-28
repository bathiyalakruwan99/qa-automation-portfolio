# BDD + POM Automation Prompt (Example)

> Synthetic example for portfolio demonstration.

## Purpose

Generates BDD feature files, step definitions, Page Object Models, component objects, fixtures, API clients, and Playwright specs from verified test cases and browser evidence.

## Template

```txt
Read verified test cases and browser exploration evidence.
Create BDD + POM Playwright automation only for verified stable flows.

Create:
- tests/<module>/features/    (BDD .feature files)
- tests/<module>/steps/       (step definitions)
- tests/<module>/specs/       (Playwright spec files)
- tests/<module>/pages/       (Page Object Models)
- tests/<module>/components/  (reusable component objects)
- tests/<module>/fixtures/    (test fixtures)
- tests/<module>/data/        (static test data)
- tests/<module>/api/         (API client wrappers)
- tests/<module>/utils/       (helpers)

Run the tests and create an execution report.
Do not weaken assertions to pass.

Test scope:
- Only smoke (@smoke), regression (@regression), and e2e (@e2e) tests.
- Do not create unit, API-only, performance, security, visual snapshot,
  accessibility-only, or exploratory scratch tests unless explicitly requested.

Defect handling:
- Do not author defect files inside specs, steps, fixtures, or page objects.
- If a UI issue blocks the expected flow, assert and let the test fail.
- If it does not block, capture evidence and note it in the run summary.
- Write formal bug reports under qa-output/<module>/defects/.
```

## Example Output (Synthetic)

See `module-template/tests/example-module/` for sample feature, steps, POM, spec, fixture, and data files.

## Confidentiality

Synthetic template. No private wording is copied.
