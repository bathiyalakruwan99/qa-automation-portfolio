Feature: Checkout coupon apply and remove
  As a shopper
  I want to apply and remove coupons during checkout
  So that I can see the correct order total

  Background:
    Given the demo store has product "ACME-SKU-001" priced at $25.00
    And coupon "WELCOME10" gives 10% off with a $20 minimum

  Scenario: Apply a valid coupon
    Given I am on the payment page with one item in the cart
    When I apply coupon "WELCOME10"
    Then the order total should be "$22.50"

  Scenario: Remove an applied coupon
    Given I have applied coupon "WELCOME10"
    When I remove the coupon
    Then the order total should be "$25.00"

  Scenario: Coupon below minimum is rejected
    Given I have a cart total of "$5.00"
    When I apply coupon "WELCOME10"
    Then I should see the error "Spend at least $20 to use this coupon."
    And the order total should be "$5.00"
