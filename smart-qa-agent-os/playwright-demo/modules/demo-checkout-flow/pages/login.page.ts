import { Page, expect } from '@playwright/test';
import type { DemoUser } from '../data/types';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto(baseUrl: string): Promise<void> {
    await this.page.goto(`${baseUrl}/login`);
  }

  async signIn(user: DemoUser): Promise<void> {
    await this.page.getByRole('textbox', { name: 'Email' }).fill(user.email);
    await this.page.getByRole('textbox', { name: 'Password' }).fill(user.password);
    await this.page.getByRole('button', { name: 'Sign in' }).click();
    await expect(this.page).toHaveURL(/\/(home|account|store)/);
  }
}
