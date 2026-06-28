# Portfolio Overview

A recruiter-friendly tour of this repository.

## Start here

1. **Smart QA Agent OS** ([`smart-qa-agent-os/`](../smart-qa-agent-os/)) — automation framework reference covering UI, API, hybrid, BDD, performance, and release-gate workflows.
2. **GPS Suite** ([`gps-testing-suite/`](../gps-testing-suite/)) — 8 GPS testing tools including road-aware path builder, live manual simulator with pause/drag/rejoin, scenario JSON generator, and 1000-device load testing.
3. **Route Optimizer Validation Engine** ([`route-optimizer/`](../route-optimizer/)) — 6-stage load optimizer with reconciliation guarantees, unassigned reason codes, vehicle accessibility, and validation summary export.

## Then explore

4. **Job Master Data Validation and Evidence Processor** ([`jobmaster/`](../jobmaster/)) — multi-method load counting (3 categories x 3 methods), bulk GPS/payment/invoice status checks, tolerant column mapping, and evidence-ready exports.
5. **Bulk Upload Data Quality Utilities** ([`bulkfile-generator/`](../bulkfile-generator/)) — Excel validation, auto-correction, diff comparison, job highlighting, and test-data generation.
6. **AI-Assisted Test Case Workflow** ([`test-cases-creation-automatic/`](../test-cases-creation-automatic/)) — Jira and Figma to draft test cases with a mandatory QA review step.
7. **Jira QA Tools** ([`jira-tools/`](../jira-tools/)) — Jira REST API utilities, ticket history, manifests, and curated QA prompt library.
8. **AI and MCP QA Workflows** ([`case-studies/ai-mcp-qa-workflows.md`](../case-studies/ai-mcp-qa-workflows.md)) — AI-powered data analysis, invoice validation, and cross-system reconciliation.

## What to look at in each project

- `README.md` — business problem, QA challenge, solution, capabilities, tech stack, limitations, confidentiality note.
- Projects are presented as case studies. Source code is not included (except for the Smart QA Agent OS Playwright demo).

## Smart QA Agent OS - deeper dive

Inside [`smart-qa-agent-os/`](../smart-qa-agent-os/) the following sub-directories show the full operating model:

| Directory | What it shows |
| --- | --- |
| `ai-qa-operating-model.md` | Layered architecture and end-to-end orchestration |
| `docs/` | Agents catalog (34 agents), workflow matrix, shared skills, rules, QA memory, example journey, demo script |
| `manual-knowledge/` | Sanitized manual QA notes that seed agent memory |
| `module-template/` | Reusable scaffold for adding a new workflow with tests/ and qa-output/ trees |
| `playwright-demo/` | Playwright + TypeScript with POM, BDD, API, hybrid tests |
| `postman-newman/` | Postman collection and environment with Newman CI |
| `k6-performance/` | k6 smoke, load, stress, and soak scripts |
| `prompts/` | Sanitized prompt templates for each QA workflow stage |
| `qa-graph-tool/` | Architecture overview of a local graph visualization tool |
| `qa-output/` | Sample module-level QA outputs, run notes, DOM captures, and sanitized results |
| `sample-artifacts/` | Synthetic test plan, BDD, API result, release gate, failure classification, memory update, evidence summary |
| `scripts/` | Utility scripts for secret scanning, evidence cleanup, Newman runs, and report generation |

## Skim path (60 seconds)

- Read the root `README.md` first.
- Open `smart-qa-agent-os/README.md` for the framework summary.
- Scan the `Featured QA Projects` table for stack coverage.
- Click any project that matches the role you are hiring for.
