# Module Template

A reusable scaffold for adding a new business workflow ("module") to Smart QA Agent OS. Each module gets two parallel trees:

- A `tests/<module-name>/` tree for automation assets (Playwright POM, API clients, fixtures, BDD features, test data).
- A `qa-output/<module-name>/` tree for human-readable QA outputs (analysis, plans, exploratory notes, final reports) plus structured evidence folders.

> Synthetic example for portfolio demonstration. Replace `<module-name>` with a real module slug when used in private work.

## Folder Layout

```
module-template/
├── tests/
│   └── <module-name>/
│       ├── api/
│       ├── components/
│       ├── data/
│       ├── features/        # BDD feature files
│       ├── fixtures/
│       ├── pages/           # Page Object Models
│       ├── specs/           # Playwright spec files
│       ├── steps/           # BDD step definitions
│       ├── test-cases/      # Markdown test case docs
│       └── utils/
└── qa-output/
    └── <module-name>/
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

## How to Use

1. Copy `module-template/tests/<module-name>` to `tests/<your-module>`.
2. Copy `module-template/qa-output/<module-name>` to `qa-output/<your-module>`.
3. Fill the templates in order: `00_setup` -> `01_user-story-analysis` -> `02_test-plan` -> `03_exploratory-testing-results` -> automation under `tests/` -> `08_final-test-execution-report`.
4. Store evidence under `defects/`, `network/`, `screenshots/`, `traces/`, `videos/`.

## Confidentiality

All template content is synthetic. The structure is what is being demonstrated, not any real module.
