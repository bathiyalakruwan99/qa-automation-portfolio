# Route Optimizer Comparison (Sanitized Sample)

> Fictional, synthetic data. Used only to illustrate the shape of a comparison report.

## Scenario

| Order   | Pickup      | Dropoff           | Weight  |
| ------- | ----------- | ----------------- | ------- |
| ORD-001 | Warehouse A | Customer Site B   | 2000 kg |
| ORD-002 | Warehouse A | Customer Site C   | 3000 kg |
| ORD-003 | Warehouse A | Customer Site D   | 4000 kg |
| ORD-004 | Warehouse A | Customer Site E   | 1500 kg |

| Vehicle    | Capacity  | Cost per km |
| ---------- | --------- | ----------- |
| Vehicle A  | 5,000 kg  | 120 / km    |
| Vehicle B  | 10,000 kg | 190 / km    |
| Vehicle C  | 7,500 kg  | 150 / km    |

## Expected (reference engine)

- **Selected vehicle:** Vehicle A + Vehicle C (multi-vehicle split)
- **Stop order:** A → B → C → D → E
- **Distance:** 42.0 km
- **Estimated cost:** 5,940
- **Capacity check:** within limits for both vehicles

## Actual (optimizer under test)

- **Selected vehicle:** Vehicle B (single)
- **Stop order:** A → C → B → D → E
- **Distance:** 39.5 km
- **Estimated cost:** 7,505
- **Capacity check:** within limits

## Difference

| Field             | Expected | Actual | Delta             |
| ----------------- | -------- | ------ | ----------------- |
| Distance (km)     | 42.0     | 39.5   | -2.5 km           |
| Estimated cost    | 5,940    | 7,505  | +1,565 (worse)    |
| Vehicle selection | A + C    | B      | Different         |
| Stop order        | A,B,C,D,E| A,C,B,D,E | Different     |

## Finding

Optimizer chose a route with **lower distance but higher total cost** because it preferred a single larger vehicle (Vehicle B at 190 / km) over a split using two cheaper vehicles. This confirms a cost-vs-distance trap; the optimizer is minimising kilometres rather than cost.

## QA action

- Open a defect: optimizer scoring should consider cost per km, not just distance.
- Add a regression scenario covering split vs single-vehicle allocation with similar inputs.
- Confirm the expected scoring formula with the product owner.
