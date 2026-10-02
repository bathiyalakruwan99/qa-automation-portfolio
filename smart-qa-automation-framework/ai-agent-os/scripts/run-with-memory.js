/**
 * run-with-memory.js
 *
 * Runs the Playwright test suite for a given module and triggers
 * post-run memory curation after execution.
 *
 * Usage: node run-with-memory.js [--module <name>] [--tag @smoke]
 *
 * Synthetic example for portfolio demonstration.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Inputs go into a shell command, so only plain names are accepted.
const SAFE_MODULE = /^[A-Za-z0-9_-]+$/;
const SAFE_TAG = /^@?[A-Za-z0-9_-]+$/;

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { module: null, tag: null };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--module') opts.module = args[++i];
    if (args[i] === '--tag') opts.tag = args[++i];
  }
  if (opts.module !== null && !SAFE_MODULE.test(opts.module)) throw new Error(`Invalid --module "${opts.module}"`);
  if (opts.tag !== null && !SAFE_TAG.test(opts.tag)) throw new Error(`Invalid --tag "${opts.tag}"`);
  return opts;
}

function runPlaywright(module, tag) {
  // --grep selects the tagged tests (--grepInvert would exclude them).
  const grep = tag ? `--grep "${tag}"` : '';
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
    // Still curate memory from a failed run (failures are evidence), but never report success.
    console.error('[run-with-memory] Playwright run failed.');
    process.exitCode = 1;
  }

  triggerMemoryUpdate(module);
}

main();
