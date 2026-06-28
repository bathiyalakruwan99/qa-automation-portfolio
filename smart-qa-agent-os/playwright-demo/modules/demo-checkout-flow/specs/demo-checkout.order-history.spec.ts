import { test } from '../fixtures/demoFixtures';
import {
  signIn,
  addItemsToCart,
  enterShipping,
  applyCoupon,
  completePayment,
  verifyOrderInHistory,
} from '../flows/demo-checkout.flow';

test.describe('@regression Order history', () => {
  test('TC006 - completed order appears in account order history with the right status', async ({ page, env }) => {
    await signIn({ page, ...env });
    await addItemsToCart({ page, ...env });
    await enterShipping({ page, ...env });
    await applyCoupon({ page, ...env });
    const result = await completePayment({ page, ...env });
    await verifyOrderInHistory({ page, ...env }, result);
  });
});
