# Confidentiality and Sanitization Policy

This portfolio is a **public** repository. The rules below apply to every file in it. The goal is to show QA engineering ability without exposing anything that belongs to an employer, a customer, or a private system.

## What this repository contains

This repository contains sanitized reference implementations, synthetic demo applications, generic QA automation examples, architecture documentation and technical case studies.

It does not contain employer-owned source code, real customer data, production environment details, confidential workflows, private business rules or proprietary implementation logic.

## How public code is created

Public implementations are **independently recreated** from the general QA problem, never converted from private code.

```text
Professional experience
  -> General engineering lesson
  -> Independent public design
  -> Synthetic data
  -> Runnable public demo
  -> Technical case study
```

Renaming identifiers in private code (for example a real customer to `Customer Alpha`) is **not** sanitization and is never done here.

**Golden test** applied to every public implementation: *could this have been written from the generic problem description alone, without seeing any private source?* If not, it is redesigned.

## Never included

- Real customer, tenant, driver or personal data; real vehicle registrations or GPS device IDs.
- Production, staging or test URLs, API hosts, internal endpoints, environment names or internal headers.
- Credentials, tokens, API keys, cookies, certificates, saved login state or `.env` files.
- Internal screenshots (blurred or not), internal Jira tickets, employer or client Figma designs.
- Real payloads, schemas, database structures, exports, invoices, contracts or release reports.
- Real or identifiable GPS coordinates and routes.
- Proprietary calculation formulas, cost/rate logic, optimisation algorithms or customer-specific rules.
- Selectors copied from employer applications.
- Private prompts, private agent rules, private QA memory or employer-owned automation code.

## Always included

- A **Project Status** block and a **Confidentiality** section in every project README.
- A clear marker on sample data: `demo`, `synthetic`, or `fictional`.
- Test targets owned by this repository (a local demo app or local mocks). Public third-party demo APIs are used only where clearly labelled, and never as the only way to run a demo.
- Generated or fictional names and IDs only.
- Synthetic coordinates, marked: *Synthetic demo coordinate. Not derived from production or customer data.*

## Fictional identifiers

| Type | Fictional values |
| --- | --- |
| Company | Northstar Logistics |
| Customer | Customer Alpha |
| Supplier | Transport Partner Beta |
| Locations | Warehouse Alpha, Customer Site Beta, Central Distribution Hub |
| Geofence | Zone Gamma |
| Vehicles | `TRUCK-001`, `TRUCK-002`, `VAN-001`, `REEFER-001` (older case studies also use `Vehicle-001`) |
| Drivers | Driver Alpha, Driver Beta |
| Jobs / Loads / Orders | `DEMO-JOB-1001`, `DEMO-LOAD-2001`, `DEMO-ORD-3001` |
| Tickets | `DEMO-101`, `DEMO-102` |

Any resemblance to real entities is unintentional.

## Screenshots and media

Screenshots and recordings come only from the public demo apps, generated reports, or local tools in this repository. Screenshots of internal applications are never published, even blurred, because layout, navigation and IDs can still leak.

## Safety checks

- `.gitignore` excludes environment files, saved auth state, raw exports and generated artifacts; only reviewed synthetic sample data is allowed.
- A repository pattern scanner (`smart-qa-agent-os/scripts/check-no-secrets.js`) runs before commits.
- gitleaks scans the full git history and working tree in CI (`.github/workflows/secret-scan.yml`).
- Every commit is checked against the public-safety checklist below.

### Pre-commit public safety checklist

- [ ] No real company URL, internal endpoint or environment name
- [ ] No real customer, tenant, driver, registration or GPS device ID
- [ ] No credentials, tokens or keys
- [ ] No real Jira ticket or confidential screenshot
- [ ] No production payload, proprietary formula or copied selector
- [ ] No private prompt, private QA memory or employer-owned implementation

## Reporting an issue

If something in this repository looks confidential, please open an issue or contact [bathiyalakruwan99@gmail.com](mailto:bathiyalakruwan99@gmail.com) and it will be removed promptly.
