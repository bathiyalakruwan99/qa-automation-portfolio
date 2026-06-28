# Sample Locator Healing Flow (Synthetic)

> Fictional example. Locator healing is a guided, human-reviewed investigation workflow, not an autonomous runtime auto-healer.

```mermaid
flowchart TD
    Fail[Test fails: element not found] --> Investigate[Investigate DOM + workflow change]
    Investigate --> Cause{Root cause?}
    Cause -->|DOM change| Suggest[Suggest safer locator]
    Cause -->|Timing| Wait[Suggest wait/condition fix]
    Cause -->|Real defect| Defect[Raise defect instead]
    Suggest --> Review[Human QA review]
    Wait --> Review
    Review -->|Approved| Apply[Apply change]
    Review -->|Rejected| Keep[Keep current locator]
```

| Field | Example |
|---|---|
| Failing element | Cart summary total for Order DEMO-1001 |
| Old locator | text-based, fragile |
| Suggested locator | stable test id |
| Decision | Requires human QA approval before adoption |

QA value: instability is investigated and a safer locator is suggested, but no change is applied until a QA engineer reviews and approves it. Monetary or critical fields always require human review.
