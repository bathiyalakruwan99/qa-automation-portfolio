# 08 - Final Test Execution Report: {{MODULE_NAME}}

> Blank template. Fill it only from executed runs: a case that was not run is "Not run", never "Pass". Every result
> links to evidence that exists.

## Summary

| Metric | Value |
| --- | --- |
| Build / environment | {{build}} / {{environment}} |
| Run date(s) | {{dates}} |
| Total cases | {{n}} |
| Passed | {{n}} |
| Failed | {{n}} |
| Blocked | {{n}} |
| Not run | {{n}} |

## Per-case results

| ID | Title | Result | Run ID / date | Evidence (must exist) |
| --- | --- | --- | --- | --- |
| TC-01 | {{title}} | Pass / Fail / Blocked / Not run | {{run}} | `traces/...` |

## Failures and classification

| ID | Classification | Reason | Evidence | Action |
| --- | --- | --- | --- | --- |
| TC-xx | product / test / environment | {{from the trace, not the screenshot alone}} | {{path}} | {{defect ID / fix / rerun}} |

## Defects

| ID | Title | Severity | Status |
| --- | --- | --- | --- |
| {{BUG-ID}} | {{title}} | {{severity}} | {{status}} |

## Release recommendation (for the release owner to decide)

- {{Go / Conditional go / Hold}}, because {{reason based on the results above}}.

## Sign-off

- Tester: {{name}}
- Date: {{YYYY-MM-DD}}
