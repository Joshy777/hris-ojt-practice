import { test, expect } from '@playwright/test';
import { login } from '../pages/login-josh';
import { createPMF } from '../utils/helpers/pmf.helper';

test('Employee Movement Full Module Flow', async ({ page }) => {
  // LOGIN
  await login(page);

  // NAVIGATE
  await page.waitForTimeout(8000);
  await page.click('text=Manage');
  await page.click('text=Employee Movement');
  await expect(page).toHaveURL(/.*employee-movement/);

  // INITIAL CHECK (TC-EM-001 & TC-EM-002)
  const rows = page.locator('table tbody tr');
  const countText = await page.locator('text=Total Record/s:').textContent();
  expect(await rows.count()).toBeGreaterThan(0);

  
  // SEARCH (TC-EM-003)
  const searchInput = page.locator('input[placeholder="Search ..."]');
  await searchInput.fill('Sage Rutledge');
  await page.keyboard.press('Enter');
   await page.waitForTimeout(4000);
  await expect(page.locator('table tbody tr').first().locator('td').nth(2)).toHaveText('Sage Rutledge');

  // RESET SEARCH
  await searchInput.fill('');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(500);

  // DATE RANGE FILTER (TC-EM-004)
  await page.click('button:has-text("1")').catch(() => {});
  await page.waitForTimeout(500);

  await page.locator('input[placeholder="mm/dd/yyyy"]').first().fill('01/20/2026');
  await page.locator('input[placeholder="mm/dd/yyyy"]').nth(1).fill('01/20/2026');
  await page.getByRole('button').nth(4).click();
  await page.waitForTimeout(1000);

  await expect(page.getByRole('cell', { name: '/20/2026' }).first()).toBeVisible();



  // PAGINATION (TC-EM-005)
  await page.click('button:has-text("2")').catch(() => {});
  await expect(page.locator('tbody tr').first()).toBeVisible();

  await page.click('button:has-text("1")').catch(() => {});
  await expect(page.locator('tbody tr').first()).toBeVisible();

  // RECORDS PER PAGE (TC-EM-006)
  await page.locator('#role-desktop').selectOption('10');
  await page.waitForTimeout(1000);

  const rowCount = await page.locator('tbody tr').count();
  expect(rowCount).toBeLessThanOrEqual(10);

  // CREATE PMF (TC-EM-007, 008, 009)
  await createPMF(page, {
    employeeName: 'Clayton Pace • Admin | Sales',
    positionValue: '128',
    employmentStatusValue: '102',
    startDateOption: 'Choose Tuesday, January 20th,',
    regularizationType: 'Early Regularization',
    salaryChangeOption: 'No changes',
  });

});
