import { Page, expect } from '@playwright/test';

export async function goToEmployeeMovement(page: Page) {
  await page.getByText('Manage').click();
  await page.getByText('Employee Movement').click();
  await expect(page).toHaveURL(/employee-movement/);
}
