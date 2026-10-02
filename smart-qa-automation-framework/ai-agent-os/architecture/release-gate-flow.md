# Release-Gate Decision Flow

A documented decision flow used to determine whether a build is ready for release.

```mermaid
flowchart TD
    A[Release Candidate Build] --> B[Run Smoke Suite]
    B -->|fail| X1[Block Release<br/>Open P1 / P0 defect]
    B -->|pass| C[Run Regression Suite]
    C -->|critical fail| X1
    C -->|non-critical fail| D[Triage & Risk Review]
    C -->|pass| E[Run API Regression - Newman]
    E -->|contract break| X1
    E -->|pass| F[Run Performance Smoke - k6]
    F -->|regress beyond threshold| D
    F -->|pass| G[Data & Reporting Validation]
    G -->|fail| D
    G -->|pass| H[Manual UAT &<br/>Exploratory Charter]
    H -->|critical defect| X1
    H -->|minor known issues| D
    H -->|clean| Y[Release-Ready ✅]

    D -->|risk accepted| Z[Release with Known Risks ⚠]
    D -->|risk not accepted| X1
```

## Gate criteria summary

- **Release-Ready** — Smoke, regression, API, performance smoke, and data validation all pass; UAT clean.
- **Release with Known Risks** — Non-critical defects exist and risk is formally accepted with owner, workaround, and ETA.
- **Blocked** — Any critical defect (P0/P1) or contract break is open.
