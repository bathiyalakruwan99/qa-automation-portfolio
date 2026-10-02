import { distanceM } from '../geo/geo';
import type { CircleGeofence } from '../scenarios/scenario';
import type { GpsPoint } from '../simulator/gps-stream';

export interface GeofenceEvent {
  type: 'ENTER' | 'EXIT';
  geofenceId: string;
  timestamp: string;
  /** For EXIT: seconds spent inside since the matching ENTER. */
  dwellS?: number;
}

/** Boundary rule: a point exactly on the radius counts as inside (distance <= radius). */
export function isInside(point: { lat: number; lng: number }, fence: CircleGeofence): boolean {
  return distanceM(point, fence.center) <= fence.radiusM;
}

/**
 * Detects ENTER/EXIT transitions for each geofence. Points must already be in timestamp order.
 * A stream that starts inside a fence produces an ENTER at the first point, so dwell is always measurable.
 */
export function detectGeofenceEvents(
  points: readonly GpsPoint[],
  fences: readonly CircleGeofence[],
): GeofenceEvent[] {
  const events: GeofenceEvent[] = [];
  for (const fence of fences) {
    let inside = false;
    let enteredAt = 0;
    for (const p of points) {
      const now = isInside(p, fence);
      if (now && !inside) {
        enteredAt = Date.parse(p.timestamp);
        events.push({ type: 'ENTER', geofenceId: fence.id, timestamp: p.timestamp });
      } else if (!now && inside) {
        const dwellS = (Date.parse(p.timestamp) - enteredAt) / 1000;
        events.push({ type: 'EXIT', geofenceId: fence.id, timestamp: p.timestamp, dwellS });
      }
      inside = now;
    }
  }
  return events.sort(
    (a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp) || a.type.localeCompare(b.type),
  );
}
