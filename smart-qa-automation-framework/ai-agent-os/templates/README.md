# Templates

Blank formats the AI QA operating model produces. They contain no results; real outputs come from executed runs.

| Template | Use |
| --- | --- |
| [`bdd-scenario.md`](bdd-scenario.md) | Feature / scenario structure with traceability, negative and boundary cases |
| [`locator-healing-review.md`](locator-healing-review.md) | Human-reviewed investigation of a failing locator |
| [`memory-update.md`](memory-update.md) | A QA memory entry with evidence and status |
| [`release-gate-report.md`](release-gate-report.md) | Evidence by area for a release decision |

The per-module reports (readiness, story analysis, test plan, exploratory results, final report) are in
[`../module-template/qa-output/module-name/`](../module-template/qa-output/module-name/).

Real evidence produced in this repository, for comparison:

- Playwright HTML report and `test-results/failure-classification.json` from `npm test` in the framework
- `workflow-evidence.json` attached to the state-engine runs (ENGINE-001…005)
- `sample-output/` in each QA tool (GPS, route, bulk upload, job data, Jira, AI test design)
