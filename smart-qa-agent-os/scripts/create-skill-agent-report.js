/**
 * create-skill-agent-report.js
 *
 * Generates a dated skill-agent report markdown file from the latest
 * Playwright run results.
 *
 * Synthetic example for portfolio demonstration.
 */

const fs = require('fs');
const path = require('path');

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { date: new Date().toISOString().slice(0, 10) };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--date') opts.date = args[++i];
  }
  return opts;
}

function loadResults() {
  const resultsPath = path.resolve(__dirname, '..', 'qa-output', 'playwright-results.json');
  if (!fs.existsSync(resultsPath)) {
    console.log('[create-skill-agent-report] No playwright-results.json found.');
    return null;
  }
  return JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
}

function generateReport(data, date) {
  const lines = [
    `# Skill Agent Report - ${date}`,
    '',
    '> Synthetic example for portfolio demonstration.',
    '',
    '## Report Period',
    '',
    `${date}, run \`${data.runId}\` for \`${data.module}\` module.`,
    '',
    '## Run Summary',
    '',
    `| Metric | Value |`,
    `| --- | --- |`,
    `| Total | ${data.summary.total} |`,
    `| Passed | ${data.summary.passed} |`,
    `| Failed | ${data.summary.failed} |`,
    `| Duration | ${data.duration} |`,
    '',
    '## Per-case Results',
    '',
    '| ID | Title | Status | Duration |',
    '| --- | --- | --- | --- |',
  ];

  for (const c of data.cases) {
    lines.push(`| ${c.id} | ${c.title} | ${c.status} | ${c.duration} |`);
  }

  lines.push('', '## Confidentiality', '', 'All data is synthetic. No private agent outputs or real product data is included.');

  return lines.join('\n');
}

function main() {
  const { date } = parseArgs();
  const data = loadResults();
  if (!data) return;

  const report = generateReport(data, date);
  const outDir = path.resolve(__dirname, '..', 'qa-output', 'skill-agent-reports');
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `${date}.md`);
  fs.writeFileSync(outFile, report, 'utf-8');
  console.log(`[create-skill-agent-report] Report written to ${outFile}`);
}

main();
