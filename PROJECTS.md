# QA Tools & Portfolio Project Directory

Independent public reference projects that demonstrate common logistics QA problems: stateful workflow automation, GPS and geofence testing, route-output validation, data validation and release evidence. Every project is written for this portfolio, runs on synthetic data, and has its own README with run commands and real sample output.

| Project | Public implementation today | Next |
|---|---|---|
| Smart QA Automation Framework (+ AI QA operating model) | Runnable demo: local app, 30 Playwright tests (+ auth setup), 116 unit tests, CI + nightly workflows | — |
| GPS Simulation & Geofence Validation Suite | Runnable demo: TypeScript simulator, 5 scenarios, CLI, map viewer, 32 tests | Road snapping |
| Route Optimizer Validation Workbench | Runnable demo: 6 validators, sample plans, CLI, 19 tests | Road-network distances |
| Job Data Validation & Release Evidence Tool | Runnable demo: reconciliation checks, CLI, 21 tests | Time-based checks |
| Bulk Upload Validator & Synthetic Test Data Generator | Runnable demo: CSV/XLSX validator, generator oracle, CLI, 36 tests | Multi-sheet workbooks |
| AI-Assisted Test Design Pipeline | Prototype: 4 templates, schema, governance validator, 17 tests | — |
| Jira QA Evidence & Release Readiness Tools | Runnable demo (offline): 3 reports, CLI, 19 tests | — |

---

## Smart QA Automation Framework

A runnable Playwright + TypeScript framework with its own fictional logistics app: UI, API, UI + API hybrid and state-driven workflow tests, typed API clients with contract schemas, and failure classification. A human-governed AI QA operating model sits alongside it; a human QA engineer stays responsible for requirement interpretation, test approval, defect decisions and release recommendations.

- **Status:** Runnable demo (framework) + prototype operating model
- **Stack:** Playwright, TypeScript, Express demo app, Ajv, Vitest, Postman/Newman, k6, GitHub Actions
- **QA value:** Readable specs over stateful workflows, UI results confirmed through the API, and failures that are classified instead of retried away.

[Open project →](smart-qa-automation-framework/)

---

## GPS Simulation & Geofence Validation Suite — Public QA Reference Project

Independent portfolio implementation demonstrating GPS simulation, route playback, geofence boundary testing and multi-device validation on synthetic data (`TRUCK-001`, `Warehouse Alpha`, `Customer Site Beta`, `Zone Gamma`).

- **Status:** Runnable demo
- **Stack:** TypeScript, Vitest
- **QA value:** Repeatable multi-vehicle GPS scenarios, including off-route and bad-data cases, without physical devices.

[Open project →](gps-simulation-validation-suite/)

---

## Route Optimizer Validation Workbench — Public QA Reference Project

Independent portfolio implementation of a QA validation layer for route-optimizer **output**: order allocation, duplicates, missing orders, capacity, vehicle suitability and route sanity. It is not an optimizer. Key QA insight: a plan with a short total distance can still drop orders, overload a vehicle or report distances that cannot be true.

- **Status:** Runnable demo
- **Stack:** TypeScript, Vitest
- **QA value:** Catches silent failures (dropped orders, overloads, unsuitable vehicles, impossible distances) with an explainable report.

[Open project →](route-optimizer-validation-workbench/)

---

## Job Data Validation & Release Evidence Tool — Public QA Reference Project

Independent portfolio implementation of job / load / activity reconciliation: completeness, consistency and orphan-record checks that produce an exception summary for release evidence. Uses fictional records (`DEMO-JOB-1001`, `DEMO-LOAD-2001`).

- **Status:** Runnable demo
- **Stack:** Python standard library, pytest, ruff
- **QA value:** Automates repeated checks across large exports and surfaces exceptions a manual review would miss.

[Open project →](job-data-validation-tool/)

---

## Bulk Upload Validator & Synthetic Test Data Generator — Public QA Reference Project

Independent portfolio implementation of bulk-upload validation: checks CSV / XLSX files against a declared schema, reports each issue by severity with its row, column and value, and generates synthetic files with recorded faults that act as the test oracle.

- **Status:** Runnable demo
- **Stack:** Python, openpyxl, pytest, ruff
- **QA value:** Separates data problems from product defects and removes the need for production data in testing.

[Open project →](bulk-upload-validator/)

---

## AI-Assisted Test Design Pipeline — Human-Reviewed QA Workflow

A workflow for drafting structured test cases with AI, then reviewing, refining and approving them before they enter the test suite: AI Draft → QA Review and Refinement → QA Approval → Test Management Import. QA approval is mandatory, and the validator rejects drafts that invent criteria or approve themselves.

- **Status:** Prototype workflow with runnable templates, schema and governance validator
- **Stack:** Prompt templates, JSON Schema, Python (jsonschema), pytest
- **QA value:** Faster first-pass drafting and more consistent coverage, with QA judgement preserved.

[Open project →](ai-assisted-test-design/) · [Detailed case study →](case-studies/ai-assisted-test-design.md)

---

## Jira QA Evidence & Release Readiness Tools — Public QA Reference Project

Independent portfolio implementation of release-readiness reporting over ticket data: release readiness, regression mapping and status history, run offline against fictional tickets (`DEMO-101`…`DEMO-112`). No ticketing-system connection, real ticket data, project keys or credentials.

- **Status:** Runnable demo (offline, fictional tickets)
- **Stack:** Python standard library, pytest, ruff
- **QA value:** Repeatable, evidence-based views of release readiness that recommend, never approve.

[Open project →](jira-tools/) · [Detailed case study →](case-studies/jira-qa-workflow-automation.md)

---

## Additional: AI and MCP QA Workflows

A high-level case study on AI-assisted QA workflows for structured data analysis, validation, and cross-system reconciliation, with human QA review at every decision point.

[Open case study →](case-studies/ai-mcp-qa-workflows.md)

---

## Contact

- **Email:** [bathiyalakruwan99@gmail.com](mailto:bathiyalakruwan99@gmail.com)
- **Website:** [bathiya-qa.vercel.app](https://bathiya-qa.vercel.app/)
- **LinkedIn:** [linkedin.com/in/bathiyalakruwan99](https://www.linkedin.com/in/bathiyalakruwan99/)

See [`NOTICE.md`](NOTICE.md) for portfolio-use terms.
