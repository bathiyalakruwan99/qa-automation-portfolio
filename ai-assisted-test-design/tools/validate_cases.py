"""Validate a test-case set against the schema AND the human-review governance rules.

python tools/validate_cases.py examples/ai-draft.json --requirement examples/requirement.json

The schema checks shape. The governance rules check what a schema cannot: that cases trace to acceptance criteria
that really exist (AI must not invent them), that every criterion is covered, and that nothing is marked APPROVED
without a named human reviewer for every case.

Exit codes: 0 no errors, 1 errors, 2 unreadable input.
"""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass
from pathlib import Path

from jsonschema import Draft202012Validator

SCHEMA = json.loads((Path(__file__).resolve().parent.parent / "schemas" / "test-case.schema.json").read_text())


@dataclass(frozen=True)
class Finding:
    severity: str  # ERROR | WARNING
    code: str
    where: str
    message: str


def schema_findings(doc: dict) -> list[Finding]:
    validator = Draft202012Validator(SCHEMA)
    return [
        Finding("ERROR", "SCHEMA", "/" + "/".join(str(p) for p in e.absolute_path), e.message)
        for e in sorted(validator.iter_errors(doc), key=lambda e: list(e.absolute_path))
    ]


def governance_findings(doc: dict, requirement: dict) -> list[Finding]:
    found: list[Finding] = []
    known_ac = {ac["id"] for ac in requirement["acceptanceCriteria"]}
    cases = doc["cases"]

    if doc["requirementId"] != requirement["id"]:
        found.append(
            Finding(
                "ERROR",
                "WRONG_REQUIREMENT",
                "/requirementId",
                f"cases are for {doc['requirementId']}, requirement file is {requirement['id']}",
            )
        )

    seen_ids: set[str] = set()
    covered: dict[str, set[str]] = {ac: set() for ac in known_ac}
    for case in cases:
        where = case["id"]
        if case["id"] in seen_ids:
            found.append(Finding("ERROR", "DUPLICATE_ID", where, "case id used twice"))
        seen_ids.add(case["id"])
        for ac in case["traceability"]["acceptanceCriteria"]:
            if ac not in known_ac:
                found.append(
                    Finding(
                        "ERROR",
                        "INVENTED_ACCEPTANCE_CRITERION",
                        where,
                        f"{ac} is not in {requirement['id']}; cases may only trace to stated criteria",
                    )
                )
            else:
                covered[ac].add(case["type"])
        if (case["confidence"] == "low" or case.get("openQuestions")) and not case.get("review", {}).get("notes"):
            found.append(
                Finding(
                    "WARNING",
                    "UNCERTAINTY_NOT_RESOLVED",
                    where,
                    "low confidence or open questions need reviewer notes before approval",
                )
            )

    for ac, types in sorted(covered.items()):
        if not types:
            found.append(Finding("ERROR", "COVERAGE_GAP", ac, "no test case covers this acceptance criterion"))
        elif not types & {"negative", "boundary"}:
            found.append(
                Finding("WARNING", "POSITIVE_ONLY", ac, "only positive/workflow cases; add a negative or boundary case")
            )

    if doc["reviewStatus"] == "APPROVED":
        unreviewed = [c["id"] for c in cases if c.get("review", {}).get("decision") != "approve"]
        if unreviewed:
            found.append(
                Finding(
                    "ERROR",
                    "APPROVED_WITHOUT_HUMAN_REVIEW",
                    "/reviewStatus",
                    f"APPROVED but not approved by a human reviewer: {', '.join(unreviewed)}",
                )
            )
        unresolved = [f.where for f in found if f.code == "UNCERTAINTY_NOT_RESOLVED"]
        if unresolved:
            found.append(
                Finding(
                    "ERROR",
                    "APPROVED_WITH_OPEN_UNCERTAINTY",
                    "/reviewStatus",
                    f"APPROVED while uncertainty is unresolved: {', '.join(unresolved)}",
                )
            )
    return found


def validate(doc: dict, requirement: dict) -> list[Finding]:
    shape = schema_findings(doc)
    if shape:
        return shape  # governance rules need a well-formed document
    order = {"ERROR": 0, "WARNING": 1}
    return sorted(governance_findings(doc, requirement), key=lambda f: (order[f.severity], f.code, f.where))


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate a test-case set against schema and governance rules.")
    parser.add_argument("cases")
    parser.add_argument("--requirement", required=True)
    args = parser.parse_args(argv)
    try:
        doc = json.loads(Path(args.cases).read_text(encoding="utf-8"))
        requirement = json.loads(Path(args.requirement).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as e:
        print(f"Cannot read input: {e}", file=sys.stderr)
        return 2
    findings = validate(doc, requirement)
    errors = [f for f in findings if f.severity == "ERROR"]
    print(f"{Path(args.cases).name}: {len(doc.get('cases', []))} case(s), status {doc.get('reviewStatus')}")
    for f in findings:
        print(f"  [{f.severity}] {f.code} {f.where}: {f.message}")
    print(f"Result: {'FAIL' if errors else 'PASS'} ({len(errors)} error(s), {len(findings) - len(errors)} warning(s))")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
