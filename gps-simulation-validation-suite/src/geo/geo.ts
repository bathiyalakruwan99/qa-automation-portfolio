/** Geodesy helpers for short, city-scale distances. All coordinates are WGS84 degrees. */

export interface LatLng {
  lat: number;
  lng: number;
}

const EARTH_RADIUS_M = 6_371_008.8;
const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

/** Great-circle distance in metres (haversine). */
export function distanceM(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Initial bearing from a to b, degrees clockwise from north (0..360). */
export function bearingDeg(a: LatLng, b: LatLng): number {
  const φ1 = toRad(a.lat);
  const φ2 = toRad(b.lat);
  const Δλ = toRad(b.lng - a.lng);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

/** The point `distance` metres from `origin` along `bearing`. */
export function destination(origin: LatLng, bearing: number, distance: number): LatLng {
  const δ = distance / EARTH_RADIUS_M;
  const θ = toRad(bearing);
  const φ1 = toRad(origin.lat);
  const λ1 = toRad(origin.lng);
  const φ2 = Math.asin(Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ));
  const λ2 =
    λ1 + Math.atan2(Math.sin(θ) * Math.sin(δ) * Math.cos(φ1), Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2));
  return { lat: toDeg(φ2), lng: ((toDeg(λ2) + 540) % 360) - 180 };
}

/** Linear interpolation between two nearby points (fraction 0..1). Accurate enough below a few km. */
export function interpolate(a: LatLng, b: LatLng, fraction: number): LatLng {
  return { lat: a.lat + (b.lat - a.lat) * fraction, lng: a.lng + (b.lng - a.lng) * fraction };
}

/**
 * Shortest distance in metres from `p` to the segment a-b, using a local equirectangular projection
 * centred on `p` (good to well under a metre at city scale).
 */
export function distanceToSegmentM(p: LatLng, a: LatLng, b: LatLng): number {
  const kx = Math.cos(toRad(p.lat)) * EARTH_RADIUS_M;
  const ky = EARTH_RADIUS_M;
  const ax = toRad(a.lng - p.lng) * kx;
  const ay = toRad(a.lat - p.lat) * ky;
  const bx = toRad(b.lng - p.lng) * kx;
  const by = toRad(b.lat - p.lat) * ky;
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSq = dx * dx + dy * dy;
  const t = lengthSq === 0 ? 0 : Math.max(0, Math.min(1, -(ax * dx + ay * dy) / lengthSq));
  return Math.hypot(ax + t * dx, ay + t * dy);
}

/** Distance in metres from `p` to the nearest segment of a polyline. */
export function distanceToPolylineM(p: LatLng, line: readonly LatLng[]): number {
  if (line.length === 0) throw new RangeError('polyline is empty');
  if (line.length === 1) return distanceM(p, line[0] as LatLng);
  let best = Infinity;
  for (let i = 0; i < line.length - 1; i++) {
    best = Math.min(best, distanceToSegmentM(p, line[i] as LatLng, line[i + 1] as LatLng));
  }
  return best;
}

export function isValidLatLng(p: Partial<LatLng>): p is LatLng {
  return (
    typeof p.lat === 'number' &&
    typeof p.lng === 'number' &&
    Number.isFinite(p.lat) &&
    Number.isFinite(p.lng) &&
    Math.abs(p.lat) <= 90 &&
    Math.abs(p.lng) <= 180
  );
}
