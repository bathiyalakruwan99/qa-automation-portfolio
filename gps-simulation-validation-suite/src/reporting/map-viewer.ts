import { distanceToPolylineM, type LatLng } from '../geo/geo';
import type { Scenario } from '../scenarios/scenario';
import type { RunResult } from '../scenarios/scenario-runner';
import { DEFAULT_THRESHOLDS } from '../validation/stream-validators';

/**
 * Renders a self-contained HTML page with an inline SVG map of a run: planned route, geofences, each vehicle's
 * stream (off-route fixes highlighted) and the PASS/FAIL checks. No map tiles or external scripts are loaded, so the
 * page works offline and a screenshot of it is deterministic.
 */
const WIDTH = 900;
const HEIGHT = 560;
const PAD = 40;
const COLORS = ['#2f6fdb', '#d9822b', '#2a9d6f', '#8e5bd1', '#c2417a', '#3a8fa6'];
const M_PER_DEG_LAT = 111_320;

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export function renderMapViewer(
  scenario: Scenario,
  run: RunResult,
  offRouteM = DEFAULT_THRESHOLDS.offRouteM,
): string {
  const streams = run.devices.map((d) => d.stream ?? []);
  if (streams.every((s) => s.length === 0))
    throw new Error('renderMapViewer needs a run made with keepStreams: true');

  const all: LatLng[] = [...scenario.route, ...streams.flat()];
  for (const f of scenario.geofences) {
    const dLat = f.radiusM / M_PER_DEG_LAT;
    const dLng = dLat / Math.cos((f.center.lat * Math.PI) / 180);
    all.push(
      { lat: f.center.lat + dLat, lng: f.center.lng + dLng },
      { lat: f.center.lat - dLat, lng: f.center.lng - dLng },
    );
  }
  const minLat = Math.min(...all.map((p) => p.lat));
  const maxLat = Math.max(...all.map((p) => p.lat));
  const minLng = Math.min(...all.map((p) => p.lng));
  const maxLng = Math.max(...all.map((p) => p.lng));
  const kx = Math.cos((((minLat + maxLat) / 2) * Math.PI) / 180);
  const scale = Math.min(
    (WIDTH - 2 * PAD) / ((maxLng - minLng) * kx || 1e-9),
    (HEIGHT - 2 * PAD) / (maxLat - minLat || 1e-9),
  );
  const x = (p: LatLng) => PAD + (p.lng - minLng) * kx * scale;
  const y = (p: LatLng) => PAD + (maxLat - p.lat) * scale;
  const pxPerM = scale / M_PER_DEG_LAT;
  const pts = (line: readonly LatLng[]) => line.map((p) => `${x(p).toFixed(1)},${y(p).toFixed(1)}`).join(' ');

  const fences = scenario.geofences
    .map(
      (f) =>
        `<circle cx="${x(f.center).toFixed(1)}" cy="${y(f.center).toFixed(1)}" r="${(f.radiusM * pxPerM).toFixed(1)}" class="fence"/>` +
        `<text x="${x(f.center).toFixed(1)}" y="${(y(f.center) - f.radiusM * pxPerM - 6).toFixed(1)}" class="label">${esc(f.id)}</text>`,
    )
    .join('');
  const vehicles = run.devices
    .map((d, i) => {
      const color = COLORS[i % COLORS.length] as string;
      const stream = d.stream ?? [];
      const dots = stream
        .map((p) => {
          const off = distanceToPolylineM(p, scenario.route) > offRouteM;
          return `<circle cx="${x(p).toFixed(1)}" cy="${y(p).toFixed(1)}" r="${off ? 4 : 2.5}" fill="${off ? 'var(--off)' : color}"${off ? ' class="off"' : ''}/>`;
        })
        .join('');
      return `<g><polyline points="${pts(stream)}" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.7"/>${dots}</g>`;
    })
    .join('');

  const barM = 500;
  const rows = run.devices
    .map(
      (d, i) =>
        `<tr><td><span class="swatch" style="background:${COLORS[i % COLORS.length]}"></span>${esc(d.deviceId)}</td>` +
        `<td>${d.points}</td><td>${d.adherence.deviations.length ? 'yes' : 'no'}</td>` +
        `<td>${d.geofenceEvents.map((g) => `${g.type} ${esc(g.geofenceId)}`).join('<br>') || '—'}</td>` +
        `<td class="${d.result === 'PASS' ? 'pass' : 'fail'}">${d.result}</td></tr>`,
    )
    .join('');
  const checks = (run.devices[0]?.checks ?? [])
    .map((c) => `<li class="${c.pass ? 'pass' : 'fail'}">${c.pass ? 'PASS' : 'FAIL'} — ${esc(c.name)}</li>`)
    .join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>GPS run: ${esc(run.scenario)}</title>
<style>
  :root { --bg:#f7f8fa; --fg:#1d2330; --muted:#5b6475; --line:#d9dde5; --route:#1d2330; --fence:#2a9d6f; --off:#d0342c; --card:#fff; }
  @media (prefers-color-scheme: dark) {
    :root { --bg:#14171c; --fg:#e6e9ef; --muted:#9aa3b2; --line:#2c323c; --route:#e6e9ef; --fence:#4cc79b; --off:#ff6b61; --card:#1c2027; }
  }
  body { margin:0; font:14px/1.4 system-ui, sans-serif; background:var(--bg); color:var(--fg); }
  main { max-width:960px; margin:0 auto; padding:16px; }
  h1 { font-size:20px; margin:0 0 4px; } p.note { color:var(--muted); margin:0 0 12px; }
  .card { background:var(--card); border:1px solid var(--line); border-radius:8px; padding:12px; margin-bottom:12px; }
  svg { width:100%; height:auto; display:block; }
  .route { fill:none; stroke:var(--route); stroke-width:2; stroke-dasharray:6 4; }
  .fence { fill:var(--fence); fill-opacity:.12; stroke:var(--fence); stroke-width:1.5; }
  .label { fill:var(--muted); font-size:11px; text-anchor:middle; }
  .legend text { fill:var(--fg); font-size:12px; }
  table { width:100%; border-collapse:collapse; } th, td { text-align:left; padding:6px; border-bottom:1px solid var(--line); vertical-align:top; }
  .swatch { display:inline-block; width:10px; height:10px; border-radius:50%; margin-right:6px; }
  .pass { color:var(--fence); font-weight:600; } .fail { color:var(--off); font-weight:600; }
  ul { margin:0; padding-left:18px; }
</style>
</head>
<body>
<main>
  <h1>Scenario: ${esc(run.scenario)} — Result: <span class="${run.result === 'PASS' ? 'pass' : 'fail'}">${run.result}</span></h1>
  <p class="note">${esc(scenario.description)} Seed ${run.seed}. Synthetic demo coordinates; not derived from any real data.${
    run.devices.length > 1
      ? ` All ${run.devices.length} vehicles drive the same scenario, so their tracks overlap.`
      : ''
  }</p>
  <div class="card">
    <svg viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-label="Planned route, geofences and vehicle tracks">
      ${fences}
      <polyline points="${pts(scenario.route)}" class="route"/>
      ${vehicles}
      <g class="legend" transform="translate(${PAD},${HEIGHT - 14})">
        <line x1="0" y1="0" x2="${(barM * pxPerM).toFixed(1)}" y2="0" stroke="var(--fg)" stroke-width="2"/>
        <text x="${(barM * pxPerM + 6).toFixed(1)}" y="4">${barM} m</text>
        <g transform="translate(${(barM * pxPerM + 70).toFixed(1)},0)">
          <line x1="0" y1="0" x2="30" y2="0" class="route"/><text x="36" y="4">planned route</text>
          <circle cx="140" cy="0" r="4" fill="var(--off)"/><text x="148" y="4">fix &gt; ${offRouteM} m off route</text>
        </g>
      </g>
    </svg>
  </div>
  <div class="card">
    <table><thead><tr><th>Vehicle</th><th>Fixes</th><th>Deviation</th><th>Geofence events</th><th>Result</th></tr></thead><tbody>${rows}</tbody></table>
  </div>
  <div class="card"><strong>Checks (${esc(run.devices[0]?.deviceId ?? '')})</strong><ul>${checks}</ul></div>
</main>
</body>
</html>
`;
}
