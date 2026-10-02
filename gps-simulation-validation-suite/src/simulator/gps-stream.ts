import { bearingDeg, destination, distanceM, interpolate, type LatLng } from '../geo/geo';
import type { Scenario } from '../scenarios/scenario';
import { seededRandom } from './seeded-random';

export interface GpsPoint {
  deviceId: string;
  /** Emission order (what a backend would receive). */
  seq: number;
  timestamp: string;
  lat: number;
  lng: number;
  speedKmh: number;
}

interface BasePoint extends LatLng {
  /** Bearing of the route at this point, used to offset deviations sideways. */
  heading: number;
}

/** Evenly spaced points along the route, `spacingM` apart, always including the final point. */
export function densifyRoute(route: readonly LatLng[], spacingM: number): BasePoint[] {
  if (spacingM <= 0) throw new RangeError('spacingM must be > 0');
  const points: BasePoint[] = [];
  let carry = 0;
  for (let i = 0; i < route.length - 1; i++) {
    const a = route[i] as LatLng;
    const b = route[i + 1] as LatLng;
    const length = distanceM(a, b);
    const heading = bearingDeg(a, b);
    for (let d = carry; d < length; d += spacingM) {
      points.push({ ...interpolate(a, b, d / length), heading });
    }
    carry = (carry - length) % spacingM;
    if (carry < 0) carry += spacingM;
  }
  const last = route[route.length - 1] as LatLng;
  const prev = route[route.length - 2] as LatLng;
  points.push({ ...last, heading: bearingDeg(prev, last) });
  return points;
}

export interface StreamOptions {
  deviceId?: string;
  seed?: number;
  /** Delay added to the scenario start time (for staggered fleets). */
  startOffsetS?: number;
}

/**
 * Generates the GPS stream a tracking device would send for a scenario. Deterministic for a given seed:
 * noise, and therefore every derived result, reproduces exactly.
 */
export function generateStream(scenario: Scenario, options: StreamOptions = {}): GpsPoint[] {
  const deviceId = options.deviceId ?? scenario.vehicle;
  const random = seededRandom(options.seed ?? 1);
  const spacingM = (scenario.speedKmh / 3.6) * scenario.sampleIntervalS;
  const base = densifyRoute(scenario.route, spacingM);

  const deviateFrom = new Map<number, number>();
  const rejoinAt = new Set<number>();
  const stops = new Map<number, number>();
  const duplicates = new Set<number>();
  const swaps = new Set<number>();
  for (const e of scenario.events) {
    if (e.type === 'DEVIATE') deviateFrom.set(e.atIndex, e.offsetM);
    if (e.type === 'REJOIN') rejoinAt.add(e.atIndex);
    if (e.type === 'STOP') stops.set(e.atIndex, e.durationS);
    if (e.type === 'DUPLICATE') duplicates.add(e.atIndex);
    if (e.type === 'OUT_OF_ORDER') swaps.add(e.atIndex);
  }

  let t = Date.parse(scenario.startTime) + (options.startOffsetS ?? 0) * 1000;
  let offsetM = 0;
  const timed: Omit<GpsPoint, 'seq'>[] = [];
  /** Position in `timed` of the point generated for each base index (for out-of-order swaps). */
  const positionOfBase = new Map<number, number>();
  const pushPoint = (p: LatLng, speedKmh: number) => {
    const noisy =
      scenario.noiseM > 0 ? destination(p, random.range(0, 360), random.range(0, scenario.noiseM)) : p;
    timed.push({ deviceId, timestamp: new Date(t).toISOString(), lat: noisy.lat, lng: noisy.lng, speedKmh });
  };

  base.forEach((point, index) => {
    if (deviateFrom.has(index)) offsetM = deviateFrom.get(index) as number;
    if (rejoinAt.has(index)) offsetM = 0;
    const position = offsetM > 0 ? destination(point, (point.heading + 90) % 360, offsetM) : point;
    const isEdge = index === 0 || index === base.length - 1;
    positionOfBase.set(index, timed.length);
    pushPoint(position, isEdge ? 0 : scenario.speedKmh);
    if (duplicates.has(index)) timed.push({ ...(timed[timed.length - 1] as Omit<GpsPoint, 'seq'>) });

    const stopS = stops.get(index);
    if (stopS !== undefined) {
      for (let waited = scenario.sampleIntervalS; waited <= stopS; waited += scenario.sampleIntervalS) {
        t += scenario.sampleIntervalS * 1000;
        pushPoint(position, 0);
      }
    }
    t += scenario.sampleIntervalS * 1000;
  });

  // Out-of-order delivery: the point generated for base index i arrives after the point that follows it.
  for (const index of swaps) {
    const at = positionOfBase.get(index);
    if (at !== undefined && at + 1 < timed.length) {
      const current = timed[at] as Omit<GpsPoint, 'seq'>;
      timed[at] = timed[at + 1] as Omit<GpsPoint, 'seq'>;
      timed[at + 1] = current;
    }
  }
  return timed.map((p, seq) => ({ ...p, seq }));
}
