import { type APIRequestContext, test as base } from '@playwright/test';
import { AuthClient } from '../api/clients/auth.client';
import { ShipmentClient } from '../api/clients/shipment.client';
import { TestSupportClient } from '../api/clients/test-support.client';
import { VehicleClient } from '../api/clients/vehicle.client';
import { readJson } from '../api/helpers/expect-response';
import type { CreateShipmentRequest, Shipment } from '../api/models/shipment.types';
import { type DemoEnv, loadEnv } from '../config/env';
import { ShipmentBuilder } from '../test-data/shipment.builder';
import { seedFromEnv } from '../utils/seeded-random';
import { CleanupRegistry } from './cleanup-registry';

interface WorkerFixtures {
  env: DemoEnv;
  apiToken: string;
  shipmentBuilder: ShipmentBuilder;
}

export interface ApiFixtures {
  /** Request context authorised as the demo user. */
  api: APIRequestContext;
  /** Request context with no credentials, for auth tests. */
  anonymousApi: APIRequestContext;
  shipments: ShipmentClient;
  vehicles: VehicleClient;
  auth: AuthClient;
  testSupport: TestSupportClient;
  cleanup: CleanupRegistry;
  /** Creates a shipment through the API, registers it for cleanup and returns it. */
  createShipment: (overrides?: Partial<CreateShipmentRequest>) => Promise<Shipment>;
}

export const test = base.extend<ApiFixtures, WorkerFixtures>({
  env: [async ({}, use) => use(loadEnv()), { scope: 'worker' }],

  apiToken: [
    async ({ playwright, env }, use) => {
      const ctx = await playwright.request.newContext({ baseURL: env.baseUrl });
      const token = await new AuthClient(ctx).token(env.username, env.password);
      await ctx.dispose();
      await use(token);
    },
    { scope: 'worker' },
  ],

  shipmentBuilder: [
    async ({}, use, workerInfo) => {
      const seed = seedFromEnv() + workerInfo.workerIndex;
      console.log(`[data] worker ${workerInfo.workerIndex} uses DEMO_SEED=${seed}`);
      await use(new ShipmentBuilder(seed, `${seed.toString(36)}W${workerInfo.workerIndex}`));
    },
    { scope: 'worker' },
  ],

  api: async ({ playwright, env, apiToken }, use) => {
    const ctx = await playwright.request.newContext({
      baseURL: env.baseUrl,
      extraHTTPHeaders: { Authorization: `Bearer ${apiToken}` },
    });
    await use(ctx);
    await ctx.dispose();
  },

  anonymousApi: async ({ playwright, env }, use) => {
    const ctx = await playwright.request.newContext({ baseURL: env.baseUrl });
    await use(ctx);
    await ctx.dispose();
  },

  shipments: async ({ api }, use) => use(new ShipmentClient(api)),
  vehicles: async ({ api }, use) => use(new VehicleClient(api)),
  auth: async ({ anonymousApi }, use) => use(new AuthClient(anonymousApi)),
  testSupport: async ({ anonymousApi }, use) => use(new TestSupportClient(anonymousApi)),

  cleanup: async ({ shipments }, use, testInfo) => {
    const registry = new CleanupRegistry();
    await use(registry);
    const problems = await registry.run(shipments);
    if (problems.length > 0) {
      testInfo.annotations.push({ type: 'cleanup', description: problems.join('; ') });
    }
  },

  createShipment: async ({ shipments, shipmentBuilder, cleanup }, use) => {
    await use(async (overrides = {}) => {
      const created = await readJson<Shipment>(
        await shipments.create(shipmentBuilder.build(overrides)),
        201,
        'shipment',
      );
      cleanup.track(created.shipmentId);
      return created;
    });
  },
});

export { expect } from '@playwright/test';
