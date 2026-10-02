# Evidence Samples

Description of the kinds of evidence produced by the Smart QA Agent OS demo suite. Concrete files are generated on each run and uploaded as CI artifacts.

## Artifacts produced

| Artifact | When | Notes |
|---|---|---|
| `playwright-report/` | Every run | HTML report with per-test status, traces, and screenshots |
| `test-results/<test>/trace.zip` | On retry / failure | Open with `npx playwright show-trace` |
| `test-results/<test>/*.png` | On failure | Failure screenshot |
| `test-results/<test>/*.webm` | On failure | Failure video |
| `newman-report.html` | API regression | Newman HTML report |
| `k6-summary.json` | Performance run | k6 summary metrics |

## How to interpret

- **Smoke red, regression green** — almost always a real defect or environment issue.
- **Smoke green, regression flake** — open the trace; look for timing or data isolation issues.
- **API contract break** — Newman shows the failing assertion and response body; treat as a release-blocker unless explicitly accepted.
- **Performance regression** — compare k6 `http_req_duration` p95 and `http_req_failed` rate to the documented baseline.

## Privacy

Evidence stored in this repository must not contain real customer data, production URLs, real GPS coordinates from production, or credentials. Use the demo target and sanitized fixtures.
