import { Locator, Page } from '@playwright/test';

/**
 * Synthetic component object for the coupon panel.
 */
export class CouponPanel {
  readonly root: Locator;
  readonly input: Locator;
  readonly applyButton: Locator;
  readonly removeButton: Locator;
  readonly badge: Locator;

  constructor(page: Page) {
    this.root = page.getByTestId('coupon-panel');
    this.input = this.root.getByLabel('Coupon code');
    this.applyButton = this.root.getByRole('button', { name: 'Apply' });
    this.removeButton = this.root.getByRole('button', { name: 'Remove coupon' });
    this.badge = this.root.getByTestId('coupon-applied-badge');
  }

  async apply(code: string): Promise<void> {
    await this.input.fill(code);
    await this.applyButton.click();
  }

  async remove(): Promise<void> {
    await this.removeButton.click();
  }
}
