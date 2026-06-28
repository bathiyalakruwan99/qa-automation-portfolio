# QA Approach

A short description of how I plan, execute, and report on quality work.

## 1. Understand the change

- Read the ticket, acceptance criteria, and design.
- Build a mind map of touched modules and data.
- Identify dependencies (other modules, APIs, reports, mobile flows).

## 2. Plan coverage

- Define the **risk areas** first (calculation, money, GPS, geofence, contracts).
- Decide the right coverage layer for each risk: smoke, regression, API, hybrid, exploratory, performance.
- Decide what is automated vs manual based on stability and value.

## 3. Author tests

- Keep tests **independent**, **deterministic**, and **isolated**.
- Use Page Object Model and reusable API clients.
- Tag tests with `@smoke`, `@regression`, `@api`, `@ui`, `@hybrid`.
- Use sanitized or generated test data.

## 4. Execute and triage

- Smoke on every push and PR.
- Regression nightly and on release candidate.
- API regression on every PR for changed services.
- Performance smoke before release.
- Triage failures with traces, screenshots, video, and API logs.

## 5. Report and decide

- Capture evidence: HTML reports, traces, screenshots, video, Newman report, k6 summary.
- Run the release-gate checklist.
- Recommend **Release-Ready**, **Release with Known Risks**, or **Blocked** with a written reason.

## 6. Learn

- Add validation rules and edge cases to QA knowledge memory.
- Update test data and POM when locators or contracts change.
- Document any new healing notes.
