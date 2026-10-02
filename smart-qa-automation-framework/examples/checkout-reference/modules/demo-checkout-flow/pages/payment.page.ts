import { Page, expect } from '@playwright/test';
import type { PaymentDetails } from '../data/types';

export class PaymentPage {
  constructor(private readonly page: Page) {}

  async fillPayment(payment: PaymentDetails): Promise<void> {
    await this.page.getByTestId('card-holder').fill(payment.cardholder);
    await this.page.getByTestId('card-number').fill(payment.cardNumberMasked);
    await this.page.getByTestId('card-expiry').fill(payment.expiry);
  }

  async placeOrder(): Promise<void> {
    await this.page.getByRole('button', { name: 'Place order' }).click();
    await expect(this.page.getByRole('heading', { name: 'Order confirmed' })).toBeVisible();
  }
}
