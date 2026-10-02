# Module Template

A blank scaffold for adding a new business workflow ("module"). Each module gets two parallel trees:

- `tests/<module-name>/` for automation: page objects, components, flows, API clients, fixtures, data, specs.
- `qa-output/<module-name>/` for the human-readable QA record (readiness, blockers, story analysis, test plan,
  exploratory results, final report) plus evidence folders.

> This is a **blank template**, not an example run. It contains no results. The running, evidence-producing example
> of every automation layer is the framework itself (`../../src/`, `../../tests/`).

## Layout

```text
module-template/
├── tests/
│   └── module-name/
│       └── README.md        # which folders to create, with links to the running examples
└── qa-output/
    └── module-name/
        ├── 00_setup-and-readiness-check.md
        ├── 00_blockers-and-missing-details.md
        ├── 01_user-story-analysis.md
        ├── 02_test-plan.md
        ├── 03_exploratory-testing-results.md
        ├── 08_final-test-execution-report.md
        ├── defects/
        ├── network/
        ├── screenshots/
        ├── traces/
        └── videos/
```

## How to use

1. Copy `tests/module-name` to `tests/<your-module>` and `qa-output/module-name` to `qa-output/<your-module>`.
2. Fill the reports in order: `00_setup` → `00_blockers` → `01_user-story-analysis` → `02_test-plan` →
   `03_exploratory-testing-results` → automation under `tests/` → `08_final-test-execution-report`.
3. Replace every `{{placeholder}}`. Store evidence under `defects/`, `network/`, `screenshots/`, `traces/` and `videos/`;
   the final report may only reference evidence that exists.

## Confidentiality

The template holds structure only. A filled-in copy for real work stays in that work's own (private) repository.
