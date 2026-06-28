# Portfolio Overview

A guided tour of this repository. Each project documents a QA tool, utility, or workflow I designed and built, presented as a sanitized public overview. No runnable source code, production data, or confidential implementation details are included.

## Start here

1. **Smart QA Agent OS** ([`smart-qa-agent-os/`](../smart-qa-agent-os/)) — a QA automation and AI-assisted testing prototype with clearly labelled capability maturity and human QA ownership at the center.
2. **GPS Simulator & Geofence Validation Suite** ([`gps-simulation-validation-suite/`](../gps-simulation-validation-suite/)) — internal QA tool: GPS stream simulation, vehicle movement patterns, route/path testing, geofence entry/exit validation, multi-vehicle scenarios, and live-map QA evidence.
3. **Route Optimizer Validation Workbench** ([`route-optimizer-validation-workbench/`](../route-optimizer-validation-workbench/)) — internal QA tool: independent comparison across distance, vehicle suitability, capacity, cost-per-kilometre, feasibility, and allocation.

## Then explore

4. **Job Master Data Validation & Release Evidence Tool** ([`job-master-validation-tool/`](../job-master-validation-tool/)) — internal QA tool: job/work-order data validation, status consistency, missing-data detection, and release evidence.
5. **Bulk Upload Validator & Synthetic Test Data Generator** ([`bulk-upload-validator/`](../bulk-upload-validator/)) — internal QA tool: bulk upload data-quality validation and synthetic test-data generation.
6. **AI-Assisted Test Design Pipeline** ([`ai-assisted-test-design/`](../ai-assisted-test-design/)) — human-reviewed workflow: AI drafts, QA reviews and approves. See also the [detailed case study](../case-studies/ai-assisted-test-design.md).
7. **Jira QA Evidence & Release Readiness Tools** ([`jira-tools/`](../jira-tools/)) — public-safe utility collection for release-readiness and evidence reporting. See also the [detailed case study](../case-studies/jira-qa-workflow-automation.md).
8. **AI and MCP QA Workflows** ([`case-studies/ai-mcp-qa-workflows.md`](../case-studies/ai-mcp-qa-workflows.md)) — AI-assisted data analysis, validation, and reconciliation concepts.

## What to look at in each project

- `README.md` — business problem, QA challenge, approach, capabilities, QA value, and confidentiality note.
- Every project is presented as a case study. No runnable source code is included.

## Smart QA Agent OS — deeper dive

Inside [`smart-qa-agent-os/`](../smart-qa-agent-os/) the documentation shows the full operating model: the AI QA operating model overview, architecture and flow diagrams, the agents and workflow docs, capability maturity labelling, and synthetic QA artifact examples. Locator/test-healing is presented as a guided, human-reviewed investigation workflow, not a fully autonomous runtime auto-healer.

## Sanitized artifact examples

See [`assets/sample-artifacts/`](../assets/sample-artifacts/) for synthetic, non-runnable QA artifact examples (BDD scenarios, POM responsibilities, hybrid flow, failure classification, locator-healing flow, memory update, release-gate summary, performance test plan). All examples use fictional identifiers only.

## Coverage at a glance

| Case study | QA focus | Key skill demonstrated |
| --- | --- | --- |
| Smart QA Agent OS | AI-assisted QA operating model | Architecture thinking, human-in-the-loop QA |
| GPS Simulator & Geofence Validation Suite | Location and time-based testing | Deterministic test data for hard scenarios |
| Route Optimizer Validation Workbench | Algorithmic output validation | Independent oracle, risk-based comparison |
| Job Master Data Validation & Release Evidence Tool | Data validation and reconciliation | Turning large exports into actionable exceptions |
| Bulk Upload Validator | Shift-left data validation | Separating data issues from product defects |
| AI-Assisted Test Design Pipeline | Requirement-to-test workflow | Human review gate over AI drafts |
| Jira QA Evidence & Release Readiness Tools | Release-readiness reporting | Evidence-based go/hold decisions |

## Skim path (60 seconds)

- Read the root `README.md` first.
- Open `smart-qa-agent-os/README.md` for the operating-model summary.
- Scan the Featured QA Case Studies list for coverage.
- Click any case study that matches the role you are hiring for.
