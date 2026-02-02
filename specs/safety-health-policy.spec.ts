import { test, expect } from '@playwright/test';
import { SafetyPolicyHelper } from '../utils/helpers/safety-policy.helper';
import { login } from '../pages/login-josh';

test.describe('Safety and Health Policy', () => {

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await login(page);
    await page.goto('https://s1.yahshuahris.com/');
    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('https://s1.yahshuahris.com/');
    await page.getByRole('link', { name: 'DOLE' }).click();
    await page.getByText('Safety and Health Policy').click();
  });

  test('should display Safety and Health Policy modal', async ({ page }) => {
    const policy = new SafetyPolicyHelper(page);
    await policy.openPolicyModal();
  });

  test('should display policy content sections', async ({ page }) => {
    const policy = new SafetyPolicyHelper(page);
    await policy.expectPolicyContentVisible();
  });

  test('should change policy status', async ({ page }) => {
    const policy = new SafetyPolicyHelper(page);
    await policy.changeStatus('On Schedule');
  });

  test('should open edit policy', async ({ page }) => {
    const policy = new SafetyPolicyHelper(page);
    await policy.clickEdit();
    await expect(page).toHaveURL(/edit/i);
  });

  test('should open print preview', async ({ page }) => {
    const policy = new SafetyPolicyHelper(page);
    await policy.clickPrint();
  });

  test('should trigger send email action', async ({ page }) => {
    const policy = new SafetyPolicyHelper(page);
    await policy.clickSendEmail();
  });

  test('should close policy modal', async ({ page }) => {
    const policy = new SafetyPolicyHelper(page);
    await policy.closeModal();
    await expect(
      page.getByText('Safety and Health Policy')
    ).not.toBeVisible();
  });

});
