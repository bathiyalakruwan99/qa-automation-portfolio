import fs from 'node:fs';
import path from 'node:path';
import type { FullResult, Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import { redact } from '../api/helpers/redact';
import { type Classification, classifyFailure } from '../utils/failure-classifier';

interface ClassifiedFailure extends Classification {
  test: string;
  file: string;
  status: TestResult['status'];
  retry: number;
  error: string;
  attachments: string[];
}

/**
 * Writes test-results/failure-classification.json: one suggested classification per failed test.
 * Messages are redacted and truncated; classifications are unconfirmed until a human reviews them.
 */
export default class FailureClassificationReporter implements Reporter {
  private readonly failures: ClassifiedFailure[] = [];

  constructor(private readonly options: { outputFile?: string } = {}) {}

  onTestEnd(test: TestCase, result: TestResult): void {
    if (result.status === 'passed' || result.status === 'skipped') return;
    const error = result.errors[0];
    const message = error?.message ?? `Test ended with status ${result.status}`;
    this.failures.push({
      test: test.titlePath().slice(1).join(' › '),
      file: path.relative(process.cwd(), test.location.file),
      status: result.status,
      retry: result.retry,
      error: String(redact(message)).slice(0, 600),
      attachments: result.attachments.map((a) => a.name),
      ...classifyFailure({ message, stack: error?.stack }),
    });
  }

  onEnd(result: FullResult): void {
    const file = this.options.outputFile ?? 'test-results/failure-classification.json';
    const summary: Record<string, number> = {};
    for (const f of this.failures) summary[f.classification] = (summary[f.classification] ?? 0) + 1;
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(
      file,
      JSON.stringify(
        { runStatus: result.status, failed: this.failures.length, summary, failures: this.failures },
        null,
        2,
      ),
    );
    if (this.failures.length > 0) {
      console.log(
        `\n[failure-classification] ${this.failures.length} failure(s) -> ${file} ` +
          `(${Object.entries(summary)
            .map(([k, v]) => `${k}: ${v}`)
            .join(', ')}). Suggestions only - confirm from the trace.`,
      );
    }
  }

  printsToStdio(): boolean {
    return false;
  }
}
