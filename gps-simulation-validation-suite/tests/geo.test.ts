import { describe, expect, it } from 'vitest';
import {
  bearingDeg,
  destination,
  distanceM,
  distanceToPolylineM,
  distanceToSegmentM,
  isValidLatLng,
} from '../src/geo/geo';

const origin = { lat: 37.7749, lng: -122.4194 };

describe('geo', () => {
  it('distance is zero to itself and symmetric', () => {
    const other = { lat: 37.789, lng: -122.399 };
    expect(distanceM(origin, origin)).toBe(0);
    expect(distanceM(origin, other)).toBeCloseTo(distanceM(other, origin), 6);
  });

  it('one degree of latitude is about 111.2 km', () => {
    expect(distanceM({ lat: 0, lng: 0 }, { lat: 1, lng: 0 })).toBeCloseTo(111_195, -1);
  });

  it.each([0, 45, 90, 180, 270])('destination() then distanceM() round-trips at bearing %i', (bearing) => {
    const p = destination(origin, bearing, 250);
    expect(distanceM(origin, p)).toBeCloseTo(250, 3);
    expect(bearingDeg(origin, p)).toBeCloseTo(bearing === 0 ? 0 : bearing, 0);
  });

  it('measures perpendicular distance to a segment and clamps to its ends', () => {
    const a = origin;
    const b = destination(origin, 90, 1000);
    const side = destination(destination(origin, 90, 500), 0, 40);
    expect(distanceToSegmentM(side, a, b)).toBeCloseTo(40, 0);
    const beyond = destination(b, 90, 30);
    expect(distanceToSegmentM(beyond, a, b)).toBeCloseTo(30, 0);
  });

  it('uses the nearest segment of a polyline', () => {
    const line = [origin, destination(origin, 90, 500), destination(destination(origin, 90, 500), 0, 500)];
    const near2nd = destination(destination(destination(origin, 90, 500), 0, 250), 90, 15);
    expect(distanceToPolylineM(near2nd, line)).toBeCloseTo(15, 0);
    expect(() => distanceToPolylineM(origin, [])).toThrow(RangeError);
  });

  it.each([
    [{ lat: 0, lng: 0 }, true],
    [{ lat: 90, lng: 180 }, true],
    [{ lat: 91, lng: 0 }, false],
    [{ lat: 0, lng: -181 }, false],
    [{ lat: Number.NaN, lng: 0 }, false],
    [{ lat: 1 }, false],
  ])('isValidLatLng(%j) = %s', (p, ok) => {
    expect(isValidLatLng(p)).toBe(ok);
  });
});
