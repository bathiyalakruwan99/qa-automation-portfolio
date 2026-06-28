import { test } from '../fixtures/demoFixtures';
import { signIn, addItemsToCart, enterShipping } from '../flows/demo-checkout.flow';

test.describe('@regression Shipping', () => {
  test('TC003 - enter a valid shipping address and continue to payment', async ({ page, env, shipping }) => {
    await signIn({ page, ...env });
    await addItemsToCart({ page, ...env });
    await enterShipping({ page, ...env });
    await shipping.continueToPayment();
  });
});
