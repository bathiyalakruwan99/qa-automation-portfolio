# Bathiya Lakruwan — Software Quality Assurance Engineer

**Manual QA | Automation QA | Product QA | API Testing | Web + Mobile Testing**

I am a Software Quality Assurance Engineer with hands-on experience in end-to-end product validation, automation testing, API testing, data validation, regression testing, release QA, and production issue reproduction.

My current work focuses on Transport and Supply Chain TMS workflows, including Job Master, GPS Live Map, Control Tower, Work Orders, Optimizer, Contracts, Invoicing, reporting, and Android mobile-assistance workflows.

I build reusable QA automation structures using Playwright, TypeScript, Cypress, Selenium, BDD/Cucumber, Page Object Model, API clients, Postman/Newman, k6, Python, SQL, and MongoDB validation.

This repository contains sanitized QA tools, automation-framework examples, test-data utilities, validation workflows, and case studies created from real enterprise-testing challenges.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.4x-2EAD33.svg)](https://playwright.dev/)

Open to **Software QA Engineer, Automation QA Engineer, Senior QA Engineer, and SDET-track opportunities**.

Contact: bathiyalakruwan99@gmail.com · [Portfolio site](https://bathiya-qa.vercel.app/) · [LinkedIn](https://www.linkedin.com/in/bathiyalakruwan99/) · [GitHub](https://github.com/bathiyalakruwan99)

---

## What I Bring to QA Teams

- **Product & Release QA:** End-to-end validation of web, mobile, workflow, reporting, invoicing, contract, optimizer, and operational-platform features.
- **Automation QA:** Playwright, TypeScript, Cypress, Selenium, BDD/Cucumber, Page Object Model, fixtures, reusable test flows, and structured reporting.
- **API & Hybrid Testing:** REST API validation, authentication, negative scenarios, JSON/schema validation, API + UI verification, Postman/Newman, and Playwright API testing.
- **Data & Reporting Validation:** SQL queries, MongoDB checks, Excel validation, report verification, calculation checks, and data-integrity testing.
- **GPS & Map Validation:** GPS coordinate testing, live map validation, geofence checks, vehicle movement simulation, route-path comparison, and location-based workflow testing.
- **Performance & CI-Ready Testing:** k6 smoke/load/stress structures, Newman execution workflows, report artifacts, and CI execution monitoring exposure.
- **AI-Assisted QA:** Requirement-to-test-case workflows, QA knowledge memory, evidence-based validation rules, locator/test-healing concepts, and release-regression planning.

---

## How to Review This Portfolio

Start with the **Smart QA Agent OS** for the flagship automation framework and AI QA operating model.
Then review the **GPS Suite** and **Route Optimizer Validation Engine** for domain-specific testing tools.
Use the **Data Quality Utilities** and **Job Master Processor** to review Python, Excel, reporting, and data-validation capability.

For a guided tour, see [`docs/portfolio-overview.md`](docs/portfolio-overview.md). For my testing approach see [`docs/qa-approach.md`](docs/qa-approach.md). For the confidentiality boundaries used in this repo see [`docs/confidentiality.md`](docs/confidentiality.md).

---

## Featured QA Projects

| # | Project | What It Demonstrates | Core Stack |
|---|---|---|---|
| 1 | [Smart QA Agent OS / Automation Framework + AI QA Operating Model](smart-qa-agent-os/) | Reusable UI, API, hybrid, performance, evidence, and release-gate QA workflow plus a modular AI QA operating model (agents, skills, rules, memory) | Playwright, TypeScript, BDD, POM, Postman/Newman, k6, AI QA Operating Model |
| 2 | [GPS Simulator and Path Generation Suite](gps-testing-suite/) | Synthetic GPS streams, road-aware paths, geofences, and high-load testing | JavaScript, Leaflet, OSM, OpenRouteService |
| 3 | [Route Optimizer Validation Engine](route-optimizer/) | Route distance, capacity, cost, and multi-stop validation (cost-vs-distance trap) | Next.js, TypeScript, OSRM, Leaflet |
| 4 | [Job Master Data Validation and Evidence Processor](jobmaster/) | TMS export validation, multi-method load counting, bulk status, evidence | Python, Pandas, OpenPyXL, Tkinter, Flask |
| 5 | [Data Quality and Test Data Utilities](#5-data-quality-and-test-data-utilities) | Excel validation, test-data generation, bulk-upload checks, comparisons | Python, Pandas, OpenPyXL |
| 6 | [AI-Assisted Test Case Workflow](test-cases-creation-automatic/) | Requirement-to-test-case drafting with mandatory QA review | AI, MCP, Jira, Figma |
| 7 | [Jira QA Tools](jira-tools/) | QA reporting and Jira/API productivity workflows | Python, REST API, Jira |

Sanitized QA tools and automation examples designed from real-world web, mobile, API, data, and logistics-testing workflows.

---

### 1. Smart QA Agent OS — Automation Framework + AI QA Operating Model

> **Flagship project** — the highlight of this portfolio.

A sanitized public reference implementation of an enterprise-style QA automation and release-validation workflow, **plus a modular AI QA operating model**. This is the most comprehensive project in the portfolio, combining a working automation framework with a structured AI-assisted QA architecture.

#### What makes this the flagship

This project demonstrates the full breadth of modern QA engineering in one place:

- **Automation framework** with runnable Playwright + TypeScript code (POM, BDD, API, hybrid tests, fixtures, test data)
- **AI QA Operating Model** with 34 specialised agents, 13 shared skill groups, 14 quality rule categories, and 17 memory categories
- **Evidence-first methodology** where every test result, defect, and memory update requires traceable evidence
- **End-to-end workflow** from requirement intake through release-gate decision, with continuous learning feedback loops
- **Supporting tooling** including a module template, prompt templates, QA graph visualizer, utility scripts, and sample QA output

#### Automation framework side

| Layer | What it demonstrates |
|---|---|
| Playwright + TypeScript | POM, BDD/Cucumber-style, fixtures, reusable test flows |
| UI testing | Page Objects, component objects, locator strategy, DOM capture |
| API testing | API client wrappers, contract validation, auth handling |
| Hybrid testing | API + UI combined workflows (create via API, verify via UI) |
| Performance | k6 smoke, load, stress, and soak test scripts |
| Postman/Newman | Collection-based API regression with CI execution |
| Evidence | Traces, screenshots, network logs, structured reports |
| Release gate | Evidence-based go/no-go decision flow with risk summary |

#### AI QA Operating Model side

| Component | Count | What it covers |
|---|---|---|
| Specialised QA agents | 34 | Orchestration, discovery, test design, execution, healing, reporting, release, and learning |
| Shared QA skill groups | 13 | Requirement-to-test, Playwright/BDD/POM, API/hybrid, Postman, performance, investigation, test data, evidence, memory, release gate, security, accessibility, documentation |
| Quality rule categories | 14 | Evidence-first, no-imagined-behaviour, safe automation, bug separation, memory quality, locator guardrails, and more |
| QA memory categories | 17 | Project, module, flow, page, API, validation rules, test data, automation, locator healing, flaky areas, known bugs, defect patterns, error-to-solution, release, learning, glossary, run |

#### End-to-end QA workflow

```
Requirement → QA Router → Discovery (browser, flow, DOM)
  → Test Planning (risk-based, test cases, BDD, POM)
  → Automation (Playwright, API, hybrid)
  → Execution → Healing (guided, human-reviewed)
  → Investigation (failure classification, defect files)
  → Reporting (evidence, release gate)
  → Memory Curation (verified learnings only, human-approved)
  → Continuous Learning (next regression is smarter)
```

#### Supporting directories

| Directory | What it contains |
|---|---|
| `manual-knowledge/` | Sanitized manual QA notes (flow, test plan, test data, locators, selectors, coupon rules) that seed agent memory |
| `module-template/` | Reusable scaffold for adding a new business workflow with parallel `tests/` and `qa-output/` trees |
| `prompts/` | 6 sanitized prompt templates for master orchestration, test planning, BDD/POM, execution/healing, memory update, and manual bug hunt |
| `qa-graph-tool/` | Architecture overview of a local visualization tool that renders the operating model as an interactive graph |
| `qa-output/` | Sample module-level QA outputs: setup, blockers, analysis, test plan, exploratory results, final report, 2 defects, run notes, skill-agent report, DOM captures, sanitized Playwright results |
| `sample-artifacts/` | 7 synthetic artifacts: test plan, BDD scenario, API validation result, release gate report, failure classification, memory update, evidence summary |
| `scripts/` | 5 utility scripts: secret scanner, evidence cleaner, Newman runner, memory-triggered test runner, skill-agent report generator |
| `previews/` | HTML preview pages for operating model concepts |

#### Key principles

- **No imagined behaviour**: every test, assertion, and conclusion must be backed by browser evidence, executed tests, or approved requirement docs
- **Human QA at the center**: agents support QA work, they do not replace QA judgement
- **Evidence-first**: no evidence = not verified, no execution = not passed, no browser = not tested
- **Controlled continuous learning**: memory is updated only after human review, with status and evidence for every entry
- **Safe healing**: locator changes for monetary or critical fields always require human QA review

Architecture-only public showcase — no private prompts, source files, customer data, rule wording, or memory content are exposed.

- [Open project →](smart-qa-agent-os/)
- [AI QA Operating Model overview →](smart-qa-agent-os/ai-qa-operating-model.md)
- [Specialised QA Agent Catalog →](smart-qa-agent-os/docs/agents-catalog.md)
- [Sample Artifacts →](smart-qa-agent-os/sample-artifacts/)
- [Manual QA Knowledge →](smart-qa-agent-os/manual-knowledge/)
- [Module Template →](smart-qa-agent-os/module-template/)
- [Prompt Examples →](smart-qa-agent-os/prompts/)
- [QA Graph Tool →](smart-qa-agent-os/qa-graph-tool/)
- [QA Output →](smart-qa-agent-os/qa-output/)
- [Scripts →](smart-qa-agent-os/scripts/)

---

### 2. GPS Simulator and Path Generation Suite

**Problem:** GPS, live-map, geofence, and vehicle-tracking features must be tested at fleet scale without physical hardware, and the hardest scenarios — off-route drivers, GPS jumps, and rejoin behaviour — must be reproducible on demand.

**Solution:** A web-based toolkit with a central dashboard and focused tools, including:

- **GPS Path Builder (road-aware)** — click waypoints on a map, fetch the real driving route via OpenRouteService, and interpolate to a configurable step (default 10 m) with a configurable speed (default 40 km/h). Exports a simulator-ready JSON. Includes `data-testid` attributes so the tool itself is testable in Playwright / Cypress / Selenium.
- **GPS Live Manual Simulator** — stream a multi-device payload while letting the tester pause selected devices, drag them off-route, and resume with either *On-route* (snap to nearest planned point) or *Rejoin* (draw a rejoin connector first). Renders planned / completed / manual-drag / rejoin paths as separate layers. Supports a local-only mode, exports the actual traveled JSON with movement metadata, and exports the map as a PNG for evidence.
- **Live GPS Simulator** for high-load multi-device streaming with staggered start.
- **GPS Vehicle Simulator** for manual / dev-tool authoring of single-device paths.
- **GPS Path Visualizer** for inspecting JSON / CSV paths on a map.
- **Multi-Device Combiner** for merging per-device JSONs into one simulator payload.

**QA value:** Makes off-route, detour, geofence-edge, and rejoin scenarios deterministic and repeatable; removes physical hardware from the test plan; produces JSON and PNG evidence that travels cleanly into defect reports.

**Technology approach:** Vanilla HTML / CSS / JavaScript (ES6+), Leaflet.js with OpenStreetMap, OpenRouteService for driving routes, SLERP + Haversine for coordinate work, runtime-only bearer-token handling (never committed).

[Open case study →](gps-testing-suite/)

---

### 3. Route Optimizer Validation Engine

**Problem:** Optimizer output is easy to ship and hard to verify. Lower distance does not always mean lower cost.
**Solution:** A standalone Next.js reference engine that recomputes routes using Nearest Neighbour + 2-opt + 3-opt with a multi-start strategy and real road distances, then compares its result with the product's optimizer across distance, cost, vehicle selection, capacity, and feasibility.
**QA value:** Provides a defensible expected result per scenario, catches the cost-vs-distance trap, and reduces route and optimizer testing effort significantly.
**Technology approach:** Next.js, TypeScript, OSRM (public or local), Leaflet, Web Workers, LRU cache.

[Open case study →](route-optimizer/)

---

### 4. Job Master Data Validation and Evidence Processor

**Problem:** TMS releases must be validated against large job and work-order exports covering jobs, loads, GPS, invoices, and payments. Manual reconciliation is slow and error-prone.
**Solution:** A Python application (desktop + web + CLI) that validates exports, applies multi-method load counting, runs bulk GPS/payment/invoice status checks, and produces evidence-ready Excel outputs with filter context in the filename.
**QA value:** Cuts data verification from minutes per check to seconds, detects calculation defects, and produces clean evidence for defect reports and release reviews.
**Technology approach:** Python 3.8+, Pandas, OpenPyXL, Tkinter, Flask.

[Open case study →](jobmaster/)

---

### 5. Data Quality and Test Data Utilities

Grouped small utilities used for Excel validation, test-data generation, bulk-upload checks, comparisons, and colour-coded review:

| Utility | What It Does |
|---|---|
| [Excel Validator / Corrector](bulkfile-generator/) | Validates and auto-corrects bulk upload Excel files before TMS ingestion. |
| [Excel Diff Tool](excel-master-diff/) | Sheet-by-sheet comparison of two Excel files with a detailed diff report. |
| [Excel Job Highlighter](excel-job-highlighter/) | Colour-codes rows by job ID to speed up large-dataset manual review. |
| [Order Data Generator](order-data-generator/) | Generates realistic test order data for performance and workflow testing. |
| [Bulkfile Generator](bulkfile-generator/) | Creates bulk upload payloads aligned to TMS schema rules. |
| [Geo Coordinate Converter](geo-coordinate-converter/) | Address ↔ GPS conversion and batch processing. |

These tools demonstrate Python, Pandas, OpenPyXL, Tkinter, and data-integrity validation skills.

---

### 6. AI-Assisted Test Case Workflow

A documented workflow (not a standalone tool) that turns Jira tickets and Figma designs into draft test cases through MCP integrations and mind-map structuring, with a mandatory QA review step before any test case is published.

[Open workflow →](test-cases-creation-automatic/)

---

### 7. Jira QA Tools

Python utilities for syncing Jira tickets, building manifests, exporting ticket history, generating ready-for-release reports, and a curated set of 76+ QA prompts for API, security, and automation testing.

[Open project →](jira-tools/)

---

## Professional Experience

### Haulmatic Technologies — Software Quality Assurance Engineer
**Jul 2024 – Present**

- Own end-to-end QA for web and Android-assistance applications across core TMS modules: Job Master, GPS Live Map, Control Tower, Work Orders, Optimizer, Contracts, and Invoicing.
- Create and maintain test plans, test scenarios, test cases, and RTMs; execute regression, exploratory, and UAT cycles for production releases.
- Manage the complete defect lifecycle in Jira including reproduction steps, severity prioritization, triage support, verification, and release sign-off.
- Perform REST API validation using Postman and Playwright/Cypress, including negative testing and authentication scenarios.
- Validate GPS, live map, geofence, and route workflows using simulation datasets to reproduce production edge cases.
- Prepared and executed 1,000+ test cases and identified 1,000+ defects across continuous release cycles.
- Built a GPS simulation suite for high-load, multi-device GPS, route-path, vehicle-movement, and geofence testing scenarios.
- Developed Python and Excel validation utilities, reducing customer upload errors by over 50%.
- Automated key UI and API workflows using Playwright and Selenium (POM structure).
- Built route and optimization validation using OSRM and Google Maps APIs, reducing route and optimizer testing effort by 75%.

**Tech:** Jira, Postman, Testiny, Playwright, Selenium, Cypress, k6, Git, Bitbucket, Excel, SQL, MongoDB

---

### IFS R&D International — Software Engineering QA Trainee
**Mar 2023 – Feb 2024**

- IFS Apps 10 system testing across releases (21R2–24R1) in 5+ environments.
- Enhanced Cypress automation with Cucumber BDD for readable, maintainable scenarios.
- Built Page Designer test suite (200+ scenarios) covering conditional logic, layouts, and data binding.
- Stabilized 30+ legacy Cypress issues; introduced a test tagging system for faster regression filtering.
- Contributed to TAR testing using OData methods, streamlining reporting and validation.

**Tech:** Cypress, Cucumber (BDD), Kendo UI, OData, Jira

---

### Team Telous — Product / QA
**Part-time / Project-based | Dec 2023**

- Converted customer feedback into structured test scenarios, validation checklists, and UAT flows.
- Supported QA planning, product validation, UX review, requirement clarification, sprint planning, retesting, and release review.
- Performed SQL-based validation for reports, payments, stock, sales, customer records, and business workflows.

**Tools:** SQL, Excel, Manual Testing, UAT Validation, Requirement Analysis, Product Validation, Release Review

---

## Education & Certifications

**Education**
- B.Sc. (Hons) in Engineering (Information & Communication) — SLTC Research University, Colombo
- Advanced Certificate in HR & Marketing Management — IDM Nations Campus

**Certifications**
- ISTQB Certified Tester – Foundation Level (CTFL) v4.0 — January 2026
- AWS Cloud Architecting — AWS Academy
- CCNA — Cisco Academy

---

## Tech Stack

**Test Automation:** Playwright, Selenium, Cypress, BDD (Cucumber), Page Object Model
**Languages:** TypeScript, JavaScript, Python, Java, SQL, HTML/CSS
**API & Performance:** Postman, Newman, REST APIs, JSON Schema, k6 (smoke/load/stress/soak)
**Data & Reporting:** SQL, MongoDB, Pandas, OpenPyXL, Excel validation
**Tools:** Jira, Testiny, Git/GitHub, Bitbucket, VS Code, Cursor AI
**AI-Assisted QA:** Model Context Protocol (MCP), prompt engineering, requirement-to-test-case workflows

---

## Reproducible Metrics

Numbers below are explainable and tied to evidence in this repository:

- 1,000+ test cases prepared and executed across TMS releases
- 1,000+ defects identified and reported with reproduction evidence
- 75% reduction in route and optimizer testing effort using the Route Optimizer Validation Engine
- 50%+ reduction in customer upload errors after introducing the Excel Validator
- High-load GPS testing scenarios validated without physical hardware

---

## Confidentiality and Responsible Sharing

This portfolio contains sanitized case studies, demo workflows, synthetic data, and high-level architecture examples. It does not include employer source code, production data, credentials, private endpoints, customer information, or proprietary implementation details.

Sample identifiers throughout this repository (`Vehicle-001`, `Warehouse A`, `Customer Site B`, `Zone Alpha`, `JOB-1001`, `LOAD-2001`, etc.) are fictional. Any resemblance to real entities is unintentional. See [`docs/confidentiality.md`](docs/confidentiality.md) for the full policy.

---

## Documentation

- [`docs/portfolio-overview.md`](docs/portfolio-overview.md) — Recruiter-friendly tour of every project
- [`docs/qa-approach.md`](docs/qa-approach.md) — How I plan, execute, and report releases
- [`docs/confidentiality.md`](docs/confidentiality.md) — Confidentiality and sanitization rules
- [`PROJECTS.md`](PROJECTS.md) — Detailed project descriptions
- [`SKILLS.md`](SKILLS.md) — Full technical skills breakdown

---

## Quick Start

```bash
git clone https://github.com/bathiyalakruwan99/qa-automation-portfolio.git
cd qa-automation-portfolio

# Smart QA Agent OS — Playwright demo
cd smart-qa-agent-os/playwright-demo
npm install
npx playwright install --with-deps
npm run test:smoke

# GPS Testing Suite
cd ../../gps-testing-suite
# open dashboard.html in a browser

# Route Optimizer
cd ../route-optimizer
npm install && npm run dev

# Job Master Data Processor
cd ../jobmaster
pip install -r requirements.txt
python desktop_app.py
```

Each project has its own README with setup instructions.

---

## Contact

- Email: bathiyalakruwan99@gmail.com
- Website: [bathiya-qa.vercel.app](https://bathiya-qa.vercel.app/)
- LinkedIn: [linkedin.com/in/bathiyalakruwan99](https://www.linkedin.com/in/bathiyalakruwan99/)
- GitHub: [github.com/bathiyalakruwan99](https://github.com/bathiyalakruwan99)
- Location: Badulla / Colombo, Sri Lanka

Open to **Software QA Engineer, Automation QA Engineer, Senior QA Engineer, and SDET-track opportunities**.

---

## License

MIT License — see [LICENSE](LICENSE).
