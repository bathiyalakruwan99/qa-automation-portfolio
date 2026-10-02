/**
 * clean-qa-output.js
 *
 * Removes old evidence artifacts (traces, screenshots, network logs, videos)
 * from qa-output/<module>/ subfolders while preserving markdown reports.
 *
 * Synthetic example for portfolio demonstration.
 */

const fs = require('fs');
const path = require('path');

const QA_OUTPUT = path.resolve(__dirname, '..', 'qa-output');
const EVIDENCE_DIRS = ['traces', 'screenshots', 'network', 'videos'];
const DEFAULT_DAYS = 7;

function parseArgs() {
  const args = process.argv.slice(2);
  let days = DEFAULT_DAYS;
  for (const arg of args) {
    const m = arg.match(/--older-than\s+(\d+)d?/);
    if (m) days = parseInt(m[1], 10);
  }
  return { days };
}

function isOlderThan(file, days) {
  const stat = fs.statSync(file);
  const ageMs = Date.now() - stat.mtimeMs;
  return ageMs > days * 24 * 60 * 60 * 1000;
}

function cleanDir(dir, days) {
  if (!fs.existsSync(dir)) return 0;
  let removed = 0;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) {
      removed += cleanDir(full, days);
    } else if (entry !== '.gitkeep' && isOlderThan(full, days)) {
      fs.unlinkSync(full);
      console.log(`[clean-qa-output] Removed: ${path.relative(QA_OUTPUT, full)}`);
      removed++;
    }
  }
  return removed;
}

function main() {
  const { days } = parseArgs();
  if (!fs.existsSync(QA_OUTPUT)) {
    console.log('[clean-qa-output] qa-output/ not found. Nothing to clean.');
    return;
  }

  let total = 0;
  for (const entry of fs.readdirSync(QA_OUTPUT)) {
    const moduleDir = path.join(QA_OUTPUT, entry);
    if (!fs.statSync(moduleDir).isDirectory()) continue;
    for (const sub of EVIDENCE_DIRS) {
      total += cleanDir(path.join(moduleDir, sub), days);
    }
  }

  console.log(`[clean-qa-output] Removed ${total} file(s) older than ${days} day(s).`);
}

main();
