# QA Output (Sample Structure)

Human-readable QA outputs and structured evidence produced by the Smart QA Agent OS workflow.

> Synthetic example for portfolio demonstration. All content is fictional. No real test results, screenshots, traces, network captures, or defect reports are included.

## Folder Layout

```
qa-output/
├── README.md
├── demo-store-checkout/          # Module-level QA output
│   ├── 00_setup-and-readiness-check.md
│   ├── 00_blockers-and-missing-details.md
│   ├── 01_user-story-analysis.md
│   ├── 02_test-plan.md
│   ├── 03_exploratory-testing-results.md
│   ├── 08_final-test-execution-report.md
│   ├── defects/
│   │   └── BUG-DEMO-001.md
│   ├── network/
│   │   └── .gitkeep
│   ├── screenshots/
│   │   └── .gitkeep
│   ├── traces/
│   │   └── .gitkeep
│   └── videos/
│       └── .gitkeep
├── run-notes/
│   └── 2026-06-15-demo-checkout-run.md
├── skill-agent-reports/
│   └── 2026-06-15.md
├── dom-captures/
│   ├── selector-evidence.md
│   └── selector-recommendations.md
└── playwright-results.json       # Sanitized execution summary
```

## How Output Is Produced

1. The QA Router creates a module folder under `qa-output/<module>/`.
2. Each stage of the workflow writes its output file in numbered order.
3. Evidence (traces, screenshots, network logs, videos) is stored in the respective subfolders.
4. Defects are written as individual markdown files under `defects/`.
5. The final report (`08_final-test-execution-report.md`) summarises all results.
6. Run notes and skill-agent reports capture cross-module observations.

## Confidentiality

All files in this directory are synthetic. Real QA outputs from private products are never published.
