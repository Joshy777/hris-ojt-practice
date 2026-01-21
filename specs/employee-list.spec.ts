import { test, expect } from '@playwright/test';

test('Employee list search and delete flow (slow visible)', async ({ page }) => {
  test.setTimeout(120000); // 2 min timeout for demo

  // ---------- LOGIN ----------
  await page.goto('https://s1.yahshuahris.com/');
  await page.getByRole('button', { name: 'Get Started' }).nth(1).click();
  await page.getByRole('link', { name: 'Sign In' }).first().click();

  await page.getByRole('textbox', { name: 'Email' })
    .fill('paulandrewnerona@gmail.com');
  await page.getByRole('textbox', { name: 'Password' })
    .fill('AndrewNeronz@13');
  await page.getByRole('button', { name: 'Sign in' }).click();

  // ---------- NAVIGATION ----------
  await page.getByRole('link', { name: 'Manage' }).click();
  await page.getByRole('link', { name: 'Employee List' }).click();

  // ---------- LOCATORS ----------
  const searchBox = page.getByRole('textbox', { name: 'Search' });
  const searchButton = searchBox.locator('xpath=following::button[1]');
  const tableRows = page.locator('tbody tr');

  const pause = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const searchEmployee = async (name: string) => {
    await searchBox.fill(name);
    await searchButton.click();
    await expect(tableRows.first()).toBeVisible({ timeout: 10000 });
    await pause(500); // small pause to make it visually slow
  };

  // ---------- SEARCH SCENARIOS ----------
  await searchEmployee('conan');
  await searchEmployee('');
  await searchEmployee('christopher');
  await searchEmployee('');
  await searchEmployee('nerona');
  await searchEmployee('');

  // ---------- EMPLOYEE ACTIONS ----------
  const row3DeleteBtn = tableRows.nth(2).getByRole('button').nth(1);
  const row2DeleteBtn = tableRows.nth(1).getByRole('button').nth(1);

  // Cancel delete
  await row3DeleteBtn.click();
  await page.getByRole('button', { name: 'No', exact: true }).click();

  // Confirm delete
  await row2DeleteBtn.click();
  await page.getByRole('button', { name: 'Yes' }).click();
});
