# QA Tools & Portfolio Project Directory

This directory summarizes QA tools, automation utilities, and human-reviewed AI-assisted workflows that I designed and built. Each entry gives a one-paragraph overview, the project status, the stack, and a link to the detailed README. Public content is sanitized; source code for internal tools is not public.

| Project | Status | Public Availability |
|---|---|---|
| Smart QA Agent OS | Prototype + actively used practices | Reference architecture + public-safe examples |
| GPS Simulator & Geofence Validation Suite | Internal QA Tool | Sanitized public overview |
| Route Optimizer Validation Workbench | Internal QA Tool | Sanitized public overview |
| Job Master Data Validation & Release Evidence Tool | Internal QA Tool | Sanitized public overview |
| Bulk Upload Validator & Synthetic Test Data Generator | Internal QA Tool | Sanitized public overview |
| AI-Assisted Test Design Pipeline | Human-Reviewed QA Workflow | Sanitized public overview |
| Jira QA Evidence & Release Readiness Tools | Public-Safe Utility | Public-safe utility collection |

---

## Smart QA Agent OS — QA Automation & AI-Assisted Testing Prototype

A QA automation framework plus a modular AI-assisted QA operating model. Capability areas are separated by maturity (Actively Used, Implemented Prototype, In Development, Learning, Planned), and a human QA engineer remains responsible for requirement interpretation, test approval, defect decisions, release recommendations, and memory updates.

- **Status:** Prototype + actively used practices
- **Stack:** Playwright, TypeScript, BDD, POM, Postman/Newman, k6, AI QA operating model
- **QA value:** A structured, evidence-driven, reusable approach that keeps human QA judgement at the centre.

[Open reference implementation →](smart-qa-agent-os/)

---

## GPS Simulator & Geofence Validation Suite — Internal QA Tool

A web-based QA toolkit I built to simulate GPS activity, build movement paths, validate geofence events, and test multi-vehicle tracking scenarios. Uses fictional entities only (`Vehicle-001`, `Warehouse Alpha`, `Customer Site Beta`, `Zone Gamma`).

- **Status:** Internal QA Tool
- **Stack:** JavaScript, web-based map rendering, road-aware pathing
- **QA value:** Enables repeatable multi-device GPS scenarios without depending on physical hardware.

[Open sanitized overview →](gps-simulation-validation-suite/)

---

## Route Optimizer Validation Workbench — Internal QA Tool

An independent QA comparison tool I built to validate route-optimizer output across distance, vehicle suitability, capacity, cost, allocation, and operational feasibility. It does not replace a product optimizer; it provides an independent QA comparison layer. Key QA insight: lower total distance does not always mean lower operating cost.

- **Status:** Internal QA Tool
- **Stack:** TypeScript, public routing/map APIs
- **QA value:** Creates a repeatable, explainable comparison process and catches silent failures (dropped orders, overloads, infeasible routes).

[Open sanitized overview →](route-optimizer-validation-workbench/)

---

## Job Master Data Validation & Release Evidence Tool — Internal QA Tool

A data-validation tool I built to process job and work-order exports, run completeness/consistency/reconciliation checks, and produce an actionable exception summary for release evidence. Uses fictional records (`DEMO-JOB-1001`, `DEMO-LOAD-2001`).

- **Status:** Internal QA Tool
- **Stack:** Python, Pandas, data validation
- **QA value:** Automates repeated checks across large exports and surfaces exceptions manual review would miss.

[Open sanitized overview →](job-master-validation-tool/)

---

## Bulk Upload Validator & Synthetic Test Data Generator — Internal QA Tool

A QA utility I built to validate bulk-upload files, classify data-quality issues (auto-correctable vs needs review), and generate safe synthetic test datasets for regression, negative, workflow, and performance testing.

- **Status:** Internal QA Tool
- **Stack:** Python, Pandas, data validation
- **QA value:** Removes a common class of false defects and reduces dependence on production data through synthetic test data.

[Open sanitized overview →](bulk-upload-validator/)

---

## AI-Assisted Test Design Pipeline — Human-Reviewed QA Workflow

A pipeline I built and use to draft structured test cases with AI, then review, refine, and approve them before they enter the test suite: AI Draft → QA Review and Refinement → QA Approval → Test Management Import. QA approval is mandatory.

- **Status:** Human-Reviewed QA Workflow
- **Stack:** AI-assisted drafting, human review gate
- **QA value:** Faster first-pass drafting and more consistent coverage, with QA judgement preserved.

[Open sanitized overview →](ai-assisted-test-design/) · [Detailed case study →](case-studies/ai-assisted-test-design.md)

---

## Jira QA Evidence & Release Readiness Tools — Public-Safe Utility

Python tools I built to collect Jira ticket data into sanitized local structures, build release-readiness views, track status history, and generate QA evidence reports. No real ticket data, project keys, or credentials are included.

- **Status:** Public-Safe Utility
- **Stack:** Python, JSON reporting
- **QA value:** Repeatable, evidence-friendly views of release readiness with a defensible audit trail.

[Open public-safe utility →](jira-tools/) · [Detailed case study →](case-studies/jira-qa-workflow-automation.md)

---

## Additional: AI and MCP QA Workflows

A high-level case study on AI-assisted QA workflows for structured data analysis, validation, and cross-system reconciliation, with human QA review at every decision point.

[Open case study →](case-studies/ai-mcp-qa-workflows.md)

---

## Contact

- **Email:** bathiyalakruwan99@gmail.com
- **Website:** [bathiya-qa.vercel.app](https://bathiya-qa.vercel.app/)
- **LinkedIn:** [linkedin.com/in/bathiyalakruwan99](https://www.linkedin.com/in/bathiyalakruwan99/)

See [`NOTICE.md`](NOTICE.md) for portfolio-use terms.
