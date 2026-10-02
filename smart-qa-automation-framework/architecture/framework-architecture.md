# Framework Architecture

Reusable layered architecture for the Smart QA Agent OS reference framework.

```mermaid
flowchart TB
    subgraph Tests["Test Layer"]
      UI["UI Tests<br/>@smoke @regression @ui"]
      API["API Tests<br/>@api @regression"]
      HYB["Hybrid Tests<br/>@hybrid"]
      BDD["BDD Features<br/>Cucumber"]
    end

    subgraph Support["Support Layer"]
      POM["Page Objects (POM)"]
      FIX["Fixtures &<br/>Test Hooks"]
      CLI["API Clients"]
      DATA["Test Data<br/>(JSON / CSV / Faker)"]
      UTIL["Utils<br/>(logger, assert, schema)"]
    end

    subgraph Runtime["Runtime"]
      PW["Playwright Runner"]
      NEWMAN["Newman Runner"]
      K6["k6 Runner"]
    end

    subgraph Outputs["Evidence & Reports"]
      HTML["Playwright HTML Report"]
      TRACE["Trace Files"]
      SHOT["Screenshots / Video"]
      NREP["Newman HTML Report"]
      KREP["k6 Summary"]
    end

    UI --> POM
    UI --> FIX
    API --> CLI
    HYB --> POM
    HYB --> CLI
    BDD --> POM
    BDD --> CLI

    POM --> PW
    FIX --> PW
    CLI --> PW
    CLI --> NEWMAN
    DATA --> PW
    DATA --> NEWMAN
    UTIL --> PW

    PW --> HTML
    PW --> TRACE
    PW --> SHOT
    NEWMAN --> NREP
    K6 --> KREP
```

## Layers explained

- **Test Layer** — what gets executed. Tests stay thin and call into Page Objects and API Clients.
- **Support Layer** — reusable building blocks: Page Objects, fixtures, API clients, test data, and utilities.
- **Runtime** — Playwright for UI/API/hybrid, Newman for Postman collections, k6 for performance.
- **Evidence & Reports** — HTML report, trace viewer, screenshots, videos, Newman report, k6 summary.
