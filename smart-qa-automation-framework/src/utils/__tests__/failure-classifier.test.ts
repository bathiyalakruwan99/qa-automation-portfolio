import { describe, expect, it } from 'vitest';
import { classifyFailure } from '../failure-classifier';

describe('classifyFailure', () => {
  it.each([
    ['UnsafeTargetError: Refusing to run against "https://example.com"', 'ENVIRONMENT', 'unsafe-target'],
    ['apiRequestContext.get: connect ECONNREFUSED 127.0.0.1:3000', 'ENVIRONMENT', 'connection-refused'],
    ['Error: Demo store reset failed with HTTP 404', 'ENVIRONMENT', 'connection-refused'],
    ['apiRequestContext.get: getaddrinfo ENOTFOUND demo.test', 'NETWORK', 'network'],
    [
      '[STALLED] CARGO_LOADING was accepted but the state stayed IN_TRANSIT',
      'PRODUCT_DEFECT',
      'workflow-stalled',
    ],
    ['[UNEXPECTED_TRANSITION] PLAN_ROUTE moved ASSIGNED -> CREATED', 'PRODUCT_DEFECT', 'workflow-stalled'],
    ['[UNKNOWN_STATE] unknown status "ON_HOLD"', 'REQUIREMENT_GAP', 'workflow-unknown-state'],
    ['[TERMINAL_STATE] shipment is CANCELLED', 'TEST_DATA', 'workflow-terminal'],
    ['[TIMEOUT] deadline of 60000 ms passed', 'TIMING', 'workflow-timeout'],
    ['/api/demo/shipments returned 500 (expected 201): {...}', 'PRODUCT_DEFECT', 'server-error'],
    [
      '/api/demo/shipments/DEMO-SHP-1 does not match the "shipment" schema',
      'PRODUCT_DEFECT',
      'contract-drift',
    ],
    ['/api/demo/shipments returned 201 (expected 400): {...}', 'PRODUCT_DEFECT', 'rule-not-enforced'],
    [
      '/api/demo/shipments/DEMO-SHP-9/assign returned 422 (expected 200)',
      'TEST_DATA',
      'unexpected-client-error',
    ],
    [
      "Error: strict mode violation: getByRole('button') resolved to 2 elements",
      'TEST_DEFECT',
      'strict-mode',
    ],
    [
      "Error: expect(locator).toBeVisible() failed\nLocator: getByTestId('x')\nError: element(s) not found\n  - waiting for getByTestId('x')",
      'LOCATOR_CHANGE',
      'locator-not-found',
    ],
    ['locator.click: Timeout 10000ms exceeded.', 'TIMING', 'timeout'],
    ["TypeError: Cannot read properties of undefined (reading 'id')", 'TEST_DEFECT', 'test-code-error'],
  ])('%s -> %s', (message, classification, rule) => {
    expect(classifyFailure({ message })).toMatchObject({ classification, rule, confirmed: false });
  });

  it('prefers specific evidence: a 5xx wins over a later timeout in the same text', () => {
    const message =
      '/api/demo/shipments returned 503 (expected 200)\nlocator.click: Timeout 5000ms exceeded.';
    expect(classifyFailure({ message }).classification).toBe('PRODUCT_DEFECT');
  });

  it('does not guess on a plain assertion mismatch', () => {
    const result = classifyFailure({
      message:
        'Error: expect(locator).toHaveText(expected) failed\nExpected: "ASSIGNED"\nReceived: "CREATED"',
    });
    expect(result).toMatchObject({ classification: 'UNKNOWN', rule: 'fallback' });
    expect(result.recommendedAction).toMatch(/trace/);
  });

  it('reads the stack as well as the message', () => {
    expect(classifyFailure({ message: 'failed', stack: 'connect ECONNREFUSED' }).classification).toBe(
      'ENVIRONMENT',
    );
  });
});
