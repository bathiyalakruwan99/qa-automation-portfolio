# Jira QA Workflow and Evidence Reporting (Case Study)

> Sanitized example for portfolio demonstration. No real ticket data, project keys, ticket IDs, Jira URLs, credentials, or proprietary prompts are included. All examples are fictional.

## Business Problem

QA needs a repeatable, evidence-friendly view of release readiness from a ticketing system: which items are ready, which need regression coverage, and how status has changed, without manually re-shaping data every release. Done by hand, this view is slow to build and easy to get wrong right before a release.

## QA Challenge

- Consolidate work items into one consistent, review-ready view
- Track readiness status and status-change history
- Connect items to the regression coverage they require
- Keep a defensible, evidence-friendly release-readiness picture
- Make the final go/hold decision explainable and traceable

## High-Level Workflow

```
Ticketing workflow
  -> Consolidate work items into a review view
  -> Track readiness status and status history
  -> Map items to required regression coverage
  -> Produce evidence-friendly release-readiness summary
  -> Human QA review and release decision
```

## What QA Reviews

| Area | Question it answers |
| --- | --- |
| Readiness state | Does each item meet its acceptance criteria? |
| Status history | How did the item move through its states? |
| Regression coverage | Which items need regression and is it planned? |
| Open risks and blockers | What could stop the release? |
| Evidence | Is each conclusion backed by traceable proof? |

## Fictional Readiness Snapshot

| Item | State | Regression needed | Evidence | Readiness |
| --- | --- | --- | --- | --- |
| DEMO-101 | Verified | No | Test run attached | Ready |
| DEMO-102 | In QA | Yes | Pending | Not ready |
| DEMO-103 | Verified with known issue | Yes | Defect DEMO-BUG-2 logged | Ready with risk |

### Sample release-readiness summary (shape only)

```
Items in scope: 3
Ready: 1
Ready with known risk: 1 (DEMO-103, DEMO-BUG-2 accepted)
Not ready: 1 (DEMO-102 still in QA)
Recommendation: HOLD until DEMO-102 completes QA
```

## QA Value

- Provides repeatable, evidence-friendly views of release readiness
- Removes manual data-shaping work from the QA workflow
- Produces summaries that travel cleanly into release reviews
- Keeps a defensible audit trail for go/hold decisions

## QA Skills Demonstrated

- Release-readiness assessment and risk communication
- Mapping work items to regression coverage
- Evidence-based reporting and traceability
- Turning scattered ticket data into a single decision view

## Human QA Ownership

Any consolidation or reporting step supports QA work; it does not make the release decision. A QA engineer reviews the readiness view, confirms coverage, and makes the final go/hold call.

## Confidentiality Note

No real ticket data, customer references, project keys, ticket IDs, Jira URLs, credentials, or proprietary prompts are included. This case study describes the workflow at a high level with fictional examples only. See [`../docs/confidentiality.md`](../docs/confidentiality.md).
