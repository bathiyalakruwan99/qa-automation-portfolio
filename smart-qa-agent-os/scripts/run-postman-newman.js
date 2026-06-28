/**
 * run-postman-newman.js
 *
 * Runs a Postman collection via Newman CLI with environment and reporter flags.
 * Produces HTML and JSON reports under qa-output/<module>/network/.
 *
 * Synthetic example for portfolio demonstration.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { collection: null, env: null, module: 'generic' };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--collection') opts.collection = args[++i];
    if (args[i] === '--env') opts.env = args[++i];
    if (args[i] === '--module') opts.module = args[++i];
  }
  if (!opts.collection) {
    console.error('Usage: node run-postman-newman.js --collection <path> --env <path> [--module <name>]');
    process.exit(1);
  }
  return opts;
}

function main() {
  const { collection, env, module } = parseArgs();
  const outputDir = path.resolve(__dirname, '..', 'qa-output', module, 'network');
  fs.mkdirSync(outputDir, { recursive: true });

  const cmd = [
    'npx newman run',
    `"${path.resolve(collection)}"`,
    env ? `--environment "${path.resolve(env)}"` : '',
    '--reporters cli,json,htmlextra',
    `--reporter-json-export "${path.join(outputDir, 'newman-results.json')}"`,
    `--reporter-htmlextra-export "${path.join(outputDir, 'newman-report.html')}"`,
    '--insecure',
  ].filter(Boolean).join(' ');

  console.log(`[run-postman-newman] Running: ${cmd}`);
  try {
    execSync(cmd, { stdio: 'inherit' });
    console.log('[run-postman-newman] Collection run completed.');
  } catch (err) {
    console.error('[run-postman-newman] Collection run failed.');
    process.exit(1);
  }
}

main();
