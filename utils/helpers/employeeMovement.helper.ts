import { expect, Page} from '@playwright/test';
import { goToEmployeeMovement } from '../../pages/employeeMovement.page';

// SEARCH EMPLOYEE
export async function searchEmployee(page: Page, name: string) {
  const searchInput = page.getByPlaceholder('Search ...');
  await searchInput.fill(name);
  await searchInput.press('Enter');
}


// RESET SEARCH
export async function resetSearch(page: Page) {
  await page.getByPlaceholder('Search ...').fill('');
  await page.keyboard.press('Enter');
}


// DATE FILTER
export async function filterByDate(
  page: Page,
  startDate: string,
  endDate: string
) {

  await page.getByRole('button', { name: '1' }).click({ timeout: 3000 }).catch(() => {});

  const dateInputs = page.getByPlaceholder('mm/dd/yyyy');
  await dateInputs.first().fill(startDate);
  await dateInputs.nth(1).fill(endDate);

  await page.getByRole('button').nth(4).click();
}



// PMF HELPER
type PMFOptions = {
  employeeName: string;
  positionValue: string;
  employmentStatusValue: string;
  startDateOption: string;
  regularizationType: string;
  salaryChangeOption: string;
};

export async function createPMF(
  page: Page,
  {
    employeeName,
    positionValue,
    employmentStatusValue,
    startDateOption,
    regularizationType,
    salaryChangeOption,
  }: PMFOptions
) {
  // Open PMF modal
  await page.click('button:has-text("Create PMF")');
  await expect(
    page.locator('text=Create Personal Movement Form (PMF)')
  ).toBeVisible();

  await page.locator('.select__input-container').click();
  await page.getByRole('option', { name: employeeName }).click();

  await page.getByLabel('New Position*').selectOption(positionValue);
  await page
    .getByLabel('New Employment Status*')
    .selectOption(employmentStatusValue);

  await page.getByRole('textbox', { name: 'Start Date*' }).click();
  await page.getByRole('option', { name: startDateOption }).click();

  await page.getByRole('radio', { name: regularizationType }).check();
  await page.getByRole('radio', { name: salaryChangeOption }).check();

  await page.getByRole('button', { name: 'Submit' }).click();
}



export async function createPMFmissing(page: Page,
  {
    employeeName,
    positionValue,
    employmentStatusValue,
    startDateOption,
    regularizationType,
    salaryChangeOption,
  }: PMFOptions
) {
  // Open PMF modal
  await page.click('button:has-text("Create PMF")');
  await expect(
    page.locator('text=Create Personal Movement Form (PMF)')
  ).toBeVisible();

  await page.getByRole('textbox', { name: 'Start Date*' }).click();
  await page.getByRole('option', { name: startDateOption }).click();

  await page.getByRole('button', { name: 'Submit' }).click();
}



export async function approvePMF(page: Page) {

await goToEmployeeMovement(page);
  // Open latest PMF
  const firstRow = page.locator('tbody tr').first();
  await firstRow.locator('button').first().click();
  // Recommendation
   await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByRole('textbox', { name: 'Your Recommendation' })
    .fill('Reviewed and approved.');

  // Draw signature
  await page.getByRole('button', { name: 'Draw' }).click();

  const canvas = page.locator('canvas');
  await page.locator('canvas').click({
    position: {
      x: 253,
      y: 55
    }
  });

  await page.getByRole('button', { name: 'Sign' }).click();


  // Approve
  await page.locator('button:has-text("Approve")').click({ timeout: 60000 });


  // Validation
  await expect(page.getByText('Approval processed successfully.')).toBeVisible();
}
