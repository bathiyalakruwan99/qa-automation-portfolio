import type { Issue, ValidationInput, Validator } from '../models/types';
import { allocationValidator } from './allocation.validator';
import { capacityValidator } from './capacity.validator';
import { makeDistanceValidator } from './distance.validator';
import { duplicateValidator } from './duplicate.validator';
import { sequenceValidator } from './sequence.validator';
import { vehicleValidator } from './vehicle.validator';

export const VALIDATORS: Record<string, Validator> = {
  allocation: allocationValidator,
  duplicate: duplicateValidator,
  capacity: capacityValidator,
  vehicle: vehicleValidator,
  sequence: sequenceValidator,
  distance: makeDistanceValidator(),
};

export type Verdict = 'REVIEW REQUIRED' | 'NO ISSUES FOUND - HUMAN REVIEW STILL REQUIRED';

export interface ValidationResult {
  runId: string;
  stats: {
    ordersInScope: number;
    ordersRouted: number;
    ordersUnassigned: number;
    vehicles: number;
    routes: number;
  };
  issues: Issue[];
  blocking: number;
  warnings: number;
  /** Never "approved": the tool gathers evidence, a human owns the decision. */
  verdict: Verdict;
}

const SEVERITY_ORDER = { CRITICAL: 0, MAJOR: 1, MINOR: 2 } as const;

export function validatePlan(input: ValidationInput, validators = VALIDATORS): ValidationResult {
  const issues = Object.values(validators)
    .flatMap((v) => v(input))
    .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] || a.code.localeCompare(b.code));
  const routedIds = new Set(input.output.routes.flatMap((r) => r.stops.map((s) => s.orderId)));
  const unassignedIds = new Set(input.output.unassigned.map((u) => u.orderId));
  const blocking = issues.filter((i) => i.status === 'FAIL').length;
  return {
    runId: input.output.runId,
    stats: {
      // Counts cover input orders only; output-only IDs are reported as UNKNOWN_ORDER findings.
      ordersInScope: input.orders.length,
      ordersRouted: input.orders.filter((o) => routedIds.has(o.id)).length,
      ordersUnassigned: input.orders.filter((o) => unassignedIds.has(o.id) && !routedIds.has(o.id)).length,
      vehicles: input.vehicles.length,
      routes: input.output.routes.length,
    },
    issues,
    blocking,
    warnings: issues.length - blocking,
    verdict: issues.length === 0 ? 'NO ISSUES FOUND - HUMAN REVIEW STILL REQUIRED' : 'REVIEW REQUIRED',
  };
}
