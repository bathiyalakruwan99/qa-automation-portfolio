# Route Optimizer Validation Workbench

> **Internal QA Tool — Sanitized Public Overview**
> An independent QA comparison tool I built to validate route-optimizer output against transparent, independently calculated checks.

## Business Problem

A transport-management platform required independent validation of complex route-planning scenarios. When a route optimizer produces a plan, QA needs to answer a hard question: is this output operationally sensible and internally consistent, or just plausible-looking? Without an independent reference, optimizer bugs (capacity overflows, lost orders, vehicle mismatches) can reach production unnoticed.

This workbench does not replace a product optimizer. It provides an independent QA comparison layer for verifying that optimizer output is operationally sensible and internally consistent.

## QA Challenge

- Validate optimizer output without re-implementing the product's proprietary algorithm
- Compare product output against transparent, independently calculated alternatives
- Check distance, vehicle suitability, capacity, cost, allocation, and operational feasibility
- Catch silent failures (dropped orders, overloaded vehicles, infeasible routes)
- Make every pass/fail explainable with a transparent reason

## What the Tool Does

An independent QA comparison tool used to validate route-optimizer output against distance, vehicle suitability, capacity, cost, allocation, and operational feasibility checks. It compares product optimizer output against transparent QA validation rules and independently calculated route alternatives.

### Validation dimensions

| Dimension | What QA checks | Example failure caught |
| --- | --- | --- |
| Distance | Total and per-leg distance is reasonable | A leg that doubles back unnecessarily |
| Vehicle suitability | Vehicle type fits the assigned work | A small vehicle on an oversized load |
| Capacity | No vehicle exceeds its capacity | A route overloaded beyond limit |
| Cost | Cost is consistent with distance and resources | Lowest distance but higher cost than an alternative |
| Allocation | Every order is assigned exactly once | An order dropped or assigned twice |
| Operational feasibility | The plan is workable in practice | A route ignoring a hard constraint |

### Comparison flow

```
Optimizer output + scenario inputs
  -> Independent QA recalculation of route alternatives
  -> Compare across distance, capacity, cost, allocation, suitability, feasibility
  -> Flag mismatches with a transparent reason
  -> Human QA reviews and decides
```

## Fictional Example

Scenario: `Customer Alpha` has orders `DEMO-1001`..`DEMO-1004` across `Warehouse Alpha`, `Customer Site Beta`, and `Zone Gamma`.

| Check | Product output | QA finding |
| --- | --- | --- |
| Allocation | 3 of 4 orders routed | DEMO-1004 dropped — flagged |
| Capacity | Vehicle-001 at 110% | Over capacity — flagged |
| Cost vs distance | Shortest distance chosen | Higher cost than alternative — review |
| Vehicle suitability | Vehicle-002 assigned | Suitable — pass |

```
Orders in scope: 4
Allocation issue: 1 (DEMO-1004 dropped)
Capacity issue: 1 (Vehicle-001 over capacity)
Cost review: 1 (cheaper alternative available)
Recommendation: HOLD — fix allocation and capacity before release
```

## Performance

Performance characteristics depend on input size, routing data availability, and the test environment; internal benchmark details are not public.

## QA Value

- Creates a repeatable and explainable comparison process for route-optimizer validation
- Catches silent failures (dropped orders, overloads, infeasible routes) before release
- Provides a transparent, independent oracle rather than trusting the optimizer blindly
- Makes optimizer validation defensible with written reasons

## QA Skills Demonstrated

- Validating algorithmic output with an independent oracle
- Risk-based comparison across multiple operational dimensions
- Designing transparent, explainable pass/fail criteria
- Catching silent data-integrity failures

## Public Portfolio Scope

The production/internal implementation is not included. This page documents the QA validation approach, test dimensions, and fictional examples only.

## Confidentiality Note

The original tool is real. The underlying implementation is not public because it contains internal validation logic, benchmark rules, and non-public operational assumptions. No real source code, algorithms, scoring formulas, customer data, or production routes are included. All examples are fictional. See [`../docs/confidentiality.md`](../docs/confidentiality.md).
