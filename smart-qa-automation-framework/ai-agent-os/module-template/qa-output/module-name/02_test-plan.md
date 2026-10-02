# 02 - Test Plan: {{MODULE_NAME}}

> Blank template. Every case traces to an acceptance criterion from `01_user-story-analysis.md`.

## Scope

{{what is tested, at which layers (UI / API / hybrid), and what is not}}

## Test cases

| ID | Title | Traces to | Type | Priority | Layer | Automated? |
| --- | --- | --- | --- | --- | --- | --- |
| TC-01 | {{title}} | AC-1 | positive / negative / boundary / workflow | P1 / P2 / P3 | UI / API / hybrid | yes / no / planned |

## Coverage check

- [ ] Every acceptance criterion has at least one case
- [ ] Every criterion with a limit has boundary cases (at, just inside, just outside)
- [ ] Every criterion has at least one negative case

## Entry / exit criteria

- Entry: `00_setup-and-readiness-check.md` signed off.
- Exit: {{e.g. all P1 executed and passed, no open P1/P2 defects, evidence stored for every failure}}
