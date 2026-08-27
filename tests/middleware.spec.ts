import { test, expect } from '@playwright/test';
import { loginAsAdmin, loginAsCustomer } from './helpers';

test.describe('middleware.ts route guarding', () => {
  test('unauthenticated visitor to /admin/dashboard is sent to /login with a redirect param', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL(/\/login\?redirect=%2Fadmin%2Fdashboard/);
  });

  test('unauthenticated visitor to /tickets is sent to /login with a redirect param', async ({ page }) => {
    await page.goto('/tickets');
    await expect(page).toHaveURL(/\/login\?redirect=%2Ftickets/);
  });

  test('customer visiting /admin/* is bounced to /tickets, not shown a 403', async ({ page }) => {
    await loginAsCustomer(page);
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL('/tickets');
  });

  test('admin visiting /tickets/* is bounced to /admin/dashboard', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/tickets');
    await expect(page).toHaveURL('/admin/dashboard');
  });

  test('/login stays reachable while already logged out', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL('/login');
  });

  test('/register stays reachable while already logged out', async ({ page }) => {
    await page.goto('/register');
    await expect(page).toHaveURL('/register');
  });
});
