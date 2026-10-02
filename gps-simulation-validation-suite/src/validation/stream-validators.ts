import { distanceM, distanceToPolylineM, type LatLng } from '../geo/geo';
import type { DataQualityIssueType } from '../scenarios/scenario';
import type { GpsPoint } from '../simulator/gps-stream';

export interface DataQualityIssue {
  type: DataQualityIssueType;
  seq: number;
  detail: string;
}

export interface ValidationThresholds {
  /** Distance from the planned route beyond which a point counts as off-route. */
  offRouteM: number;
  /** Consecutive off-route (or back-on-route) points needed to call a deviation (or rejoin). */
  confirmPoints: number;
  /** Points within this radius of each other count as "not moving". */
  stopRadiusM: number;
  /** Minimum duration for a stop. Shorter pauses are ignored. */
  minStopS: number;
  /** Implied speed above this between consecutive points is physically implausible. */
  maxPlausibleKmh: number;
}

export const DEFAULT_THRESHOLDS: ValidationThresholds = {
  offRouteM: 100,
  confirmPoints: 2,
  stopRadiusM: 25,
  minStopS: 120,
  maxPlausibleKmh: 160,
};

/** Duplicates, out-of-order timestamps and implausible jumps, in the order the backend received them. */
export function checkDataQuality(
  points: readonly GpsPoint[],
  thresholds: ValidationThresholds = DEFAULT_THRESHOLDS,
): DataQualityIssue[] {
  const issues: DataQualityIssue[] = [];
  let latest: GpsPoint | undefined;
  let previous: GpsPoint | undefined;
  for (const p of points) {
    if (previous && p.timestamp === previous.timestamp && p.lat === previous.lat && p.lng === previous.lng) {
      issues.push({
        type: 'DUPLICATE_POINT',
        seq: p.seq,
        detail: `same position and time as seq ${previous.seq}`,
      });
    } else if (latest && Date.parse(p.timestamp) < Date.parse(latest.timestamp)) {
      issues.push({
        type: 'OUT_OF_ORDER',
        seq: p.seq,
        detail: `${p.timestamp} arrived after ${latest.timestamp}`,
      });
    } else if (latest) {
      const seconds = (Date.parse(p.timestamp) - Date.parse(latest.timestamp)) / 1000;
      const kmh = seconds > 0 ? (distanceM(latest, p) / seconds) * 3.6 : 0;
      if (kmh > thresholds.maxPlausibleKmh) {
        issues.push({ type: 'IMPOSSIBLE_SPEED', seq: p.seq, detail: `implied ${kmh.toFixed(0)} km/h` });
      }
    }
    if (!latest || Date.parse(p.timestamp) >= Date.parse(latest.timestamp)) latest = p;
    previous = p;
  }
  return issues;
}

/** Sorted by timestamp with exact duplicates removed: the "clean" view used for route and stop analysis. */
export function normalizeStream(points: readonly GpsPoint[]): GpsPoint[] {
  const seen = new Set<string>();
  return [...points]
    .sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp) || a.seq - b.seq)
    .filter((p) => {
      const key = `${p.timestamp}|${p.lat}|${p.lng}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export interface RouteAdherence {
  deviations: { startedAt: string; maxDistanceM: number; rejoinedAt: string | null }[];
}

/**
 * Off-route and rejoin detection. A deviation starts after `confirmPoints` consecutive points beyond
 * `offRouteM` and ends (rejoin) after `confirmPoints` consecutive points back within it. Requiring
 * consecutive points stops single noisy fixes from raising false alerts.
 */
export function checkRouteAdherence(
  points: readonly GpsPoint[],
  plannedRoute: readonly LatLng[],
  thresholds: ValidationThresholds = DEFAULT_THRESHOLDS,
): RouteAdherence {
  const deviations: RouteAdherence['deviations'] = [];
  let off = false;
  let streak: GpsPoint[] = [];
  let current: RouteAdherence['deviations'][number] | undefined;
  for (const p of points) {
    const d = distanceToPolylineM(p, plannedRoute);
    const pointOff = d > thresholds.offRouteM;
    if (current) current.maxDistanceM = Math.max(current.maxDistanceM, d);
    if (pointOff !== off) {
      streak.push(p);
      if (streak.length >= thresholds.confirmPoints) {
        const first = streak[0] as GpsPoint;
        if (pointOff) {
          current = {
            startedAt: first.timestamp,
            maxDistanceM: Math.max(...streak.map((s) => distanceToPolylineM(s, plannedRoute))),
            rejoinedAt: null,
          };
          deviations.push(current);
        } else if (current) {
          current.rejoinedAt = first.timestamp;
          current = undefined;
        }
        off = pointOff;
        streak = [];
      }
    } else {
      streak = [];
    }
  }
  return { deviations };
}

export interface StopEvent {
  startedAt: string;
  durationS: number;
  position: LatLng;
}

/** Stops: the vehicle stays within `stopRadiusM` of where it halted for at least `minStopS`. */
export function detectStops(
  points: readonly GpsPoint[],
  thresholds: ValidationThresholds = DEFAULT_THRESHOLDS,
): StopEvent[] {
  const stops: StopEvent[] = [];
  let i = 0;
  while (i < points.length) {
    const anchor = points[i] as GpsPoint;
    let j = i + 1;
    while (j < points.length && distanceM(anchor, points[j] as GpsPoint) <= thresholds.stopRadiusM) j++;
    const last = points[j - 1] as GpsPoint;
    const durationS = (Date.parse(last.timestamp) - Date.parse(anchor.timestamp)) / 1000;
    if (durationS >= thresholds.minStopS) {
      stops.push({ startedAt: anchor.timestamp, durationS, position: { lat: anchor.lat, lng: anchor.lng } });
      i = j;
    } else {
      i += 1;
    }
  }
  return stops;
}
