import { describe, expect, it } from 'vitest';
import { loadEnv } from '../env';
import { assertSafeBaseUrl, isSafeHost, UnsafeTargetError } from '../url-guard';

describe('isSafeHost', () => {
  it.each([
    'localhost',
    '127.0.0.1',
    '[::1]',
    'demo.test',
    'app.northstar.example',
    'x.invalid',
    'LOCALHOST',
  ])('accepts %s', (host) => expect(isSafeHost(host)).toBe(true));

  it.each(['example.com', 'demo.test.com', 'localhost.evil.com', '10.0.0.5', 'testing.io'])(
    'rejects %s',
    (host) => expect(isSafeHost(host)).toBe(false),
  );
});

describe('assertSafeBaseUrl', () => {
  it('returns the parsed URL for a local target', () => {
    expect(assertSafeBaseUrl('http://localhost:3000').port).toBe('3000');
  });

  it('rejects a public host by default', () => {
    expect(() => assertSafeBaseUrl('https://example.com')).toThrow(UnsafeTargetError);
  });

  it('allows a public host only with explicit opt-in', () => {
    expect(assertSafeBaseUrl('https://example.com', true).hostname).toBe('example.com');
  });

  it('rejects embedded credentials even with opt-in', () => {
    expect(() => assertSafeBaseUrl('https://user:secret@example.com', true)).toThrow(/credentials/);
  });

  it.each(['not a url', 'ftp://localhost/file', '/relative/path'])('rejects invalid input %s', (input) => {
    expect(() => assertSafeBaseUrl(input)).toThrow(UnsafeTargetError);
  });
});

describe('loadEnv', () => {
  it('uses local demo defaults', () => {
    expect(loadEnv({})).toEqual({
      baseUrl: 'http://localhost:3000',
      username: 'demo.user@example.test',
      password: 'demo-password',
    });
  });

  it('strips a trailing slash from the base URL', () => {
    expect(loadEnv({ DEMO_BASE_URL: 'http://127.0.0.1:4000/' }).baseUrl).toBe('http://127.0.0.1:4000');
  });

  it('fails fast on an unsafe target', () => {
    expect(() => loadEnv({ DEMO_BASE_URL: 'https://example.com' })).toThrow(UnsafeTargetError);
  });
});
