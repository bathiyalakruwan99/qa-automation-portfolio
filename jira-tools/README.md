# Jira QA Automation Tools

Python tools for syncing Jira tickets, generating reports, and managing QA workflows. Uses the Jira REST API to fetch tickets from epics, build manifests, and produce markdown reports.

## Features

- **Ticket sync** — Fetch tickets from Jira epics into local JSON
- **Manifest builder** — Build a JSON manifest of all synced tickets
- **Report generation** — Ready-for-release lists, regression test cases
- **QA prompt library** — 76+ prompts for API testing, contract testing, and more

## Setup

```bash
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your Jira credentials and epic keys
```

## Configuration

Set these environment variables (or use `.env`):

| Variable | Description |
|----------|-------------|
| `JIRA_URL` | Your Jira instance URL (e.g. `https://your-domain.atlassian.net`) |
| `JIRA_USERNAME` | Email or username |
| `JIRA_API_TOKEN` | API token from Jira account settings |
| `JIRA_EPICS` | Comma-separated epic keys (e.g. `EPIC-1,EPIC-2`) |

## Scripts

| Script | Purpose |
|--------|---------|
| `sync_from_jira.py` | Sync tickets from configured epics to `ticket_history/ticket_data/` |
| `build_ticket_manifest.py` | Build manifest from ticket JSON files |
| `gen_ready_for_release.py` | Generate markdown list of tickets in "Ready for Release" |
| `gen_regression_test_cases.py` | Generate regression test cases from bug/task tickets |

## Project Structure

```
jira-tools/
├── scripts/           # Python automation scripts
├── qa_prompts/         # QA prompt templates (76+ prompts)
├── ticket_history/
│   ├── ticket_data/   # Synced ticket JSON files
│   └── jira_ticket_manifest.json
└── reports/            # Generated markdown reports
```

## Usage

```bash
# Sync tickets from Jira (requires credentials)
python scripts/sync_from_jira.py

# Build manifest from local ticket data
python scripts/build_ticket_manifest.py

# Generate reports
python scripts/gen_ready_for_release.py
python scripts/gen_regression_test_cases.py
```

## Tech

Python 3.8+, OpenPyXL, Requests, Jira REST API
