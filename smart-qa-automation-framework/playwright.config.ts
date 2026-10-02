import { defineConfig, devices } from '@playwright/test';
import { loadEnv } from './src/config/env';

// Fails fast (before any test runs) if DEMO_BASE_URL points at a non-local host without opt-in.
const env = loadEnv();
const port = new URL(env.baseUrl).port || '3000';
export const AUTH_FILE = '.auth/demo-user.json';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // No retries: the system under test is local and deterministic. A failure is investigated, not re-run
  // (see docs/retry-and-evidence.md). Retries would only be justified for known transient infrastructure.
  retries: 0,
  workers: process.env.CI ? 2 : 1,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  globalSetup: './tests/global-setup.ts',
  use: {
    baseURL: env.baseUrl,
    testIdAttribute: 'data-testid',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },
  webServer: {
    command: 'npm run demo:start',
    url: `${env.baseUrl}/health`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
    env: { DEMO_TEST_MODE: '1', PORT: port },
    stdout: 'ignore',
    stderr: 'pipe',
  },
  projects: [
    {
      name: 'api',
      testDir: './tests/api',
    },
    {
      name: 'setup',
      testDir: './tests/setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      testIgnore: ['**/api/**', '**/setup/**'],
      use: { ...devices['Desktop Chrome'], storageState: AUTH_FILE },
      dependencies: ['setup'],
    },
  ],
});
