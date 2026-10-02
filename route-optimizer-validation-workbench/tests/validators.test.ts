import path from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import { checkStructure, InputError, loadInput } from '../src/data/load';
import type { ValidationInput } from '../src/models/types';
import { formatReport } from '../src/reporting/report';
import { validatePlan } from '../src/validators';
import { makeDistanceValidator } from '../src/validators/distance.validator';
import { haversineKm } from '../src/validators/helpers';

const DATA = path.join(__dirname, '..', 'sample-data');
let input: ValidationInput;
const codes = (i: ValidationInput) => validatePlan(i).issues.map((x) => x.code);
const route = (vehicleId: string) => input.output.routes.find((r) => r.vehicleId === vehicleId)!;
const straightLineKm = (vehicleId: string) => {
  const byId = new Map(input.locations.map((l) => [l.id, l]));
  const ids = ['CENTRAL-HUB', ...route(vehicleId).stops.map((s) => s.locationId), 'CENTRAL-HUB'];
  return ids.slice(1).reduce((km, id, i) => km + haversineKm(byId.get(ids[i]!)!, byId.get(id)!), 0);
};

beforeEach(() => {
  input = structuredClone(loadInput(DATA, 'optimizer-output-clean.json'));
});

describe('Route optimizer output validation', () => {
  it('ROUTE-001 a clean plan has no findings, but is never "approved"', () => {
    const result = validatePlan(input);
    expect(result.issues).toEqual([]);
    expect(result.verdict).toBe('NO ISSUES FOUND - HUMAN REVIEW STILL REQUIRED');
    expect(formatReport(result)).not.toMatch(/approved|release approved/i);
  });

  it('ROUTE-002 an order missing from the output is critical', () => {
    route('TRUCK-002').stops = route('TRUCK-002').stops.filter((s) => s.orderId !== 'DEMO-ORD-3019');
    expect(codes(input)).toEqual(['ORDER_MISSING']);
  });

  it('ROUTE-003 an order assigned to two vehicles is a duplicate', () => {
    route('TRUCK-001').stops.push({ orderId: 'DEMO-ORD-3011', locationId: 'SITE-GAMMA' });
    expect(codes(input)).toContain('ORDER_ASSIGNED_TWICE');
  });

  it('ROUTE-004 an order both routed and unassigned is contradictory', () => {
    input.output.unassigned.push({ orderId: 'DEMO-ORD-3001', reasonCode: 'CAPACITY' });
    expect(codes(input)).toEqual(['ORDER_ROUTED_AND_UNASSIGNED']);
  });

  it('ROUTE-005 an unknown order in the output is critical', () => {
    input.output.unassigned.push({ orderId: 'DEMO-ORD-3999', reasonCode: 'CAPACITY' });
    expect(codes(input)).toEqual(['UNKNOWN_ORDER']);
  });

  it('ROUTE-006 an unassigned order needs a known reason code', () => {
    input.output.unassigned[0]!.reasonCode = 'BECAUSE';
    expect(codes(input)).toEqual(['UNASSIGNED_WITHOUT_REASON']);
    delete input.output.unassigned[0]!.reasonCode;
    expect(codes(input)).toEqual(['UNASSIGNED_WITHOUT_REASON']);
  });

  it('ROUTE-007 capacity: exactly at the limit passes, 1 kg over fails with the overload amount', () => {
    const van = input.vehicles.find((v) => v.id === 'VAN-001')!;
    van.capacityKg = 1400; // the clean van load is exactly 1400 kg
    expect(codes(input)).toEqual([]);
    van.capacityKg = 1399;
    const [finding] = validatePlan(input).issues;
    expect(finding).toMatchObject({ code: 'WEIGHT_OVER_CAPACITY', severity: 'CRITICAL' });
    expect(finding!.message).toContain('overload 1 kg');
  });

  it('ROUTE-008 volume is checked independently of weight', () => {
    input.vehicles.find((v) => v.id === 'VAN-001')!.capacityM3 = 8.5;
    expect(codes(input)).toEqual(['VOLUME_OVER_CAPACITY']);
  });

  it('ROUTE-009 goods that need a reefer on a truck are a vehicle mismatch', () => {
    const reefer = route('REEFER-001');
    reefer.stops = reefer.stops.filter((s) => s.orderId !== 'DEMO-ORD-3016');
    route('TRUCK-002').stops.push({ orderId: 'DEMO-ORD-3016', locationId: 'SITE-DELTA' });
    expect(codes(input)).toContain('VEHICLE_TYPE_MISMATCH');
  });

  it('ROUTE-010 a location restricted to vans rejects a truck', () => {
    const van = route('VAN-001');
    van.stops = van.stops.filter((s) => s.orderId !== 'DEMO-ORD-3010');
    route('TRUCK-001').stops.push({ orderId: 'DEMO-ORD-3010', locationId: 'SITE-EPSILON' });
    expect(codes(input)).toContain('LOCATION_DISALLOWS_VEHICLE');
  });

  it('ROUTE-011 unknown vehicles and a vehicle used twice are reported', () => {
    input.output.routes.push({ vehicleId: 'TRUCK-999', stops: [] });
    input.output.routes.push({ ...structuredClone(route('VAN-001')), stops: [] });
    const found = codes(input);
    expect(found).toContain('UNKNOWN_VEHICLE');
    expect(found).toContain('VEHICLE_USED_TWICE');
  });

  it('ROUTE-012 a stop at the wrong location for its order is reported', () => {
    route('TRUCK-001').stops[0]!.locationId = 'SITE-ZETA';
    expect(codes(input)).toContain('STOP_LOCATION_MISMATCH');
  });

  it('ROUTE-013 the stop limit counts distinct locations', () => {
    input.vehicles.find((v) => v.id === 'TRUCK-001')!.maxStops = 3; // TRUCK-001 visits 4 locations
    expect(codes(input)).toEqual(['TOO_MANY_STOPS']);
  });

  it('ROUTE-014 returning to a location already left is a warning, not a failure', () => {
    route('TRUCK-001').stops.push({ orderId: 'DEMO-ORD-3018', locationId: 'WAREHOUSE-ALPHA' });
    route('TRUCK-001').stops.splice(2, 1); // move 3018 to the end of the route
    // The detour makes the route longer, so the reported distance must be updated too; otherwise the
    // distance validator (correctly) reports it as shorter than the straight line.
    route('TRUCK-001').reportedDistanceKm = +(straightLineKm('TRUCK-001') * 1.35).toFixed(1);
    const result = validatePlan(input);
    expect(result.issues.map((i) => [i.code, i.status])).toEqual([['LOCATION_REVISITED', 'WARNING']]);
    expect(result.blocking).toBe(0);
    expect(result.verdict).toBe('REVIEW REQUIRED');
  });

  it('ROUTE-015 a reported distance below the straight line is impossible', () => {
    route('TRUCK-002').reportedDistanceKm = 1;
    expect(codes(input)).toEqual(['DISTANCE_BELOW_STRAIGHT_LINE']);
  });

  it('ROUTE-016 a reported distance far above the straight line is flagged for review', () => {
    route('TRUCK-002').reportedDistanceKm = 999;
    expect(validatePlan(input).issues).toMatchObject([
      { code: 'DISTANCE_SUSPICIOUSLY_HIGH', status: 'WARNING' },
    ]);
    const strict = makeDistanceValidator({ belowStraightLineTolerance: 0.02, maxRoadToStraightRatio: 1000 });
    expect(strict(input)).toEqual([]);
  });

  it('ROUTE-017 the shipped flawed plan triggers one finding per planted defect', () => {
    const flawed = validatePlan(loadInput(DATA));
    expect(new Set(flawed.issues.map((i) => i.code))).toEqual(
      new Set([
        'DISTANCE_BELOW_STRAIGHT_LINE',
        'ORDER_ASSIGNED_TWICE',
        'ORDER_MISSING',
        'UNKNOWN_ORDER',
        'VEHICLE_TYPE_MISMATCH',
        'VOLUME_OVER_CAPACITY',
        'WEIGHT_OVER_CAPACITY',
        'LOCATION_DISALLOWS_VEHICLE',
        'STOP_LOCATION_MISMATCH',
        'UNASSIGNED_WITHOUT_REASON',
        'LOCATION_REVISITED',
      ]),
    );
    expect(flawed.stats.ordersRouted + flawed.stats.ordersUnassigned + 1).toBe(flawed.stats.ordersInScope);
    expect(flawed.issues[0]!.severity).toBe('CRITICAL'); // sorted most severe first
  });
});

describe('input structure', () => {
  it('rejects malformed files before any business rule runs', () => {
    const bad = structuredClone(input);
    (bad.orders[0] as { weightKg: unknown }).weightKg = 'heavy';
    bad.vehicles.push({ ...bad.vehicles[0]! });
    expect(() => checkStructure(bad)).toThrow(InputError);
    try {
      checkStructure(bad);
    } catch (e) {
      expect((e as Error).message).toContain('orders[0]');
      expect((e as Error).message).toContain('duplicate id(s) TRUCK-001');
    }
  });

  it('requires routes and unassigned arrays', () => {
    expect(() => checkStructure({ ...input, output: { runId: 'x' } as never })).toThrow(/routes/);
  });
});
