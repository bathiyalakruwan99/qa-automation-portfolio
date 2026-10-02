import { test } from '../fixtures/demoFixtures';
import { signIn, addItemsToCart } from '../flows/demo-checkout.flow';

test.describe('@regression Add to cart', () => {
  test('TC002 - add multiple items and see them in the cart', async ({ page, env }) => {
    await signIn({ page, ...env });
    await addItemsToCart({ page, ...env });
  });
});
