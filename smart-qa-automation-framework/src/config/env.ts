import { assertSafeBaseUrl } from './url-guard';

export interface DemoEnv {
  baseUrl: string;
  username: string;
  password: string;
}

/** Reads the demo configuration. Defaults are fake values that only work against the local demo app. */
export function loadEnv(source: NodeJS.ProcessEnv = process.env): DemoEnv {
  const baseUrl = source.DEMO_BASE_URL ?? 'http://localhost:3000';
  assertSafeBaseUrl(baseUrl, source.ALLOW_EXTERNAL_TARGET === '1');
  return {
    baseUrl: baseUrl.replace(/\/$/, ''),
    username: source.DEMO_USERNAME ?? 'demo.user@example.test',
    password: source.DEMO_PASSWORD ?? 'demo-password',
  };
}
