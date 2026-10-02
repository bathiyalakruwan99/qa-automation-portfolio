import type { Issue, Validator } from '../models/types';
import { allStops, issue } from './helpers';

/** No order may be delivered twice, whether on the same route or on two different vehicles. */
export const duplicateValidator: Validator = (input) => {
  const seen = new Map<string, string[]>();
  for (const { route, stopIndex } of allStops(input)) {
    const orderId = route.stops[stopIndex]!.orderId;
    seen.set(orderId, [...(seen.get(orderId) ?? []), route.vehicleId]);
  }
  const issues: Issue[] = [];
  for (const [orderId, vehicles] of seen) {
    if (vehicles.length > 1) {
      issues.push(
        issue(
          'duplicate',
          'ORDER_ASSIGNED_TWICE',
          'CRITICAL',
          'FAIL',
          `${orderId} appears ${vehicles.length} times (${vehicles.join(', ')})`,
          [orderId, ...new Set(vehicles)],
        ),
      );
    }
  }
  return issues;
};
