import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../pages/Checkout.page';

test.describe('Checkout coupon - UI', () => {
  test('valid coupon updates total', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    // Seed cart via demo fixture (omitted)
    await checkout.applyCoupon('WELCOME10');
    const total = await checkout.getTotal();
    expect(total).toBe('$22.50');
  });

  test('invalid coupon shows error', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.applyCoupon('FAKE');
    await expect(checkout.errorAlert).toContainText('not recognised');
  });
});
