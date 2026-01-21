import { test, expect, Browser, Page } from '@playwright/test';

test.describe('Address Employee Issue - Feature Tests', () => {
  let page: Page;
  let browser: Browser;

  test.beforeAll(async ({ browser: pwBrowser }) => {
    browser = pwBrowser;
    const context = await browser.newContext();
    page = await context.newPage();

    // ---------- LOGIN ONCE ----------
    await page.goto('https://s1.yahshuahris.com/');

    await page.getByRole('button', { name: 'Get Started' }).nth(1).click();
    await page.getByRole('link', { name: 'Sign In' }).first().click();

    await page.getByRole('textbox', { name: 'Email' }).fill('paulandrewnerona@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('AndrewNeronz@13');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await page.getByRole('link', { name: 'Manage' }).click();
    await page.getByRole('link', { name: 'Address Employee Issue' }).click();

    await expect(page.getByText('All Issues')).toBeVisible();
  });

  test.afterAll(async () => {
    await page.close();
  });

  // ---------------- MONTH PICKER ----------------
  test('Month selection / date filter', async () => {
    const fromPicker = page.locator('#from-datepicker-datepicker-button');
    const toPicker = page.locator('#to-datepicker-datepicker-button');

    await fromPicker.click();
    await page.getByRole('option', { name: 'Choose Wednesday, January 21st,' }).click();

    await toPicker.click();
    await page.getByRole('option', { name: 'Choose Friday, January 30th,' }).click();
  });

 // ---------------- SEARCH ----------------
test('Search employee (search → clear → reset)', async () => {
  const searchBox = page.getByRole('textbox', { name: 'Search' });
  const searchButton = searchBox.locator('xpath=following-sibling::button');
  const tableBody = page.locator('tbody');

  // Initial state (normal list)
  await expect(tableBody).toBeVisible();

  // Search "nerona"
  await searchBox.fill('nerona');
  await searchButton.click();

  // Results should still show table
  await expect(tableBody).toBeVisible();

  // Clear search
  await searchBox.fill('');
  await searchButton.click();

  // Back to normal (unfiltered list)
  await expect(tableBody).toBeVisible();
});


 // ---------------- TAB FILTERS ----------------
// ---------------- TAB FILTERS ----------------
test('Tabs filtering (All Issues → Approved → Disapproved → All Issues)', async () => {
  // Narrow scope to the tabs row/container
  const tabsContainer = page
    .locator('div.cursor-pointer')
    .first()
    .locator('xpath=ancestor::div[1]');

  const allIssuesTab = tabsContainer.locator('div.cursor-pointer', {
    hasText: /^All Issues$/,
  });

  const approvedTab = tabsContainer.locator('div.cursor-pointer', {
    hasText: /^Approved$/,
  });

  const disapprovedTab = tabsContainer.locator('div.cursor-pointer', {
    hasText: /^Disapproved$/,
  });

  // All Issues (default)
  await expect(allIssuesTab).toBeVisible();

  // Approved
  await approvedTab.click();
  await expect(page.locator('tbody')).toBeVisible();

  // Disapproved
  await disapprovedTab.click();
  await expect(page.locator('tbody')).toBeVisible();

  // Back to All Issues
  await allIssuesTab.click();
  await expect(page.locator('tbody')).toBeVisible();
});





  // ---------------- CREATE ISSUE ----------------
  test('Create Address Employee Issue', async () => {
    await page.getByRole('button', { name: 'CREATE' }).click();

    const modal = page.locator('div[role="dialog"][data-headlessui-state="open"]');
    await expect(modal).toHaveCount(1);

    await modal.locator('.select__control').first().click();
    await page.locator('.select__option').first().click();

    await modal.locator('#incidentPlace').fill('Main Office');

    await modal.locator('.select__control').nth(1).click();
    await page.getByRole('option', { name: /Absenteeism|Tardiness|Job/i }).first().click();

    await modal.locator('#briefBackground').fill(
      'Employee failed to report to work without notice.'
    );

    await page.getByRole('button', { name: 'Create', exact: true }).click();
    await expect(page.getByText(/success/i)).toBeVisible();
  });

  // ---------------- APPROVE ISSUE ----------------
  test('Update issue status - Approve only', async () => {
    const firstRowActions = page
      .locator('tbody tr')
      .first()
      .locator('button')
      .last();

    await firstRowActions.click();
    await page.getByRole('button', { name: 'Update Status' }).click();

    await page.getByRole('button', { name: 'Approve', exact: true }).click();

   
  });
});
