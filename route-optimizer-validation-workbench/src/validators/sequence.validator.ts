import type { Issue, Validator } from '../models/types';
import { indexById, issue } from './helpers';

/**
 * Route integrity: every stop is at a known location, each stop's location matches its order, the vehicle's
 * stop limit is respected, and the route does not come back to a location it already left.
 */
export const sequenceValidator: Validator = (input) => {
  const orders = indexById(input.orders);
  const vehicles = indexById(input.vehicles);
  const locations = indexById(input.locations);
  const issues: Issue[] = [];

  for (const route of input.output.routes) {
    if (route.stops.length === 0) {
      issues.push(
        issue('sequence', 'EMPTY_ROUTE', 'MINOR', 'WARNING', `${route.vehicleId} has a route with no stops`, [
          route.vehicleId,
        ]),
      );
      continue;
    }
    const vehicle = vehicles.get(route.vehicleId);
    const distinctStops = new Set(route.stops.map((s) => s.locationId)).size;
    if (vehicle && distinctStops > vehicle.maxStops) {
      issues.push(
        issue(
          'sequence',
          'TOO_MANY_STOPS',
          'MAJOR',
          'FAIL',
          `${vehicle.id} visits ${distinctStops} locations; limit is ${vehicle.maxStops}`,
          [vehicle.id],
        ),
      );
    }

    const left = new Set<string>();
    route.stops.forEach((stop, i) => {
      if (!locations.has(stop.locationId)) {
        issues.push(
          issue(
            'sequence',
            'UNKNOWN_LOCATION',
            'CRITICAL',
            'FAIL',
            `${stop.locationId} (stop ${i + 1} of ${route.vehicleId}) is not a known location`,
            [stop.locationId],
          ),
        );
      }
      const order = orders.get(stop.orderId);
      if (order && order.locationId !== stop.locationId) {
        issues.push(
          issue(
            'sequence',
            'STOP_LOCATION_MISMATCH',
            'MAJOR',
            'FAIL',
            `${order.id} belongs at ${order.locationId} but is scheduled at ${stop.locationId}`,
            [order.id, stop.locationId],
          ),
        );
      }
      const previous = route.stops[i - 1];
      if (previous && previous.locationId !== stop.locationId) left.add(previous.locationId);
      if (left.has(stop.locationId)) {
        issues.push(
          issue(
            'sequence',
            'LOCATION_REVISITED',
            'MINOR',
            'WARNING',
            `${route.vehicleId} returns to ${stop.locationId} after leaving it (stop ${i + 1})`,
            [route.vehicleId, stop.locationId],
          ),
        );
      }
    });
  }
  return issues;
};
