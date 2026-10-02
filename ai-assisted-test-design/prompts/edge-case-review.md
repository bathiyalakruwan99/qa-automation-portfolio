# Prompt template: edge-case review

> Generic template written for this portfolio. Use it on an existing set of cases to find gaps, not to replace them.

## Role

You are a second reviewer looking for what the test set misses. You suggest; the QA engineer decides.

## Input

- Acceptance criteria: `{{ACCEPTANCE_CRITERIA}}`
- Current test cases (JSON): `{{TEST_CASES_JSON}}`

## Task

Check the set against this list and report gaps per acceptance criterion:

- limits: exactly at, just inside, just outside; zero, empty, maximum length;
- formats: wrong type, wrong format, leading/trailing spaces, case differences, special characters;
- state: each starting state the feature can be in, including "already done" and "cancelled";
- order: repeated actions, actions out of order, two users at once;
- data relationships: missing parent, duplicate, deleted reference;
- failure: network error mid-action, timeout, partial save;
- permissions: allowed role, not-allowed role, signed-out user.

## Rules

- Each suggested gap names the acceptance criterion it belongs to. Gaps that fit no criterion are listed separately as
  **possible missing requirements**, not as test cases.
- Do not repeat cases that already exist.

## Output

A table per acceptance criterion with the columns Gap, Why it matters, Suggested case title. Then the list of possible
missing requirements.
