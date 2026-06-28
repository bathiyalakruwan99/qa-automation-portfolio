# Jira QA Tools

Python utilities for syncing Jira tickets, building manifests, exporting ticket history, generating ready-for-release reports, and a curated set of 76+ QA prompts for API, security, and automation testing.

---

## Business Problem

QA teams spend meaningful time pulling Jira data into a shape that supports release decisions: which tickets are ready for release, which need regression tests, and what each ticket's status history looks like. Doing that by hand across many epics is slow and error-prone.

## QA Challenge

- Aggregate tickets from multiple epics into one consistent dataset
- Track ready-for-release status and status-change history
- Generate regression test cases from bug/task tickets
- Reuse a library of high-quality QA prompts across releases

## Solution

A small collection of focused Python scripts that:

- Sync Jira tickets to local JSON
- Build a manifest for quick lookup
- Export ticket data and status history to Excel
- Generate ready-for-release and regression-test-case reports
- Provide 76+ QA prompts under `qa_prompts/`

## Key Capabilities

- **Ticket sync** from configured Jira epics into local JSON
- **Ticket history** Excel export (sample dataset of 10+ tickets and 14+ status rows)
- **Manifest builder** for fast indexing of all synced tickets
- **Report generators** — ready-for-release list and regression test cases
- **QA prompt library** — 76+ prompts for API, security, automation, and more

## Tech Stack

Python 3.8+, Jira REST API, Requests, OpenPyXL

## How It Works

### Setup

```bash
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your Jira credentials and epic keys
```

### Configuration

| Variable | Description |
|----------|-------------|
| `JIRA_URL` | Your Jira instance URL (e.g. `https://your-domain.atlassian.net`) |
| `JIRA_USERNAME` | Email or username |
| `JIRA_API_TOKEN` | API token from Jira account settings |
| `JIRA_EPICS` | Comma-separated epic keys (e.g. `EPIC-1,EPIC-2`) |

### Scripts

| Script | Purpose |
|--------|---------|
| `sync_from_jira.py` | Sync tickets from configured epics to `ticket_history/ticket_data/` |
| `build_ticket_manifest.py` | Build manifest from ticket JSON files |
| `export_ticket_history_to_excel.py` | Export ticket data + status history to Excel |
| `update_ticket_json.py` | Update ticket JSON fields or add status changelog entries |
| `gen_ready_for_release.py` | Generate markdown list of tickets in "Ready for Release" |
| `gen_regression_test_cases.py` | Generate regression test cases from bug/task tickets |

### Project structure

```
jira-tools/
├── scripts/                       # Python automation scripts
├── qa_prompts/                    # 76+ QA prompt templates
├── samples/                       # Sample Excel outputs
├── ticket_history/
│   ├── ticket_data/               # 10 sample ticket JSONs
│   └── jira_ticket_manifest.json
└── reports/                       # Generated markdown reports
```

## Sample Evidence / Screenshots

- `samples/ticket_history_sample.xlsx` — ticket data + status history
- `samples/regression_test_cases_sample.xlsx` — example regression test cases
- `samples/tickets_ready_for_release_sample.xlsx` — example ready-for-release list
- `ticket_history/ticket_data/` — 10 sample ticket JSONs (SAMPLE-001 … SAMPLE-010)

## QA Value

- Provides repeatable, evidence-friendly views of release readiness
- Removes manual data-shaping work from the QA workflow
- Enables a reusable QA prompt library for consistent testing artefacts
- Produces Excel and markdown outputs that travel cleanly into reviews

## Limitations

- Requires valid Jira credentials to sync (sample data is included for review)
- Reports are intentionally focused; deeper analytics belong in a BI tool
- Status-history depth depends on what Jira's changelog API returns

## Confidentiality Note

The repository ships with **sanitized sample data only** (SAMPLE-001 … SAMPLE-010). No real ticket data, customer references, internal epic keys, or credentials are included. Credentials must be supplied through environment variables that are not committed. See [`../docs/confidentiality.md`](../docs/confidentiality.md).
