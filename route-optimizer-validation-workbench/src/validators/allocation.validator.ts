import { UNASSIGNED_REASONS, type Validator } from '../models/types';
import { allStops, issue } from './helpers';

/**
 * Every input order must appear exactly once in the output: on a route, or in `unassigned` with a reason.
 * Orders the input never contained must not appear at all.
 */
export const allocationValidator: Validator = (input) => {
  const issues = [];
  const inputIds = new Set(input.orders.map((o) => o.id));
  const routed = new Set(allStops(input).map((s) => s.stop.orderId));
  const unassigned = new Map(input.output.unassigned.map((u) => [u.orderId, u.reasonCode]));

  for (const id of inputIds) {
    if (!routed.has(id) && !unassigned.has(id)) {
      issues.push(
        issue('allocation', 'ORDER_MISSING', 'CRITICAL', 'FAIL', `${id} is neither routed nor unassigned`, [
          id,
        ]),
      );
    }
    if (routed.has(id) && unassigned.has(id)) {
      issues.push(
        issue(
          'allocation',
          'ORDER_ROUTED_AND_UNASSIGNED',
          'CRITICAL',
          'FAIL',
          `${id} is routed and also listed as unassigned`,
          [id],
        ),
      );
    }
  }
  for (const id of new Set([...routed, ...unassigned.keys()])) {
    if (!inputIds.has(id)) {
      issues.push(
        issue(
          'allocation',
          'UNKNOWN_ORDER',
          'CRITICAL',
          'FAIL',
          `${id} is in the output but not in the input`,
          [id],
        ),
      );
    }
  }
  for (const [id, reason] of unassigned) {
    if (!inputIds.has(id)) continue;
    if (!reason || !(UNASSIGNED_REASONS as readonly string[]).includes(reason)) {
      issues.push(
        issue(
          'allocation',
          'UNASSIGNED_WITHOUT_REASON',
          'MAJOR',
          'FAIL',
          `${id} is unassigned with ${reason ? `unknown reason "${reason}"` : 'no reason'}; expected one of ${UNASSIGNED_REASONS.join(', ')}`,
          [id],
        ),
      );
    }
  }
  return issues;
};
