import { test, expect } from '@playwright/test';
import { login } from '../pages/login-drew';
import { createAddressIssue } from '../utils/helpers/address-employee.helper';

test('Address Employee Issue Full Flow', async ({ page }) => {
  // ---------------- LOGIN ----------------
  await login(page);
  await expect(page.locator('#headlessui-menu-button-\\:R6qiqikq\\::visible')).toBeVisible();
 await page.getByRole('button', { name: /I Understand/i }).click();
  // ---------------- NAVIGATE ----------------
  const manageLink = page.getByText('Manage', { exact: true });
  await manageLink.waitFor({ state: 'visible' });
  await manageLink.click();

  const addressIssueLink = page.getByText('Address Employee Issue', { exact: true });
  await addressIssueLink.waitFor({ state: 'visible' });
  await addressIssueLink.click();

  // Verify landing page
  await expect(page.getByText('All Issues')).toBeVisible();

  // ---------------- INITIAL CHECK ----------------
  const rows = page.locator('tbody tr');
  expect(await rows.count()).toBeGreaterThan(0);

  // ---------------- SEARCH ----------------
  const searchBox = page.getByRole('textbox', { name: 'Search' });
  await searchBox.waitFor({ state: 'visible' });
  await searchBox.fill('nerona');
  await page.keyboard.press('Enter');

  // Wait for search results
  await expect(rows.first()).toBeVisible();

  // RESET SEARCH
  await searchBox.fill('');
  await page.keyboard.press('Enter');
  await expect(rows.first()).toBeVisible();

  // ---------------- TAB FILTERS ----------------
  const approvedTab = page.locator('div.cursor-pointer', { hasText: /^Approved$/ });
  const disapprovedTab = page.locator('div.cursor-pointer', { hasText: /^Disapproved$/ });
  const allIssuesTab = page.locator('div.cursor-pointer', { hasText: /^All Issues$/ });

  await approvedTab.waitFor({ state: 'visible' });
  await approvedTab.click();
  await expect(rows.first()).toBeVisible();

  await disapprovedTab.waitFor({ state: 'visible' });
  await disapprovedTab.click();
  await expect(rows.first()).toBeVisible();

  await allIssuesTab.waitFor({ state: 'visible' });
  await allIssuesTab.click();
  await expect(rows.first()).toBeVisible();

  // ---------------- CREATE ADDRESS ISSUE ----------------
  await createAddressIssue(page, {
    incidentPlace: 'Main Office',
    incidentType: /Absenteeism|Tardiness|Job/i,
    background: 'Employee failed to report to work without notice.',
  });
});
