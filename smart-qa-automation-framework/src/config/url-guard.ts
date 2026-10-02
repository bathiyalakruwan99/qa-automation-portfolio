/**
 * Refuses to run the suite against anything that is not obviously a local or reserved test host,
 * unless the operator opts in explicitly. Prevents a mistyped env var from pointing destructive
 * tests (create / delete / state changes) at a real system.
 */
const SAFE_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);
// RFC 2606 / RFC 6761 reserved names that can never resolve to a real public system.
const SAFE_SUFFIXES = ['.test', '.example', '.invalid', '.localhost'];

export class UnsafeTargetError extends Error {
  constructor(url: string, reason: string) {
    super(
      `Refusing to run against "${url}": ${reason}. Set ALLOW_EXTERNAL_TARGET=1 only for a target you own.`,
    );
    this.name = 'UnsafeTargetError';
  }
}

export function isSafeHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return SAFE_HOSTS.has(host) || SAFE_SUFFIXES.some((suffix) => host.endsWith(suffix));
}

export function assertSafeBaseUrl(rawUrl: string, allowExternal = false): URL {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new UnsafeTargetError(rawUrl, 'not a valid absolute URL');
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new UnsafeTargetError(rawUrl, `unsupported protocol ${url.protocol}`);
  }
  if (url.username || url.password) {
    throw new UnsafeTargetError(rawUrl, 'credentials must not be embedded in the URL');
  }
  if (!allowExternal && !isSafeHost(url.hostname)) {
    throw new UnsafeTargetError(rawUrl, `host "${url.hostname}" is not a local or reserved test host`);
  }
  return url;
}
