import { Page, expect } from '@playwright/test';

export class CartPage {
  constructor(private readonly page: Page) {}

  async goto(baseUrl: string): Promise<void> {
    await this.page.goto(`${baseUrl}/cart`);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Your cart' })).toBeVisible();
  }

  async expectRowCount(count: number): Promise<void> {
    await expect(this.page.getByTestId('cart-row')).toHaveCount(count);
  }

  async removeItem(sku: string): Promise<void> {
    const row = this.page.getByTestId('cart-row').filter({ hasText: sku });
    await row.getByRole('button', { name: 'Remove' }).click();
  }

  async checkout(): Promise<void> {
    await this.page.getByRole('button', { name: 'Checkout' }).click();
  }
}
