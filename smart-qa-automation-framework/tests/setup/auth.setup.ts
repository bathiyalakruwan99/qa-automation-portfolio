import { expect, test as setup } from '@playwright/test';
import { loadEnv } from '../../src/config/env';
import { AUTH_FILE } from '../../src/config/paths';
import { LoginPage } from '../../src/pages/login.page';

/** Signs in once through the real UI and saves the browser state for every UI project test. */
setup('sign in as the demo user', async ({ page }) => {
  const env = loadEnv();
  const login = new LoginPage(page);

  await login.goto();
  await login.login(env.username, env.password);

  await expect(page).toHaveURL(/\/shipments\.html$/);
  await page.context().storageState({ path: AUTH_FILE });
});
