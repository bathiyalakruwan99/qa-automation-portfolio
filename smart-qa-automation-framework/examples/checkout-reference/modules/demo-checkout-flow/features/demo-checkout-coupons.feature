Feature: Coupon application
  As a registered customer
  I want to apply a coupon at checkout
  So that the discount is reflected before I pay

  Background:
    Given I am signed in as a demo customer
    And I have 1 of "SKU-001" in my cart
    And I have entered a valid shipping address

  @regression
  Scenario: Valid coupon is accepted
    When I apply coupon "WELCOME10"
    Then a discount of "-10%" is shown on the order summary

  @regression @negative
  Scenario: Invalid coupon is rejected
    When I apply coupon "INVALID-CODE"
    Then a clear "coupon not valid" error is shown
    And no discount is applied
