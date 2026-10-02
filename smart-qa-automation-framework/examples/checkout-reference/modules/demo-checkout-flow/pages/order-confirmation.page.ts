import { Page, expect } from '@playwright/test';

export class OrderConfirmationPage {
  constructor(private readonly page: Page) {}

  async readOrderRef(): Promise<string> {
    return (await this.page.getByTestId('confirmation-order-ref').innerText()).trim();
  }

  async expectStatus(status: string): Promise<void> {
    await expect(this.page.getByTestId('confirmation-status')).toHaveText(status);
  }
}
