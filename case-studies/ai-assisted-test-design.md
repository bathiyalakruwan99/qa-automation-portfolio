# AI-Assisted Test Design Workflow (Case Study)

> Sanitized example for portfolio demonstration. No real ticket data, designs, prompts, or screenshots are included. All examples are fictional.

## Business Problem

Writing comprehensive test cases for new features is slow and repetitive: read the requirement, walk the acceptance criteria, capture happy paths and edge cases, and produce a structured set of test cases per module. This work is high-volume but low-novelty per item and slows the release cycle, while inconsistent coverage between authors creates gaps.

## QA Challenge

- Consistently cover acceptance criteria, edge cases, and negative paths
- Keep AI drafts from leaking into the test suite unreviewed
- Maintain a defensible audit trail of how each test case was authored
- Keep coverage consistent regardless of who drafts the tests

## High-Level Workflow

```
Requirement
  -> Risk analysis
  -> Test scenario draft
  -> Human QA review
  -> Approved test case
  -> Test management import concept
```

AI-assisted drafting supports first-pass test design. A QA engineer reviews, corrects, expands, prioritises, and approves all final test cases.

## What AI Supports vs What QA Owns

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

The QA engineer then reviews the drafts, removes anything unsupported by the requirement, adds missing edge cases (for example a coupon at exactly the minimum value), sets priorities, and approves the final set before it enters the test suite.

## QA Value

- Cuts time-to-first-draft from hours to minutes per module
- Improves coverage consistency through reusable structure
- Keeps a defensible authoring trail
- Frees QA time for exploratory and risk-based testing

## QA Skills Demonstrated

- Requirement analysis and risk-based test design
- Positive, negative, and boundary coverage thinking
- Using AI as a drafting aid without surrendering QA judgement
- Maintaining traceability from requirement to approved test case

## Human QA Ownership

No test case is published without QA review. Unreviewed AI output is never allowed in the test suite. Quality of output depends on the quality of the requirement and the review.

## Confidentiality Note

No real ticket data, designs, prompts referencing customer data, or screenshots are included. This case study describes the workflow at a high level with fictional examples only. See [`../docs/confidentiality.md`](../docs/confidentiality.md).
