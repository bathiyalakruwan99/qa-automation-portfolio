# Jira QA Evidence & Release Readiness Tools

> **Public-Safe QA Utility Collection**
> Python tools for collecting Jira ticket data, building release-readiness views, tracking status history, and generating QA evidence reports.

## Security and Data Handling

No real Jira URL, user account, API token, project key, ticket content, customer data, or internal release information is included in this repository. Never commit `.env`, Jira tokens, project keys, real issue exports, or customer data. Use `.env.example` as a configuration template only.

## Business Problem

QA needs a repeatable, evidence-friendly view of release readiness from a ticketing system: which items are ready, which need regression coverage, and how status has changed, without manually re-shaping data every release. Done by hand, this view is slow to build and easy to get wrong right before a release.

## QA Challenge

- Consolidate work items into one consistent, review-ready view
- Track readiness status and status-change history
- Connect items to the regression coverage they require
- Keep a defensible, evidence-friendly release-readiness picture
- Make the go/hold decision explainable and traceable

## What the Tools Do

- Fetch configured Jira ticket data into local sanitized JSON structures for reporting and analysis
- Track readiness status and status-change history
- Map work items to the regression coverage they require
- Generate QA evidence and release-readiness summaries

Fictional sample tickets are included for demonstration and report-generation testing.

### Release-readiness flow

```
Ticketing workflow
  -> Consolidate work items into a review view
  -> Track readiness status and status history
  -> Map items to required regression coverage
  -> Produce an evidence-friendly release-readiness summary
  -> Human QA review and release decision
```

### What QA reviews

| View | What it shows | QA use |
| --- | --- | --- |
| Readiness list | Each work item's readiness against acceptance criteria | Decide what can ship |
| Status history | How an item moved through states | Traceability and audit |
| Regression mapping | Which items need regression coverage | Plan regression scope |
| Evidence summary | Risks, blockers, and supporting evidence | Support the release decision |

For the detailed workflow, see [`../case-studies/jira-qa-workflow-automation.md`](../case-studies/jira-qa-workflow-automation.md).

## Fictional Readiness Snapshot

| Item | State | Regression needed | Readiness |
| --- | --- | --- | --- |
| DEMO-101 | Verified | No | Ready |
| DEMO-102 | In QA | Yes | Not ready |
| DEMO-103 | Verified with known issue | Yes | Ready with risk |

```
Items in scope: 3
Ready: 1
Ready with known risk: 1 (DEMO-103)
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

## Confidentiality Note

No real ticket data, customer references, project keys, ticket IDs, Jira URLs, credentials, or proprietary prompts are included. All sample tickets are fictional. See [`../docs/confidentiality.md`](../docs/confidentiality.md).
