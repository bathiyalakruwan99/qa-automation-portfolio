import { test } from '../fixtures/demoFixtures';
import { signIn } from '../flows/demo-checkout.flow';
import { HomePage } from '../pages/home.page';
import { captureDomSnapshot } from '../utils/domCapture';

test.describe('@diagnostic Diagnostic helpers', () => {
  test('DIAG-001 - home page DOM snapshot captured for review', async ({ page, env }) => {
    await signIn({ page, ...env });
    await captureDomSnapshot(page, 'home');
  });

  test('DIAG-002 - products page DOM snapshot captured for review', async ({ page, env }) => {
    await signIn({ page, ...env });
    await new HomePage(page).openShop();
    await captureDomSnapshot(page, 'products');
  });
});
