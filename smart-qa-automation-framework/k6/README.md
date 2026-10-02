# k6 Performance Tests

Sanitized k6 scripts demonstrating the four performance-test layers used in this reference framework: **smoke**, **load**, **stress**, and **soak**. Target is the public **https://reqres.in** demo API.

> Performance numbers are illustrative. Real baselines must be captured against the actual System Under Test before being trusted.

## Files

- `smoke.js` — minimal load to verify the script and endpoint work
- `load.js` — expected production-like load
- `stress.js` — push beyond expected load to find limits
- `soak.js` — sustained load to find leaks and degradation

## Run

```bash
# Install k6 from https://k6.io/

k6 run smoke.js
k6 run load.js
k6 run stress.js
k6 run soak.js
```

## Thresholds

Every script defines basic thresholds for `http_req_duration` p95 and `http_req_failed` rate. Adjust to match your real baseline once captured.

## Output

- Console summary
- Optional JSON summary via `--summary-export k6-summary.json`
