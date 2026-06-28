import { test, expect } from '../fixtures/demoFixtures';
import {
  signIn,
  addItemsToCart,
  enterShipping,
} from '../flows/demo-checkout.flow';

test.describe('@regression @negative Negative and validation scenarios', () => {
  test('NEG-001 - missing required shipping field surfaces a clear error', async ({ page, env, shipping }) => {
    await signIn({ page, ...env });
    await addItemsToCart({ page, ...env });
    await shipping.fillAddress({ ...env.data.shipping, postcode: '' });
    await page.getByRole('button', { name: 'Continue to payment' }).click();
    await expect(page.getByRole('alert')).toContainText('Postcode is required');
  });

  test('NEG-002 - invalid coupon is rejected and no discount is applied', async ({ page, env }) => {
    await signIn({ page, ...env });
    await addItemsToCart({ page, ...env });
    await enterShipping({ page, ...env });
    await page.getByTestId('coupon-input').fill('INVALID-CODE');
    await page.getByRole('button', { name: 'Apply coupon' }).click();
    await expect(page.getByRole('alert')).toContainText('Coupon is not valid');
    await expect(page.getByTestId('coupon-applied')).toHaveCount(0);
  });

  test('NEG-003 - expired card is rejected at payment', async ({ page, env, payment }) => {
    await signIn({ page, ...env });
    await addItemsToCart({ page, ...env });
    await enterShipping({ page, ...env });
    await page.getByRole('button', { name: 'Continue to payment' }).click();
    await payment.fillPayment({ ...env.data.payment, expiry: '01/20' });
    await page.getByRole('button', { name: 'Place order' }).click();
    await expect(page.getByRole('alert')).toContainText('Card is expired');
  });
});
