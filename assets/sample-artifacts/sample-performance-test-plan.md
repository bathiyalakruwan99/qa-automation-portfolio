# Sample Performance Test Plan (Synthetic)

> Fictional example. Uses a safe demo/controlled target only. Not runnable.

| Test type | Goal | Shape | Pass threshold (example) |
|---|---|---|---|
| Smoke | Confirm the endpoint responds under light load | 1-2 virtual users, short | p95 < 500 ms, 0 errors |
| Load | Confirm behaviour at expected load | Ramp to target users, steady | p95 < 800 ms, error rate < 1% |
| Stress | Find the breaking point | Ramp past expected load | Identify degradation point |
| Soak | Confirm stability over time | Steady load, extended duration | No memory/latency creep |

**Fictional target:** a public demo API for `Order DEMO-1001` style requests. No production endpoints, tokens, or real data are used.

QA value: separating smoke, load, stress, and soak makes performance testing intentional. Thresholds are defined up front so results are pass/fail, not subjective.
