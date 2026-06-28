/**
 * run-with-memory.js
 *
 * Runs the Playwright test suite for a given module and triggers
 * post-run memory curation after execution.
 *
 * Synthetic example for portfolio demonstration.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { module: null, tag: null };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--module') opts.module = args[++i];
    if (args[i] === '--tag') opts.tag = args[++i];
  }
  return opts;
}

function runPlaywright(module, tag) {
  const grep = tag ? `--grepInvert "${tag}"` : '';
  const cmd = `npx playwright test ${module ? `tests/${module}` : ''} ${grep}`.trim();
  console.log(`[run-with-memory] Running: ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

function triggerMemoryUpdate(module) {
  const resultsPath = path.resolve(__dirname, '..', 'qa-output', 'playwright-results.json');
  if (!fs.existsSync(resultsPath)) {
    console.log('[run-with-memory] No playwright-results.json found. Skipping memory update.');
    return;
  }

  console.log('[run-with-memory] Triggering memory curation...');
  // In the real system, this invokes the memory curator agent.
  // Here we just log the intent for demonstration.
  console.log(`[run-with-memory] Memory curator would process: ${resultsPath}`);
  console.log(`[run-with-memory] Module: ${module || 'all'}`);
}

function main() {
  const { module, tag } = parseArgs();

  try {
    runPlaywright(module, tag);
  } catch (err) {
    console.error('[run-with-memory] Playwright run failed.');
  }

  triggerMemoryUpdate(module);
}

main();
