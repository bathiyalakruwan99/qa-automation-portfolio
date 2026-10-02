import { Page, expect } from '@playwright/test';

export class HomePage {
  constructor(private readonly page: Page) {}

  async expectLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Acme Demo Store' })).toBeVisible();
  }

  async openShop(): Promise<void> {
    await this.page.getByTestId('cta-shop-now').click();
  }
}
