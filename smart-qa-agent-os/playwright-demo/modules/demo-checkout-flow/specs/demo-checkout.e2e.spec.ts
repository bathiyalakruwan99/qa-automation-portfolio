import { test, expect } from '../fixtures/demoFixtures';
import { runEndToEnd } from '../flows/demo-checkout.flow';

test.describe('@e2e Demo Checkout', () => {
  test('TC001 - customer can complete a full checkout through every sub-flow', async ({ page, env }) => {
    const result = await runEndToEnd({ page, ...env });
    expect(result.orderRef).toContain(env.data.expected.orderRefPrefix);
  });
});
