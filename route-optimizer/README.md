# Route Optimizer Validation Engine (Case Study)

> Synthetic example for portfolio demonstration. No real source code, algorithms, API usage, or route data are included.

## Business Problem

Optimizer output is easy to ship and hard to verify. Lower distance does not always mean lower cost. A route with the shortest distance might pick the wrong vehicle, exceed capacity, miss a delivery window, or split a single drop across multiple loads, resulting in higher actual cost.

## QA Challenge

- Independently verify optimizer output for distance, cost, vehicle selection, capacity, and feasibility
- Catch the cost-vs-distance trap where shorter distance leads to higher cost
- Validate that every input order is either planned exactly once or unassigned exactly once (never both, never missing, never duplicated)
- Verify SKU, weight, and CBM conservation across the optimization
- Check vehicle accessibility rules (some locations only allow certain vehicle sizes)
- Provide a defensible expected result per scenario, not just a pass/fail

## Solution

A standalone Next.js reference engine that accepts an order file and an organization (master) file, then runs a full load optimization pipeline:

1. **Parse inputs**: Read order file (Order IDs, pickup/drop locations, weight, CBM, SKU lines) and org file (location names, coordinates, accessibility rules, loading/unloading times, operating hours)
2. **Validate orders**: Drop bad orders to unassigned with reason codes (pickup not found, drop ambiguous, zero weight, exceeds all vehicle capacity, access not allowed, vehicle count exhausted)
3. **Group shipments**: Pair pickup and drop into shipment groups
4. **Build road matrix**: One global OSRM distance matrix for all points
5. **Construct corridors**: Seed + cheapest insertion algorithm
6. **Rebalance**: Split, merge, and split-drop repair passes
7. **Finalize**: Strict vehicle count enforcement with vehicle selection by lowest real route cost, then highest CBM utilisation, then highest weight utilisation, then smallest vehicle
8. **Reconcile**: Assert order conservation, SKU conservation, and weight/CBM conservation at every stage boundary
9. **Export**: Consolidated load manifest workbook with a Validation Summary sheet

### Optimization Objective

The global objective minimized over the whole solution:

```
objective = Sum(route cost)
          + loadCount * 5,000
          + splitDrops * 100,000
          + unusedCbm * 500
          + accessViolations * 1,000,000
          + capacityViolations * 1,000,000
```

A split drop costs roughly 20 loads' worth of penalty, so the optimizer only splits a drop when no single vehicle can carry it (capacity-forced). Such cases are reported, not hidden.

### Reconciliation Guarantees (Hard Invariants)

| Invariant | Rule |
|---|---|
| Order conservation | Input orders = planned orders + unassigned orders |
| No missing | Every input order ID appears in a load or in unassigned |
| No duplicate | No order ID appears in more than one load |
| No extra | No planned/unassigned order ID that was not in the input |
| SKU conservation | Input SKU lines = planned SKU lines + unassigned SKU lines |
| Weight / CBM | Input weight = planned weight + unassigned weight (within rounding) |

If an assertion fails, it throws. A planning bug must never produce a silently wrong manifest.

### Unassigned Reason Codes

| Code | Meaning |
|---|---|
| PICKUP_NOT_FOUND | Pickup location not in org file |
| DROP_NOT_FOUND | Drop location not found and no valid geo-tag |
| PICKUP_AMBIGUOUS / DROP_AMBIGUOUS | Matched multiple org locations, cannot disambiguate |
| INVALID_GEOTAG | Geo-tag present but coordinates invalid |
| ZERO_OR_NEGATIVE_WEIGHT / CBM | Missing or non-positive quantity |
| EXCEEDS_ALL_VEHICLE_CAPACITY | Exceeds every selected vehicle size |
| PICKUP_ACCESS_NOT_ALLOWED / DROP_ACCESS_NOT_ALLOWED | No selected vehicle can access the location |
| VEHICLE_COUNT_EXHAUSTED | A fitting size exists but its unit count is used up |
| NO_VEHICLE_SELECTED | No vehicle sizes selected at all |

### Vehicle Accessibility Rules

| Rule | Meaning |
|---|---|
| ALL, empty, or NotAllowed:[] | Every vehicle size allowed |
| OnlyAllowed:[A,B] | Only sizes A and B |
| NotAllowed:[A,B] | Every size except A and B |

