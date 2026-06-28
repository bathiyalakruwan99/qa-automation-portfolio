# QA Approach

How I plan, execute, and report on quality work. This describes a repeatable, evidence-first way of working that scales from a single ticket to a full release.

## 1. Understand the change

- Read the ticket, acceptance criteria, and design.
- Build a mind map of touched modules and data.
- Identify dependencies (other modules, APIs, reports, mobile flows).
- Write down assumptions and open questions early, before testing starts.

**Output:** a clear picture of what changed, what it touches, and what is still unknown.

## 2. Plan coverage

- Define the **risk areas** first (calculation, money, GPS, geofence, contracts, data integrity).
- Decide the right coverage layer for each risk: smoke, regression, API, hybrid, exploratory, performance.
- Decide what is automated vs manual based on stability and value.
- Prioritise: not everything needs the same depth; high-risk and high-change areas get the most attention.

**Output:** a coverage plan that maps each risk to the cheapest layer that can catch it.

## 3. Author tests

- Keep tests **independent**, **deterministic**, and **isolated**.
- Use Page Object Model and reusable API clients so changes are fixed in one place.
- Tag tests with `@smoke`, `@regression`, `@api`, `@ui`, `@hybrid` for fast filtering.
- Use sanitized or generated test data, never production data.
- Cover positive, negative, boundary, and cleanup conditions, not just the happy path.

**Output:** maintainable tests that map back to the planned risks.

## 4. Execute and triage

- Smoke on every push and PR.
- Regression nightly and on release candidate.
- API regression on every PR for changed services.
- Performance smoke before release.
- Triage failures with traces, screenshots, video, and API logs.
- Classify each failure first: product defect, test defect, environment/flaky, or data issue, before raising anything.

**Output:** a clean signal where real defects are separated from automation noise.

## 5. Report and decide

- Capture evidence: HTML reports, traces, screenshots, video, Newman report, k6 summary.
- Run the release-gate checklist.
- Recommend **Release-Ready**, **Release with Known Risks**, or **Blocked** with a written reason.
- Make the recommendation explainable: every area backed by evidence.

**Output:** a defensible release recommendation a team can trust.

## 6. Learn

- Add validation rules and edge cases to QA knowledge memory (verified findings only).
- Update test data and POM when locators or contracts change.
- Document any new healing notes and recurring defect patterns.
- Feed lessons back into the next regression cycle so it starts smarter.

**Output:** each release leaves the test suite and QA knowledge stronger than before.

---

These principles are demonstrated across the case studies in this repository, all using sanitized, fictional examples.
