import { test as base, expect } from '@playwright/test';

type DemoFixtures = {
  demoCart: { sku: string; qty: number };
  demoCoupon: { code: string; minSpend: number; discountPct: number };
};

export const test = base.extend<DemoFixtures>({
  demoCart: async ({ request }, use) => {
    const cart = { sku: 'ACME-SKU-001', qty: 1 };
    await request.post('/api/demo/cart/seed', { data: cart });
    await use(cart);
    await request.delete('/api/demo/cart/clear');
  },
  demoCoupon: async ({ request }, use) => {
    const coupon = { code: 'WELCOME10', minSpend: 20, discountPct: 10 };
    await request.post('/api/demo/coupons/seed', { data: coupon });
    await use(coupon);
    await request.delete('/api/demo/coupons/clear');
  },
});

export { expect };
