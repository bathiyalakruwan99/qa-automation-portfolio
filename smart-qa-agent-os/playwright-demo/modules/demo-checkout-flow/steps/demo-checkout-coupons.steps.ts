import { test, expect } from '../fixtures/bddFixtures';
import * as flows from '../flows/demo-checkout.flow';

test.describe('Coupon application - BDD coverage', () => {
  test('valid coupon shows the expected discount', async ({ page, env }) => {
    await flows.signIn({ page, ...env });
    await flows.addItemsToCart({ page, ...env });
    await flows.enterShipping({ page, ...env });
    await flows.applyCoupon({ page, ...env });
    await expect(page.getByTestId('coupon-applied')).toContainText(`-${env.data.coupon.percentOff}%`);
  });
});
