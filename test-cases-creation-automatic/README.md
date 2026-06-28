# AI-Assisted Test Case Workflow (Case Study)

> Synthetic example for portfolio demonstration. No real Jira ticket data, Figma files, or proprietary prompts are included.

## Business Problem

Writing comprehensive test cases for new features is slow and repetitive: read the Jira ticket, open Figma, walk the acceptance criteria, capture happy paths and edge cases, and produce 50-100 test cases per module in the test-management format. This work is high-volume but low-novelty per ticket and slows the release cycle.

## QA Challenge

- Consistently cover acceptance criteria, edge cases, and negative paths
- Keep test cases in sync with Jira and Figma changes
- Avoid AI hallucinations finding their way into the test suite
- Keep a defensible audit trail of how each test case was authored

## Solution

A documented workflow with five stages:

1. **Gather context** via Jira MCP (tickets, acceptance criteria) and Figma MCP (designs, UI specs).
2. **Structure coverage** in an RTMS-style mind map (modules, flows, edge cases).
3. **Draft test cases with AI** (ChatGPT / Claude / Cursor) using specialized prompts.
4. **Mandatory human review** before anything is converted to CSV and imported into the test-management tool.
5. **Import** reviewed test cases via CSV into the test management tool.

```
Jira MCP -> Figma MCP -> RTMS Mind Map -> AI Draft -> Human Review -> CSV -> Test Management Tool
```

## Key Capabilities

- Jira and Figma context pulled through MCP integrations
- Mind-map driven coverage structure
- Reusable prompt set for different test types (functional, negative, API, regression)
- Hard gate: no test case is published without QA review
- CSV-based import path into the test-management tool
- Requirement Traceability Matrix (RTM) for coverage traceability

## Tech Stack

Jira MCP, Figma MCP, ChatGPT / Claude / Cursor, mind-mapping tools, Python (CSV conversion)

## QA Value

- Cuts time-to-first-draft from hours to minutes per module
- Improves coverage consistency through reusable prompts and templates
- Keeps a defensible authoring trail (mind map + reviewed draft + CSV)
- Frees QA time for exploratory and risk-based testing

## Limitations

- This is a workflow, not a single installable product
- AI drafts must be reviewed; unreviewed output is not allowed in the test suite
- Quality of output depends on the quality of the ticket, design, and prompt
- MCP integrations require their own setup and access tokens

## Confidentiality Note

No real Jira ticket data, real Figma files, real prompts referencing customer data, or real screenshots are included. This case study describes the workflow at a high level only. See [`../docs/confidentiality.md`](../docs/confidentiality.md).
