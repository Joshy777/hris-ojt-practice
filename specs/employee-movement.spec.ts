import { test, expect } from '@playwright/test';
import { login } from '../pages/login-josh';
import { goToEmployeeMovement } from '../pages/employeeMovement.page';
import { expectTableHasRows, expectEmployeeInFirstRow } from '../assertions/employeeMovement.assert';
import { searchEmployee, resetSearch, createPMF } from '../utils/helpers/employeeMovement.helper';
import { filterByDate } from '../utils/helpers/employeeMovement.helper';  
import { verifyDateResults } from '../assertions/employeeMovement.assert';

test('Employee Movement Full Module Flow', async ({ page }) => {
  // LOGIN
  await login(page);
 await page
  .getByRole('button', { name: 'Open user menu profile logo' })
  .waitFor({ state: 'visible' });

  // NAVIGATE
  await goToEmployeeMovement(page);

  
  // INITIAL CHECK 
  await expectTableHasRows(page);
  await expectEmployeeInFirstRow(page);


  // RESET SEARCH
  await searchEmployee(page, 'Allen Alexander');
  await resetSearch(page);


  // DATE RANGE FILTER (TC-EM-004)
  await filterByDate(page, '01/15/2026', '01/25/2026');
  await verifyDateResults(page, '');


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
    employeeName: 'Allen Alexander • Admin | Software Engineer',
    positionValue: '128',
    employmentStatusValue: '102',
    startDateOption: 'Choose Tuesday, January 20th,',
    regularizationType: 'Early Regularization',
    salaryChangeOption: 'No changes',
  });

});
