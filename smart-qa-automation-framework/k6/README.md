# k6 Performance Scripts

> **Maturity: Learning.** These scripts show how I structure performance tests and choose thresholds. They run
> against a small local demo app, so their numbers say nothing about production performance.

Every scenario runs the same user journey against the local Northstar Logistics demo API (fictional):
login once in `setup()`, then create, read, list and delete a shipment. Each iteration deletes what it
created, so a run leaves no data behind. The scripts refuse any non-local target unless
`ALLOW_EXTERNAL_TARGET=1` is set.

## Scenarios

| Script | Question it answers | Shape |
| --- | --- | --- |
| `smoke.js` | Does the system respond correctly under minimal load? | 1 VU for 20 s |
| `load.js` | Does expected normal traffic stay within thresholds? | ramp to 10 VUs, hold 1 min |
| `stress.js` | Where does degradation begin? | steps to 10, 25, 50 VUs |
| `soak.js` | Does performance degrade over time? | 5 VUs for `SOAK_DURATION` (default 5 min) |

## Thresholds and why they exist

See [`lib/thresholds.js`](lib/thresholds.js). Every threshold has a comment giving its reason:

- **`http_req_failed < 1%`**: errors matter more than speed. A fast API that fails is broken.
- **`p(95) < 500 ms` and `p(99) < 1000 ms`**: p95 is what nearly every user experiences, and p99 catches the
  slow tail that an average hides.
- **`checks > 99%`**: the functional checks (status codes, body shape) must keep passing under load.
- **Create p95 < 800 ms**: writes usually degrade first, so they get their own budget.
- **Stress** enforces only errors and observes latency, because its job is to find the breaking point.

The numbers are starting points for a local demo. For a real system they come from measured baselines.

## Run

```bash
# terminal 1 (test mode, so a later `npm test` can reuse this server)
npm run demo:start:test

# terminal 2 (k6 installed from https://k6.io/)
k6 run k6/smoke.js
k6 run k6/load.js
k6 run k6/stress.js
SOAK_DURATION=1h k6 run k6/soak.js
```

## What has actually been run

| Script | Run | Result |
| --- | --- | --- |
| `smoke.js` | Locally against the demo app, 2026-10-02 | All thresholds passed: 140/140 checks, 0% failed requests |
| `load.js`, `stress.js`, `soak.js` | Not run yet | — |

No benchmark claims are made from these runs.
