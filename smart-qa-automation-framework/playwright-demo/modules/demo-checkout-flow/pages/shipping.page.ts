import { Page, expect } from '@playwright/test';
import type { ShippingAddress } from '../data/types';

export class ShippingPage {
  constructor(private readonly page: Page) {}

  async fillAddress(address: ShippingAddress): Promise<void> {
    await this.page.getByTestId('ship-full-name').fill(address.fullName);
    await this.page.getByTestId('ship-line1').fill(address.line1);
    await this.page.getByTestId('ship-city').fill(address.city);
    await this.page.getByTestId('ship-postcode').fill(address.postcode);
    await this.page.getByTestId('ship-country').selectOption(address.country);
  }

  async continueToPayment(): Promise<void> {
    await this.page.getByRole('button', { name: 'Continue to payment' }).click();
    await expect(this.page.getByRole('heading', { name: 'Payment' })).toBeVisible();
  }
}
