# Manual Bug Hunt Prompt (Example)

> Synthetic example for portfolio demonstration.

## Purpose

Drives exploratory, manual bug hunting using live browser interaction. Captures real evidence before drawing conclusions.

## Template

```txt
Open the application in a browser via MCP tools.

Explore the <module> workflow using charters:
- Happy path first, then alternatives and edge cases.
- Try boundary inputs, rapid state changes, back navigation, concurrent actions.
- Observe console errors, network failures, visual regressions, timing issues.

For each finding:
1. Capture a screenshot.
2. Capture the network request/response (if relevant).
3. Note exact reproduction steps.
4. Classify: product bug, cosmetic, performance, UX, or not-a-bug.
5. If product bug, create a defect file under qa-output/<module>/defects/.

Rules:
- Do not report imagined behaviour.
- Do not create fake screenshots or evidence paths.
- Distinguish real bugs from automation issues and environment problems.
- Every finding must have reproducible steps and evidence.
```

## Example Charter (Synthetic)

> Explore the checkout coupon flow. Try: apply + remove + re-apply, apply then change shipping, apply at exact minimum spend, apply in two tabs simultaneously.

## Confidentiality

Synthetic template. No private wording is copied.
