import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp, DEMO_USER } from '../src/app';

/** Starts the real Express app on a random loopback port and talks to it over HTTP. */
function startServer(testMode: boolean): Promise<{ server: Server; base: string }> {
  return new Promise((resolve) => {
    const server = createApp({ testMode }).listen(0, '127.0.0.1', () => {
      const { port } = server.address() as AddressInfo;
      resolve({ server, base: `http://127.0.0.1:${port}` });
    });
  });
}

describe('demo app over HTTP', () => {
  let server: Server;
  let base: string;
  let auth: Record<string, string>;

  beforeAll(async () => {
    ({ server, base } = await startServer(true));
    const res = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(DEMO_USER),
    });
    const { token } = (await res.json()) as { token: string };
    auth = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  });

  afterAll(() => new Promise<void>((done) => server.close(() => done())));

  it('serves health and the login page without auth', async () => {
    expect((await fetch(`${base}/health`)).status).toBe(200);
    expect(await (await fetch(`${base}/`)).text()).toContain('Sign in');
  });

  it('rejects wrong credentials with 401 and a stable error code', async () => {
    const res = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: DEMO_USER.email, password: 'wrong' }),
    });
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({
      error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
    });
  });

  it('protects /api/demo with a Bearer token', async () => {
    expect((await fetch(`${base}/api/demo/shipments`)).status).toBe(401);
    expect(
      (await fetch(`${base}/api/demo/shipments`, { headers: { Authorization: 'Bearer forged' } })).status,
    ).toBe(401);
  });

  it('maps malformed JSON to 400 INVALID_JSON', async () => {
    const res = await fetch(`${base}/api/demo/shipments`, { method: 'POST', headers: auth, body: '{bad' });
    expect(res.status).toBe(400);
    expect(((await res.json()) as { error: { code: string } }).error.code).toBe('INVALID_JSON');
  });

  it('returns 404 JSON for unknown API routes', async () => {
    const res = await fetch(`${base}/api/demo/nothing-here`, { headers: auth });
    expect(res.status).toBe(404);
  });

  it('keeps test hooks unavailable when test mode is off', async () => {
    const plain = await startServer(false);
    try {
      expect((await fetch(`${plain.base}/api/test/reset`, { method: 'POST' })).status).toBe(404);
    } finally {
      await new Promise<void>((done) => plain.server.close(() => done()));
    }
  });
});
