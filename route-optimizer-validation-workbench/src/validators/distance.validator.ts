import type { Issue, Location, Validator } from '../models/types';
import { haversineKm, indexById, issue } from './helpers';

export interface DistanceRules {
  /** Allowed rounding below the straight-line distance before a reported distance is "impossible". */
  belowStraightLineTolerance: number;
  /** Reported road distance above this multiple of the straight-line distance is flagged for review. */
  maxRoadToStraightRatio: number;
}

export const DEFAULT_DISTANCE_RULES: DistanceRules = {
  belowStraightLineTolerance: 0.02,
  maxRoadToStraightRatio: 2,
};

/**
 * Independent sanity check on reported distances. A road route can never be shorter than the straight line
 * through the same points (depot -> stops -> depot), so a shorter reported distance is a defect. A much longer
 * one is not necessarily wrong (one-way streets, bridges) but deserves a look.
 */
export function makeDistanceValidator(rules: DistanceRules = DEFAULT_DISTANCE_RULES): Validator {
  return (input) => {
    const locations = indexById(input.locations);
    const vehicles = indexById(input.vehicles);
    const issues: Issue[] = [];
    for (const route of input.output.routes) {
      const vehicle = vehicles.get(route.vehicleId);
      const depot = vehicle && locations.get(vehicle.depotId);
      const path = route.stops.map((s) => locations.get(s.locationId));
      if (!depot || route.stops.length === 0 || path.some((p) => !p)) continue; // reported elsewhere
      const points = [depot, ...(path as Location[]), depot];
      let straightKm = 0;
      for (let i = 0; i < points.length - 1; i++) straightKm += haversineKm(points[i]!, points[i + 1]!);

      if (route.reportedDistanceKm === undefined) {
        issues.push(
          issue(
            'distance',
            'DISTANCE_NOT_REPORTED',
            'MINOR',
            'WARNING',
            `${route.vehicleId} has no reported distance`,
            [route.vehicleId],
          ),
        );
        continue;
      }
      const ratio = route.reportedDistanceKm / straightKm;
      const detail = `reported ${route.reportedDistanceKm} km vs straight-line ${straightKm.toFixed(1)} km`;
      if (ratio < 1 - rules.belowStraightLineTolerance) {
        issues.push(
          issue(
            'distance',
            'DISTANCE_BELOW_STRAIGHT_LINE',
            'CRITICAL',
            'FAIL',
            `${route.vehicleId}: ${detail} - physically impossible`,
            [route.vehicleId],
          ),
        );
      } else if (ratio > rules.maxRoadToStraightRatio) {
        issues.push(
          issue(
            'distance',
            'DISTANCE_SUSPICIOUSLY_HIGH',
            'MINOR',
            'WARNING',
            `${route.vehicleId}: ${detail} (x${ratio.toFixed(1)})`,
            [route.vehicleId],
          ),
        );
      }
    }
    return issues;
  };
}
