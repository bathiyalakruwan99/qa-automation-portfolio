import { Page, expect } from '@playwright/test';
import type { CartItem } from '../data/types';

export class ProductsPage {
  constructor(private readonly page: Page) {}

  async expectLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Products' })).toBeVisible();
  }

  card(sku: string) {
    return this.page.getByTestId('product-card').filter({ hasText: sku });
  }

  async addItem(item: CartItem): Promise<void> {
    const card = this.card(item.sku);
    for (let i = 0; i < item.quantity; i++) {
      await card.getByRole('button', { name: 'Add to cart' }).click();
    }
  }

  async addItems(items: CartItem[]): Promise<void> {
    for (const item of items) {
      await this.addItem(item);
    }
  }
}
