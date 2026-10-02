import { detectGeofenceEvents, type GeofenceEvent } from '../geofence/geofence';
import { generateStream, type GpsPoint } from '../simulator/gps-stream';
import {
  checkDataQuality,
  checkRouteAdherence,
  type DataQualityIssue,
  DEFAULT_THRESHOLDS,
  detectStops,
  normalizeStream,
  type RouteAdherence,
  type StopEvent,
  type ValidationThresholds,
} from '../validation/stream-validators';
import type { Scenario } from './scenario';

export interface RunOptions {
  devices?: number;
  seed?: number;
  /** Seconds between device start times in a fleet run. */
  staggerS?: number;
  thresholds?: ValidationThresholds;
}

export interface Check {
  name: string;
  expected: string;
  actual: string;
  pass: boolean;
}

export interface DeviceResult {
  deviceId: string;
  points: number;
  adherence: RouteAdherence;
  stops: StopEvent[];
  geofenceEvents: GeofenceEvent[];
  dataQuality: DataQualityIssue[];
  checks: Check[];
  result: 'PASS' | 'FAIL';
}

export interface RunResult {
  scenario: string;
  seed: number;
  devices: DeviceResult[];
  totalPoints: number;
  result: 'PASS' | 'FAIL';
}

export function deviceIds(scenario: Scenario, count: number): string[] {
  if (count === 1) return [scenario.vehicle];
  return Array.from({ length: count }, (_, i) => `TRUCK-${String(i + 1).padStart(3, '0')}`);
}

/** Compares what the analysis detected with what the scenario says a correct backend should detect. */
function compare(scenario: Scenario, r: Omit<DeviceResult, 'checks' | 'result'>): Check[] {
  const checks: Check[] = [];
  const e = scenario.expect;
  const add = (name: string, expected: unknown, actual: unknown) =>
    checks.push({
      name,
      expected: JSON.stringify(expected),
      actual: JSON.stringify(actual),
      pass: JSON.stringify(expected) === JSON.stringify(actual),
    });
  if (e.deviation !== undefined) add('deviation detected', e.deviation, r.adherence.deviations.length > 0);
  if (e.rejoin !== undefined) {
    add(
      'rejoin detected',
      e.rejoin,
      r.adherence.deviations.length > 0 && r.adherence.deviations.every((d) => d.rejoinedAt),
    );
  }
  if (e.stops !== undefined) add('stops', e.stops, r.stops.length);
  if (e.geofenceEvents !== undefined) {
    add(
      'geofence events',
      e.geofenceEvents,
      r.geofenceEvents.map((g) => `${g.type}:${g.geofenceId}`),
    );
  }
  if (e.dataQuality !== undefined) {
    add(
      'data-quality issues',
      [...e.dataQuality].sort(),
      [...new Set(r.dataQuality.map((d) => d.type))].sort(),
    );
  }
  return checks;
}

export function runScenario(scenario: Scenario, options: RunOptions = {}): RunResult {
  const seed = options.seed ?? 1;
  const thresholds = options.thresholds ?? DEFAULT_THRESHOLDS;
  const devices = deviceIds(scenario, options.devices ?? 1).map((deviceId, i): DeviceResult => {
    const raw: GpsPoint[] = generateStream(scenario, {
      deviceId,
      seed: seed + i,
      startOffsetS: i * (options.staggerS ?? 30),
    });
    const clean = normalizeStream(raw);
    const partial = {
      deviceId,
      points: raw.length,
      adherence: checkRouteAdherence(clean, scenario.route, thresholds),
      stops: detectStops(clean, thresholds),
      geofenceEvents: detectGeofenceEvents(clean, scenario.geofences),
      dataQuality: checkDataQuality(raw, thresholds),
    };
    const checks = compare(scenario, partial);
    return { ...partial, checks, result: checks.every((c) => c.pass) ? 'PASS' : 'FAIL' };
  });
  return {
    scenario: scenario.name,
    seed,
    devices,
    totalPoints: devices.reduce((sum, d) => sum + d.points, 0),
    result: devices.every((d) => d.result === 'PASS') ? 'PASS' : 'FAIL',
  };
}
