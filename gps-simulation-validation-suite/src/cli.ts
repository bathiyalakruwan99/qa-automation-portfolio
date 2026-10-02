import fs from 'node:fs';
import path from 'node:path';
import { formatReport } from './reporting/gps-report';
import { renderMapViewer } from './reporting/map-viewer';
import { parseScenario } from './scenarios/scenario';
import { runScenario } from './scenarios/scenario-runner';

/** Usage: npm run gps -- --scenario off-route-rejoin [--devices 5] [--seed 7] [--json out.json] [--viewer map.html] */
function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const scenarioDir = path.join(__dirname, '..', 'scenarios');
const name = arg('scenario');
const available = fs
  .readdirSync(scenarioDir)
  .filter((f) => f.endsWith('.json'))
  .map((f) => f.replace(/\.json$/, ''));

if (!name || !available.includes(name)) {
  console.error(
    `Usage: npm run gps -- --scenario <name> [--devices N] [--seed N] [--json file] [--viewer file.html]`,
  );
  console.error(`Scenarios: ${available.join(', ')}`);
  process.exit(2);
}

const devices = Number(arg('devices') ?? 1);
const seed = Number(arg('seed') ?? 1);
if (!Number.isInteger(devices) || devices < 1 || devices > 1000) {
  console.error('--devices must be an integer from 1 to 1000');
  process.exit(2);
}

const scenario = parseScenario(JSON.parse(fs.readFileSync(path.join(scenarioDir, `${name}.json`), 'utf8')));
const viewerOut = arg('viewer');
const run = runScenario(scenario, { devices, seed, keepStreams: Boolean(viewerOut) });
console.log(formatReport(run));

const jsonOut = arg('json');
if (jsonOut) {
  fs.mkdirSync(path.dirname(path.resolve(jsonOut)), { recursive: true });
  // Streams are only kept for the viewer; the JSON report stays small.
  fs.writeFileSync(
    jsonOut,
    JSON.stringify(run, (key, value) => (key === 'stream' ? undefined : value), 2),
  );
  console.log(`\nJSON report written to ${jsonOut}`);
}
if (viewerOut) {
  fs.mkdirSync(path.dirname(path.resolve(viewerOut)), { recursive: true });
  fs.writeFileSync(viewerOut, renderMapViewer(scenario, run));
  console.log(`Map viewer written to ${viewerOut}`);
}
process.exit(run.result === 'PASS' ? 0 : 1);
