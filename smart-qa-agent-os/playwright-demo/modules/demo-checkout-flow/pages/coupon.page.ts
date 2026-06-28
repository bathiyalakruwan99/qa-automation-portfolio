import { Page, expect } from '@playwright/test';
import type { Coupon } from '../data/types';

export class CouponPage {
  constructor(private readonly page: Page) {}

  async apply(coupon: Coupon): Promise<void> {
    await this.page.getByTestId('coupon-input').fill(coupon.code);
    await this.page.getByRole('button', { name: 'Apply coupon' }).click();
    await expect(this.page.getByTestId('coupon-applied')).toContainText(`-${coupon.percentOff}%`);
  }
}
