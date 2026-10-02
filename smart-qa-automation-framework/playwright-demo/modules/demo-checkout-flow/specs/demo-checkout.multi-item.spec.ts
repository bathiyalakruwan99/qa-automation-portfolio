import { test } from '../fixtures/demoFixtures';
import { signIn } from '../flows/demo-checkout.flow';
import { HomePage } from '../pages/home.page';

test.describe('@regression Multi-item cart', () => {
  test('TC007 - add several items in a single session and see them all in the cart', async ({ page, env, products, cart }) => {
    await signIn({ page, ...env });
    await new HomePage(page).openShop();
    await products.expectLoaded();

    const items = Array.from({ length: 5 }).map((_, i) => ({
      sku: `SKU-${String(100 + i).padStart(3, '0')}`,
      name: `Demo Item ${i + 1}`,
      quantity: 1,
      unitPrice: 5 + i,
    }));

    await products.addItems(items);

    await cart.goto(env.baseUrl);
    await cart.expectLoaded();
    await cart.expectRowCount(items.length);
  });
});
