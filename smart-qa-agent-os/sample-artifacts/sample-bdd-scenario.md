# Sample BDD Scenario — Order Dispatch (Synthetic example for portfolio demonstration)

> Synthetic example. Not based on any real customer, system, or workflow.

```gherkin
Feature: Order Dispatch
  As a dispatcher on the Northstar Retail Operations Platform
  I want to assign confirmed orders to available vehicles
  So that orders are dispatched accurately

  Background:
    Given I am signed in as a dispatcher
    And the warehouse "Central Warehouse" has vehicle "TRK-101" available

  Scenario: Successful dispatch of a confirmed order
    Given a confirmed order "DEMO-ORD-1001" assigned to "Central Warehouse"
    When I assign the order to vehicle "TRK-101"
    And I confirm the dispatch
    Then the order status changes to "Dispatched"
    And the audit log shows the dispatch event
    And the API returns a 200 response with status "Dispatched"

  Scenario: Capacity-exceeded conflict (regression risk)
    Given a confirmed order "DEMO-ORD-1002"
    And vehicle "TRK-101" is already at capacity
    When I try to assign the order to vehicle "TRK-101"
    Then the UI shows a clear capacity error
    And the API returns a 409 conflict response
    And the order status is not "Dispatched"
```

## Confidentiality note

Scenario text, names, and IDs are fictional and used only for portfolio demonstration.
