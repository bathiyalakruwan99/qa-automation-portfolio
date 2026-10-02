# 00 - Setup and Readiness Check: {{MODULE_NAME}}

> Blank template. Fill it in before any testing starts. Leave a box unticked rather than assume.

## Environment

- Target environment: `{{ENVIRONMENT}}` (never production unless explicitly approved)
- Build / version under test: `{{BUILD}}`
- Tester: {{NAME}}
- Date: {{YYYY-MM-DD}}

## Pre-conditions

- [ ] Test data available and documented in `tests/{{module-name}}/data/`
- [ ] Test accounts available (credentials stored outside the repository)
- [ ] Dependent services reachable: {{SERVICES}}
- [ ] Feature flags / configuration confirmed: {{FLAGS}}

## Tooling

- [ ] Playwright runs locally and the trace viewer opens a trace
- [ ] API collection or client available
- [ ] Evidence folders exist (`defects/`, `network/`, `screenshots/`, `traces/`, `videos/`)

## Sign-off

- [ ] Environment is healthy (how verified: {{HOW}})
- [ ] Blockers recorded in `00_blockers-and-missing-details.md`
- [ ] Ready to begin user-story analysis
