import { beforeEach, describe, expect, it } from 'vitest';
import type { CreateShipmentInput } from '../src/domain';
import { ShipmentStore } from '../src/store';

const input: CreateShipmentInput = {
  reference: 'DEMO-REF-100',
  customerId: 'CUSTOMER-ALPHA',
  vehicleType: 'TRUCK',
  origin: 'WAREHOUSE-ALPHA',
  destination: 'CUSTOMER-SITE-BETA',
  weightKg: 2000,
};

describe('ShipmentStore workflow', () => {
  let store: ShipmentStore;
  let id: string;

  beforeEach(() => {
    store = new ShipmentStore(() => new Date('2026-01-01T00:00:00Z'));
    id = store.create(input).shipmentId;
  });

  it('creates sequential demo IDs in CREATED state', () => {
    expect(id).toBe('DEMO-SHP-1001');
    expect(store.get(id).status).toBe('CREATED');
  });

  it('rejects a duplicate reference', () => {
    expect(() => store.create(input)).toThrow(expect.objectContaining({ code: 'DUPLICATE_REFERENCE' }));
  });

  it('runs the full happy path to CLOSED', () => {
    store.assign(id, 'TRUCK-001');
    store.changeStatus(id, 'ROUTE_PLANNED');
    store.changeStatus(id, 'IN_TRANSIT');
    expect(store.get(id).tasks.map((t) => t.type)).toEqual(['LOADING', 'TRANSIT', 'UNLOADING']);
    store.completeTask(id, 'LOADING');
    store.completeTask(id, 'TRANSIT');
    expect(store.completeTask(id, 'UNLOADING').status).toBe('DELIVERED');
    expect(store.changeStatus(id, 'CLOSED').status).toBe('CLOSED');
    expect(store.get(id).history.map((h) => h.to)).toEqual([
      'CREATED',
      'ASSIGNED',
      'ROUTE_PLANNED',
      'IN_TRANSIT',
      'DELIVERED',
      'CLOSED',
    ]);
  });

  it('never allows a direct jump to DELIVERED', () => {
    store.assign(id, 'TRUCK-001');
    expect(() => store.changeStatus(id, 'DELIVERED')).toThrow(
      expect.objectContaining({ httpStatus: 409, code: 'ILLEGAL_TRANSITION' }),
    );
  });

  it('enforces task order', () => {
    store.assign(id, 'TRUCK-001');
    store.changeStatus(id, 'ROUTE_PLANNED');
    store.changeStatus(id, 'IN_TRANSIT');
    expect(() => store.completeTask(id, 'UNLOADING')).toThrow(
      expect.objectContaining({ code: 'TASK_OUT_OF_ORDER' }),
    );
  });

  it('rejects a vehicle of the wrong type', () => {
    expect(() => store.assign(id, 'VAN-001')).toThrow(
      expect.objectContaining({ httpStatus: 422, code: 'VEHICLE_TYPE_MISMATCH' }),
    );
  });

  it('rejects a load above vehicle capacity, and accepts exactly at capacity', () => {
    const heavy = store.create({ ...input, reference: 'DEMO-REF-101', vehicleType: 'VAN', weightKg: 1501 });
    expect(() => store.assign(heavy.shipmentId, 'VAN-001')).toThrow(
      expect.objectContaining({ code: 'CAPACITY_EXCEEDED' }),
    );
    const exact = store.create({ ...input, reference: 'DEMO-REF-102', vehicleType: 'VAN', weightKg: 1500 });
    expect(store.assign(exact.shipmentId, 'VAN-001').status).toBe('ASSIGNED');
  });

  it('simulates a stall: STUCK_TASK accepts the request but changes nothing', () => {
    store.assign(id, 'TRUCK-001');
    store.changeStatus(id, 'ROUTE_PLANNED');
    store.changeStatus(id, 'IN_TRANSIT');
    store.injectFault(id, 'STUCK_TASK');
    const before = store.get(id);
    expect(store.completeTask(id, 'LOADING')).toEqual(before);
  });

  it('simulates an undocumented state with UNKNOWN_STATE', () => {
    expect(store.injectFault(id, 'UNKNOWN_STATE').status).toBe('ON_HOLD');
  });

  it('filters the list by status and free-text query', () => {
    store.create({ ...input, reference: 'OTHER-REF-200', customerId: 'CUSTOMER-BETA' });
    expect(store.list({ q: 'other' }).map((s) => s.reference)).toEqual(['OTHER-REF-200']);
    expect(store.list({ status: 'CREATED' })).toHaveLength(2);
  });

  it('returns copies so callers cannot mutate stored state', () => {
    const copy = store.get(id);
    copy.status = 'CLOSED';
    expect(store.get(id).status).toBe('CREATED');
  });

  it('reset clears shipments and the ID sequence', () => {
    store.reset();
    expect(store.list()).toEqual([]);
    expect(store.create(input).shipmentId).toBe('DEMO-SHP-1001');
  });
});
