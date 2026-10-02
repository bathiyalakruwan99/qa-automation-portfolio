import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { destination, distanceM } from '../src/geo/geo';
import { detectGeofenceEvents, isInside } from '../src/geofence/geofence';
import { parseScenario, type Scenario, ScenarioError } from '../src/scenarios/scenario';
import { runScenario } from '../src/scenarios/scenario-runner';
import { renderMapViewer } from '../src/reporting/map-viewer';
import { generateStream, type GpsPoint } from '../src/simulator/gps-stream';
import {
  checkDataQuality,
  checkRouteAdherence,
  detectStops,
  normalizeStream,
} from '../src/validation/stream-validators';

function load(name: string): Scenario {
  return parseScenario(
    JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'scenarios', `${name}.json`), 'utf8')),
  );
}

describe('GPS simulation and validation', () => {
  it('GPS-001 baseline movement: evenly timed points from route start to end at the configured speed', () => {
    const s = load('baseline');
    const points = generateStream({ ...s, noiseM: 0 });
    const times = points.map((p) => Date.parse(p.timestamp));
    expect(times.every((t, i) => i === 0 || t - (times[i - 1] as number) === s.sampleIntervalS * 1000)).toBe(
      true,
    );
    expect(distanceM(points[0] as GpsPoint, s.route[0]!)).toBeLessThan(1);
    expect(distanceM(points.at(-1) as GpsPoint, s.route.at(-1)!)).toBeLessThan(1);
    // Spacing between interior fixes matches speed x interval (10 m/s x 10 s = 100 m).
    expect(distanceM(points[3] as GpsPoint, points[4] as GpsPoint)).toBeCloseTo(100, -1);
    expect(checkRouteAdherence(points, s.route).deviations).toEqual([]);
  });

  it('GPS-002 off-route detection: a 250 m deviation is detected, a 3 m noise wobble is not', () => {
    const s = load('off-route-rejoin');
    const deviations = checkRouteAdherence(normalizeStream(generateStream(s)), s.route).deviations;
    expect(deviations).toHaveLength(1);
    expect(deviations[0]!.maxDistanceM).toBeGreaterThan(240);
    const noisyBaseline = generateStream({ ...load('baseline'), noiseM: 3 }, { seed: 99 });
    expect(checkRouteAdherence(noisyBaseline, s.route).deviations).toEqual([]);
  });

  it('GPS-003 rejoin detection: the deviation ends when the vehicle is back on route', () => {
    const s = load('off-route-rejoin');
    const [dev] = checkRouteAdherence(normalizeStream(generateStream(s)), s.route).deviations;
    expect(dev!.rejoinedAt).not.toBeNull();
    expect(Date.parse(dev!.rejoinedAt!)).toBeGreaterThan(Date.parse(dev!.startedAt));
    // Without the REJOIN event the vehicle never returns: deviation stays open.
    const noRejoin = { ...s, events: s.events.filter((e) => e.type !== 'REJOIN') };
    expect(checkRouteAdherence(generateStream(noRejoin), s.route).deviations[0]!.rejoinedAt).toBeNull();
  });

  it('GPS-004 geofence enter: ENTER fires once when the vehicle arrives at Customer Site Beta', () => {
    const s = load('baseline');
    const events = detectGeofenceEvents(generateStream(s), s.geofences).filter(
      (e) => e.geofenceId === 'CUSTOMER-SITE-BETA',
    );
    expect(events.map((e) => e.type)).toEqual(['ENTER']);
  });

  it('GPS-005 geofence exit: EXIT carries the dwell time since the matching ENTER', () => {
    const s = load('baseline');
    const zone = detectGeofenceEvents(generateStream(s), s.geofences).filter(
      (e) => e.geofenceId === 'ZONE-GAMMA',
    );
    expect(zone.map((e) => e.type)).toEqual(['ENTER', 'EXIT']);
    expect(zone[1]!.dwellS).toBe((Date.parse(zone[1]!.timestamp) - Date.parse(zone[0]!.timestamp)) / 1000);
  });

  it('GPS-006 edge boundary: exactly on the radius is inside; just beyond is outside', () => {
    const center = { lat: 37.78, lng: -122.41 };
    const fence = { id: 'EDGE', center, radiusM: 100 };
    expect(isInside(destination(center, 45, 99.9), fence)).toBe(true);
    expect(isInside(destination(center, 45, 100.1), fence)).toBe(false);
    const edge = load('geofence-edge');
    const events = detectGeofenceEvents(generateStream(edge), edge.geofences).map(
      (e) => `${e.type}:${e.geofenceId}`,
    );
    expect(events).toEqual(['ENTER:EDGE-INSIDE', 'EXIT:EDGE-INSIDE']);
  });

  it('GPS-007 stopped vehicle: a 5 min stop is reported, a 60 s pause is not', () => {
    const stops = detectStops(normalizeStream(generateStream(load('short-stop'))));
    expect(stops).toHaveLength(1);
    expect(stops[0]!.durationS).toBeGreaterThanOrEqual(300);
  });

  it('GPS-008 duplicate point is flagged and removed before route analysis', () => {
    const raw = generateStream(load('data-quality'));
    expect(checkDataQuality(raw).filter((i) => i.type === 'DUPLICATE_POINT')).toHaveLength(1);
    expect(normalizeStream(raw)).toHaveLength(raw.length - 1);
  });

  it('GPS-009 out-of-order timestamp is flagged; the normalised stream is back in time order', () => {
    const raw = generateStream(load('data-quality'));
    const outOfOrder = checkDataQuality(raw).filter((i) => i.type === 'OUT_OF_ORDER');
    expect(outOfOrder).toHaveLength(1);
    const times = normalizeStream(raw).map((p) => Date.parse(p.timestamp));
    expect(times).toEqual([...times].sort((a, b) => a - b));
  });

  it('GPS-010 multi-vehicle: unique IDs, staggered starts, deterministic per seed, all pass', () => {
    const s = load('off-route-rejoin');
    const run = runScenario(s, { devices: 5, seed: 7 });
    expect(run.devices.map((d) => d.deviceId)).toEqual([
      'TRUCK-001',
      'TRUCK-002',
      'TRUCK-003',
      'TRUCK-004',
      'TRUCK-005',
    ]);
    expect(new Set(run.devices.map((d) => d.geofenceEvents[0]!.timestamp)).size).toBe(5);
    expect(run.result).toBe('PASS');
    expect(runScenario(s, { devices: 5, seed: 7 })).toEqual(run);
    expect(runScenario(s, { devices: 5, seed: 8 })).not.toEqual(run);
  });
});

