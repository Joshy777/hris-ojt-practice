import { Page, expect } from '@playwright/test';

export class SafetyPolicyHelper {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async openPolicyModal() {
    await expect(
      this.page.getByText('Safety and Health Policy')
    ).toBeVisible();
  }

  async expectPolicyContentVisible() {
    await expect(
      this.page.getByText('Introduction')
    ).toBeVisible();

    await expect(
      this.page.getByText('Policy Statement')
    ).toBeVisible();

    await expect(
      this.page.getByText('Management Responsibilities')
    ).toBeVisible();

    await expect(
      this.page.getByText('Employee Responsibilities')
    ).toBeVisible();
  }

  async changeStatus(status: string) {
    await this.page.getByRole('button', { name: /On Schedule/i }).click();
    await this.page.getByText(status).click();
    await expect(
      this.page.getByRole('button', { name: status })
    ).toBeVisible();
  }

  async clickEdit() {
    await this.page.getByRole('button', { name: 'Edit' }).click();
  }

  async clickPrint() {
    await this.page.getByRole('button', { name: 'Print' }).click();
  }

  async clickSendEmail() {
    await this.page.getByRole('button', { name: 'Send Email' }).click();
  }

  async closeModal() {
    await this.page.getByRole('button', { name: 'Close' }).click();
  }
}
