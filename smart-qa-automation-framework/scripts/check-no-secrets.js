/**
 * check-no-secrets.js
 *
 * Lightweight pre-commit secret scan. Complements (does not replace) gitleaks in CI.
 *
 * Usage:
 *   node check-no-secrets.js          # scan staged files (default)
 *   node check-no-secrets.js --all    # scan every tracked file
 *
 * Exits with code 1 if any suspicious pattern is found. Matched values are never printed.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const RULES = [
  { name: 'generic api key assignment', re: /(?:api[_-]?key|apikey|x-api-key)['"]?\s*[:=]\s*['"][A-Za-z0-9_\-]{16,}['"]/gi },
  { name: 'secret/token/password assignment', re: /(?:secret|token|password|passwd|pwd)['"]?\s*[:=]\s*['"][^\s'"]{8,}['"]/gi },
  { name: 'bearer token', re: /Bearer\s+[A-Za-z0-9._\-]{20,}/g },
  { name: 'JWT', re: /eyJ[A-Za-z0-9_\-]{10,}\.eyJ[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]{10,}/g },
  { name: 'Google API key', re: /AIza[0-9A-Za-z_\-]{35}/g },
  { name: 'AWS access key id', re: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g },
  { name: 'GitHub token', re: /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36,}\b|\bgithub_pat_[A-Za-z0-9_]{50,}\b/g },
  { name: 'Slack token', re: /\bxox[abprs]-[A-Za-z0-9-]{10,}\b/g },
  { name: 'private key block', re: /-----BEGIN\s+(?:RSA\s+|EC\s+|OPENSSH\s+|DSA\s+)?PRIVATE\s+KEY-----/g },
  { name: 'database URL with credentials', re: /\b(?:mongodb(?:\+srv)?|postgres(?:ql)?|mysql|redis|amqp):\/\/[^\s'"/:]+:[^\s'"@]+@/gi },
];

// Values that are intentionally fake and documented as such.
const ALLOWED_VALUES = [/REPLACE_ME/i, /demo[-_]?pass/i, /example\.(?:test|com)/i, /['"]role=/, /<[^>]+>/];

const SKIPPED_FILES = [
  /(^|\/)\.env\.example$/,
  /(^|\/)node_modules\//,
  /package-lock\.json$/,
  /\.(png|jpe?g|gif|mp4|webm|ico|pdf|zip|xlsx)$/i,
];

function listFiles(all) {
  const cmd = all ? 'git ls-files' : 'git diff --cached --name-only --diff-filter=ACMR';
  try {
    return execSync(cmd, { encoding: 'utf-8' }).split('\n').map((f) => f.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

function scanFile(file) {
  const full = path.resolve(file);
  if (!fs.existsSync(full) || fs.statSync(full).isDirectory()) return [];
  const lines = fs.readFileSync(full, 'utf-8').split(/\r?\n/);
  const findings = [];
  lines.forEach((line, i) => {
    for (const rule of RULES) {
      rule.re.lastIndex = 0;
      for (const match of line.matchAll(rule.re)) {
        if (ALLOWED_VALUES.some((ok) => ok.test(match[0]))) continue;
        findings.push({ file, line: i + 1, rule: rule.name });
      }
    }
  });
  return findings;
}

function main() {
  const all = process.argv.includes('--all');
  const files = listFiles(all).filter((f) => !SKIPPED_FILES.some((p) => p.test(f)));
  if (files.length === 0) {
    console.log(`[check-no-secrets] No ${all ? 'tracked' : 'staged'} files to scan.`);
    return;
  }

  const findings = files.flatMap(scanFile);
  for (const f of findings) {
    console.error(`[check-no-secrets] ${f.file}:${f.line} - ${f.rule}`);
  }

  if (findings.length > 0) {
    console.error(`[check-no-secrets] ${findings.length} suspicious value(s) in ${files.length} file(s). Review before committing.`);
    process.exit(1);
  }
  console.log(`[check-no-secrets] OK - ${files.length} ${all ? 'tracked' : 'staged'} file(s) scanned, no secrets detected.`);
}

main();
