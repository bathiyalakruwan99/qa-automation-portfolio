import { createApp } from './app';

const port = Number(process.env.PORT ?? 3000);
// Test hooks: DEMO_TEST_MODE=1 or --test-mode (the flag works the same on every shell, including Windows).
const testMode = process.env.DEMO_TEST_MODE === '1' || process.argv.includes('--test-mode');

// Bind to loopback only: the demo app is never meant to be reachable from other machines.
createApp({ testMode }).listen(port, '127.0.0.1', () => {
  console.log(
    `[demo-app] Northstar Logistics demo on http://127.0.0.1:${port} (test hooks ${testMode ? 'ON' : 'off'})`,
  );
});
