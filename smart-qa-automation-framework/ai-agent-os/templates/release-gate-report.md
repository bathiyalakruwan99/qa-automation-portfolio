# Template: release gate report

> Blank template. Evidence for a release decision; the release owner makes the decision. "Not run" is never reported
> as "Passed".

## Release

- Product / module: {{name}}
- Candidate: {{version or sprint}}
- Date: {{YYYY-MM-DD}}

## Evidence by area

| Area | Status | Evidence (must exist) | Notes |
| --- | --- | --- | --- |
| Smoke | Passed / Failed / Not run | {{report link / run ID}} | |
| Regression | Passed / Failed / Not run | {{report link / run ID}} | |
| API contract | Passed / Failed / Not run | {{report link}} | |
| UI vs API consistency (hybrid) | Passed / Failed / Not run | {{report link}} | |
| Performance smoke | Passed / Failed / Not run | {{summary link}} | thresholds: {{file}} |
| Open defects | {{count by severity}} | {{tracker query}} | |

## Known issues accepted for this release

| Defect | Severity | Why acceptable | Accepted by |
| --- | --- | --- | --- |
| {{ID}} | {{severity}} | {{reason}} | {{name}} |

## Recommendation (for the release owner)

**{{Go / Conditional go / Hold}}**, because {{reason tied to the evidence above}}.

## Required actions before release

1. {{action, owner}}

A machine-generated equivalent from this portfolio: `python -m jira_tools release-report` in
[`jira-tools/`](../../../jira-tools/). It recommends HOLD, READY WITH KNOWN RISK or READY FOR HUMAN SIGN-OFF, and
never "approved".
