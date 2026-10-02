import fs from 'node:fs';
import path from 'node:path';
import { InputError, loadInput } from './data/load';
import { formatReport } from './reporting/report';
import { validatePlan } from './validators';

/** Usage: npm run validate -- [--data sample-data] [--output optimizer-output.json] [--json report.json] */
function arg(name: string, fallback?: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : fallback;
}

try {
  const dir = path.resolve(arg('data', path.join(__dirname, '..', 'sample-data')) as string);
  const result = validatePlan(loadInput(dir, arg('output', 'optimizer-output.json')));
  console.log(formatReport(result));
  const jsonOut = arg('json');
  if (jsonOut) {
    fs.mkdirSync(path.dirname(path.resolve(jsonOut)), { recursive: true });
    fs.writeFileSync(jsonOut, JSON.stringify(result, null, 2));
    console.log(`\nJSON report written to ${jsonOut}`);
  }
  // 1 = blocking findings, 0 = none; never a silent pass on a broken plan.
  process.exit(result.blocking > 0 ? 1 : 0);
} catch (e) {
  console.error(e instanceof InputError ? e.message : `Unexpected error: ${(e as Error).message}`);
  process.exit(2);
}
