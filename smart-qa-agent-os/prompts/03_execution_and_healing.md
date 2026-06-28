# Execution and Healing Prompt (Example)

> Synthetic example for portfolio demonstration.

## Purpose

Runs the Playwright suite, classifies failures, and applies safe locator healing for automation-only issues while keeping product bugs visible.

## Template

```txt
Execute the Playwright test suite for <module>.

For each failure:
1. Classify the failure type:
   - Product defect
   - Automation issue (locator, timing, test data, stale reference)
   - Environment issue
   - Permission issue
   - Requirement gap
2. If automation issue:
   - Propose a healed locator using the locator strategy from QA memory.
   - Apply the heal only after human QA review for monetary or critical fields.
   - Record the heal in locator-healing memory.
3. If product defect:
   - Do not weaken the assertion.
   - Capture evidence (trace, screenshot, network log).
   - Create a defect file under qa-output/<module>/defects/.
4. Re-run healed tests to confirm the fix.

Produce a structured execution summary with per-case results.
```

## Failure Classification Matrix

| Failure Type | Action | Heal? |
| --- | --- | --- |
| Product defect | Assert + evidence + defect file | No |
| Locator changed | Propose new locator + human review | Yes (guided) |
| Timing / flaky | Add wait strategy + retry | Yes |
| Test data issue | Fix data + re-run | Yes |
| Environment down | Mark blocked | No |
| Requirement gap | Log question + mark blocked | No |

## Confidentiality

Synthetic template. No private wording is copied.
