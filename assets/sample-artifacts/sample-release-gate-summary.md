# Sample Release Gate Summary (Synthetic)

> Fictional example. Evidence-based go/hold summary for a release decision.

| Area | Result | Evidence |
|---|---|---|
| Smoke suite | Pass | All critical paths green |
| Regression (checkout) | Pass with 1 known issue | Defect BUG-DEMO-002 (low) accepted |
| API contract checks | Pass | Status, schema, response time within thresholds |
| Open blockers | None | - |
| Open high-severity defects | 0 | - |

**Recommendation:** GO, with BUG-DEMO-002 tracked for the next cycle.

QA value: the release decision is backed by evidence per area. No evidence means not verified; the recommendation is explainable and traceable.
