import { Page, expect } from '@playwright/test';

export const TEST_USERS = {
  admin: { email: 'admin@gmail.com', password: 'Password123' },
  customer: { email: 'usman@gmail.com', password: '12345678Aa' },
};

export async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.getByLabel('Email', { exact: true }).fill(email);

  await page.getByLabel('Password', { exact: true }).fill(password);


  const [response] = await Promise.all([
    page.waitForResponse('**/api/login', { timeout: 15000 }),
    page.getByRole('button', { name: /login/i }).click(),
  ]);

  return response;
}

export async function loginAsAdmin(page: Page) {
  const response = await login(page, TEST_USERS.admin.email, TEST_USERS.admin.password);
  if (!response.ok()) {
    const body = await response.json().catch(() => ({}));
    throw new Error(
      `Admin login failed with status ${response.status()}: ${JSON.stringify(body)}`
    );
  }

  await expect(page).toHaveURL('/admin/dashboard', { timeout: 15000 });
}

export async function loginAsCustomer(page: Page) {
  const response = await login(page, TEST_USERS.customer.email, TEST_USERS.customer.password);
  if (!response.ok()) {
    const body = await response.json().catch(() => ({}));
    throw new Error(
      `Customer login failed with status ${response.status()}: ${JSON.stringify(body)}`
    );
  }
  await expect(page).toHaveURL('/tickets', { timeout: 15000 });
}

export async function logout(page: Page) {
  await page.getByRole('button', { name: /log out/i }).click();
}

export async function selectMuiOption(page: Page, fieldLabel: string, optionName: string) {
  const control = page.locator('.MuiFormControl-root').filter({ hasText: fieldLabel });
  await control.locator('.MuiSelect-select').click();
  await page.getByRole('option', { name: optionName, exact: true }).click();
}