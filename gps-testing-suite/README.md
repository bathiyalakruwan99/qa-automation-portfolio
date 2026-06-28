# GPS Simulator and Geofence Validation Suite (Case Study)

> Sanitized example for portfolio demonstration. No real source code, map data, coordinates, routes, vehicle registrations, geofence names, API config, tokens, or screenshots with real locations are included. All examples below are fictional.

## Business Problem

GPS, live-map, geofence, and vehicle-tracking features must be tested at fleet scale without physical hardware. The hardest scenarios, off-route drivers, GPS jumps, rejoin behaviour, and multi-vehicle scenario coverage, must be reproducible on demand. Relying on real devices makes these tests slow, expensive, and impossible to repeat exactly.

## QA Challenge

- Simulate GPS streams for multiple vehicles without physical hardware
- Reproduce off-route, detour, geofence-edge, and rejoin scenarios deterministically
- Generate realistic, road-aware vehicle movement paths
- Create scenario-specific movement data (short stops, return early, out of sequence, unplanned stops)
- Validate geofence entry/exit behaviour at the edges, not just the centre
- Produce QA evidence that travels cleanly into defect reports

## Approach

A web-based QA toolkit concept that turns GPS testing from a hardware problem into a repeatable data problem. Each capability supports a specific class of GPS scenario.

### Capabilities

| Capability | What it supports | QA use |
| --- | --- | --- |
| GPS stream simulation | Generate streams for one or many vehicles | Exercise live-map and tracking without devices |
| Vehicle movement patterns | Road-aware paths, configurable speed, interpolation | Make movement resemble real driving |
| Route and path testing | Build and replay planned routes | Compare planned vs actual movement |
| Geofence entry/exit | Define zones and verify entry, exit, dwell, and edge events | Validate geofence triggers reliably |
| Multi-vehicle scenarios | Run several vehicles concurrently | Test concurrent tracking and live-map load |
| Live-map QA evidence | Capture path data and map snapshots | Attach evidence to defect reports |

### Scenario types

- Planned route (baseline)
- Short stop
- Return early
- Out of sequence
- Unplanned stop
- Off-route then rejoin
- Geofence edge (enter, dwell, exit near the boundary)

## Fictional Scenario Example

| Element | Fictional Value |
|---|---|
| Vehicle | Vehicle-001 |
| Origin | Warehouse Alpha |
| Destination | Customer Site Beta |
| Geofence zone | Zone Gamma |
| Scenario | Off-route then rejoin |

A QA run with this fictional setup sends `Vehicle-001` from `Warehouse Alpha` toward `Customer Site Beta`, drives it off-route, verifies the live map reflects the deviation, then rejoins the planned route and confirms `Zone Gamma` entry and exit events fire correctly.

### Example multi-vehicle scenario (fictional)

| Vehicle | Scenario | Expected behaviour |
| --- | --- | --- |
| Vehicle-001 | Planned route | Clean entry/exit at Zone Gamma |
| Vehicle-002 | Off-route then rejoin | Deviation visible, then rejoin |
| Vehicle-003 | Unplanned stop | Dwell event inside Zone Gamma |

Running all three together checks that concurrent tracking, live-map rendering, and geofence events stay correct under load.

### Sample evidence (shape only)

```
Scenario: Off-route then rejoin (Vehicle-001)
Geofence Zone Gamma: ENTER ok, EXIT ok
Deviation detected: yes (reflected on live map)
Rejoin: yes
Evidence: path data + map snapshot attached
```

## QA Value

- Makes off-route, detour, geofence-edge, rejoin, and scenario-based testing deterministic and repeatable
- Removes physical hardware from the test plan
- Supports high-load, multi-vehicle testing without real devices
- Produces path data and map evidence that travels cleanly into defect reports
- Enables testing of specific GPS behaviours without manual path editing

## QA Skills Demonstrated

- Designing deterministic test data for hard-to-reproduce, real-world scenarios
- Edge-focused testing (geofence boundaries, rejoin, out-of-sequence)
- Concurrent, multi-entity test design
- Evidence capture for time-and-location-based features

## Limitations

- No source code is included in this public portfolio
- Real location data, coordinates, routes, and screenshots are not included
- API configuration and tokens are not included

## Confidentiality Note

No real source code, map data, coordinates, routes, vehicle registrations, geofence names, customer locations, GPS payloads, API URLs, tokens, route polylines, or internal GPS workflow rules are included. This case study describes the QA approach and capabilities at a high level with fictional examples only. See [`../docs/confidentiality.md`](../docs/confidentiality.md).
