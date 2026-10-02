import type { Issue, Validator } from '../models/types';
import { indexById, issue } from './helpers';

/** Each vehicle's load must fit both its weight and its volume capacity. Exactly at capacity is allowed. */
export const capacityValidator: Validator = (input) => {
  const orders = indexById(input.orders);
  const vehicles = indexById(input.vehicles);
  const issues: Issue[] = [];
  for (const route of input.output.routes) {
    const vehicle = vehicles.get(route.vehicleId);
    if (!vehicle) continue; // reported by the vehicle validator
    let kg = 0;
    let m3 = 0;
    for (const stop of route.stops) {
      const order = orders.get(stop.orderId);
      if (!order) continue; // reported by the allocation validator
      kg += order.weightKg;
      m3 += order.volumeM3;
    }
    if (kg > vehicle.capacityKg) {
      issues.push(
        issue(
          'capacity',
          'WEIGHT_OVER_CAPACITY',
          'CRITICAL',
          'FAIL',
          `${vehicle.id} capacity ${vehicle.capacityKg} kg, assigned ${kg} kg, overload ${kg - vehicle.capacityKg} kg`,
          [vehicle.id],
        ),
      );
    }
    if (m3 > vehicle.capacityM3 + 1e-9) {
      issues.push(
        issue(
          'capacity',
          'VOLUME_OVER_CAPACITY',
          'CRITICAL',
          'FAIL',
          `${vehicle.id} capacity ${vehicle.capacityM3} m3, assigned ${+m3.toFixed(3)} m3, overload ${+(m3 - vehicle.capacityM3).toFixed(3)} m3`,
          [vehicle.id],
        ),
      );
    }
  }
  return issues;
};
