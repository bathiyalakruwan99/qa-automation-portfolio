import { test, expect } from '../fixtures/demoFixtures';
import {
  signIn,
  addItemsToCart,
  enterShipping,
  applyCoupon,
  completePayment,
} from '../flows/demo-checkout.flow';

test.describe('@regression Payment', () => {
  test('TC005 - place order with a demo card and see confirmation', async ({ page, env }) => {
    await signIn({ page, ...env });
    await addItemsToCart({ page, ...env });
    await enterShipping({ page, ...env });
    await applyCoupon({ page, ...env });
    const result = await completePayment({ page, ...env });
    expect(result.orderRef).toContain(env.data.expected.orderRefPrefix);
  });
});
