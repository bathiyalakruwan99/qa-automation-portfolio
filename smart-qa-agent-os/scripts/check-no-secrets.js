/**
 * check-no-secrets.js
 *
 * Scans staged files for potential secrets, tokens, and credentials.
 * Exits with code 1 if any suspicious patterns are found.
 *
 * Synthetic example for portfolio demonstration.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PATTERNS = [
  /(?:api[_-]?key|apikey)\s*[:=]\s*['"][A-Za-z0-9]{20,}['"]/gi,
  /(?:secret|token|password|passwd)\s*[:=]\s*['"][^\s'"]{8,}['"]/gi,
  /Bearer\s+[A-Za-z0-9._-]{20,}/gi,
  /-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----/g,
  /mongodb(?:\+srv)?:\/\/[^\s'"]+:[^\s'"]+@/gi,
  /postgres(?:ql)?:\/\/[^\s'"]+:[^\s'"]+@/gi,
];

const ALLOWED = [
  /\.env\.example$/,
  /\.env\.template$/,
  /node_modules\//,
  /package-lock\.json$/,
];

function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-only', { encoding: 'utf-8' });
    return output.trim().split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

function isAllowed(file) {
  return ALLOWED.some((p) => p.test(file));
}

function scanFile(file) {
  const full = path.resolve(file);
  if (!fs.existsSync(full)) return [];
  const content = fs.readFileSync(full, 'utf-8');
  const findings = [];
  for (const pattern of PATTERNS) {
    const matches = content.match(pattern);
    if (matches) {
      findings.push({ file, pattern: pattern.source, count: matches.length });
    }
  }
  return findings;
}

function main() {
  const files = getStagedFiles();
  if (files.length === 0) {
    console.log('[check-no-secrets] No staged files to scan.');
    return;
  }

  let total = 0;
  for (const file of files) {
    if (isAllowed(file)) continue;
    const findings = scanFile(file);
    for (const f of findings) {
      console.error(`[check-no-secrets] WARNING: ${f.file} - ${f.count} match(es) for ${f.pattern}`);
      total += f.count;
    }
  }

  if (total > 0) {
    console.error(`[check-no-secrets] ${total} suspicious pattern(s) found. Review before committing.`);
    process.exit(1);
  }

  console.log('[check-no-secrets] No secrets detected in staged files.');
}

main();
