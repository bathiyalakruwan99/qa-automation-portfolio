import { Page } from '@playwright/test';
import { mkdir, writeFile } from 'fs/promises';
import { dirname, resolve } from 'path';

export async function captureDomSnapshot(page: Page, label: string): Promise<string> {
  const target = resolve(__dirname, '..', 'dom', `${label}.snapshot.txt`);
  await mkdir(dirname(target), { recursive: true });

  const lines: string[] = [];
  lines.push(`# DOM snapshot - ${label}`);
  lines.push(`# Captured: ${new Date().toISOString()}`);
  lines.push(`# URL: ${page.url()}`);
  lines.push('');

  const headings = await page.locator('h1, h2, h3, [role="heading"]').allInnerTexts();
  lines.push('## Headings');
  for (const h of headings) lines.push(`- ${h.trim()}`);

  lines.push('');
  lines.push('## Interactive elements');
  const buttons = await page.getByRole('button').allInnerTexts();
  for (const b of buttons) lines.push(`- button: ${b.trim()}`);

  lines.push('');
  lines.push('## Test-id anchors');
  const testIds = await page.locator('[data-testid]').evaluateAll((els) =>
    els.map((el) => (el as HTMLElement).getAttribute('data-testid'))
  );
  for (const id of testIds) if (id) lines.push(`- ${id}`);

  await writeFile(target, lines.join('\n'), 'utf-8');
  return target;
}
