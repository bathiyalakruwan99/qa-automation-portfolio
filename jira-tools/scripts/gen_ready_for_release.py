"""Generate tickets_ready_for_release.md from ticket_data."""
import json
import os
from datetime import datetime

_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TICKET_HISTORY = os.path.join(_PROJECT_ROOT, 'ticket_history')
TICKETS_DIR = os.path.join(TICKET_HISTORY, 'ticket_data')
REPORTS_DIR = os.path.join(_PROJECT_ROOT, 'reports')
READY_STATUSES = {'ready for release', 'ready for lead review'}


def format_date(ts):
    if not ts:
        return "—"
    try:
        dt = datetime.fromisoformat(ts.replace('Z', '+00:00').replace('+0530', '+05:30'))
        return dt.strftime('%Y-%m-%d')
    except Exception:
        return ts[:10] if len(ts) >= 10 else ts


def get_changelogs(data):
    logs = data.get('changelogs', [])
    if logs:
        return logs
    return data.get('changelog', {}).get('histories', [])


def find_status_before_ready(data):
    """Get (RfR date, status before RfR) from changelog."""
    for changelog in sorted(get_changelogs(data), key=lambda x: x.get('created', '')):
        created = changelog.get('created', '')
        for item in changelog.get('items', []):
            if item.get('field') == 'status':
                to_val = item.get('to_string') or item.get('toString') or ''
                if to_val and 'ready for release' in to_val.lower():
                    from_val = item.get('from_string') or item.get('fromString') or ''
                    return format_date(created), from_val
    return "—", "—"


def main():
    os.makedirs(REPORTS_DIR, exist_ok=True)
    rows = []
    if not os.path.exists(TICKETS_DIR):
        print(f"No ticket data at {TICKETS_DIR}")
        return
    for fname in sorted(os.listdir(TICKETS_DIR)):
        if not fname.endswith('.json'):
            continue
        path = os.path.join(TICKETS_DIR, fname)
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        status = data.get('status') or {}
        status_name = (status.get('name') or '') if isinstance(status, dict) else str(status)
        if not status_name or status_name.lower() not in READY_STATUSES:
            continue
        key = data.get('key', fname.replace('.json', ''))
        summary = (data.get('summary') or '').strip()
        rfr_dt, was_before = find_status_before_ready(data)
        rows.append((key, summary, rfr_dt, was_before))

    rows.sort(key=lambda x: x[0])
    lines = [
        "# Tickets Ready for Release",
        "",
        "| Ticket ID | Summary | Ready Date | Previous Status |",
        "|-----------|---------|------------|-----------------|",
    ]
    for key, summary, rfr_dt, was_before in rows:
        lines.append(f"| {key} | {(summary[:60] + '...') if len(summary) > 60 else summary} | {rfr_dt} | {was_before} |")

    out_path = os.path.join(REPORTS_DIR, 'tickets_ready_for_release.md')
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(lines))
    print(f"Written {out_path} with {len(rows)} tickets")


if __name__ == '__main__':
    main()
