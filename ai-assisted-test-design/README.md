# AI-Assisted Test Design Pipeline

> **Human-Reviewed QA Workflow — Sanitized Public Overview**
> A QA pipeline I built and use to draft structured test cases with AI, then review, refine, and approve them before they enter the test suite. QA approval is mandatory.

## Business Problem

Writing comprehensive test cases for new features is slow and repetitive: read the requirement, walk the acceptance criteria, capture happy paths and edge cases, and produce a structured set of test cases per module. This work is high-volume but low-novelty per item, and inconsistent coverage between authors creates gaps.

## QA Challenge

- Consistently cover acceptance criteria, edge cases, and negative paths
- Keep AI drafts from leaking into the test suite unreviewed
- Maintain a defensible audit trail of how each test case was authored
- Keep coverage consistent regardless of who drafts the tests

## What the Pipeline Does

AI-assisted generation of structured test-case drafts, with mandatory QA review before approval or import. AI supports first-pass drafting; a QA engineer reviews, corrects, expands, prioritises, and approves every final test case.

### Pipeline

```
AI Draft -> QA Review and Refinement -> QA Approval -> Test Management Import
```

It generates structured test-case drafts covering positive, negative, boundary, and workflow scenarios, then hands them to QA for review.

### What AI supports vs what QA owns

| Step | AI support | Human QA ownership |
|---|---|---|
| Risk analysis | Suggests risks and areas to cover | Confirms and prioritises risk |
| Scenario draft | Drafts scenarios and edge cases | Reviews coverage and accuracy |
| Test case wording | Drafts structured test cases | Corrects, expands, and approves |
| Prioritisation | Suggests a first-pass priority | Sets the final priority |
| Import | Prepares an import-ready draft | Approves what enters the suite |

## Fictional Example

For a fictional checkout feature, AI drafts scenarios for `Customer Alpha` placing `Order DEMO-1001`:

| Scenario | Type | Expected result |
| --- | --- | --- |
| Apply a valid coupon | Positive | Discount applied, total reduced |
| Apply an expired coupon | Negative | Coupon rejected, total unchanged |
| Coupon below minimum order value | Boundary | Coupon rejected with clear message |
| Apply two coupons | Negative | Only one coupon allowed |

QA then reviews the drafts, removes anything unsupported by the requirement, adds missing edge cases (for example a coupon at exactly the minimum value), sets priorities, and approves the final set before it enters the test suite.

For the detailed workflow case study, see [`../case-studies/ai-assisted-test-design.md`](../case-studies/ai-assisted-test-design.md).

## QA Value

- Faster first-pass drafting, more consistent structure, and more QA time available for risk analysis and exploratory testing
- Designed to reduce the effort needed to prepare a structured first draft of test coverage while preserving mandatory QA review
- Improves coverage consistency through reusable structure
- Keeps a defensible authoring trail

> Example outcome: AI-assisted first drafts can reduce drafting effort; actual time varies by requirement quality, complexity, and QA review depth.

## QA Skills Demonstrated

- Requirement analysis and risk-based test design
- Positive, negative, and boundary coverage thinking
- Using AI as a drafting aid without surrendering QA judgement
- Maintaining traceability from requirement to approved test case

## Human QA Ownership

No test case is published without QA review. Unreviewed AI output is never allowed in the test suite. Quality of output depends on the quality of the requirement and the review.

## Public Portfolio Scope

The public repository documents the pipeline and QA approach at a high level with fictional examples only. Internal prompts, real requirements, and production test cases remain private.

## Confidentiality Note

No real ticket data, designs, prompts referencing customer data, or screenshots are included. All examples are fictional. See [`../docs/confidentiality.md`](../docs/confidentiality.md).