describe('implausible jumps', () => {
  it('flags a jump faster than the plausibility limit', () => {
    const p = (seq: number, t: number, lat: number): GpsPoint => ({
      deviceId: 'TRUCK-001',
      seq,
      timestamp: new Date(t * 1000).toISOString(),
      lat,
      lng: -122.41,
      speedKmh: 30,
    });
    // ~1.1 km in 10 s = ~400 km/h
    expect(checkDataQuality([p(0, 0, 37.78), p(1, 10, 37.79)]).map((i) => i.type)).toEqual([
      'IMPOSSIBLE_SPEED',
    ]);
  });
});

describe('scenario validation', () => {
  it('every shipped scenario is valid and passes its own expectations', () => {
    const dir = path.join(__dirname, '..', 'scenarios');
    for (const file of fs.readdirSync(dir)) {
      expect(runScenario(load(file.replace(/\.json$/, ''))).result, file).toBe('PASS');
    }
  });

  it('reports every problem in an invalid scenario at once', () => {
    try {
      parseScenario({
        name: 'bad',
        speedKmh: 0,
        route: [{ lat: 200, lng: 0 }],
        events: [{ type: 'TELEPORT' }],
      });
      throw new Error('expected ScenarioError');
    } catch (e) {
      expect(e).toBeInstanceOf(ScenarioError);
      const msg = (e as Error).message;
      for (const part of ['vehicle', 'startTime', 'speedKmh', 'route needs', 'route[0]', 'events[0].type']) {
        expect(msg).toContain(part);
      }
    }
  });

  it('rejects a REJOIN without a DEVIATE', () => {
    const s = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'scenarios', 'baseline.json'), 'utf8'));
    expect(() => parseScenario({ ...s, events: [{ type: 'REJOIN', atIndex: 3 }] })).toThrow(/REJOIN/);
  });
});

describe('map viewer', () => {
  it('renders a self-contained page with the route, fences, every vehicle and the result', () => {
    const s = load('off-route-rejoin');
    const html = renderMapViewer(s, runScenario(s, { devices: 2, keepStreams: true }));
    expect(html).toContain('<svg');
    expect(html).toContain('Result: <span class="pass">PASS</span>');
    expect((html.match(/class="fence"/g) ?? []).length).toBe(s.geofences.length);
    expect(html).toContain('TRUCK-002');
    expect(html).toMatch(/class="off"/); // the deviation is highlighted
    expect(html).not.toMatch(/<script|https?:\/\//); // no external resources
  });

  it('refuses a run without streams instead of drawing an empty map', () => {
    const s = load('baseline');
    expect(() => renderMapViewer(s, runScenario(s))).toThrow(/keepStreams/);
  });

  it('keeps streams off the result unless asked', () => {
    const s = load('baseline');
    expect(runScenario(s).devices[0]!.stream).toBeUndefined();
    expect(runScenario(s, { keepStreams: true }).devices[0]!.stream!.length).toBeGreaterThan(0);
  });
});
