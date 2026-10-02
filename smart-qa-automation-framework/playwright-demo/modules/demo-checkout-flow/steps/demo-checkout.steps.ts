import { test, expect } from '../fixtures/bddFixtures';
import * as flows from '../flows/demo-checkout.flow';

test.describe('Demo Checkout - BDD step coverage', () => {
  test('end-to-end coverage of every step in the feature', async ({
    page,
    env,
    context,
  }) => {
    await flows.signIn({ page, ...env });

    await flows.addItemsToCart({ page, ...env });
    context.itemCount = env.data.items.length;

    await flows.enterShipping({ page, ...env });
    await flows.applyCoupon({ page, ...env });
    context.couponCode = env.data.coupon.code;

    const result = await flows.completePayment({ page, ...env });
    context.orderRef = result.orderRef;
    context.paidWithCard = env.data.payment.cardNumberMasked;

    await flows.verifyOrderInHistory({ page, ...env }, result);

    expect(context.itemCount).toBe(env.data.items.length);
    expect(context.couponCode).toBe(env.data.coupon.code);
    expect(context.orderRef).toContain(env.data.expected.orderRefPrefix);
    expect(context.paidWithCard).toBe(env.data.payment.cardNumberMasked);
  });
});
