# Confidentiality and Sanitization Policy

This portfolio is a **public** repository. The rules below apply to every file in this repo. The goal is to show QA capability and architecture thinking without exposing anything that belongs to an employer, a customer, or a private system.

## Never include

- Real customer data, personal data, or business contact data.
- Real production URLs, API hosts, internal endpoints, or environment names.
- Credentials, tokens, API keys, certificates, or `.env` files.
- Internal screenshots, internal Jira tickets, internal Figma boards, or proprietary diagrams.
- Real production payloads, real production GPS coordinates, or real customer Excel exports.
- Proprietary business logic, calculation formulas, internal column names, or category names copied from any employer.
- Private prompts, private QA memory content, or internal rule wording.

## Always include

- A clear `Confidentiality Note` section in every project README.
- A clear marker on sample data: `demo`, `sanitized`, `synthetic`, or `reference implementation`.
- Public demo targets only (for example `demo.playwright.dev`, `reqres.in`).
- Generated or fictional names and IDs only.

## Fictional identifiers used throughout

To keep examples consistent and obviously fake, the repository uses placeholder names such as:

| Type | Fictional value |
| --- | --- |
| Customer | Customer Alpha |
| Vehicle | Vehicle-001 |
| Order | Order DEMO-1001 |
| Job | DEMO-JOB-1001 |
| Load | DEMO-LOAD-2001 |
| Location | Warehouse Alpha, Customer Site Beta |
| Geofence | Zone Gamma |

Any resemblance to real entities is unintentional.

## Code and frameworks

- This repository is documentation-only: it contains sanitized case studies, diagrams, and synthetic examples, not runnable employer code.
- Where a technique (POM, fixtures, BDD, k6 stages) is industry-standard, it is presented as such.
- Any patterns shown are inspired by professional experience and do not reproduce any employer's codebase.

## How sanitization is applied

- Real business logic is described at a capability level, never reproduced verbatim.
- Metrics are limited to figures that are accurate and explainable in an interview.
- Diagrams show workflow shape and architecture, not real screens, selectors, or data.

## Reporting an issue

If something in this repository looks confidential, please open an issue or contact me at bathiyalakruwan99@gmail.com and I will remove it promptly.
