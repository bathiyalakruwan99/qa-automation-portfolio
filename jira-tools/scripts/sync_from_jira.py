"""
Sync Jira tickets from configured epics to ticket_data.
Epic keys are read from JIRA_EPICS env (comma-separated).
"""

import json
import os
import base64
import sys
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TICKET_HISTORY = os.path.join(_PROJECT_ROOT, 'ticket_history')
TICKET_DATA_DIR = os.path.join(TICKET_HISTORY, 'ticket_data')
MANIFEST_PATH = os.path.join(TICKET_HISTORY, 'jira_ticket_manifest.json')


def get_epic_keys():
    """Get epic keys from JIRA_EPICS env (comma-separated)."""
    epics = os.environ.get('JIRA_EPICS', '').strip()
    if not epics:
        print('ERROR: Set JIRA_EPICS (comma-separated epic keys, e.g. EPIC-1,EPIC-2)')
        sys.exit(1)
    return [k.strip() for k in epics.split(',') if k.strip()]


def get_credentials():
    """Get Jira credentials from env."""
    url = os.environ.get('JIRA_URL') or os.environ.get('ATLASSIAN_BASE_URL')
    user = os.environ.get('JIRA_USERNAME') or os.environ.get('ATLASSIAN_EMAIL')
    token = os.environ.get('JIRA_API_TOKEN') or os.environ.get('ATLASSIAN_API_TOKEN')
    if not url or not user or not token:
        print('ERROR: Set JIRA_URL, JIRA_USERNAME, JIRA_API_TOKEN')
        sys.exit(1)
    return url.rstrip('/'), user, token


def jira_request(url_base, path, auth, method='GET'):
    """Make authenticated Jira REST API request."""
    url = f'{url_base}{path}'
    req = Request(url, method=method)
    req.add_header('Authorization', 'Basic ' + base64.b64encode(f'{auth[1]}:{auth[2]}'.encode()).decode())
    req.add_header('Accept', 'application/json')
    req.add_header('Content-Type', 'application/json')
    try:
        with urlopen(req, timeout=60) as resp:
            return json.loads(resp.read().decode())
    except HTTPError as e:
        body = e.read().decode() if e.fp else ''
        raise RuntimeError(f'Jira API error {e.code}: {body[:500]}')
    except URLError as e:
        raise RuntimeError(f'Jira request failed: {e.reason}')


def get_linked_keys_from_epic(url_base, auth, epic_key):
    """Get linked issue keys from epic (issuelinks)."""
    path = f'/rest/api/2/issue/{epic_key}?fields=issuelinks'
    data = jira_request(url_base, path, auth)
    links = (data.get('fields') or {}).get('issuelinks', []) or []
    keys = {epic_key}
    for link in links:
        for node in [link.get('inwardIssue'), link.get('outwardIssue')]:
            if node and node.get('key'):
                keys.add(node['key'])
    return keys


def fetch_full_issue(url_base, auth, issue_key):
    """Fetch full issue with changelog and comments."""
    path = f'/rest/api/2/issue/{issue_key}?expand=changelog'
    data = jira_request(url_base, path, auth)
    fields = data.get('fields', {})
    return {
        'id': data.get('id'),
        'key': data.get('key'),
        'summary': (fields.get('summary') or '').strip(),
        'description': fields.get('description'),
        'status': fields.get('status'),
        'issue_type': fields.get('issuetype'),
        'priority': fields.get('priority'),
        'assignee': fields.get('assignee'),
        'reporter': fields.get('reporter'),
        'created': fields.get('created', ''),
        'updated': fields.get('updated', ''),
        'url': data.get('self', ''),
        'changelogs': data.get('changelog', {}).get('histories', []),
        'comments': (fields.get('comment') or {}).get('comments', []),
        'issuelinks': fields.get('issuelinks', []),
    }


def main():
    os.makedirs(TICKET_DATA_DIR, exist_ok=True)
    auth = get_credentials()
    url_base = auth[0]
    epic_keys = get_epic_keys()

    all_keys = set()
    for epic in epic_keys:
        keys = get_linked_keys_from_epic(url_base, auth, epic)
        all_keys.update(keys)
        print(f'  {epic}: {len(keys)} linked issues')

    print(f'Total unique keys: {len(all_keys)}')

    for key in sorted(all_keys):
        try:
            issue = fetch_full_issue(url_base, auth, key)
            out_path = os.path.join(TICKET_DATA_DIR, f'{key}.json')
            with open(out_path, 'w', encoding='utf-8') as f:
                json.dump(issue, f, indent=2, ensure_ascii=False)
            print(f'Saved {key}')
        except Exception as e:
            print(f'ERROR fetching {key}: {e}')

    print('Done! Run build_ticket_manifest.py to update manifest.')


if __name__ == '__main__':
    main()
