# Manual QA Knowledge

Sanitized manual QA notes used to seed the Smart QA Agent OS memory and shared skills.

> Synthetic demo example. Fictional product (`Acme Demo Store`). No real customer data, real selectors, real workflows, internal screenshots, or proprietary domain rules.

## What lives here

A small collection of structured, human-written QA notes that explain workflows, validation rules, locator strategy, test data, and exploratory observations for a single business workflow. The QA agents read this as approved background context, not as live test code.

| File | Purpose |
| --- | --- |
| [`checkout-flow.manual.md`](checkout-flow.manual.md) | End-to-end demo checkout workflow described in plain language |
| [`checkout-test-plan.manual.md`](checkout-test-plan.manual.md) | Risk-based test plan written by a QA engineer |
| [`checkout-test-data.manual.md`](checkout-test-data.manual.md) | Test data conditions: positive, negative, boundary, dependency, cleanup |
| [`checkout-locator-knowledge.md`](checkout-locator-knowledge.md) | Locator strategy and stability observations |
| [`checkout-selectors.manual.md`](checkout-selectors.manual.md) | Selector catalog notes per page (synthetic) |
| [`coupon-rules.manual.md`](coupon-rules.manual.md) | Validation rules for the coupon sub-flow |

## How agents use this

1. The QA Router reads the relevant files when a request mentions the workflow.
2. The Requirement Analyst, Test Case Planning, and Test Data Curator agents propose coverage based on this context plus the requirement.
3. The Memory Curator only updates long-term QA memory when a learning has been reviewed by a human and supported by evidence.

## Confidentiality

All entries are synthetic. Real manual QA notes from private products are never published.
