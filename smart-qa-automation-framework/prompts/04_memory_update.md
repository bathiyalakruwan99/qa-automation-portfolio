# Memory Update Prompt (Example)

> Synthetic example for portfolio demonstration.

## Purpose

After a completed QA run, curates verified learnings into the appropriate QA memory categories. Only evidence-backed, human-reviewed learnings are stored.

## Template

```txt
After a completed QA run, update QA memory.

Check and update each applicable memory category:
- Project memory      (if project-level context changed)
- Module memory       (if module understanding deepened)
- Flow memory         (if a flow path was verified)
- Page memory         (if a new page or navigation was verified)
- Selector memory     (if new stable locators were verified)
- Locator healing     (if selectors were healed)
- Test data memory    (if new test data values were used)
- Validation rules    (if new rules were discovered)
- Known bugs          (if bugs were confirmed)
- Defect patterns     (if repeated risk was identified)
- Flaky areas         (if instability was observed)
- Automation memory   (if framework behaviour was discovered)
- Learning memory     (if a process mistake was found and fixed)
- Run memory          (new dated entry for this run)

Rules:
- Every memory item must have: status, evidence reference, date.
- Mark outdated memory clearly as "Outdated".
- Do not update memory from imagined behaviour.
- Do not store passwords, tokens, or private data.
- Human QA review is required before memory is promoted to "Verified".
```

## Memory Curation Flow

```
Run completes
  -> Evidence collected (traces, screenshots, network logs)
  -> Memory Curator proposes updates
  -> Human QA reviews
  -> Approved updates written to memory
  -> Outdated entries marked
```

## Confidentiality

Synthetic template. No private memory content or filenames are copied.
