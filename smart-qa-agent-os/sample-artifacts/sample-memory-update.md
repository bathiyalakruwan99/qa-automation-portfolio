# Sample QA Memory Update (Synthetic example for portfolio demonstration)

> Synthetic example. Not from any real memory store.

## Category

`Defect Pattern Memory`

## Entry

- **Title:** Capacity-conflict status mismatch
- **Module:** Order Dispatch
- **Pattern:** UI shows `Dispatched` even when the dispatch API returns a 409 conflict for capacity-exceeded vehicles.
- **Detection cue:** Hybrid UI vs API check fails while the UI scenario alone appears to pass.
- **Source:** Run `run-2026-06-28-001` (fictional)
- **Evidence:** `synthetic-evidence/ui-vs-api-mismatch.png`
- **Confidence:** Verified — reproduced twice in the demo environment.
- **Owner agent:** Memory Curator
- **Curation review:** Approved.

## Reuse intent

- Future regression runs should always include the capacity-exceeded hybrid scenario.
- Bug Pattern Miner should monitor whether the issue reappears in similar modules.

## Confidentiality note

All references are fictional. Real memory entries are never published.
