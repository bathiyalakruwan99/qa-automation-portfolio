# GPS Simulator & Geofence Validation Suite

> **Internal QA Tool — Sanitized Public Overview**
> A web-based QA toolkit I designed to simulate GPS activity, build movement paths, validate geofence events, and test multi-vehicle tracking scenarios.

## Business Problem

GPS, live-map, geofence, and vehicle-tracking features must be tested at fleet scale without physical hardware. The hardest scenarios, off-route drivers, GPS jumps, rejoin behaviour, and multi-vehicle scenario coverage, must be reproducible on demand. Relying on real devices makes these tests slow, expensive, and impossible to repeat exactly.

## QA Challenge

- Simulate GPS streams for multiple vehicles without physical hardware
- Reproduce off-route, detour, geofence-edge, and rejoin scenarios deterministically
- Generate realistic, road-aware vehicle movement paths
- Create scenario-specific movement data (short stops, return early, out of sequence, unplanned stops)
- Validate geofence entry/exit behaviour at the edges, not just the centre
- Produce QA evidence that travels cleanly into defect reports

## What the Tool Does

A web-based QA toolkit that turns GPS testing from a hardware-dependent activity into repeatable scenario-based validation. Built to support Transport Management System QA workflows.

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

### Fictional evidence output

```
Scenario: Off-route then rejoin (Vehicle-001)
Geofence Zone Gamma: ENTER ok, EXIT ok
Deviation detected: yes (reflected on live map)
Rejoin: yes
Evidence: path data + map snapshot attached
```

## Scale

Designed and tested for multi-device simulation scenarios, including controlled runs at up to 1,000 simulated device streams in QA scenarios.

## Integration Boundary

The internal version sends simulated GPS data to configured non-public test environments. Real endpoint structures, tokens, payloads, and integration settings are intentionally excluded from this public overview.

## QA Value

- Enables repeatable GPS, geofence, off-route, rejoin, and multi-device scenarios without relying on physical hardware
- Makes hard-to-reproduce, time-and-location-based scenarios deterministic
- Produces path data and map evidence that travels cleanly into defect reports
- Supports concurrent multi-vehicle testing

## QA Skills Demonstrated

- Designing deterministic test data for hard-to-reproduce, real-world scenarios
- Edge-focused testing (geofence boundaries, rejoin, out-of-sequence)
- Concurrent, multi-entity test design
- Evidence capture for time-and-location-based features

## Public Portfolio Scope

The public repository contains documentation, fictional scenarios, and safe artifacts only. The internal tool's source code, real map data, endpoint structures, and screenshots with real locations are not public.

## Confidentiality Note

The original tool is real. No real source code, map data, coordinates, routes, vehicle registrations, geofence names, customer locations, GPS payloads, API URLs, tokens, route polylines, or internal GPS workflow rules are included. All examples are fictional. See [`../docs/confidentiality.md`](../docs/confidentiality.md).
