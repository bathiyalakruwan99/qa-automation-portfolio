import type { ValidationResult } from '../validators';

const count = (r: ValidationResult, ...codes: string[]) =>
  r.issues.filter((i) => codes.includes(i.code)).length;

/** Text report in the shape QA reviewers expect: counts first, then each finding with its evidence. */
export function formatReport(r: ValidationResult): string {
  const lines = [
    'Route Validation Report',
    `Run: ${r.runId}`,
    '',
    `Orders in scope: ${r.stats.ordersInScope}`,
    `Orders routed: ${r.stats.ordersRouted}`,
    `Orders unassigned: ${r.stats.ordersUnassigned}`,
    `Missing orders: ${count(r, 'ORDER_MISSING')}`,
    `Duplicate assignments: ${count(r, 'ORDER_ASSIGNED_TWICE')}`,
    '',
    `Vehicles: ${r.stats.vehicles} (routes: ${r.stats.routes})`,
    '',
    `Capacity violations: ${count(r, 'WEIGHT_OVER_CAPACITY', 'VOLUME_OVER_CAPACITY')}`,
    `Vehicle compatibility issues: ${count(r, 'VEHICLE_TYPE_MISMATCH', 'LOCATION_DISALLOWS_VEHICLE', 'UNKNOWN_VEHICLE', 'VEHICLE_USED_TWICE')}`,
    `Sequence issues: ${r.issues.filter((i) => i.validator === 'sequence').length}`,
    `Distance issues: ${r.issues.filter((i) => i.validator === 'distance').length}`,
    '',
  ];
  if (r.issues.length > 0) {
    lines.push('Findings:');
    for (const i of r.issues) lines.push(`  [${i.severity} ${i.status}] ${i.code}: ${i.message}`);
    lines.push('');
  }
  lines.push(`Blocking findings: ${r.blocking}   Warnings: ${r.warnings}`);
  lines.push(`Final Result: ${r.verdict}`);
  lines.push('The release decision belongs to human QA; this report is evidence, not an approval.');
  return lines.join('\n');
}
