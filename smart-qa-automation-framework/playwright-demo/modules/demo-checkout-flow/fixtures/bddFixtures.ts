import { test as demoTest } from './demoFixtures';

interface BddWorld {
  context: {
    orderRef?: string;
    itemCount?: number;
    couponCode?: string;
    paidWithCard?: string;
  };
}

export const test = demoTest.extend<BddWorld>({
  context: async ({}, use) => {
    const state: BddWorld['context'] = {};
    await use(state);
  },
});

export { expect } from '@playwright/test';
