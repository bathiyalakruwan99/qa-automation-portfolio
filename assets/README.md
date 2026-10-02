# Assets

Shared, sanitized visual and documentation assets used by the root README, the case studies, and the docs.

## Folders

- `diagrams/` — exported architecture and flow diagrams (Mermaid sources live next to their docs)
- `sanitized-screenshots/` — sanitized UI screenshots (no real data, no internal URLs)
- `screenshots/` — alias kept for backwards compatibility
- `demo-gifs/` — short demo GIFs

## Current images

All captured from repository-owned demos with fictional data (never from internal applications):

| File | Shows |
| --- | --- |
| `demo-gifs/shipment-journey.gif` | One shipment driven from CREATED to DELIVERED in the demo app |
| `screenshots/demo-app-login.png`, `demo-app-shipments.png`, `demo-app-shipment-in-transit.png` | The Northstar Logistics demo app |
| `screenshots/playwright-report.png` | The Playwright HTML report of a local run (30 tests + auth setup, all passed) |
| `screenshots/gps-simulator-off-route.png` | The GPS map viewer for the `off-route-rejoin` scenario, 5 vehicles |

## Rules

- Only sanitized, fictional, or synthetic content.
- Generic / placeholder identifiers only (`TRUCK-001`, `Warehouse Alpha`, `DEMO-SHP-1001`).
- No raw data files (no CSV, JSON, Excel, or exports).
- No employer URLs, customer references, financial values, or production screenshots.
