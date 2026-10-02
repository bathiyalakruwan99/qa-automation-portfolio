import { Page, Locator, expect } from '@playwright/test';

/**
 * Synthetic POM example for portfolio demonstration.
 * No real product is represented.
 */
export class CheckoutPage {
  readonly page: Page;
  readonly couponInput: Locator;
  readonly applyCouponButton: Locator;
  readonly orderTotal: Locator;
  readonly placeOrderButton: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.couponInput = page.getByLabel('Coupon code');
    this.applyCouponButton = page
      .getByTestId('coupon-panel')
      .getByRole('button', { name: 'Apply' });
    this.orderTotal = page.getByTestId('order-total');
    this.placeOrderButton = page.getByTestId('place-order');
    this.errorAlert = page.getByRole('alert');
  }

  async applyCoupon(code: string): Promise<void> {
    await this.couponInput.fill(code);
    await this.applyCouponButton.click();
  }

  async getTotal(): Promise<string> {
    await expect(this.orderTotal).toBeVisible();
    return (await this.orderTotal.textContent())?.trim() ?? '';
  }

  async placeOrder(): Promise<void> {
    await expect(this.placeOrderButton).toBeEnabled();
    await this.placeOrderButton.click();
  }
}
