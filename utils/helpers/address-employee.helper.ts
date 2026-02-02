import { expect, Page } from '@playwright/test';

type AddressIssueOptions = {
  incidentPlace: string;
  incidentType: RegExp;
  background: string;
};

export async function createAddressIssue(
  page: Page,
  {
    incidentPlace,
    incidentType,
    background,
  }: AddressIssueOptions
) {
  // Open modal
  await page.getByRole('button', { name: 'CREATE' }).click();

  const modal = page.locator(
    'div[role="dialog"][data-headlessui-state="open"]'
  );
  await expect(modal).toBeVisible();

  // Select employee
  await modal.locator('.select__control').first().click();
  await page.locator('.select__option').first().click();

  // Incident place
  await modal.locator('#incidentPlace').fill(incidentPlace);

  // Incident type
  await modal.locator('.select__control').nth(1).click();
  await page
    .getByRole('option', { name: incidentType })
    .first()
    .click();

  // Background
  await modal.locator('#briefBackground').fill(background);

  // Submit
  await page.getByRole('button', { name: 'Create', exact: true }).click();

  // Success feedback
  await expect(page.getByText(/success/i)).toBeVisible();
}
