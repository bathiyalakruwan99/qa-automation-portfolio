# Postman + Newman

Collection-based API regression for the local **Northstar Logistics demo app** (fictional). It complements the
typed Playwright API suite: the same contract, checked from a tool many QA teams use day to day.

## Files

- `demo-api.postman_collection.json`: 9 requests, 18 assertions, run in order.
- `demo-api.postman_environment.json`: `baseUrl` and the fake demo account.

## What is covered

| ID | Request | Checks |
| --- | --- | --- |
| PM-001 | Login | 200, token issued and stored for later requests |
| PM-002 | List without a token | 401 `UNAUTHORIZED` |
| PM-003 | Create a shipment | 201, `CREATED`, reference echoed, response time |
| PM-004 | Retrieve it | 200, same shipment |
| PM-005 | Duplicate reference | 409 `DUPLICATE_REFERENCE` |
| PM-006 | Missing customer | 400 `REQUIRED_FIELD` on `customerId` |
| PM-007 | Jump straight to DELIVERED | 409 `ILLEGAL_TRANSITION` |
| PM-008 | Delete (cleanup) | 204 |
| PM-009 | Read the deleted shipment | 404 |

The run creates one shipment and deletes it, so it leaves no data behind.

## Run

```bash
# terminal 1: start the demo app
npm run demo:start

# terminal 2
npm run test:postman
```

## Verified

Run locally against the demo app on 2026-10-02: 9 requests and 18 assertions, 0 failures.

## Notes

- The environment holds a fake account that only works against the local demo app.
- Never point this collection at a system you do not own.
