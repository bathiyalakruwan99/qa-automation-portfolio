import type { Issue, Validator } from '../models/types';
import { indexById, issue } from './helpers';

/** The vehicle must exist, be used once, suit every order it carries and be allowed at every stop. */
export const vehicleValidator: Validator = (input) => {
  const orders = indexById(input.orders);
  const vehicles = indexById(input.vehicles);
  const locations = indexById(input.locations);
  const issues: Issue[] = [];
  const used = new Map<string, number>();

  for (const route of input.output.routes) {
    used.set(route.vehicleId, (used.get(route.vehicleId) ?? 0) + 1);
    const vehicle = vehicles.get(route.vehicleId);
    if (!vehicle) {
      issues.push(
        issue('vehicle', 'UNKNOWN_VEHICLE', 'CRITICAL', 'FAIL', `${route.vehicleId} is not in the fleet`, [
          route.vehicleId,
        ]),
      );
      continue;
    }
    for (const stop of route.stops) {
      const order = orders.get(stop.orderId);
      if (order?.requiredVehicleType && order.requiredVehicleType !== vehicle.type) {
        issues.push(
          issue(
            'vehicle',
            'VEHICLE_TYPE_MISMATCH',
            'CRITICAL',
            'FAIL',
            `${order.id} needs a ${order.requiredVehicleType}; ${vehicle.id} is a ${vehicle.type}`,
            [order.id, vehicle.id],
          ),
        );
      }
      const allowed = locations.get(stop.locationId)?.allowedVehicleTypes;
      if (allowed && !allowed.includes(vehicle.type)) {
        issues.push(
          issue(
            'vehicle',
            'LOCATION_DISALLOWS_VEHICLE',
            'MAJOR',
            'FAIL',
            `${stop.locationId} only accepts ${allowed.join('/')}; ${vehicle.id} is a ${vehicle.type}`,
            [stop.locationId, vehicle.id],
          ),
        );
      }
    }
  }
  for (const [vehicleId, count] of used) {
    if (count > 1) {
      issues.push(
        issue(
          'vehicle',
          'VEHICLE_USED_TWICE',
          'MAJOR',
          'FAIL',
          `${vehicleId} has ${count} routes in one plan`,
          [vehicleId],
        ),
      );
    }
  }
  return issues;
};
