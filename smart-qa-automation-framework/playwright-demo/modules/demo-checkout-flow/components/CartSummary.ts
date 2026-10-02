import { Locator, Page, expect } from '@playwright/test';

export class CartSummary {
  readonly root: Locator;

  constructor(page: Page) {
    this.root = page.getByTestId('cart-summary');
  }

  async expectVisible(): Promise<void> {
    await expect(this.root).toBeVisible();
  }

  async expectItemCount(count: number): Promise<void> {
    await expect(this.root.getByTestId('cart-summary-item-count')).toHaveText(String(count));
  }

  async expectTotal(total: string): Promise<void> {
    await expect(this.root.getByTestId('cart-summary-total')).toHaveText(total);
  }
}
