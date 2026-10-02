# QA Workflow Diagrams

> Moved from the root README to keep it short. Diagrams show workflow shape only, with fictional names. They describe QA approaches; they are not screenshots or exports from any real system.

Diagrams and synthetic reports only. No source code, real data, endpoints, or screenshots. All names are fictional (`Vehicle-001`, `Warehouse Alpha`, `Customer Site Beta`, `Zone Gamma`, `Order DEMO-1001`, `DEMO-JOB-1001`).

## Smart QA Agent OS Architecture

```mermaid
flowchart TB
    Req[Requirement Intake] --> Router[QA Router / Orchestration]
    Router --> Discovery[Discovery: browser, flow, DOM]
    Router --> Design[Test Design: cases, BDD, POM]
    Design --> Auto[Automation: Playwright, API, hybrid]
    Auto --> Exec[Execution]
    Exec --> Invest[Investigation: failure classification]
    Invest --> Heal[Locator healing investigation]
    Exec --> Report[Reporting + Release Gate]
    Report --> Memory[QA Memory: verified, human-approved]
    Memory --> Router
    Heal --> Review[Human QA review and approval]
    Report --> Review
    Memory --> Review
```

## Requirement → Test Design → Human Review → Evidence → Memory

```mermaid
flowchart LR
    R[Requirement] --> TD[Test Design]
    TD --> HR[Human Review]
    HR --> EV[Evidence]
    EV --> MEM[QA Memory]
    MEM --> R
```

## Locator Healing Investigation Flow

```mermaid
flowchart TD
    Fail[Test fails: element not found] --> Inv[Investigate DOM + workflow change]
    Inv --> Cause{Root cause?}
    Cause -->|DOM change| Sug[Suggest safer locator]
    Cause -->|Timing| Wait[Suggest wait/condition fix]
    Cause -->|Real defect| Def[Raise defect instead]
    Sug --> Rev[Human QA review]
    Wait --> Rev
    Rev -->|Approved| Apply[Apply change]
    Rev -->|Rejected| Keep[Keep current locator]
```

## GPS Simulation Flow

```mermaid
flowchart LR
    Plan[Plan route: Warehouse Alpha to Customer Site Beta] --> Build[Build road-aware path]
    Build --> Sim[Simulate GPS stream for Vehicle-001]
    Sim --> Geo[Geofence entry/exit: Zone Gamma]
    Sim --> Off[Off-route then rejoin scenario]
    Geo --> Ev[Capture path data + map evidence]
    Off --> Ev
```

## Route Validation Flow

```mermaid
flowchart TD
    In[Orders + Vehicles] --> Cmp[Independent comparison]
    Cmp --> Dist[Distance]
    Cmp --> Cost[Cost per km]
    Cmp --> Cap[Capacity + vehicle suitability]
    Cmp --> Feas[Route feasibility + allocation]
    Dist --> Rep[QA comparison report]
    Cost --> Rep
    Cap --> Rep
    Feas --> Rep
    Rep --> Find[Finding: lower distance can mean higher cost]
```

## Job Master Validation Pipeline

```mermaid
flowchart LR
    Exp[Export ingest] --> Norm[Normalise to internal view]
    Norm --> Status[Status consistency checks]
    Norm --> Missing[Missing / incomplete data detection]
    Norm --> Ready[GPS / invoice / payment readiness]
    Status --> Sum[Evidence-ready summary]
    Missing --> Sum
    Ready --> Sum
```

## Synthetic Sample Reports

Fictional, non-runnable examples that show the shape of QA evidence:

- [Synthetic failure-classification report →](../assets/sample-artifacts/sample-failure-classification.md)
- [Synthetic release-gate report →](../assets/sample-artifacts/sample-release-gate-summary.md)
- [Synthetic QA memory update example →](../assets/sample-artifacts/sample-memory-update.md)
- [All synthetic QA artifacts →](../assets/sample-artifacts/)
