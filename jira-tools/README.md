# Jira QA Evidence & Release Readiness Tools

**Turns ticket data into three release-review views:** a readiness state for every item in a release, the regression
suites the release needs, and a status history that exposes reopened and stuck work. It runs **offline** against an
exported JSON file, so no ticketing-system access, URL or token is needed.

## Project Status

**Public implementation:** Runnable demo. Python (standard library only), fictional sample tickets
(`DEMO-101`…`DEMO-112`), CLI, 19 pytest tests, ruff lint.

**Professional relevance:** Based on the release-readiness and regression-scoping work I do with ticket data. The
internal tools pull data from a ticketing system; this public version is independently written for this portfolio
and works only on fictional, offline data.

**Confidentiality:** No ticketing-system URL, project key, real ticket ID, user, token, ticket content or release data.
Never commit `.env` files, tokens or real exports. See [`../docs/confidentiality.md`](../docs/confidentiality.md).
Background case study: [`../case-studies/jira-qa-workflow-automation.md`](../case-studies/jira-qa-workflow-automation.md).

---

## 1. The QA problem

Before a release, someone has to answer three questions from the ticket data, usually by hand in a spreadsheet:

1. Is every item in the release actually ready, and what is blocking the rest?
2. Which regression suites does this release touch?
3. Which items bounced back after QA, or sat in QA too long?

## 2. The three views

### Release readiness (`release-report`)

| State | Rule |
| --- | --- |
| `BLOCKED` | An open **Blocker/Critical** defect is linked to the item, even if the item itself is Verified |
| `NOT_READY` | Item is still open, **or** a bug fix is Done but not Verified by QA |
| `READY_WITH_RISK` | Done/Verified with an accepted minor defect or a `known-issue` label |
| `READY` | Done/Verified, nothing open against it |

The recommendation is `HOLD`, `READY WITH KNOWN RISK - needs explicit sign-off` or `READY FOR HUMAN SIGN-OFF`. **It is
never "approved".** The release owner makes the go/hold decision. The CLI exits `1` on HOLD, so the report can gate a
pipeline step.

### Regression plan (`regression-plan`)

Bugs, and items flagged `regressionRequired`, pull in every suite mapped to their components
([`sample-data/regression-map.json`](sample-data/regression-map.json)). `smoke` always runs. An item that needs
regression but whose component maps to nothing is listed under **NEEDS MAPPING** and is never silently dropped.

### Status history (`status-history`)

For each item: hours spent in each status (summed across repeat visits), reopen count (moving out of Done/Verified),
and flags for `REOPENED`, `LONG_IN_QA` (default > 72 h) and `HISTORY_MISMATCH` (the history doesn't end in the
current status).

## 3. Setup and run

```bash
cd jira-tools
python -m venv .venv && source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements-dev.txt
pytest                                                   # 19 tests
ruff check . && ruff format --check .

python -m jira_tools release-report --release 2026.10    # exit 1 (HOLD)
python -m jira_tools regression-plan --release 2026.10
python -m jira_tools status-history --now 2026-10-02T12:00:00Z
python -m jira_tools release-report --issues my-export.json --release 2026.11
```

## 4. Sample output

[`sample-output/`](sample-output/) holds all three reports. Release readiness:

```text
Release readiness: 2026.10

Items in scope: 10
  READY: 5
  READY_WITH_RISK: 1
  NOT_READY: 3
  BLOCKED: 1

  DEMO-106  BLOCKED          open blocker/critical defect(s): DEMO-112
  DEMO-102  NOT_READY        status is In QA
  DEMO-105  NOT_READY        bug fix is Done but not Verified by QA
  DEMO-112  NOT_READY        status is In Progress
  DEMO-103  READY_WITH_RISK  accepted known issue(s): DEMO-111
  DEMO-101  READY            status is Verified
  ...

Recommendation: HOLD
The go/hold decision is made by the release owner.
```

Regression plan:

```text
Regression plan: 2026.10

  smoke                  always
  auth                   DEMO-108
  live-map               DEMO-102, DEMO-105
  reports                DEMO-106
  shipments-api          DEMO-101, DEMO-104, DEMO-106, DEMO-112
  shipments-ui           DEMO-101, DEMO-104, DEMO-106, DEMO-112
  tracking-geofence      DEMO-102, DEMO-105

  NEEDS MAPPING: DEMO-109 (regression required, no component mapped)
```

Status history (excerpt):

```text
  DEMO-102  To Do 144 h, In Progress 144 h, In QA 123 h
            ! LONG_IN_QA (123 h > 72 h)
  DEMO-106  To Do 24 h, In Progress 192 h, In QA 80 h, Verified 211 h, Reopened 24 h
            ! REOPENED x1
            ! LONG_IN_QA (80 h > 72 h)
```

## 5. Test coverage

| ID | Test |
| --- | --- |
| JIRA-001 / 002 | Verified item is READY; every open status is NOT_READY |
| JIRA-003 | A bug fix needs Verified, not just Done (a task can be Done) |
| JIRA-004 | An open Critical defect blocks even a Verified item |
| JIRA-005 | A minor open defect or `known-issue` label gives READY_WITH_RISK |
| JIRA-006 | Recommendations for HOLD, ready and risky releases; never "approved" |
| JIRA-007 | Scope is by fix version; most severe first |
| JIRA-008 / 009 | Component → suite mapping; unmapped items surfaced; bugs always need regression |
| JIRA-010 | Hours per status across repeat visits; reopen counting |
| JIRA-011 / 012 | LONG_IN_QA threshold; history that disagrees with the status |
| JIRA-013 | Bad data rejected with every problem listed (exit 2) |
| JIRA-014 | CLI exit codes |

## 6. Known limitations

This public implementation intentionally simplifies:

- **offline only:** no live ticketing-system client is included;
- **calendar hours:** time in status ignores working hours and weekends;
- **one fix version per item;**
- **readiness rules are this demo's own:** a real team agrees its definition of ready first.
