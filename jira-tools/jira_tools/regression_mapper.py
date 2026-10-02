"""Maps release items to the regression suites they require, using a component -> suites map."""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path

from .model import WorkItem

ALWAYS = "smoke"


@dataclass(frozen=True)
class RegressionPlan:
    release: str
    suites: dict[str, list[str]]  # suite -> item keys that require it
    unmapped: list[str]  # items that need regression but have no mapped component

    @property
    def suite_names(self) -> list[str]:
        return sorted(self.suites, key=lambda s: (s != ALWAYS, s))


def load_map(path: str | Path) -> dict[str, list[str]]:
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    return {component: list(suites) for component, suites in data["components"].items()}


def regression_plan(items: list[WorkItem], release: str, component_map: dict[str, list[str]]) -> RegressionPlan:
    """Bugs and items flagged `regressionRequired` pull in every suite mapped to their components.
    The smoke suite always runs. Items that need regression but map to nothing are listed, never silently dropped."""
    suites: dict[str, list[str]] = {ALWAYS: []}
    unmapped: list[str] = []
    for item in (i for i in items if i.fix_version == release):
        if not (item.regression_required or item.type == "Bug"):
            continue
        mapped = sorted({s for c in item.components for s in component_map.get(c, [])})
        if not mapped:
            unmapped.append(item.key)
        for suite in mapped:
            suites.setdefault(suite, []).append(item.key)
    return RegressionPlan(release, suites, sorted(unmapped))


def format_regression_plan(plan: RegressionPlan) -> str:
    lines = [f"Regression plan: {plan.release}", ""]
    for suite in plan.suite_names:
        keys = plan.suites[suite]
        lines.append(f"  {suite:<22} {'always' if suite == ALWAYS else ', '.join(keys)}")
    if plan.unmapped:
        lines += ["", f"  NEEDS MAPPING: {', '.join(plan.unmapped)} (regression required, no component mapped)"]
    return "\n".join(lines)