Strict mode (default) uses token-exact matching. Legacy mode provides looser matching for backward compatibility.

### Validation Summary Export

The exported manifest workbook includes a Validation Summary sheet with:

| Section | Contents |
|---|---|
| A. Order Reconciliation | Input / planned / unassigned / missing / duplicate / extra + OK flag |
| B. SKU Reconciliation | Input / planned / unassigned / missing SKU lines |
| C. Weight / CBM Reconciliation | Input vs planned vs unassigned vs delta |
| D. Feasibility Checks | Capacity, pickup/drop access, count-exhausted, empty loads, invalid coords, ambiguous |
| E. Optimization Quality | Per-load vehicle, CBM/weight utilisation, distance, cost, vehicle reason |
| F. Unassigned Orders | Order ID, pickup, drop, weight, CBM, reason code, debug info |
| G. Split Drop Locations | Any drop spread across loads (should be empty unless capacity-forced) |

## Architecture Overview

```
Order file (.xlsx) + Org/master file (.xlsx)
      |
      v
  Parse orders + parse org index
      |
      v
  Resolve locations (ref-id > name > geo-tag fallback)
      |
      v
  +--------------------------------------------------+
  | STAGE 1  validation (drop bad -> unassigned)     |
  | STAGE 2  shipment grouping (pickup+drop)          |
  | STAGE 3  global road matrix (OSRM)                |
  | STAGE 4  corridor construction (seed+insertion)   |
  | STAGE 5  rebalance / split / merge / repair       |
  | STAGE 6  finalize with strict vehicle counts      |
  +--------------------------------------------------+
      |
      v
  Reconciliation (order + SKU + weight/CBM conservation)
      |
      v
  Route each load (sequence, distance, duration, legs)
      |
      v
  Export manifest workbook + Validation Summary
```

## Dummy Scenario Example

| Input | Value |
|---|---|
| Orders | 30 deliveries across 3 zones |
| Vehicles | 3 trucks (Vehicle-001: 5t/30 CBM, Vehicle-002: 3t/18 CBM, Vehicle-003: 8t/45 CBM) |
| Depots | Central Warehouse, North Hub, South Hub |

| Metric | Product Optimizer | Reference Engine | Match? |
|---|---|---|---|
| Total distance | 142 km | 138 km | No |
| Total cost | $480 | $410 | No |
| Vehicles used | 3 | 2 | No |
| Capacity utilisation | 67% | 89% | No |
| Split drops | 1 | 0 | No |
| Feasibility | Pass | Pass | Yes |
| Reconciliation OK | Unknown | Yes | - |

In this synthetic example, the product optimizer used 3 vehicles, a longer route, and split one drop across two loads. The reference engine found a 2-vehicle solution with lower distance, lower cost, higher capacity utilisation, and zero split drops.

## Additional Capabilities

The project also includes:

- **Order file creation**: A tool to generate realistic test order data for optimizer testing, with configurable order templates, bulk generation, and multiple export formats
- **Geo coordinate location getter**: A tool to convert addresses to GPS coordinates and vice versa, supporting batch processing from Excel/CSV, used to build and maintain the org/master location file with accurate coordinates
- **File upload interface**: A web-based interface for uploading order and org files, running the optimizer, and downloading the manifest with validation summary

## Tech Stack

Next.js 15, React 18, TypeScript, Tailwind CSS, Leaflet, React-Leaflet, OSRM (public or local), Nominatim (OpenStreetMap geocoding), Web Workers for non-blocking optimization, LRU cache for route calculations

## QA Value

- Provides a defensible expected result per scenario with full reconciliation
- Catches the cost-vs-distance trap
- Detects split drops, capacity violations, and accessibility violations
- Validates order, SKU, weight, and CBM conservation
- Produces a Validation Summary that travels cleanly into defect reports
- Reduces route and optimizer testing effort by 75%

## Limitations

- Source code is not included in this public portfolio
- Route data and maps are not included
- Maximum 50 locations per OSRM matrix request (chunked for larger datasets)
- Public OSRM rate limits (local OSRM recommended for production)
- No real-time traffic data (uses static OSM road network)

## Confidentiality Note

No real Next.js code, algorithms, package/config files, API usage, route data, or maps are included. This case study describes the approach with dummy vehicles and orders only. See [`../docs/confidentiality.md`](../docs/confidentiality.md).
