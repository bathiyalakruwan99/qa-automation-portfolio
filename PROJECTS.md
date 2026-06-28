# Projects

Sanitized QA tools and automation examples designed from real-world web, mobile, API, data, and logistics-testing workflows. Most were built during my work at **Haulmatic Technologies** (Transport Management Systems) and **IFS R&D International** (ERP systems). This repository contains only the public, sanitized versions.

Featured order — open in this sequence:

1. Smart QA Agent OS / Automation Framework
2. GPS Simulator and Path Generation Suite
3. Route Optimizer Validation Engine
4. Job Master Data Validation and Evidence Processor
5. Data Quality and Test Data Utilities
6. AI-Assisted Test Case Workflow
7. Jira QA Tools

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

Web-based tools for testing GPS and location-based features without physical hardware: multi-device simulator, road-aware path builder using OpenRouteService, coordinate visualizer, and multi-device combiner.

Built a GPS simulation suite for high-load, multi-device GPS, route-path, vehicle-movement, and geofence testing scenarios.

**Tech:** JavaScript, Leaflet.js, OpenStreetMap, OpenRouteService API

[Open project →](gps-testing-suite/)

---

## 3. Route Optimizer Validation Engine

Next.js application that solves multi-stop routing problems (Nearest Neighbour + 2-opt + 3-opt) using OSRM for real road distances. Used as a reference engine to validate route distance, route path, cost, and multi-stop behaviour for TMS optimizers. Result: 75% reduction in route and optimizer testing effort.

**Tech:** Next.js, TypeScript, React, OSRM, Google Maps API

[Open project →](route-optimizer/)

---

## 4. Job Master Data Validation and Evidence Processor

QA tool for validating large job and work-order exports from a TMS. Ingests an export, applies validation rules, highlights data quality issues, runs bulk GPS/payment/invoice status checks, and produces evidence-ready Excel outputs with filter context in the filename.

- Real-time search and filter across all columns
- Multi-method load counting (Non-distribution unique loads + distribution prorated / 8x / 10x)
- Bulk status checking for thousands of jobs
- Tolerant column mapping across export variants
- Multi-sheet exports with raw data + summary + applied filters

**Tech:** Python, Pandas, OpenPyXL, Tkinter, Flask

[Open project →](jobmaster/)

---

## 5. Data Quality and Test Data Utilities

Grouped small utilities used for Excel validation, test-data generation, bulk-upload checks, comparisons, and color-coded review:

- **Excel Validator / Corrector** — validates and auto-corrects bulk upload Excel files before TMS ingestion. Reduced customer upload errors by 50%+.
- **Excel Diff Tool** — sheet-by-sheet comparison of two Excel files with a detailed diff report.
- **Excel Job Highlighter** — color-codes rows by job ID to speed up large-dataset manual review.
- **Order Data Generator** — generates realistic test order data for performance and workflow testing.
- **Bulkfile Generator** — creates bulk upload payloads aligned to TMS schema rules.
- **Geo Coordinate Converter** — address ↔ GPS conversion and batch processing.

**Tech:** Python, Pandas, OpenPyXL, Tkinter, Faker

[Bulkfile Generator](bulkfile-generator/) · [Excel Diff Tool](excel-master-diff/) · [Excel Job Highlighter](excel-job-highlighter/) · [Order Data Generator](order-data-generator/) · [Geo Coordinate Converter](geo-coordinate-converter/)

---

## 6. AI-Assisted Test Case Workflow

A documented workflow (not a standalone tool) that turns Jira tickets and Figma designs into draft test cases through MCP integrations and mind-map structuring, with a mandatory QA review step before any test case is published.

- Jira MCP for tickets and acceptance criteria
- Figma MCP for design context
- Mind map / RTM for coverage visualization
- AI drafts test cases
- **Mandatory** human review before publishing
- CSV import into the test management tool

**Tech:** Jira MCP, Figma MCP, ChatGPT/Claude, Python (CSV conversion)

[Open workflow →](test-cases-creation-automatic/)

---

## 7. Jira QA Tools

Python utilities for syncing Jira tickets, building manifests, exporting ticket history, generating ready-for-release reports, and a curated set of 76+ QA prompts for API, security, and automation testing.

**Tech:** Python, Jira REST API, OpenPyXL, Requests

[Open project →](jira-tools/)

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
