# GPS Simulator and Path Generation Suite (Case Study)

> Synthetic example for portfolio demonstration. No real source code, map data, API config, or screenshots with real locations are included.

## Business Problem

GPS, live-map, geofence, and vehicle-tracking features must be tested at fleet scale without physical hardware. The hardest scenarios, off-route drivers, GPS jumps, rejoin behaviour, and multi-device scenario coverage, must be reproducible on demand.

## QA Challenge

- Test multi-device GPS streaming (up to 1000 devices) without physical hardware
- Reproduce off-route, detour, geofence-edge, and rejoin scenarios deterministically
- Generate road-aware GPS paths with configurable speed and interval
- Create scenario-specific GPS data (short stops, return early, out of sequence, unplanned stops, reassignment splits)
- Produce evidence (JSON path data, PNG map exports) that travels cleanly into defect reports
- Tools must be testable themselves (data-testid attributes for automation)

## Solution

A web-based toolkit with a central dashboard and 7 specialised tools, each with cross-navigation:

### 1. Central Dashboard

Unified access point to all GPS testing tools with tool overview, expandable README sections, cross-navigation, and responsive design.

### 2. GPS Vehicle Simulator

Manually generate static or test GPS paths with:
- Interactive Google Maps integration
- Real-time GPS data transmission to APIs
- Multi-environment support (Dev / Staging / Production)
- Bearer token authentication
- Debug console with API response monitoring
- Drag and drop vehicle positioning

### 3. Live GPS Simulator

Simulate real-time GPS streams from multiple devices with:
- Support for up to 1000 devices simultaneously
- OpenStreetMap integration (no API keys required)
- Staggered device startup to reduce CPU load
- Visual and silent simulation modes
- Real-time statistics and monitoring
- JSON data upload and management

### 4. GPS Path Builder (Road-Aware)

Build routes using road-aware pathing with:
- OpenRouteService API integration for real driving routes
- Automatic interpolation every 10 meters
- Real road-following GPS paths (not straight lines)
- Interactive waypoint selection
- Configurable speed (default 40 km/h) and routing profiles
- Export-ready JSON output with data-testid attributes for automation

### 5. GPS Live Manual Simulator

Manual-capable live GPS simulator with:
- Upload or paste multi-device JSON
- Run all devices live with optional local-only mode (skip API send)
- Pause selected devices only and drag markers manually while others keep moving
- Continue with On-route (jump to nearest planned route point) or Rejoin (draw a rejoin connector first)
- Four separate map path layers: planned, completed planned, manual drag, rejoin connector
- Export final actual-traveled data JSON with movement metadata
- Export map as PNG for evidence (with screenshot fallback if browser blocks canvas export)

### 6. GPS Unified Builder (Scenario JSON Generator)

Generate simulator-ready GPS JSON for multiple route behaviours and scenario tests with:
- Build or import routes, geofences, and devices
- Map geofences to dynamic labels (A, B, C ... Z, AA, AB ...)
- Define planned route order
- Generate scenario-specific outputs
- Assign scenarios per device (mixed-scenario combined JSON where each device follows a different scenario)

**Supported scenarios:**
- Planned route (baseline)
- Short stop
- Return early
- Out of sequence (randomized, still covers planned locations)
- Unplanned stop (inside, outside, or both, with repeat count)
- Reassignment split (split behaviour)

**Timing presets:**
| Type | Duration (ms) | Speed (km/h) |
|---|---|---|
| Transit points | 800-1500 | 30-50 |
| Real stop | 30000-120000 | 0-5 |
| Short stop | 1000-5000 | 5-15 |
| Unplanned stop | 20000-90000 | 0-5 |

### 7. GPS Path Visualizer

Upload and preview GPS paths for debugging with:
- Drag and drop file upload
- Multiple data format support (JSON, CSV, arrays)
- OpenStreetMap visualization
- Path analysis and statistics
- Interactive navigation controls
- Real-time path metrics

### 8. Multi-Device GPS Combiner

Combine multiple per-device JSONs into simulator-ready files with:
- Multi-file data merging
- Device ID assignment
- Format flexibility (GPS objects, coordinates, arrays)
- Speed data preservation
- Export options (full / basic formats)
- Copy to clipboard and download

## Architecture Overview

```
Dashboard (central hub)
  |-- GPS Vehicle Simulator (Google Maps, real-time API, multi-environment)
  |-- Live GPS Simulator (up to 1000 devices, OpenStreetMap, staggered start)
  |-- GPS Path Builder (OpenRouteService, 10m interpolation, road-aware)
  |-- GPS Live Manual Simulator (pause/drag/rejoin, 4 path layers, PNG export)
  |-- GPS Unified Builder (scenario generator, geofence mapping, mixed-scenario)
  |-- GPS Path Visualizer (JSON/CSV inspection, drag&drop, metrics)
  |-- Multi-Device Combiner (merge per-device JSONs, device ID assignment)
```

## Typical QA Workflow

1. **GPS Vehicle Simulator** to create individual test paths
2. **GPS Path Builder** to generate realistic road-following routes
3. **GPS Unified Builder** to create scenario-specific JSON (short stop, return early, out of sequence, unplanned stop)
4. **Multi-Device Combiner** to combine multiple device data
5. **Live GPS Simulator** to load-test APIs with bulk devices (100-1000)
6. **GPS Live Manual Simulator** to test off-route and rejoin behaviour interactively
7. **GPS Path Visualizer** to debug and validate all generated data

## Tech Stack

Vanilla HTML / CSS / JavaScript (ES6+), Leaflet.js with OpenStreetMap, OpenRouteService for driving routes, Google Maps integration (Vehicle Simulator), SLERP + Haversine for coordinate interpolation, React + Vite + TypeScript (Unified Builder), runtime-only bearer-token handling (never committed)

## Performance Notes

| Tool | Recommended Limit |
|---|---|
| Vehicle Simulator | Real-time, single device |
| Live Simulator | Up to 1000 devices (recommended: 100-500) |
| Path Builder | Routes up to 1000 km |
| Visualizer | Files up to 10 MB |
| Combiner | Up to 50 device files simultaneously |

## QA Value

- Makes off-route, detour, geofence-edge, rejoin, and scenario-based testing deterministic and repeatable
- Removes physical hardware from the test plan
- Supports 1000+ device load testing without real devices
- Produces JSON and PNG evidence that travels cleanly into defect reports
- Includes data-testid attributes so the tools themselves are testable in Playwright / Cypress / Selenium
- Scenario generator enables testing of specific GPS behaviours (short stop, return early, out of sequence, unplanned stop) without manual path editing

## Location-Data Validation

A complementary geo-coordinate converter tool was used to generate and maintain realistic GPS test data by converting addresses to coordinates and vice versa, supporting batch processing from Excel/CSV and Excel export. This supported building and maintaining the location master file with accurate coordinates for all GPS testing tools.

## Limitations

- Source code is not included in this public portfolio
- Real location data and screenshots are not included
- API configuration and tokens are not committed
- Google Maps integration requires an API key (OpenStreetMap-based tools do not)

## Confidentiality Note

No real source code, map data, route paths, API config, screenshots with real locations, or run files are included. This case study describes the architecture and capabilities at a high level only. See [`../docs/confidentiality.md`](../docs/confidentiality.md).
