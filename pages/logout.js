import { Page } from '@playwright/test';

export async function logout(page) {
  await page.getByRole('button', { name: 'Open user menu profile logo' }).click();
  await page.getByRole('menuitem', { name: 'Sign Out' }).click();
}
