# Jira QA Automation Tools

Python tools for syncing Jira tickets, generating reports, and managing QA workflows. Uses the Jira REST API to fetch tickets from epics, build manifests, and produce markdown reports.

## Features

- **Ticket sync** — Fetch tickets from Jira epics into local JSON
- **Ticket history** — Export ticket data and status changes to Excel (10+ sample tickets)
- **Manifest builder** — Build a JSON manifest of all synced tickets
- **Data gathering & updates** — Scripts to update ticket JSONs and refresh manifests
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
| `export_ticket_history_to_excel.py` | Export ticket data + status history to Excel |
| `update_ticket_json.py` | Update ticket JSON fields or add status changelog entries |
| `gen_ready_for_release.py` | Generate markdown list of tickets in "Ready for Release" |
| `gen_regression_test_cases.py` | Generate regression test cases from bug/task tickets |

## Project Structure

```
jira-tools/
├── scripts/           # Python automation scripts
├── qa_prompts/         # QA prompt templates (76+ prompts)
├── samples/            # Sample Excel outputs
│   ├── ticket_history_sample.xlsx   # 10+ rows: ticket data + status history
│   ├── regression_test_cases_sample.xlsx
│   └── tickets_ready_for_release_sample.xlsx
├── ticket_history/
│   ├── ticket_data/   # 10 sample ticket JSONs (SAMPLE-001 … SAMPLE-010)
│   └── jira_ticket_manifest.json
└── reports/            # Generated markdown reports
```

## Sample Files

The `samples/` folder contains example Excel outputs:

- **`ticket_history_sample.xlsx`** — Ticket history with 10+ rows: Ticket ID, Summary, Type, Priority, Status, Created, Updated, Status Change Date, From Status, To Status
- `regression_test_cases_sample.xlsx` — Example regression test cases (ID, Title, Module, Expected, Actual)
- `tickets_ready_for_release_sample.xlsx` — Example ready-for-release list (Ticket ID, Summary, Ready Date, Previous Status)

The `ticket_history/ticket_data/` folder has 10 sample ticket JSONs (SAMPLE-001 through SAMPLE-010) with varied statuses, changelogs, and modules.

## Usage

```bash
# Sync tickets from Jira (requires credentials)
python scripts/sync_from_jira.py

# Build manifest from local ticket data
python scripts/build_ticket_manifest.py

# Export ticket history to Excel
python scripts/export_ticket_history_to_excel.py

# Update a ticket JSON (add status change or edit field)
python scripts/update_ticket_json.py SAMPLE-001 --status-change "To Do" "In Progress"
python scripts/update_ticket_json.py SAMPLE-001 --field summary --value "New summary"

# Generate reports
python scripts/gen_ready_for_release.py
python scripts/gen_regression_test_cases.py
```

## Tech

Python 3.8+, OpenPyXL, Requests, Jira REST API
