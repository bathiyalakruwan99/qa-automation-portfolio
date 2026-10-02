import fs from 'node:fs';
import path from 'node:path';
import type { Location, OptimizerOutput, Order, ValidationInput, Vehicle } from '../models/types';

export class InputError extends Error {
  constructor(problems: string[]) {
    super(`Input files are not usable:\n  - ${problems.join('\n  - ')}`);
    this.name = 'InputError';
  }
}

const isNum = (v: unknown) => typeof v === 'number' && Number.isFinite(v);
const isStr = (v: unknown) => typeof v === 'string' && v.length > 0;

/**
 * Structural checks only (types, required fields, unique IDs). Business rules belong to the validators, so a
 * malformed file is reported as an input problem instead of producing misleading findings.
 */
export function checkStructure(input: ValidationInput): void {
  const problems: string[] = [];
  const uniq = (kind: string, ids: string[]) => {
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    if (dupes.length) problems.push(`${kind}: duplicate id(s) ${[...new Set(dupes)].join(', ')}`);
  };
  if (!Array.isArray(input.orders)) problems.push('orders must be an array');
  if (!Array.isArray(input.vehicles)) problems.push('vehicles must be an array');
  if (!Array.isArray(input.locations)) problems.push('locations must be an array');
  if (!input.output || !Array.isArray(input.output.routes) || !Array.isArray(input.output.unassigned)) {
    problems.push('optimizer output needs "routes" and "unassigned" arrays');
  }
  if (problems.length) throw new InputError(problems);

  input.orders.forEach((o: Order, i) => {
    if (!isStr(o.id) || !isStr(o.locationId) || !isNum(o.weightKg) || !isNum(o.volumeM3)) {
      problems.push(`orders[${i}] needs id, locationId, weightKg and volumeM3`);
    } else if (o.weightKg < 0 || o.volumeM3 < 0) problems.push(`orders[${i}] (${o.id}) has a negative size`);
  });
  input.vehicles.forEach((v: Vehicle, i) => {
    if (
      !isStr(v.id) ||
      !isStr(v.type) ||
      !isNum(v.capacityKg) ||
      !isNum(v.capacityM3) ||
      !isStr(v.depotId) ||
      !isNum(v.maxStops)
    ) {
      problems.push(`vehicles[${i}] needs id, type, capacityKg, capacityM3, depotId and maxStops`);
    }
  });
  input.locations.forEach((l: Location, i) => {
    if (!isStr(l.id) || !isNum(l.lat) || !isNum(l.lng) || Math.abs(l.lat) > 90 || Math.abs(l.lng) > 180) {
      problems.push(`locations[${i}] needs id and a valid lat/lng`);
    }
  });
  input.output.routes.forEach((r, i) => {
    if (!isStr(r.vehicleId) || !Array.isArray(r.stops))
      problems.push(`routes[${i}] needs vehicleId and stops`);
    else
      r.stops.forEach((s, j) => {
        if (!isStr(s.orderId) || !isStr(s.locationId))
          problems.push(`routes[${i}].stops[${j}] needs orderId and locationId`);
      });
  });
  uniq(
    'orders',
    input.orders.map((o) => o.id),
  );
  uniq(
    'vehicles',
    input.vehicles.map((v) => v.id),
  );
  uniq(
    'locations',
    input.locations.map((l) => l.id),
  );
  if (problems.length) throw new InputError(problems);
}

const read = <T>(file: string): T => JSON.parse(fs.readFileSync(file, 'utf8')) as T;

export function loadInput(dir: string, outputFile = 'optimizer-output.json'): ValidationInput {
  const input: ValidationInput = {
    orders: read<Order[]>(path.join(dir, 'orders.json')),
    vehicles: read<Vehicle[]>(path.join(dir, 'vehicles.json')),
    locations: read<Location[]>(path.join(dir, 'locations.json')),
    output: read<OptimizerOutput>(path.isAbsolute(outputFile) ? outputFile : path.join(dir, outputFile)),
  };
  checkStructure(input);
  return input;
}
