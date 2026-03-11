"""
Build a JSON manifest of all tickets in ticket_data.
Contains: ticket key, summary, status, updated, created.
"""

import json
import os
from datetime import datetime

_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TICKET_HISTORY = os.path.join(_PROJECT_ROOT, 'ticket_history')
TICKETS_DIR = os.path.join(TICKET_HISTORY, 'ticket_data')
MANIFEST_FILE = os.path.join(TICKET_HISTORY, 'jira_ticket_manifest.json')


def get_status_name(ticket: dict) -> str:
    """Get current/last status as string."""
    status = ticket.get('status')
    if status is None:
        return ''
    if isinstance(status, dict):
        return (status.get('name') or '').strip()
    return str(status).strip()


def load_all_tickets() -> list:
    """Load all ticket JSON files from ticket_data."""
    tickets = []
    if not os.path.exists(TICKETS_DIR):
        return tickets
    for filename in sorted(os.listdir(TICKETS_DIR)):
        if not filename.endswith('.json'):
            continue
        path = os.path.join(TICKETS_DIR, filename)
        try:
            with open(path, 'r', encoding='utf-8') as f:
                tickets.append(json.load(f))
        except Exception as e:
            print(f"Warning: skip {filename}: {e}")
    return tickets


def build_manifest() -> dict:
    """Build manifest dict from all tickets in ticket_data."""
    tickets_raw = load_all_tickets()
    entries = []
    for t in tickets_raw:
        key = t.get('key', '')
        if not key:
            continue
        status = get_status_name(t)
        updated = t.get('updated') or ''
        created = t.get('created') or ''
        summary = (t.get('summary') or '').strip()
        entries.append({
            'key': key,
            'summary': summary,
            'status': status,
            'updated': updated,
            'created': created,
        })
    entries.sort(key=lambda e: e.get('key', ''))
    ids_with_status = {e['key']: e['status'] for e in entries}
    return {
        'generated_at': datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ'),
        'source_dir': TICKETS_DIR,
        'ticket_count': len(entries),
        'ids_with_status': ids_with_status,
        'tickets': entries,
    }


def main():
    manifest = build_manifest()
    with open(MANIFEST_FILE, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    print(f"Manifest written: {MANIFEST_FILE}")
    print(f"  Tickets: {manifest['ticket_count']}")
    print(f"  Generated: {manifest['generated_at']}")


if __name__ == '__main__':
    main()
