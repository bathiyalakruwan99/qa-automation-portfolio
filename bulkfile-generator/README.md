# Bulk Upload Data Quality and Validation Workflow (Case Study)

> Sanitized example for portfolio demonstration. No real code, Excel templates, validation logic, or sample uploads are included. All examples are fictional.

## Business Problem

Customers uploading bulk data (organizations, vehicles, drivers, locations) to a platform regularly hit validation errors: wrong formats, missing fields, duplicate IDs. The support team is then flooded with tickets that are really data-quality problems, not product defects. Each ticket costs time to triage before anyone realises the upload file itself was the issue.

## QA Challenge

- Catch data issues before they reach the platform
- Highlight errors that need human attention versus those that are auto-correctable
- Validate large files quickly enough to use in QA and support workflows
- Generate safe, synthetic test data for QA without using production data

## Approach

A data-quality and validation workflow that checks an upload file, separates real problems from noise, and produces a clear report. It also generates fictional test data so QA can exercise ingestion flows without touching production data.

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

### Test data generation

A complementary capability produces fictional, synthetic datasets (for example `Customer Alpha`, `Vehicle-001`, `Order DEMO-1001`) for performance and workflow testing, so QA never depends on real customer data.

## Fictional Example

| Record | Field | Result |
|---|---|---|
| Customer Alpha | Required fields | Pass |
| Vehicle-001 | Duplicate ID | Flagged for review |
| Vehicle-002 | Date format | Auto-correctable |

### Sample validation summary (shape only)

```
Rows checked: 3
Pass: 1
Auto-correctable: 1 (Vehicle-002 date format)
Needs review: 1 (Vehicle-001 duplicate ID)
Action: fix flagged rows, re-upload clean file
```

## QA Value

- Removes a common class of false defects driven by bad upload data
- Cuts support load by 50%+ for upload-related tickets
- Separates auto-correctable issues from those needing human attention
- Provides QA with a reusable validation approach to harden new ingestion flows
- Removes dependence on production data through synthetic test-data generation

## QA Skills Demonstrated

- Data-quality validation and root-cause separation (data vs product defect)
- Designing review-ready reports for non-QA stakeholders (support, customers)
- Safe synthetic test-data generation
- Reducing defect noise through shift-left validation

## Limitations

- No source code is included in this public portfolio
- The approach is described at a workflow level only
- Templates and sample uploads are not included

## Confidentiality Note

No real code, templates, validation logic, correction rules, or sample uploads are included. This case study describes the approach at a high level with fictional examples only. See [`../docs/confidentiality.md`](../docs/confidentiality.md).
