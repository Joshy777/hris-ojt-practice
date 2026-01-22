import { expect, Page } from '@playwright/test';

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

  // Select employee
  await page.locator('.select__input-container').click();
  await page.getByRole('option', { name: employeeName }).click();

  // Fill PMF fields
  await page.getByLabel('New Position*').selectOption(positionValue);
  await page
    .getByLabel('New Employment Status*')
    .selectOption(employmentStatusValue);

  // Start Date
  await page.getByRole('textbox', { name: 'Start Date*' }).click();
  await page.getByRole('option', { name: startDateOption }).click();

  // Radio buttons
  await page.getByRole('radio', { name: regularizationType }).check();
  await page.getByRole('radio', { name: salaryChangeOption }).check();

  // Submit
  await page.getByRole('button', { name: 'Submit' }).click();
}
