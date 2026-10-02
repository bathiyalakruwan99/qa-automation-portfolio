import type { Issue, Severity, ValidationInput } from '../models/types';

export function issue(
  validator: string,
  code: string,
  severity: Severity,
  status: Issue['status'],
  message: string,
  refs: string[],
): Issue {
  return { validator, code, severity, status, message, refs };
}

export function indexById<T extends { id: string }>(items: readonly T[]): Map<string, T> {
  return new Map(items.map((i) => [i.id, i]));
}

/** Every (route, stop) pair, with the position of the stop, for validators that look at stops. */
export function allStops(input: ValidationInput) {
  return input.output.routes.flatMap((route, routeIndex) =>
    route.stops.map((stop, stopIndex) => ({ route, routeIndex, stop, stopIndex })),
  );
}

const EARTH_RADIUS_KM = 6371.0088;
export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}
