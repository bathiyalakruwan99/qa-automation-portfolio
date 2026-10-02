const SENSITIVE_KEY = /pass(word)?|secret|token|authorization|cookie|api[-_]?key/i;
const BEARER = /Bearer\s+[A-Za-z0-9._~+/-]+=*/g;

/** Deep-copies a value with sensitive keys masked, so evidence can be logged and attached safely. */
export function redact(value: unknown, depth = 0): unknown {
  if (depth > 8) return '[depth limit]';
  if (typeof value === 'string') return value.replace(BEARER, 'Bearer [REDACTED]');
  if (Array.isArray(value)) return value.map((v) => redact(v, depth + 1));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, SENSITIVE_KEY.test(k) ? '[REDACTED]' : redact(v, depth + 1)]),
    );
  }
  return value;
}

/** Short, safe one-line summary of a body for assertion messages. */
export function summarize(value: unknown, max = 300): string {
  const text = JSON.stringify(redact(value)) ?? String(value);
  return text.length > max ? `${text.slice(0, max)}…` : text;
}
