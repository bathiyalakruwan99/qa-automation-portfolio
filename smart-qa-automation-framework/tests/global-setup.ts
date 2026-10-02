import { request } from '@playwright/test';
import { loadEnv } from '../src/config/env';

/** Starts every run from the demo app's empty seed state. Runs once, after the web server is up. */
export default async function globalSetup(): Promise<void> {
  const env = loadEnv();
  const ctx = await request.newContext({ baseURL: env.baseUrl });
  try {
    const res = await ctx.post('/api/test/reset');
    if (res.status() !== 204) {
      throw new Error(
        `Demo store reset failed with HTTP ${res.status()}. Is the demo app running with DEMO_TEST_MODE=1?`,
      );
    }
  } finally {
    await ctx.dispose();
  }
}
