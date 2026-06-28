# Sample BDD Scenario (Synthetic)

> Fictional example. Not runnable. Names and data are invented.

```gherkin
Feature: Checkout coupon application
  As Customer Alpha
  I want to apply a coupon at checkout
  So that a valid discount is reflected in my order total

  Scenario: Apply a valid coupon
    Given Customer Alpha has Order DEMO-1001 in the cart
    When the coupon "DEMO-SAVE10" is applied
    Then the order total is reduced by 10 percent
    And the coupon is shown as applied

  Scenario: Reject an expired coupon
    Given Customer Alpha has Order DEMO-1001 in the cart
    When the expired coupon "DEMO-OLD" is applied
    Then the coupon is rejected
    And the order total is unchanged
```

QA notes: positive and negative paths are both covered; the order total is the key assertion in each scenario.
