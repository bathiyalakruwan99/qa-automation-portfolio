import type { APIRequestContext, APIResponse } from '@playwright/test';

export class AuthClient {
  constructor(private readonly request: APIRequestContext) {}

  login(email: string, password: string): Promise<APIResponse> {
    return this.request.post('/api/auth/login', { data: { email, password } });
  }

  /** Logs in and returns the bearer token, failing with a safe message if login is rejected. */
  async token(email: string, password: string): Promise<string> {
    const res = await this.login(email, password);
    if (!res.ok()) throw new Error(`Demo login failed with HTTP ${res.status()}`);
    const body = (await res.json()) as { token?: unknown };
    if (typeof body.token !== 'string') throw new Error('Demo login returned no token');
    return body.token;
  }
}
