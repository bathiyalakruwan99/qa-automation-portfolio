import { Page, expect } from '@playwright/test';

export class AccountOrdersPage {
  constructor(private readonly page: Page) {}

  async goto(baseUrl: string): Promise<void> {
    await this.page.goto(`${baseUrl}/account/orders`);
  }

  async expectOrderVisible(orderRef: string): Promise<void> {
    const row = this.page.getByTestId('account-order-row').filter({ hasText: orderRef });
    await expect(row).toBeVisible();
  }

  async expectOrderStatus(orderRef: string, status: string): Promise<void> {
    const row = this.page.getByTestId('account-order-row').filter({ hasText: orderRef });
    await expect(row.getByTestId('account-order-status')).toHaveText(status);
  }
}
