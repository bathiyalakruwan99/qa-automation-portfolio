# Prompt Examples

Sanitized, capability-level prompt templates that show how the Smart QA Agent OS orchestrates a QA workflow. These are illustrative only - private prompt wording, internal paths, and proprietary references have been removed.

> Synthetic example for portfolio demonstration. No private prompt files, internal paths, or proprietary instructions are copied.

## Files

| File | Purpose |
| --- | --- |
| [`00_master_qa_orchestration.md`](00_master_qa_orchestration.md) | Master prompt that loads rules, memory, and skills, then runs the full QA workflow |
| [`01_test_case_planning.md`](01_test_case_planning.md) | Risk-based test case planning from requirements and exploration evidence |
| [`02_bdd_pom_automation.md`](02_bdd_pom_automation.md) | BDD + POM Playwright automation generation from verified test cases |
| [`03_execution_and_healing.md`](03_execution_and_healing.md) | Test execution, failure classification, and safe locator healing |
| [`04_memory_update.md`](04_memory_update.md) | Post-run QA memory curation after evidence-backed results |
| [`05_manual_bug_hunt.md`](05_manual_bug_hunt.md) | Exploratory bug hunting with live browser evidence capture |

## How These Relate to the Operating Model

Each prompt corresponds to a stage in the agent workflow:

```
Master Orchestration
  -> Test Case Planning (Requirement Analyst + Test Architect)
  -> BDD/POM Automation (Playwright BDD/POM Builder)
  -> Execution and Healing (E2E Runner + Healing Agent)
  -> Memory Update (Memory Curator)
  -> Manual Bug Hunt (Manual Bug Hunter)
```

## Confidentiality

All prompt content is synthetic and generic. The structure mirrors a real AI-assisted QA system, but no private wording, file paths, agent filenames, or product-specific instructions are exposed.
