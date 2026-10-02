import { describe, expect, it } from 'vitest';
import { redact, summarize } from '../redact';
import { validateSchema } from '../schema-validator';

describe('redact', () => {
  it('masks sensitive keys at any depth', () => {
    expect(
      redact({ email: 'demo.user@example.test', password: 'x', nested: { token: 'y', apiKey: 'z', ok: 1 } }),
    ).toEqual({
      email: 'demo.user@example.test',
      password: '[REDACTED]',
      nested: { token: '[REDACTED]', apiKey: '[REDACTED]', ok: 1 },
    });
  });

  it('masks bearer tokens inside strings', () => {
    expect(redact('Authorization: Bearer abc.def-123')).toBe('Authorization: Bearer [REDACTED]');
  });

  it('truncates long summaries', () => {
    expect(summarize({ text: 'a'.repeat(1000) }, 50)).toHaveLength(51);
  });
});

const shipment = {
  shipmentId: 'DEMO-SHP-1001',
  reference: 'DEMO-REF-001',
  customerId: 'CUSTOMER-ALPHA',
  vehicleType: 'TRUCK',
  origin: 'WAREHOUSE-ALPHA',
  destination: 'CUSTOMER-SITE-BETA',
  weightKg: 100,
  status: 'CREATED',
  vehicleId: null,
  tasks: [],
  history: [{ from: null, to: 'CREATED', at: '2026-01-01T00:00:00.000Z' }],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('validateSchema', () => {
  it('accepts a contract-conformant shipment and list', () => {
    expect(validateSchema('shipment', shipment).valid).toBe(true);
    expect(validateSchema('shipment-list', { items: [shipment], total: 1 }).valid).toBe(true);
  });

  it('reports an undocumented status', () => {
    const result = validateSchema('shipment', { ...shipment, status: 'ON_HOLD' });
    expect(result.valid).toBe(false);
    expect(result.errors.join()).toContain('/status');
  });

  it('reports unexpected and missing fields', () => {
    const { vehicleId: _omit, ...missing } = shipment;
    expect(validateSchema('shipment', missing).errors.join()).toContain('vehicleId');
    expect(validateSchema('shipment', { ...shipment, internalNote: 'x' }).valid).toBe(false);
  });

  it('validates the error contract', () => {
    expect(validateSchema('error', { error: { code: 'NOT_FOUND', message: 'x' } }).valid).toBe(true);
    expect(validateSchema('error', { message: 'x' }).valid).toBe(false);
  });
});
