import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CheckoutPage } from '../pages/Checkout.page';

let checkout: CheckoutPage;
let initialTotal = '';

Given('I am on the payment page with one item in the cart', async function () {
  // Navigate to demo payment page with seeded cart (fixture omitted for brevity)
  checkout = new CheckoutPage(this.page);
  initialTotal = await checkout.getTotal();
});

When('I apply coupon {string}', async function (code: string) {
  await checkout.applyCoupon(code);
});

Then('the order total should be {string}', async function (expected: string) {
  const total = await checkout.getTotal();
  expect(total).toBe(expected);
});

When('I remove the coupon', async function () {
  await this.page.getByRole('button', { name: 'Remove coupon' }).click();
});

Given('I have applied coupon {string}', async function (code: string) {
  checkout = new CheckoutPage(this.page);
  await checkout.applyCoupon(code);
});

Given('I have a cart total of {string}', async function (_total: string) {
  checkout = new CheckoutPage(this.page);
  initialTotal = await checkout.getTotal();
});

Then('I should see the error {string}', async function (msg: string) {
  await expect(checkout.errorAlert).toContainText(msg);
});
