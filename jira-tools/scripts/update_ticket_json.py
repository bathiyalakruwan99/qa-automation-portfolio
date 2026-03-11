"""
Update a single ticket JSON file with new field values.
Useful for: applying status updates, fixing metadata, merging changelog entries.

Usage:
  python update_ticket_json.py <ticket_key> --field status --value "In Progress"
  python update_ticket_json.py SAMPLE-001 --field summary --value "Updated summary"
"""

import argparse
import json
import os
from datetime import datetime

_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TICKETS_DIR = os.path.join(_PROJECT_ROOT, 'ticket_history', 'ticket_data')


def load_ticket(key: str) -> dict:
    """Load ticket JSON by key."""
    path = os.path.join(TICKETS_DIR, f'{key}.json')
    if not os.path.exists(path):
        raise FileNotFoundError(f"Ticket not found: {path}")
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_ticket(key: str, data: dict) -> None:
    """Save ticket JSON."""
    path = os.path.join(TICKETS_DIR, f'{key}.json')
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def update_field(data: dict, field: str, value: str) -> None:
    """Update a top-level field."""
    if field == 'status':
        data['status'] = {'name': value}
    elif field == 'summary':
        data['summary'] = value
    elif field == 'updated':
        data['updated'] = value
    else:
        data[field] = value


def add_changelog_entry(data: dict, from_status: str, to_status: str) -> None:
    """Append a status change to changelog."""
    now = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S.000Z')
    entry = {
        'created': now,
        'items': [
            {'field': 'status', 'fromString': from_status, 'toString': to_status}
        ]
    }
    logs = data.get('changelogs', [])
    if not logs:
        logs = data.get('changelog', {}).get('histories', [])
    logs.append(entry)
    data['changelogs'] = logs
    data['status'] = {'name': to_status}
    data['updated'] = now


def main():
    parser = argparse.ArgumentParser(description='Update ticket JSON')
    parser.add_argument('key', help='Ticket key (e.g. SAMPLE-001)')
    parser.add_argument('--field', '-f', help='Field to update')
    parser.add_argument('--value', '-v', help='New value')
    parser.add_argument('--status-change', nargs=2, metavar=('FROM', 'TO'),
                        help='Add status change: from_status to_status')
    args = parser.parse_args()

    data = load_ticket(args.key)

    if args.status_change:
        from_s, to_s = args.status_change
        add_changelog_entry(data, from_s, to_s)
        print(f"Added changelog: {from_s} -> {to_s}")
    elif args.field and args.value:
        update_field(data, args.field, args.value)
        print(f"Updated {args.field} = {args.value}")
    else:
        print("Use --field/--value or --status-change")
        return

    save_ticket(args.key, data)
    print(f"Saved {args.key}.json")


if __name__ == '__main__':
    main()
