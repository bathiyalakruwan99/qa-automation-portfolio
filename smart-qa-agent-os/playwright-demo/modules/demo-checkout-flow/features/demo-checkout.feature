Feature: Demo Checkout - End to End
  As a registered customer of the Acme Demo Store
  I want to add items to my cart and complete checkout
  So that I receive a confirmed order I can see in my order history

  Background:
    Given I am signed in as a demo customer

  @smoke @e2e
  Scenario: Successful end-to-end checkout
    When I add 2 of "SKU-001" and 1 of "SKU-002" to my cart
    And I enter a valid shipping address
    And I apply coupon "WELCOME10"
    And I place the order with a demo card
    Then I see an order confirmation with status "Confirmed"
    And the order appears in my account order history with status "Confirmed"
