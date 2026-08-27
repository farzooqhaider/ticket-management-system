import { test, expect } from '@playwright/test';
import { TEST_USERS, login, loginAsAdmin, loginAsCustomer, logout } from './helpers';

test.describe('Login', () => {
  test('customer can log in and lands on /tickets', async ({ page }) => {
    await loginAsCustomer(page);
  });

  test('admin can log in and lands on /admin/dashboard', async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('shows an error toast on wrong password', async ({ page }) => {
    await login(page, TEST_USERS.customer.email, 'wrongpassword');
    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
    await expect(page).toHaveURL('/login');
  });

  test('shows client-side validation for a too-short password', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email', { exact: true }).fill('someone@example.com');
    await page.getByLabel('Password', { exact: true }).fill('123');
    await page.getByRole('button', { name: /login/i }).click();
    
    await expect(page.getByText(/must conatin at least 8 characters/i)).toBeVisible();
  });

  test('logging out clears the session and re-guards protected routes', async ({ page }) => {
    await loginAsCustomer(page);
    await logout(page);
    await expect(page).toHaveURL('/login');

  
    await page.goto('/tickets');
    await expect(page).toHaveURL(/\/login/);
  });
});