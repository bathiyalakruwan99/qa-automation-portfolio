"""Generate regression test cases MD and CSV from bug/task tickets."""
import csv
import json
import os
import re

_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TICKET_HISTORY = os.path.join(_PROJECT_ROOT, 'ticket_history')
TICKETS_DIR = os.path.join(TICKET_HISTORY, 'ticket_data')
REPORTS_DIR = os.path.join(_PROJECT_ROOT, 'reports')


def clean_text(s):
    """Remove markdown, images, Jira tags, extra whitespace."""
    if not s:
        return ""
    s = re.sub(r'!\w+-\w+\.png[^!]*', '', s)
    s = re.sub(r'\*+', '', s)
    s = re.sub(r'\[([^\]]+)\]\s*\([^)]+\)', r'\1', s)
    s = re.sub(r'\[~[^\]]+\]', '', s)
    s = re.sub(r'\{color:[^}]+\}', '', s)
    s = re.sub(r'\s+', ' ', s).strip()
    return s[:500] if len(s) > 500 else s


def extract_module(summary):
    """Extract module from summary pattern."""
    m = re.search(r'\[([^\]]+)\]', summary)
    return m.group(1) if m else "General"


def parse_expected_actual(desc):
    """Extract expected and actual from description."""
    expected, actual = [], []
    for line in (desc or "").split('\n'):
        line = line.strip()
        if 'Expected:' in line:
            expected.append(clean_text(re.sub(r'.*Expected:?\s*', '', line)))
        elif 'Actual:' in line:
            actual.append(clean_text(re.sub(r'.*Actual:?\s*', '', line)))
    return '; '.join(expected) if expected else '', '; '.join(actual) if actual else ''


def main():
    os.makedirs(REPORTS_DIR, exist_ok=True)
    test_cases = []
    if not os.path.exists(TICKETS_DIR):
        print(f"No ticket data at {TICKETS_DIR}")
        return
    for fname in sorted(os.listdir(TICKETS_DIR)):
        if not fname.endswith('.json'):
            continue
        path = os.path.join(TICKETS_DIR, fname)
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        key = data.get('key', fname.replace('.json', ''))
        summary = (data.get('summary') or '').strip()
        desc = data.get('description') or ''
        issue_type = data.get('issue_type') or {}
        type_name = (issue_type.get('name') or '') if isinstance(issue_type, dict) else ''
        if type_name and 'bug' not in type_name.lower() and 'task' not in type_name.lower():
            continue
        module = extract_module(summary)
        title = clean_text(summary)
        expected, actual = parse_expected_actual(desc)
        test_cases.append({
            'id': key,
            'title': title,
            'module': module,
            'expected': expected,
            'actual': actual,
        })

    # Write CSV
    csv_path = os.path.join(REPORTS_DIR, 'regression_test_cases.csv')
    with open(csv_path, 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=['id', 'title', 'module', 'expected', 'actual'])
        w.writeheader()
        w.writerows(test_cases)
    print(f"Written {csv_path} with {len(test_cases)} test cases")

    # Write MD
    md_path = os.path.join(REPORTS_DIR, 'regression_test_cases.md')
    lines = ["# Regression Test Cases", "", "| ID | Title | Module | Expected | Actual |", "|----|-------|--------|----------|--------|"]
    for tc in test_cases:
        t = tc['title'][:50] + '...' if len(tc['title']) > 50 else tc['title']
        e = tc['expected'][:30] + '...' if len(tc['expected']) > 30 else tc['expected']
        a = tc['actual'][:30] + '...' if len(tc['actual']) > 30 else tc['actual']
        lines.append(f"| {tc['id']} | {t} | {tc['module']} | {e} | {a} |")
    with open(md_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(lines))
    print(f"Written {md_path}")


if __name__ == '__main__':
    main()
