# API + UI Hybrid Test Flow

Hybrid tests cover the most realistic user journeys: data is prepared or asserted via API, and the user-facing result is verified via UI. This reduces flakiness and increases coverage.

```mermaid
sequenceDiagram
    autonumber
    participant T as Hybrid Test
    participant API as API Client
    participant SUT as System Under Test
    participant UI as UI / Page Object
    participant E as Evidence

    T->>API: 1. Create resource (e.g., booking / job)
    API->>SUT: POST /resource
    SUT-->>API: 201 + id
    API-->>T: returns id + payload

    T->>API: 2. Assert resource state
    API->>SUT: GET /resource/{id}
    SUT-->>API: 200 + state
    API-->>T: schema + value checks

    T->>UI: 3. Open page using id
    UI->>SUT: HTTP GET /page/{id}
    SUT-->>UI: HTML
    UI-->>T: page loaded

    T->>UI: 4. Verify rendered values
    UI-->>T: assertions pass / fail

    alt failure
      T->>E: attach screenshot, video, trace, API logs
    else success
      T->>E: attach summary
    end
```

## Why this matters

- Data setup is **fast and reliable** via API instead of brittle UI clicks.
- UI assertions remain **user-centric** so we catch real product defects.
- Evidence captured at every step makes failures easy to triage.
