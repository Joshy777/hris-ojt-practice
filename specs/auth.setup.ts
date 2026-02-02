import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authntication', async({ page }) => {
await page.goto('/login');
  await page.getByRole('textbox', { name: 'Email' })
    .fill('joba.pagapong.coc@phinmaed.com');
  await page.getByRole('textbox', { name: 'Password' })
    .fill('Ezeypagapong@777');
  await page.getByRole('button', { name: 'Sign in' }).click();
   await page.context().storageState({ path: authFile });
})