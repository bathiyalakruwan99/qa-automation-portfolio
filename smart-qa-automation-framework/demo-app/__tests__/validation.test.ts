import { describe, expect, it } from 'vitest';
import { DomainError } from '../src/domain';
import { validateCreateShipment } from '../src/validation';

const valid = {
  reference: 'demo-ref-001',
  customerId: 'CUSTOMER-ALPHA',
  vehicleType: 'TRUCK',
  origin: 'WAREHOUSE-ALPHA',
  destination: 'CUSTOMER-SITE-BETA',
  weightKg: 1200,
};

function errorOf(body: unknown): DomainError {
  try {
    validateCreateShipment(body);
  } catch (e) {
    if (e instanceof DomainError) return e;
    throw e;
  }
  throw new Error('expected validation to fail');
}

describe('validateCreateShipment', () => {
  it('accepts a valid body and upper-cases the reference', () => {
    expect(validateCreateShipment(valid)).toEqual({ ...valid, reference: 'DEMO-REF-001' });
  });

  it.each([
    ['customerId', 'REQUIRED_FIELD'],
    ['reference', 'REQUIRED_FIELD'],
    ['vehicleType', 'REQUIRED_FIELD'],
    ['weightKg', 'REQUIRED_FIELD'],
  ])('rejects a missing %s', (field, code) => {
    const body: Record<string, unknown> = { ...valid };
    delete body[field];
    expect(errorOf(body)).toMatchObject({ httpStatus: 400, code, field });
  });

  it('rejects an unsupported vehicle type', () => {
    expect(errorOf({ ...valid, vehicleType: 'BICYCLE' })).toMatchObject({
      httpStatus: 400,
      code: 'UNSUPPORTED_VEHICLE_TYPE',
    });
  });

  it('rejects unknown customers and locations', () => {
    expect(errorOf({ ...valid, customerId: 'CUSTOMER-ZETA' }).code).toBe('UNKNOWN_CUSTOMER');
    expect(errorOf({ ...valid, origin: 'NOWHERE' }).code).toBe('UNKNOWN_LOCATION');
  });

  it('rejects identical origin and destination (cross-field rule)', () => {
    expect(errorOf({ ...valid, destination: valid.origin })).toMatchObject({
      code: 'SAME_ORIGIN_DESTINATION',
      field: 'destination',
    });
  });

  it.each([0, -5, 30001])('rejects out-of-range weight %s', (weightKg) => {
    expect(errorOf({ ...valid, weightKg }).code).toBe('OUT_OF_RANGE');
  });

  it('accepts the maximum weight boundary', () => {
    expect(validateCreateShipment({ ...valid, weightKg: 30000 }).weightKg).toBe(30000);
  });

  it.each(['AB', 'has space', 'x'.repeat(41)])('rejects badly formatted reference %j', (reference) => {
    expect(errorOf({ ...valid, reference }).code).toBe('INVALID_FORMAT');
  });

  it.each([null, [], 'text'])('rejects a non-object body %j', (body) => {
    expect(errorOf(body).code).toBe('INVALID_BODY');
  });
});
