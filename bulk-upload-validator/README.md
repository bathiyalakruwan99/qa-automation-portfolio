# Bulk Upload Validator & Synthetic Test Data Generator

> **Internal QA Tool — Sanitized Public Overview**
> Built by me to validate bulk-upload data and generate safe synthetic datasets for QA testing. The public repository contains fictional examples only.

## Business Problem

Customers uploading bulk data (organizations, vehicles, drivers, locations) to a platform regularly hit validation errors: wrong formats, missing fields, duplicate IDs. The support team is then flooded with tickets that are really data-quality problems, not product defects. Each ticket costs time to triage before anyone realises the upload file itself was the issue.

## QA Challenge

- Catch data issues before they reach the platform
- Highlight errors that need human attention versus those that are auto-correctable
- Validate large files quickly enough to use in QA and support workflows
- Generate safe, synthetic test data for QA without using production data

## What the Tool Does

A QA utility that validates upload files, classifies data-quality issues, and generates review-ready validation summaries. The tool also generates synthetic test datasets for regression, negative, workflow, and performance testing without using production data.

### Validation checks

| Check | What it catches | Example |
| --- | --- | --- |
| Required fields | Missing mandatory values | A vehicle row with no ID |
| Format checks | Values in the wrong shape | A malformed date or code |
| Duplicate detection | Repeated unique identifiers | Two rows sharing one ID |
| Cross-field consistency | Fields that contradict each other | Status and dependent fields disagree |
| Reference checks | Values that must match a known list | An unknown location reference |

### Workflow

```
Upload file
  -> Validate required fields, formats, duplicates, and references
  -> Separate auto-correctable issues from manual-review items
  -> Produce a clear, review-ready validation summary
  -> QA or support confirms and returns a clean file
```

### Synthetic test data generation

A built-in capability produces fictional, synthetic datasets (for example `Customer Alpha`, `Vehicle-001`, `Order DEMO-1001`) for regression, negative, workflow, and performance testing, so QA never depends on real customer data.

## Fictional Example Output

| Record | Field | Result |
|---|---|---|
| Customer Alpha | Required fields | Pass |
| Vehicle-001 | Duplicate ID | Flagged for review |
| Vehicle-002 | Date format | Auto-correctable |

```
Rows checked: 3
Pass: 1
Auto-correctable: 1 (Vehicle-002 date format)
Needs review: 1 (Vehicle-001 duplicate ID)
Action: fix flagged rows, re-upload clean file
```

## QA Value

- Removes a common class of false defects driven by bad upload data
- Designed to reduce upload-related support effort by identifying data-quality issues before platform submission
- Separates auto-correctable issues from those needing human attention
- Provides QA with a reusable validation approach to harden new ingestion flows
- Removes dependence on production data through synthetic test-data generation

## QA Skills Demonstrated

- Data-quality validation and root-cause separation (data vs product defect)
- Designing review-ready reports for non-QA stakeholders (support, customers)
- Safe synthetic test-data generation
- Reducing defect noise through shift-left validation

## Public Portfolio Scope

- The production/internal source code is not public because it includes confidential implementation details and employer-owned logic.
- The public documentation describes functionality at a high level; implementation details and validation rules remain private.

## Confidentiality Note

The original tool is real. This public page intentionally excludes its source code, customer templates, correction rules, and sample uploads. All names and records shown here are fictional. See [`../docs/confidentiality.md`](../docs/confidentiality.md).
