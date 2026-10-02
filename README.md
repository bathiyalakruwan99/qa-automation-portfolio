# Bathiya Lakruwan — QA Engineer

**QA Engineer | Automation | Product QA**

Playwright · TypeScript · API Testing · TMS / Logistics · GPS · Data Validation · AI-Assisted QA

[![Playwright](https://img.shields.io/badge/Playwright-TypeScript-2EAD33.svg)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6.svg)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3-3776AB.svg)](https://www.python.org/)
[![Postman](https://img.shields.io/badge/Postman-Newman-FF6C37.svg)](https://learning.postman.com/docs/collections/using-newman-cli/command-line-integration-with-newman/)
[![k6](https://img.shields.io/badge/k6-learning-7D64FF.svg)](https://k6.io/)

QA Engineer focused on product quality, test automation, data validation and complex logistics workflows (transport management, GPS tracking, route planning).

Contact: [bathiyalakruwan99@gmail.com](mailto:bathiyalakruwan99@gmail.com) · [Portfolio site](https://bathiya-qa.vercel.app/) · [LinkedIn](https://www.linkedin.com/in/bathiyalakruwan99/) · [GitHub](https://github.com/bathiyalakruwan99)

> **Portfolio status (October 2026):** this repository is being upgraded from documentation-heavy case studies into **runnable, independently built public demos**. The [maturity matrix](#project-maturity) shows exactly what is public code today and what is still a case study.

---

## Core Engineering Areas

- Playwright + TypeScript (Page Object Model, fixtures, typed test data, business flows)
- UI, API, and UI + API hybrid testing
- Product, exploratory, regression, and release QA
- Transport Management Systems (TMS) and logistics workflows
- GPS, live-map, and geofence testing
- Route-optimizer output validation
- Data, Excel, and CSV validation
- AI-assisted QA with mandatory human review
- Evidence-based release readiness

---

## Featured Projects

### 1. Smart QA Automation Framework

Playwright + TypeScript reference framework: Page Object Model, component objects, fixtures, typed test data, reusable business flows, BDD layer, tagging, negative and diagnostic specs, plus a human-governed AI QA operating model.

- **Public today:** framework structure and code (TypeScript), Postman collection, k6 scripts, synthetic QA artifacts.
- **In progress:** a local demo logistics app so every test runs on clone, typed API clients, API and hybrid suites, a state-driven workflow engine, unit-tested utilities, and CI.

[View project →](smart-qa-agent-os/)

### 2. GPS Simulation & Validation Suite

Approach for testing GPS, live-map and geofence features without hardware: route playback, multi-device simulation, geofence enter/exit and boundary cases, off-route and rejoin scenarios.

- **Public today:** case study with fictional scenarios.
- **In progress:** independently built simulator library, JSON scenarios with synthetic coordinates, CLI, and automated tests.

[View project →](gps-simulation-validation-suite/)

### 3. Route Optimizer Validation Workbench

An independent QA validation layer for route-optimizer **output** (not an optimizer): order allocation, duplicates, missing orders, capacity, vehicle suitability, route sanity.

- **Public today:** case study with fictional examples.
- **In progress:** TypeScript validators, fictional optimizer output, CLI report, unit tests.

[View project →](route-optimizer-validation-workbench/)

### 4. Data Validation Toolkit

Bulk-upload and job/load reconciliation validation: required fields, duplicates, formats, references, cross-field rules, orphan records, status/progress consistency, structured reports, synthetic data generation.

- **Public today:** case studies for the [Bulk Upload Validator](bulk-upload-validator/) and [Job Master Validation Tool](job-master-validation-tool/).
- **In progress:** runnable Python validators (CSV + XLSX), synthetic data generator, pytest suites.

[View Bulk Upload Validator →](bulk-upload-validator/) · [View Job Master Validation Tool →](job-master-validation-tool/)

### More

| Project | What it covers | Status |
| --- | --- | --- |
| [AI-Assisted Test Design](ai-assisted-test-design/) | AI drafts test cases; QA reviews and approves every case | Case study (prompt templates and schema in progress) |
| [Jira Release-Readiness Tools](jira-tools/) | Release-readiness views, regression mapping, status history | Case study (public Python implementation in progress) |
| [AI and MCP QA Workflows](case-studies/ai-mcp-qa-workflows.md) | AI-assisted analysis and reconciliation with human review | Case study |

---

## Project Maturity

What is publicly verifiable in this repository **today**. Labels are updated as each runnable demo lands.

| Area | Public code today | Professional relevance | Public maturity |
| --- | --- | --- | --- |
| Playwright framework structure (POM, fixtures, flows, BDD) | Yes | High | Reference implementation — runnable target in progress |
| API automation | Postman collection only | High | Reference — typed Playwright API suite in progress |
| UI + API hybrid testing | No | High | Documented — in progress |
| GPS simulation and validation | No | High | Case study — public reference build planned |
| Route-output validation | No | High | Case study — public reference build planned |
| Bulk upload / data validation | No | High | Case study — public reference build planned |
| Job / load reconciliation | No | High | Case study — public reference build planned |
| Jira release-readiness tools | No | Medium | Case study — public implementation planned |
| AI-assisted QA workflow | Documentation and templates | High | Prototype (human-reviewed) |
| k6 performance testing | Scripts against a public demo API | Developing | Learning |
| CI/CD | Secret-scan workflow | Developing | Working knowledge |

Labels used across the repo: **Runnable Demo**, **Reference Implementation**, **Prototype**, **Learning**, **Case Study / Documentation**.

---

## How This Portfolio Is Built

- **Independently recreated.** Public code is written from the general QA problem, never copied from employer systems. Employer source code, data, endpoints, selectors, payloads and business rules are not in this repository.
- **Synthetic data only.** One consistent fictional world: Northstar Logistics, Customer Alpha, Warehouse Alpha, Customer Site Beta, `TRUCK-001`, `DEMO-JOB-1001`.
- **Evidence first.** A test that was not executed is not reported as passed; a CI badge appears only after a real green run.
- **Human QA decides.** AI drafts and assists; humans review, approve and own release decisions.

Details: [`docs/confidentiality.md`](docs/confidentiality.md) · [`docs/qa-approach.md`](docs/qa-approach.md) · [`docs/qa-workflow-diagrams.md`](docs/qa-workflow-diagrams.md) · [`docs/portfolio-overview.md`](docs/portfolio-overview.md)

---

## Professional Experience

### Haulmatic Technologies — Software Quality Assurance Engineer (Jul 2024 – Present)

- End-to-end QA for web and Android-assistance applications across TMS modules (job management, GPS live map, control tower, work orders, optimizer, contracts, invoicing).
- Test plans, scenarios, test cases and RTMs; regression, exploratory and UAT cycles for production releases; full Jira defect lifecycle through release sign-off.
- REST API validation (Postman, Playwright, Cypress) including negative and authentication scenarios.
- Automated key UI and API workflows with Playwright (POM) and Selenium.
- Built internal QA tooling for GPS simulation, route-optimizer output comparison, and upload-data validation.

### IFS R&D International — Software Engineering QA Trainee (Mar 2023 – Feb 2024)

- IFS Apps 10 system testing across releases 21R2–24R1 in 5+ environments.
- Cypress + Cucumber BDD automation; Page Designer suite (200+ scenarios); stabilised 30+ legacy Cypress issues; introduced test tagging.

### Team Telous — Product / QA (Part-time, project-based, Dec 2023)

- Converted customer feedback into structured scenarios, checklists and UAT flows; SQL-based report and workflow validation.

**Professional metrics** (from employment; not reproducible from this public repository): 1,000+ test cases prepared and executed; 1,000+ defects reported with reproduction evidence; GPS simulation exercised at up to 1,000 simulated device streams in controlled QA runs.

---

## Education & Certifications

- B.Sc. (Hons) in Engineering (Information & Communication) — SLTC Research University, Colombo
- Advanced Certificate in HR & Marketing Management — IDM Nations Campus
- ISTQB Certified Tester – Foundation Level (CTFL) v4.0
- AWS Cloud Architecting — AWS Academy
- CCNA — Cisco Academy

---

## Documentation

- [`PROJECTS.md`](PROJECTS.md) — project directory with status labels
- [`SKILLS.md`](SKILLS.md) — skills grouped by evidence level
- [`docs/confidentiality.md`](docs/confidentiality.md) — public/private boundary and sanitization rules
- [`docs/demo-app-design-rationale.md`](docs/demo-app-design-rationale.md) — why the demos run against a local, repository-owned app
- [`NOTICE.md`](NOTICE.md) — portfolio-use notice

---

## Contact

Email: [bathiyalakruwan99@gmail.com](mailto:bathiyalakruwan99@gmail.com) · Website: [bathiya-qa.vercel.app](https://bathiya-qa.vercel.app/) · LinkedIn: [linkedin.com/in/bathiyalakruwan99](https://www.linkedin.com/in/bathiyalakruwan99/) · Location: Badulla / Colombo, Sri Lanka

Open to **QA Engineer, Automation QA Engineer and SDET-track** roles.
