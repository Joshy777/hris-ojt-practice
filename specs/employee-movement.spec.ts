import { test, expect } from '@playwright/test';
import { login } from '../pages/login-josh';
import { goToEmployeeMovement } from '../pages/employeeMovement.page';
import {
  expectTableHasRows,
  expectEmployeeInFirstRow,
  verifyDateResults
} from '../assertions/employeeMovement.assert';
import {
  searchEmployee,
  resetSearch,
  createPMF,
  createPMFmissing,
  filterByDate,
  approvePMF
} from '../utils/helpers/employeeMovement.helper';

// ==============================
// SHARED SETUP (CREATOR ONLY)
// ==============================
test.describe('Employee Movement - Creator Flow', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);

    await page
      .getByRole('button', { name: 'Open user menu profile logo' })
      .waitFor({ state: 'visible' });

    await goToEmployeeMovement(page);
  });

  test('TC-EM-001 | Display employee movement records', async ({ page }) => {
    await expectTableHasRows(page);
    await expectEmployeeInFirstRow(page);
  });

  test('TC-EM-002 | Search employee and reset search', async ({ page }) => {
    await searchEmployee(page, 'Allen Alexander');
    await resetSearch(page);
    await expectTableHasRows(page);
  });

  test('TC-EM-004 | Filter employee movement by date range', async ({ page }) => {
    await filterByDate(page, '01/15/2026', '01/25/2026');
    await verifyDateResults(page, '');
  });

  test('TC-EM-005 | Pagination works correctly', async ({ page }) => {
    await page.getByRole('button', { name: 'Page 2' }).click();
    await page.getByRole('button', { name: 'Page 3' }).click();
    await page.getByRole('button', { name: 'Page 4' }).click();
    await page.getByRole('button', { name: 'Page 1' }).click();

    await expect(page.locator('tbody tr').first()).toBeVisible();
  });

  test('TC-EM-006 | Change records per page', async ({ page }) => {
    await page.locator('#role-desktop').selectOption('10');
    await page.waitForTimeout(1000);

    const rowCount = await page.locator('tbody tr').count();
    expect(rowCount).toBeLessThanOrEqual(10);
  });
});



test('TC-EM-007 | Create PMF and approve using two browser contexts', async ({ browser }) => {

  // creator
  const creatorContext = await browser.newContext();
  const creatorPage = await creatorContext.newPage();

  await login(creatorPage);
  await goToEmployeeMovement(creatorPage);

  await createPMF(creatorPage, {
    employeeName: 'Allen Alexander • Admin | Software Engineer',
    positionValue: '128',
    employmentStatusValue: '102',
    startDateOption: 'Choose Tuesday, February 3rd,',
    regularizationType: 'Early Regularization',
    salaryChangeOption: 'No changes',
  });

  // arover
  const approverContext = await browser.newContext();
  const approverPage = await approverContext.newPage();

  await approverPage.goto('https://s1.yahshuahris.com/login');

  await approverPage.getByRole('textbox', { name: 'Email' })
    .fill('joba.pagapong.coc+1@phinmaed.com');

  await approverPage.getByRole('textbox', { name: 'Password' })
    .fill('Ezeypagapong@777');

  await approverPage.getByRole('button', { name: 'Sign in' }).click();

  await approvePMF(approverPage);

  // close
  await creatorContext.close();
  await approverContext.close();
});


test('TC-EM-008 | Create PMF with missing inputs', async ({ page }) => {
  await login(page);
  await goToEmployeeMovement(page);

  await createPMFmissing(page, {
    employeeName: '',
    positionValue: '',
    employmentStatusValue: '',
    startDateOption: 'Choose Tuesday, January 20th,',
    regularizationType: '',
    salaryChangeOption: '',
  });

  await expect(
    page.getByRole('heading', { name: 'You cannot proceed due to' })
  ).toBeVisible();
});
