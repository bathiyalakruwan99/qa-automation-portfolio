# Sample Failure Classification (Synthetic)

> Fictional example. Illustrates how a failed run is triaged before a defect is raised.

| Failure | Signal | Classification | Action |
|---|---|---|---|
| Coupon not applied for Order DEMO-1001 | Total unchanged, no error toast | Product defect | Raise defect with evidence |
| Element not found: cart summary | DOM changed, locator stale | Test maintenance | Investigate locator, human review |
| Timeout on payment page | Slow response, passes on retry | Environment/flaky | Quarantine, monitor, do not raise as product defect |
| Wrong expected value in assertion | Test expected old behaviour | Test defect | Fix test, re-run |

QA value: a failed test is not automatically a product bug. Classifying the failure first prevents noisy or incorrect defect reports and keeps the suite trustworthy.
