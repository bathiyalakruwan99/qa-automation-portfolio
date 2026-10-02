import { test, expect } from '../fixtures/demoFixtures';
import { signIn, addItemsToCart, enterShipping, applyCoupon } from '../flows/demo-checkout.flow';

test.describe('@regression Coupon application', () => {
  test('TC004 - applying a valid coupon shows the expected discount', async ({ page, env }) => {
    await signIn({ page, ...env });
    await addItemsToCart({ page, ...env });
    await enterShipping({ page, ...env });
    await applyCoupon({ page, ...env });
    await expect(page.getByTestId('coupon-applied')).toContainText(`-${env.data.coupon.percentOff}%`);
  });
});
