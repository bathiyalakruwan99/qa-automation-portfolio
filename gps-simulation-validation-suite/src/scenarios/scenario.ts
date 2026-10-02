import { isValidLatLng, type LatLng } from '../geo/geo';

export interface CircleGeofence {
  id: string;
  center: LatLng;
  radiusM: number;
}

/**
 * Events reshape the generated stream. `atIndex` refers to the index of a base point
 * (the evenly spaced points generated along the route, before any event is applied).
 */
export type ScenarioEvent =
  | { type: 'DEVIATE'; atIndex: number; offsetM: number }
  | { type: 'REJOIN'; atIndex: number }
  | { type: 'STOP'; atIndex: number; durationS: number }
  | { type: 'DUPLICATE'; atIndex: number }
  | { type: 'OUT_OF_ORDER'; atIndex: number };

export type DataQualityIssueType = 'DUPLICATE_POINT' | 'OUT_OF_ORDER' | 'IMPOSSIBLE_SPEED';

/** What a correct tracking backend should conclude from this scenario. */
export interface ScenarioExpectation {
  deviation?: boolean;
  rejoin?: boolean;
  stops?: number;
  /** Ordered geofence events as "ENTER:<id>" / "EXIT:<id>". */
  geofenceEvents?: string[];
  dataQuality?: DataQualityIssueType[];
}

export interface Scenario {
  name: string;
  description: string;
  vehicle: string;
  startTime: string;
  speedKmh: number;
  sampleIntervalS: number;
  /** Maximum random position noise per point, metres (seeded). */
  noiseM: number;
  route: LatLng[];
  geofences: CircleGeofence[];
  events: ScenarioEvent[];
  expect: ScenarioExpectation;
}

const EVENT_TYPES = ['DEVIATE', 'REJOIN', 'STOP', 'DUPLICATE', 'OUT_OF_ORDER'];

export class ScenarioError extends Error {
  constructor(name: string, problems: string[]) {
    super(`Invalid scenario "${name}":\n  - ${problems.join('\n  - ')}`);
    this.name = 'ScenarioError';
  }
}

/** Validates an untrusted scenario object and returns it typed. Collects every problem at once. */
export function parseScenario(raw: unknown): Scenario {
  const s = (raw ?? {}) as Record<string, unknown>;
  const name = typeof s.name === 'string' ? s.name : '(unnamed)';
  const problems: string[] = [];
  const need = (cond: boolean, msg: string) => {
    if (!cond) problems.push(msg);
  };

  need(typeof s.name === 'string' && s.name.length > 0, 'name is required');
  need(typeof s.vehicle === 'string' && s.vehicle.length > 0, 'vehicle is required');
  need(
    typeof s.startTime === 'string' && !Number.isNaN(Date.parse(s.startTime as string)),
    'startTime must be ISO-8601',
  );
  need(typeof s.speedKmh === 'number' && s.speedKmh > 0 && s.speedKmh <= 130, 'speedKmh must be in (0, 130]');
  need(typeof s.sampleIntervalS === 'number' && s.sampleIntervalS >= 1, 'sampleIntervalS must be >= 1');
  need(typeof s.noiseM === 'number' && s.noiseM >= 0 && s.noiseM <= 50, 'noiseM must be in [0, 50]');

  const route = Array.isArray(s.route) ? (s.route as Partial<LatLng>[]) : [];
  need(route.length >= 2, 'route needs at least 2 points');
  route.forEach((p, i) => need(isValidLatLng(p), `route[${i}] is not a valid coordinate`));

  const fences = Array.isArray(s.geofences) ? (s.geofences as Record<string, unknown>[]) : [];
  fences.forEach((g, i) => {
    need(typeof g.id === 'string', `geofences[${i}].id is required`);
    need(isValidLatLng((g.center ?? {}) as Partial<LatLng>), `geofences[${i}].center is invalid`);
    need(typeof g.radiusM === 'number' && g.radiusM > 0, `geofences[${i}].radiusM must be > 0`);
  });

  const events = Array.isArray(s.events) ? (s.events as Record<string, unknown>[]) : [];
  events.forEach((e, i) => {
    need(
      EVENT_TYPES.includes(e.type as string),
      `events[${i}].type must be one of ${EVENT_TYPES.join(', ')}`,
    );
    need(
      Number.isInteger(e.atIndex) && (e.atIndex as number) >= 0,
      `events[${i}].atIndex must be an integer >= 0`,
    );
    if (e.type === 'DEVIATE')
      need(typeof e.offsetM === 'number' && e.offsetM > 0, `events[${i}].offsetM must be > 0`);
    if (e.type === 'STOP')
      need(typeof e.durationS === 'number' && e.durationS > 0, `events[${i}].durationS must be > 0`);
  });
  const deviates = events.filter((e) => e.type === 'DEVIATE').length;
  const rejoins = events.filter((e) => e.type === 'REJOIN').length;
  need(rejoins <= deviates, 'every REJOIN needs a preceding DEVIATE');

  if (problems.length > 0) throw new ScenarioError(name, problems);
  return {
    ...(s as unknown as Scenario),
    geofences: fences as unknown as CircleGeofence[],
    events: events as unknown as ScenarioEvent[],
    expect: (s.expect ?? {}) as ScenarioExpectation,
  };
}
