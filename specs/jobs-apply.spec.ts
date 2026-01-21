import { test, expect } from '@playwright/test';

test.describe('Job Listing Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://s1.yahshuahris.com/jobs'); 
  });

  
  test('Job Listings Display', async ({ page }) => {
    const jobs = page.locator('text=Apply Now');
    await expect(jobs.first()).toBeVisible();
  });


  test('Job Count Display', async ({ page }) => {
    await expect(page.getByText(/Jobs available:/i)).toBeVisible();
  });


  test('Job Details are shown', async ({ page }) => {
    await page.locator('text=Web Developer').first().click();
    await expect(page.getByRole('heading', { name: 'Job Details' })).toBeVisible();
     await expect(page.getByRole('button').filter({ hasText: /^$/ })).toBeVisible();
  });


  test('Search by Job Title', async ({ page }) => {
    await page.getByPlaceholder('Enter job title, company, or keywords')
      .fill('Web Developer');

    await page.getByRole('button', { name: 'Find Jobs' }).click();

    await expect(page.getByText('Web Developer').first()).toBeVisible();
  });

 
  test('Search by Location', async ({ page }) => {
    await page.getByPlaceholder('Locations, Country')
      .fill('Philippines');

    await page.getByRole('button', { name: 'Find Jobs' }).click();

    await expect(page.locator('text=Philippines').first()).toBeVisible();
  });

  
  test('Combiined Search', async ({ page }) => {
    await page.getByPlaceholder('Enter job title, company, or keywords')
      .fill('Web Developer');

    await page.getByPlaceholder('Locations, Country')
      .fill('Metro Manila');

    await page.getByRole('button', { name: 'Find Jobs' }).click();

    await expect(page.getByText('Web Developer').first()).toBeVisible();
  });

 
  test('Load more Jobs', async ({ page }) => {
    const initialCount = await page.locator('text=Apply Now').count();

    await page.getByRole('button', { name: 'Load More Jobs' }).click();

    await expect
      .poll(async () => page.locator('text=Apply Now').count())
      .toBeGreaterThan(initialCount);
  });

  
  test('Apply Now', async ({ page }) => {
    await page.getByRole('button', { name: 'Apply Now' }).first().click();

    await expect(page).toHaveURL(/job-app-form|412/i);
  });

});
