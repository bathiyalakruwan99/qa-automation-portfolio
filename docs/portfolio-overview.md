# Portfolio Overview

A guided tour of this repository. Each project is an independent public reference implementation of a common logistics QA problem, written for this portfolio and run on synthetic data. Each README's **Project Status** block says how mature it is.

## Start here

1. **Smart QA Automation Framework** ([`smart-qa-automation-framework/`](../smart-qa-automation-framework/)): a runnable Playwright + TypeScript framework (API, UI, hybrid, state engine) against its own fictional logistics app, with a human-governed AI QA operating model in [`ai-agent-os/`](../smart-qa-automation-framework/ai-agent-os/).
2. **GPS Simulation & Geofence Validation Suite** ([`gps-simulation-validation-suite/`](../gps-simulation-validation-suite/)): deterministic GPS simulation, off-route and rejoin detection, geofence enter/exit validation, multi-vehicle runs and an offline map viewer.
3. **Route Optimizer Validation Workbench** ([`route-optimizer-validation-workbench/`](../route-optimizer-validation-workbench/)): validators for route-optimizer output: allocation, duplicates, missing orders, capacity, vehicle suitability and route sanity.

## Then explore

4. **Job Data Validation & Release Evidence Tool** ([`job-data-validation-tool/`](../job-data-validation-tool/)): job / load / activity reconciliation, status consistency, missing-data detection and an exception report for release evidence.
5. **Bulk Upload Validator & Synthetic Test Data Generator** ([`bulk-upload-validator/`](../bulk-upload-validator/)): CSV / XLSX upload validation and a fault-injecting synthetic data generator.
6. **AI-Assisted Test Design Pipeline** ([`ai-assisted-test-design/`](../ai-assisted-test-design/)) — human-reviewed workflow: AI drafts, QA reviews and approves. See also the [detailed case study](../case-studies/ai-assisted-test-design.md).
7. **Jira QA Evidence & Release Readiness Tools** ([`jira-tools/`](../jira-tools/)) — offline release-readiness, regression-mapping and status-history tools over fictional tickets. See also the [detailed case study](../case-studies/jira-qa-workflow-automation.md).
8. **AI and MCP QA Workflows** ([`case-studies/ai-mcp-qa-workflows.md`](../case-studies/ai-mcp-qa-workflows.md)) — AI-assisted data analysis, validation, and reconciliation concepts.

## What to look at in each project

- `README.md` — business problem, QA challenge, approach, capabilities, QA value, and confidentiality note.
- The **Project Status** block at the top of each README: case study, reference implementation, prototype, or runnable demo.

## Smart QA Automation Framework — deeper dive

Start with the framework README for the runnable suite. Inside [`ai-agent-os/`](../smart-qa-automation-framework/ai-agent-os/) the documentation shows the full operating model: the AI QA operating model overview, architecture and flow diagrams, the agents and workflow docs, capability maturity labelling, and synthetic QA artifact examples. Locator/test-healing is presented as a guided, human-reviewed investigation workflow, not a fully autonomous runtime auto-healer.

## Report templates

Blank templates for the documents the QA workflow produces (BDD scenario, locator-healing review, memory update,
release-gate report, per-module reports) are in
[`smart-qa-automation-framework/ai-agent-os/templates/`](../smart-qa-automation-framework/ai-agent-os/templates/) and
the module template. Real outputs come from running the projects; each README shows them.

## Coverage at a glance

| Project | QA focus | Key skill demonstrated |
| --- | --- | --- |
| Smart QA Automation Framework | Runnable UI, API, hybrid and state-driven automation | Automation architecture, evidence-first triage |
| GPS Simulation & Geofence Validation Suite | Location and time-based testing | Deterministic test data for hard scenarios |
| Route Optimizer Validation Workbench | Algorithmic output validation | Independent oracle, risk-based comparison |
| Job Data Validation & Release Evidence Tool | Data validation and reconciliation | Turning large exports into actionable exceptions |
| Bulk Upload Validator | Shift-left data validation | Separating data issues from product defects |
| AI-Assisted Test Design Pipeline | Requirement-to-test workflow | Human review gate over AI drafts |
| Jira QA Evidence & Release Readiness Tools | Release-readiness reporting | Evidence-based go/hold decisions |

## Skim path (60 seconds)

- Read the root `README.md` first.
- Open `smart-qa-automation-framework/README.md` and run `npm test`.
- Scan the Featured QA Case Studies list for coverage.
- Click any case study that matches the role you are hiring for.
