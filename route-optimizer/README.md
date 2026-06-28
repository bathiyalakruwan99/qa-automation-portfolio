# Route Optimizer Validation Engine (Case Study)

> Sanitized example for portfolio demonstration. No real source code, algorithms, scoring formulas, API usage, or route data are included. All data below is fictional.

## Business Problem

Optimizer output is easy to ship and hard to verify. Lower distance does not always mean lower cost. A route with the shortest distance might pick the wrong vehicle, exceed capacity, miss a delivery window, or split a single drop across multiple loads, resulting in higher actual operating cost. Without an independent way to check the output, QA can only confirm that the optimizer "ran", not that it produced a sensible plan.

## QA Challenge

- Independently sanity-check optimizer output beyond raw distance
- Catch the cost-vs-distance trap where a shorter route is more expensive to operate
- Confirm every order is planned or unassigned exactly once (never missing, never duplicated)
- Check vehicle suitability and capacity for each assignment
- Confirm multi-stop sequences are feasible and respect operational constraints
- Provide a defensible, explainable comparison per scenario, not just pass/fail

## Approach

A QA validation approach that takes the same inputs as the product optimizer and produces an independent comparison view. Instead of trusting a single number, it breaks the result into the factors that actually drive a good plan.

### What QA validates

| Check | Question it answers | Why it matters |
| --- | --- | --- |
| Route comparison | Is the chosen route shorter or longer than an independent baseline? | Distance is the headline number teams trust first |
| Operating cost | Is the cheaper-distance route actually cheaper to run? | A shorter route on an expensive vehicle can cost more |
| Vehicle suitability | Is the assigned vehicle appropriate for the load? | Wrong-size vehicles waste capacity or cannot carry the load |
| Capacity validation | Does the load fit within weight and volume limits? | Over-capacity plans fail in the real world |
| Cost per kilometre | How do vehicle rates change the total? | The cheapest vehicle per km is not always smallest |
| Multi-stop behaviour | Is the stop sequence feasible and ordered sensibly? | Bad sequencing inflates distance and time |
| Order allocation | Is every order planned or unassigned exactly once? | Missing or duplicated orders are silent, high-impact bugs |
| Route feasibility | Are access and operational constraints respected? | A plan that ignores constraints is not executable |

> Lower total distance does not always mean lower operating cost. QA validation must consider vehicle suitability, capacity, cost per kilometre, load allocation, route feasibility, and operational constraints.

### Example QA scenarios (fictional)

- **Cost-vs-distance trap:** the optimizer picks a single large vehicle for a short route; QA shows two smaller, cheaper-per-km vehicles deliver the same orders at lower total cost.
- **Capacity overflow:** an order is added to a vehicle already at its weight limit; QA flags the capacity violation.
- **Lost order:** an order silently disappears from both the plan and the unassigned list; QA's allocation check catches the discrepancy.
- **Split drop:** a single delivery is split across two loads when one vehicle could have carried it; QA highlights the unnecessary split.

## Fictional Scenario Example

| Vehicle | Capacity | Cost |
|---|---|---|
| Vehicle A | 5,000 kg | 120/km |
| Vehicle B | 10,000 kg | 190/km |

| Order | Weight |
|---|---|
| Order DEMO-1001 | 2,000 kg |
| Order DEMO-1002 | 1,500 kg |

A distance-only view might prefer the larger `Vehicle B` for a single short route. A cost-aware QA comparison shows that the smaller, cheaper-per-kilometre `Vehicle A` carries `Order DEMO-1001` and `Order DEMO-1002` together within capacity at lower operating cost. The QA value is making that trade-off visible, repeatable, and explainable in a defect report.

### Sample comparison summary (shape only)

| Field | Optimizer under test | Independent baseline | Verdict |
| --- | --- | --- | --- |
| Total distance | shorter | slightly longer | distance not the deciding factor |
| Operating cost | higher | lower | baseline wins on cost |
| Vehicles used | one large | two small | suitability difference |
| Allocation | all orders placed | all orders placed | both complete |

## QA Value

- Provides a defensible, explainable expected result per scenario
- Catches the cost-vs-distance trap that pure distance checks miss
- Surfaces capacity and vehicle-suitability issues early
- Confirms order allocation is complete and non-duplicated
- Produces a comparison summary that travels cleanly into defect reports
- Reduces route/optimizer validation effort by 75%

## QA Skills Demonstrated

- Building an independent oracle to validate complex algorithmic output
- Risk-based thinking (cost, capacity, feasibility, allocation) over single-metric checks
- Translating findings into clear, evidence-backed defect reports
- Designing repeatable regression scenarios for optimization changes

## Limitations

- No source code, algorithms, or scoring formulas are included in this public portfolio
- Route data and maps are not included
- The approach is described at a QA-comparison level only

## Confidentiality Note

No real code, algorithms, scoring formulas, allocation rules, API usage, route data, or maps are included. This case study describes the QA comparison approach with fictional vehicles and orders only. See [`../docs/confidentiality.md`](../docs/confidentiality.md).
