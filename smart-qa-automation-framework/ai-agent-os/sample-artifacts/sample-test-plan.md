# Sample Test Plan — Order Dispatch (Synthetic example for portfolio demonstration)

> Synthetic example. Not based on any real customer, system, or workflow.

## Scope

- Module (fictional): Order Dispatch on the Northstar Retail Operations Platform.
- Release (fictional): Sprint 42 candidate.
- In scope: order creation, vehicle assignment, dispatch confirmation, audit log.
- Out of scope: pricing engine, billing, third-party fulfilment.

## Risk-based coverage

| Risk Area               | Coverage Type      | Priority |
| ----------------------- | ------------------ | -------- |
| Vehicle capacity edges  | UI + API hybrid    | High     |
| Status synchronisation  | UI + API hybrid    | High     |
| Authorisation           | API                | High     |
| Audit log accuracy      | UI                 | Medium   |
| Responsive view         | UI                 | Medium   |
| Performance smoke       | k6                 | Low      |

## Test layers

- UI Automation: Playwright with BDD/POM for dispatcher journeys.
- API Automation: Direct endpoint validation for dispatch and assignment.
- Hybrid: Confirm UI status matches API state.
- Performance smoke: One-VU baseline check for the dispatch endpoint.

## Acceptance criteria (fictional)

- A confirmed order can be assigned to an available vehicle.
- Status becomes `Dispatched` on UI and API.
- Capacity-exceeded scenarios surface a clear UI error and a 409 API response.

## Exit criteria

- 100% of high-priority scenarios executed.
- No open Severity-1 or Severity-2 defects in scope.
- Evidence available for all failed and verified-defect runs.

## Confidentiality note

This plan is fictional. Real plans for private products are never published.
