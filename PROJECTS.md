# Projects

Sanitized QA tools and automation examples designed from real-world web, mobile, API, data, and logistics-testing workflows. Most were built during my work at **Haulmatic Technologies** (Transport Management Systems) and **IFS R&D International** (ERP systems). This repository contains only the public, sanitized versions.

Featured order — open in this sequence:

1. Smart QA Agent OS / Automation Framework
2. GPS Simulator and Path Generation Suite
3. Route Optimizer Validation Engine
4. Job Master Data Validation and Evidence Processor
5. Bulk Upload Data Quality Utilities
6. AI-Assisted Test Case Workflow
7. Jira QA Tools

Additional: AI and MCP QA Workflows (case study)

---

## 1. Smart QA Agent OS — Automation Framework + AI QA Operating Model

A sanitized public reference implementation of an enterprise-style QA automation and release-validation workflow, **plus a modular AI QA operating model with specialised QA agents, reusable skills, quality guardrails, and continuously curated QA memory**.

Framework side:

- Layered structure: UI, API, hybrid, BDD, performance
- Reusable Page Objects, fixtures, and API clients
- Postman + Newman collection with CI execution
- k6 smoke / load / stress / soak scripts
- Documented release-gate checklist and QA knowledge memory

AI QA Operating Model side (architecture-only, public showcase):

- **34 capability-level specialised QA agents** across six categories: Orchestration/Strategy, Discovery/Understanding, Test Design/Automation, Execution/Investigation/Healing, Reporting/Documentation/Release, Learning/Memory
- **13 shared QA skill groups** used across multiple agents
- **14 quality rule categories** enforcing evidence-first verification and safe automation
- **17-category continuous QA memory architecture** (Project, Module, Flow, Page/Component, API/Network, Validation Rules, Test Data, Automation, Locator Healing, Flaky Area, Known Bugs, Defect Pattern, Error-to-Solution, Release, Learning, Glossary, Run)
- Example agent journey, sample artifacts, demo walkthrough script

**Tech:** Playwright, TypeScript, BDD/Cucumber-style, POM, Postman, Newman, k6, AI QA Operating Model

- [Open project →](smart-qa-agent-os/)
- [AI QA Operating Model overview →](smart-qa-agent-os/ai-qa-operating-model.md)
- [Agents catalog →](smart-qa-agent-os/docs/agents-catalog.md)
- [Sample artifacts →](smart-qa-agent-os/sample-artifacts/)
- [Manual QA Knowledge →](smart-qa-agent-os/manual-knowledge/)
- [Module Template →](smart-qa-agent-os/module-template/)
- [Prompt Examples →](smart-qa-agent-os/prompts/)
- [QA Graph Tool →](smart-qa-agent-os/qa-graph-tool/)
- [QA Output →](smart-qa-agent-os/qa-output/)
- [Scripts →](smart-qa-agent-os/scripts/)

---

## 2. GPS Simulator and Path Generation Suite

Web-based toolkit with 8 specialised GPS testing tools: vehicle simulator, live simulator (up to 1000 devices), road-aware path builder, live manual simulator with pause/drag/rejoin and 4 path layers, unified scenario JSON generator (short stop, return early, out of sequence, unplanned stop, reassignment split), path visualizer, and multi-device combiner. Includes data-testid attributes for automation.

**Tech:** JavaScript, Leaflet.js, OpenStreetMap, OpenRouteService, React + Vite + TypeScript, Google Maps

[Open case study →](gps-testing-suite/)

---

## 3. Route Optimizer Validation Engine

Standalone Next.js reference engine that runs a full 6-stage load optimization pipeline (validate, group shipments, OSRM road matrix, corridor construction, rebalance, finalize) with hard reconciliation guarantees (order, SKU, weight/CBM conservation), unassigned reason codes, vehicle accessibility rules, penalty-based optimization objective, and a 7-section Validation Summary export. Result: 75% reduction in route and optimizer testing effort.

**Tech:** Next.js 15, React 18, TypeScript, Tailwind CSS, OSRM, Leaflet, Web Workers, LRU cache

[Open case study →](route-optimizer/)

---

## 4. Job Master Data Validation and Evidence Processor

Python application suite (desktop, web, CLI, bulk checker) for validating TMS job/work-order exports. Core capability is a multi-method load counting system: 3 categories (Non FTL-DISTRIBUTION, FTL-DISTRIBUTION, FTL-DOMESTIC Route Optimiser) x 3 calculation methods (Current/Prorated, 8x, 10x), with Route Optimiser exclusion logic, tolerant column mapping, bulk GPS/payment/invoice status checks, and evidence-ready Excel exports.

**Tech:** Python 3.8+, Pandas, OpenPyXL, Tkinter, Flask

[Open case study →](jobmaster/)

---

## 5. Bulk Upload Data Quality Utilities

Python validator and corrector for TMS bulk uploads (desktop GUI, web, CLI). Validates organization, vehicle, driver, and location data, auto-corrects common mistakes, and produces evidence-ready outputs. Includes complementary utilities for Excel diff comparison, job-row highlighting, and synthetic test-data generation. Reduced customer upload errors by 50%+.

**Tech:** Python, Pandas, OpenPyXL, Tkinter, Flask, Faker

[Open case study →](bulkfile-generator/)

---

## 6. AI-Assisted Test Case Workflow

A documented workflow that turns Jira tickets and Figma designs into draft test cases through MCP integrations and mind-map structuring, with a mandatory QA review step before any test case is published. Includes RTM traceability and CSV import into the test management tool.

**Tech:** Jira MCP, Figma MCP, ChatGPT/Claude, Python (CSV conversion)

[Open case study →](test-cases-creation-automatic/)

---

## 7. Jira QA Tools

Python utilities for syncing Jira tickets, building manifests, exporting ticket history, generating ready-for-release reports, and a curated set of 76+ QA prompts for API, security, and automation testing.

**Tech:** Python, Jira REST API, OpenPyXL, Requests

[Open case study →](jira-tools/)

---

## Additional: AI and MCP QA Workflows

AI-powered QA workflows using Model Context Protocol (MCP) for automated data analysis, invoice validation, job progress tracking, and cross-system reconciliation.

[Open case study →](case-studies/ai-mcp-qa-workflows.md)

---

## Test Automation Frameworks (Reference)

UI and API automation with Playwright, Cypress, and Selenium using Page Object Model. Public reference implementation lives in [`smart-qa-agent-os/`](smart-qa-agent-os/). Enterprise codebases used in employment are proprietary and are **not** published here.

---

## Reproducible Metrics

- 1,000+ test cases prepared and executed across TMS releases
- 1,000+ defects identified and reported with reproduction evidence
- 75% reduction in route and optimizer testing effort using the Route Optimizer Validation Engine
- 50%+ reduction in customer upload errors after introducing the Excel Validator

---

## Contact

- **Email:** bathiyalakruwan99@gmail.com
- **Website:** [bathiya-qa.vercel.app](https://bathiya-qa.vercel.app/)
- **LinkedIn:** [linkedin.com/in/bathiyalakruwan99](https://www.linkedin.com/in/bathiyalakruwan99/)

Sanitized QA tools and automation examples designed from real-world web, mobile, API, data, and logistics-testing workflows. MIT licensed — see [LICENSE](LICENSE).
