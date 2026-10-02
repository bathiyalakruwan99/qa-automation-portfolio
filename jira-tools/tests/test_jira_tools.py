from __future__ import annotations

import json
from dataclasses import replace
from datetime import UTC, datetime
from pathlib import Path

import pytest

from jira_tools.__main__ import main
from jira_tools.model import DataError, Transition, WorkItem, load_items
from jira_tools.regression_mapper import load_map, regression_plan
from jira_tools.release_report import assess, release_report
from jira_tools.status_history import summarize

DATA = Path(__file__).resolve().parent.parent / "sample-data"
ITEMS = load_items(DATA / "sample-issues.json")
BY_KEY = {i.key: i for i in ITEMS}
NOW = datetime(2026, 10, 2, 12, tzinfo=UTC)


def item(**changes: object) -> WorkItem:
    base = WorkItem("DEMO-900", "Fictional item", "Story", "Verified", "Major", "2026.10")
    return replace(base, **changes)


def t(day: int, hour: int, frm: str | None, to: str) -> Transition:
    return Transition(datetime(2026, 9, day, hour, tzinfo=UTC), frm, to)


def test_jira_001_verified_item_is_ready():
    assert assess(item(), {}).state == "READY"


@pytest.mark.parametrize("status", ["To Do", "In Progress", "In Review", "In QA", "Reopened"])
def test_jira_002_open_items_are_not_ready(status):
    assert assess(item(status=status), {}).state == "NOT_READY"


def test_jira_003_bug_must_be_verified_not_just_done():
    assert assess(item(type="Bug", status="Done"), {}).state == "NOT_READY"
    assert assess(item(type="Task", status="Done"), {}).state == "READY"


def test_jira_004_open_critical_defect_blocks_even_a_verified_item():
    defect = item(key="DEMO-901", type="Bug", status="In Progress", priority="Critical")
    result = assess(item(open_defects=("DEMO-901",)), {"DEMO-901": defect})
    assert result.state == "BLOCKED" and "DEMO-901" in result.reason


def test_jira_005_minor_open_defect_or_known_issue_label_is_ready_with_risk():
    minor = item(key="DEMO-902", type="Bug", status="To Do", priority="Minor")
    assert assess(item(open_defects=("DEMO-902",)), {"DEMO-902": minor}).state == "READY_WITH_RISK"
    assert assess(item(labels=("known-issue",)), {}).state == "READY_WITH_RISK"


def test_jira_006_recommendation_is_never_an_approval():
    sample = release_report(ITEMS, "2026.10")
    assert sample.recommendation == "HOLD"
    ready = release_report([item(key=f"DEMO-9{i}") for i in range(3)], "2026.10")
    assert ready.recommendation == "READY FOR HUMAN SIGN-OFF"
    risky = release_report([item(), item(key="DEMO-950", labels=("known-issue",))], "2026.10")
    assert risky.recommendation.startswith("READY WITH KNOWN RISK")
    for report in (sample, ready, risky):
        assert "APPROVED" not in report.recommendation.upper()


def test_jira_007_release_scope_is_by_fix_version():
    report = release_report(ITEMS, "2026.10")
    keys = {r.key for r in report.rows}
    assert "DEMO-110" not in keys and "DEMO-111" not in keys
    assert len(keys) == 10
    assert [r.state for r in report.rows][0] == "BLOCKED", "most severe first"


def test_jira_008_regression_plan_maps_components_and_reports_gaps():
    plan = regression_plan(ITEMS, "2026.10", load_map(DATA / "regression-map.json"))
    assert plan.suite_names[0] == "smoke"
    assert set(plan.suites["shipments-api"]) == {"DEMO-101", "DEMO-104", "DEMO-106", "DEMO-112"}
    assert "DEMO-107" not in {k for keys in plan.suites.values() for k in keys}, "task without regression flag"
    assert plan.unmapped == ["DEMO-109"], "items needing regression must never be silently dropped"


def test_jira_009_bugs_always_need_regression():
    plan = regression_plan([item(type="Bug", components=("Billing",))], "2026.10", {"Billing": ["billing"]})
    assert plan.suites["billing"] == ["DEMO-900"]


def test_jira_010_status_history_durations_and_reopens():
    reopened = item(
        status="Verified",
        history=(
            t(1, 9, None, "In Progress"),
            t(2, 9, "In Progress", "In QA"),
            t(3, 9, "In QA", "Verified"),
            t(4, 9, "Verified", "Reopened"),
            t(4, 21, "Reopened", "In QA"),
            t(5, 9, "In QA", "Verified"),
        ),
    )
    summary = summarize(reopened, now=datetime(2026, 9, 6, 9, tzinfo=UTC))
    assert summary.hours_in_status == {"In Progress": 24.0, "In QA": 36.0, "Verified": 48.0, "Reopened": 12.0}
    assert summary.reopen_count == 1 and "REOPENED x1" in summary.flags


def test_jira_011_long_in_qa_flag_uses_the_threshold():
    stuck = item(status="In QA", history=(t(28, 12, None, "In QA"),))
    assert any(f.startswith("LONG_IN_QA") for f in summarize(stuck, NOW).flags)
    assert not summarize(stuck, NOW, long_in_qa_hours=200).flags


def test_jira_012_history_that_disagrees_with_status_is_flagged():
    odd = item(status="Verified", history=(t(1, 9, None, "In QA"),))
    assert any(f.startswith("HISTORY_MISMATCH") for f in summarize(odd, NOW).flags)


def test_jira_013_bad_data_is_rejected_with_every_problem(tmp_path):
    bad = tmp_path / "issues.json"
    bad.write_text(
        json.dumps(
            {
                "issues": [
                    {"key": "DEMO-1"},
                    {
                        "key": "DEMO-2",
                        "summary": "x",
                        "type": "Bug",
                        "status": "Closed",
                        "priority": "Minor",
                        "fixVersion": "1",
                    },
                ]
            }
        )
    )
    with pytest.raises(DataError) as e:
        load_items(bad)
    assert "DEMO-1: missing" in str(e.value) and "unknown status 'Closed'" in str(e.value)
    assert main(["release-report", "--issues", str(bad)]) == 2


def test_jira_014_cli_exit_codes(capsys):
    assert main(["release-report"]) == 1
    assert main(["regression-plan"]) == 0
    assert main(["status-history", "--now", "2026-10-02T12:00:00Z"]) == 0
    assert "LONG_IN_QA" in capsys.readouterr().out


def test_sample_data_has_only_fictional_keys():
    assert all(i.key.startswith("DEMO-") for i in ITEMS)
