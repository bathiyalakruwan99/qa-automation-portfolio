# Route Optimizer Validation Engine (Case Study)

> Sanitized example for portfolio demonstration. No real source code, algorithms, scoring formulas, API usage, or route data are included. All data below is fictional.

## Business Problem

Optimizer output is easy to ship and hard to verify. Lower distance does not always mean lower cost. A route with the shortest distance might pick the wrong vehicle, exceed capacity, miss a delivery window, or split a single drop across multiple loads, resulting in higher actual operating cost.

## QA Challenge

- Independently sanity-check optimizer output beyond raw distance
- Catch the cost-vs-distance trap where a shorter route is more expensive to operate
- Confirm every order is planned or unassigned exactly once (never missing, never duplicated)
- Check vehicle suitability and capacity for each assignment
- Provide a defensible, explainable comparison per scenario, not just pass/fail

## Approach

A QA validation approach that takes the same inputs as the product optimizer and produces an independent comparison view focused on:

- **Route comparison** — distance and operating cost side by side
- **Vehicle suitability** — is the assigned vehicle appropriate for the load
- **Capacity validation** — does the load fit within the vehicle's limits
- **Cost-per-kilometre comparison** — operating cost, not just distance
- **Multi-stop route behaviour** — sequence and feasibility across stops
- **Order allocation validation** — every order accounted for exactly once
- **Route feasibility** — access, capacity, and constraint checks
- **QA comparison reporting** — a clean summary that travels into defect reports

> Lower total distance does not always mean lower operating cost. QA validation must consider vehicle suitability, capacity, cost per kilometre, load allocation, route feasibility, and operational constraints.

## Fictional Scenario Example

| Vehicle | Capacity | Cost |
|---|---|---|
| Vehicle A | 5,000 kg | 120/km |
| Vehicle B | 10,000 kg | 190/km |

| Order | Weight |
|---|---|
| Order DEMO-1001 | 2,000 kg |

In this fictional scenario, a distance-only view might prefer the larger vehicle for a single short route, while a cost-aware QA comparison shows that the smaller, cheaper-per-kilometre vehicle carries `Order DEMO-1001` at lower operating cost while still respecting capacity. The QA value is making that trade-off visible and explainable.

## QA Value

- Provides a defensible, explainable expected result per scenario
- Catches the cost-vs-distance trap
- Surfaces capacity and vehicle-suitability issues early
- Confirms order allocation is complete and non-duplicated
- Produces a comparison summary that travels cleanly into defect reports
- Reduces route/optimizer validation effort by 75%

## Limitations

- No source code, algorithms, or scoring formulas are included in this public portfolio
- Route data and maps are not included
- The approach is described at a QA-comparison level only

## Confidentiality Note

No real code, algorithms, scoring formulas, allocation rules, API usage, route data, or maps are included. This case study describes the QA comparison approach with fictional vehicles and orders only. See [`../docs/confidentiality.md`](../docs/confidentiality.md).
