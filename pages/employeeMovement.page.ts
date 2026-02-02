import { Page, expect } from '@playwright/test';

export async function goToEmployeeMovement(page: Page) {
    await page
    .getByRole('button', { name: 'Open user menu profile logo' })
    .waitFor({ state: 'visible' });
    await expect(page.getByRole('link', { name: 'Manage' })).toBeVisible();

  await page.getByText('Manage').click();

  const understandBtn = page.getByRole('button', { name: 'I Understand' });

  if (await understandBtn.isVisible()) {
  await understandBtn.click();
  await page.getByText('Manage').click();
  }


  await page.getByText('Employee Movement').click();
  await expect(page).toHaveURL(/employee-movement/);
}
