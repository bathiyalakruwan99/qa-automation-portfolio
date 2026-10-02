# Scripts (Sample Utilities)

Sanitized utility scripts that support the Smart QA Agent OS workflow. These are illustrative templates, not production code.

> Synthetic example for portfolio demonstration. No private scripts, internal endpoints, or credentials are included.

## Files

| File | Purpose |
| --- | --- |
| [`check-no-secrets.js`](check-no-secrets.js) | Scans staged files for secrets, tokens, and credentials before commit |
| [`clean-qa-output.js`](clean-qa-output.js) | Removes old evidence artifacts from `qa-output/` while keeping markdown reports |
| [`run-postman-newman.js`](run-postman-newman.js) | Runs a Postman collection via Newman CLI with environment and reporter flags |
| [`run-with-memory.js`](run-with-memory.js) | Runs the Playwright suite and triggers post-run memory curation |
| [`create-skill-agent-report.js`](create-skill-agent-report.js) | Generates a dated skill-agent report from the latest run results |

## Usage (Conceptual)

```bash
# Pre-commit secret check
node scripts/check-no-secrets.js

# Clean old evidence (keep reports)
node scripts/clean-qa-output.js --older-than 7d

# Run Postman regression
node scripts/run-postman-newman.js --collection postman/demo.json --env postman/demo-env.json

# Run Playwright with post-run memory update
node scripts/run-with-memory.js --module demo-store-checkout

# Generate skill-agent report
node scripts/create-skill-agent-report.js --date 2026-06-15
```

## Confidentiality

All scripts are synthetic templates. Private endpoints, auth flows, internal paths, and proprietary logic have been removed.
