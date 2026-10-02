import type { RunResult } from '../scenarios/scenario-runner';

const mark = (pass: boolean) => (pass ? 'PASS' : 'FAIL');

/** Human-readable run report. Every line is derived from the run result; nothing is hard-coded. */
export function formatReport(run: RunResult, detailDevices = 3): string {
  const lines = [
    `Scenario: ${run.scenario}`,
    `Seed: ${run.seed}`,
    '',
    `Vehicles: ${run.devices.length}`,
    `Points generated: ${run.totalPoints}`,
    '',
  ];
  for (const d of run.devices.slice(0, detailDevices)) {
    const dev = d.adherence.deviations;
    lines.push(d.deviceId);
    lines.push(
      `  Deviation: ${dev.length > 0 ? `detected (max ${Math.round(Math.max(...dev.map((x) => x.maxDistanceM)))} m off route)` : 'none'}`,
    );
    lines.push(
      `  Rejoin: ${dev.length === 0 ? 'n/a' : dev.every((x) => x.rejoinedAt) ? 'detected' : 'NOT detected'}`,
    );
    lines.push(
      `  Stops: ${d.stops.length}${d.stops.length ? ` (${d.stops.map((s) => `${Math.round(s.durationS)} s`).join(', ')})` : ''}`,
    );
    lines.push(
      `  Geofence events: ${d.geofenceEvents.map((g) => `${g.type} ${g.geofenceId}${g.dwellS !== undefined ? ` (dwell ${Math.round(g.dwellS)} s)` : ''}`).join(', ') || 'none'}`,
    );
    lines.push(
      `  Data quality: ${d.dataQuality.map((q) => `${q.type} @seq ${q.seq}`).join(', ') || 'clean'}`,
    );
    for (const c of d.checks)
      lines.push(`  ${mark(c.pass)}  ${c.name} (expected ${c.expected}, got ${c.actual})`);
    lines.push('');
  }
  if (run.devices.length > detailDevices) {
    const rest = run.devices.slice(detailDevices);
    const failed = rest.filter((d) => d.result === 'FAIL').map((d) => d.deviceId);
    lines.push(
      `${rest.length} more vehicle(s): ${failed.length === 0 ? 'all PASS' : `FAIL: ${failed.join(', ')}`}`,
      '',
    );
  }
  lines.push(`Result: ${run.result}`);
  return lines.join('\n');
}
