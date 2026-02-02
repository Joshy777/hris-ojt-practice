import { Page, expect } from '@playwright/test';

// ASSERTIONS FOR EMPLOYEE MOVEMENT PAGE
export async function expectTableHasRows(page: Page) {
  await expect(page.locator('tbody tr')).toHaveCount(5);
}


//  EXPECT EMPLOYEE IN FIRST ROW
export async function expectEmployeeInFirstRow(page: Page) {
  const cell = page.locator('tbody tr').first().locator('td').nth(2);

  await expect(cell).toBeVisible();
  await expect(cell).not.toHaveText('');
}


// VERIFY DATE RESULTS
export async function verifyDateResults(page: Page, expectedDate: string) {
  const results = page.locator('tbody tr td'); 
  const count = await results.count();

  for (let i = 0; i < count; i++) {
    const text = await results.nth(i).textContent();
    expect(text).toContain(expectedDate);
  }
}

