# Sample QA Memory Update (Synthetic)

> Fictional example. QA memory is updated only after human review, with status and evidence for every entry.

| Field | Value |
|---|---|
| Entry type | Validation rule |
| Module | Checkout (fictional) |
| Rule | A coupon below the minimum order value must be rejected |
| Evidence | Run on Order DEMO-1001 with coupon DEMO-OLD; total unchanged, rejection shown |
| Status | Verified |
| Reviewed by | Human QA |
| Date | 2026-01-01 |

QA value: only verified, human-approved learnings enter memory. Each entry carries its evidence and status so future regression runs are smarter without trusting unverified claims.
