from __future__ import annotations

import copy
import json
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from validate_cases import main, validate  # noqa: E402

REQ = json.loads((ROOT / "examples" / "requirement.json").read_text())
DRAFT = json.loads((ROOT / "examples" / "ai-draft.json").read_text())
REVIEWED = json.loads((ROOT / "examples" / "reviewed.json").read_text())


def codes(doc: dict) -> set[str]:
    return {f.code for f in validate(doc, REQ)}


def errors(doc: dict) -> set[str]:
    return {f.code for f in validate(doc, REQ) if f.severity == "ERROR"}


def test_ai_001_reviewed_set_passes_with_no_findings():
    assert validate(REVIEWED, REQ) == []


def test_ai_002_self_approved_ai_draft_is_rejected_for_each_governance_reason():
    assert errors(DRAFT) == {
        "APPROVED_WITHOUT_HUMAN_REVIEW",
        "APPROVED_WITH_OPEN_UNCERTAINTY",
        "COVERAGE_GAP",
        "INVENTED_ACCEPTANCE_CRITERION",
    }


def test_ai_003_invented_acceptance_criterion_is_an_error_even_in_a_draft():
    doc = copy.deepcopy(REVIEWED)
    doc["reviewStatus"] = "DRAFT"
    doc["cases"][0]["traceability"]["acceptanceCriteria"] = ["AC-42"]
    assert "INVENTED_ACCEPTANCE_CRITERION" in errors(doc)


def test_ai_004_every_acceptance_criterion_needs_a_case():
    doc = copy.deepcopy(REVIEWED)
    doc["cases"] = [c for c in doc["cases"] if "AC-4" not in c["traceability"]["acceptanceCriteria"]]
    found = [f for f in validate(doc, REQ) if f.code == "COVERAGE_GAP"]
    assert [f.where for f in found] == ["AC-4"]


def test_ai_005_approval_needs_a_human_decision_on_every_case():
    doc = copy.deepcopy(REVIEWED)
    del doc["cases"][2]["review"]
    assert "APPROVED_WITHOUT_HUMAN_REVIEW" in errors(doc)
    doc["cases"][2]["review"] = {"reviewer": "QA reviewer", "decision": "change"}
    assert "APPROVED_WITHOUT_HUMAN_REVIEW" in errors(doc), "'change' is not an approval"


def test_ai_006_a_draft_may_be_unreviewed():
    doc = copy.deepcopy(DRAFT)
    doc["reviewStatus"] = "DRAFT"
    assert "APPROVED_WITHOUT_HUMAN_REVIEW" not in codes(doc)
    assert "APPROVED_WITH_OPEN_UNCERTAINTY" not in codes(doc)


def test_ai_007_uncertainty_needs_reviewer_notes():
    doc = copy.deepcopy(REVIEWED)
    doc["cases"][0]["confidence"] = "low"
    assert "APPROVED_WITH_OPEN_UNCERTAINTY" in errors(doc)
    doc["cases"][0]["review"]["notes"] = "Confirmed against the validator."
    assert "APPROVED_WITH_OPEN_UNCERTAINTY" not in errors(doc)


def test_ai_008_positive_only_coverage_is_a_warning():
    doc = copy.deepcopy(REVIEWED)
    for case in doc["cases"]:
        case["type"] = "positive"
    warnings = {f.where for f in validate(doc, REQ) if f.code == "POSITIVE_ONLY"}
    assert warnings == {"AC-1", "AC-2", "AC-3", "AC-4"}
    assert "POSITIVE_ONLY" not in errors(doc)


@pytest.mark.parametrize(
    "mutate",
    [
        lambda d: d.update(reviewStatus="SHIPPED"),
        lambda d: d["cases"][0].update(id="CASE-1"),
        lambda d: d["cases"][0].update(steps=[]),
        lambda d: d["cases"][0]["traceability"].update(acceptanceCriteria=[]),
        lambda d: d["cases"][0].update(confidence="certain"),
        lambda d: d["cases"][0].update(extraField=True),
    ],
)
def test_ai_009_schema_rejects_malformed_documents(mutate):
    doc = copy.deepcopy(REVIEWED)
    mutate(doc)
    assert codes(doc) == {"SCHEMA"}


def test_ai_010_duplicate_case_ids_and_wrong_requirement():
    doc = copy.deepcopy(REVIEWED)
    doc["cases"][1]["id"] = doc["cases"][0]["id"]
    doc["requirementId"] = "REQ-OTHER"
    assert {"DUPLICATE_ID", "WRONG_REQUIREMENT"} <= errors(doc)


def test_ai_011_cli_exit_codes(tmp_path):
    req = str(ROOT / "examples" / "requirement.json")
    assert main([str(ROOT / "examples" / "reviewed.json"), "--requirement", req]) == 0
    assert main([str(ROOT / "examples" / "ai-draft.json"), "--requirement", req]) == 1
    broken = tmp_path / "broken.json"
    broken.write_text("{not json")
    assert main([str(broken), "--requirement", req]) == 2


def test_prompts_forbid_inventing_criteria_and_self_approval():
    prompts = {p.name: p.read_text(encoding="utf-8") for p in (ROOT / "prompts").glob("*.md")}
    assert len(prompts) == 4
    generation = prompts["scenario-generation.md"]
    assert "Never create a new AC ID" in generation and "Never set `APPROVED`" in generation
    assert all("{{" in text for text in prompts.values()), "templates use placeholders, not real requirements"
