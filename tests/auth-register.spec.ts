import { test, expect } from '@playwright/test';

// Each run generates a unique email/username so registration doesn't
// collide with the unique-email constraint on repeated test runs.
function uniqueUser() {
  const stamp = Date.now();

  return {
    userName: `testuser${stamp}`,
    email: `testuser${stamp}@example.com`,
  };
}

async function fillCommonFields(
  page,
  user: { userName: string; email: string }
) {
  await page.getByLabel('username*').fill(user.userName);
  await page.getByLabel('Email*').fill(user.email);
  await page.getByLabel('Phone*').fill('03001234567');

  // Material UI Country Select
  // Select USA so the required Country field is populated.
  await page.getByRole('combobox', { name: /Country/ }).click();

  await page.getByRole('option', {
    name: 'USA',
    exact: true,
  }).click();

  // Select Male
  await page.getByLabel('Male', { exact: true }).check();
}

test.describe('Register', () => {
  test('customer can register and lands on /tickets', async ({ page }) => {
    const user = uniqueUser();

    await page.goto('/register');

    await fillCommonFields(page, user);

    await page
      .getByLabel('Password*', { exact: true })
      .fill('Password1');

    await page
      .getByLabel('Confirm Password*', { exact: true })
      .fill('Password1');

    await page
      .getByLabel(/I agree to the Terms/i)
      .check();

    await page
      .getByRole('button', { name: /create account/i })
      .click();

    await expect(page).toHaveURL('/login?redirect=%2Ftickets');
  });

  test('shows an error when passwords do not match', async ({ page }) => {
    const user = uniqueUser();

    await page.goto('/register');

    await fillCommonFields(page, user);

    await page
      .getByLabel('Password*', { exact: true })
      .fill('Password1');

    await page
      .getByLabel('Confirm Password*', { exact: true })
      .fill('Different1');

    await page
      .getByLabel(/I agree to the Terms/i)
      .check();

    await page
      .getByRole('button', { name: /create account/i })
      .click();

    await expect(
      page.getByText(/passwords do not match/i)
    ).toBeVisible();

    await expect(page).toHaveURL('/register');
  });

  test('rejects a phone number that is not a valid Pakistani number', async ({
    page,
  }) => {
    await page.goto('/register');

    await page.getByLabel('Phone*').fill('12345');
    await page.getByLabel('Phone*').blur();

    await expect(
      page.getByText(/enter valid pakistani number/i)
    ).toBeVisible();
  });

  test('rejects a password missing an uppercase letter', async ({ page }) => {
    await page.goto('/register');

    await page
      .getByLabel('Password*', { exact: true })
      .fill('password1');

    await page
      .getByLabel('Password*', { exact: true })
      .blur();

    await expect(
      page.getByText(
        /password must contain uppercase, lowercase and number/i
      )
    ).toBeVisible();
  });

  test('cannot submit without accepting the terms checkbox', async ({
    page,
  }) => {
    const user = uniqueUser();

    await page.goto('/register');

    await fillCommonFields(page, user);

    await page
      .getByLabel('Password*', { exact: true })
      .fill('Password1');

    await page
      .getByLabel('Confirm Password*', { exact: true })
      .fill('Password1');

    // Deliberately do not accept the terms checkbox.

    await page
      .getByRole('button', { name: /create account/i })
      .click();

    await expect(
      page.getByText(/you must accept the terms/i)
    ).toBeVisible();

    await expect(page).toHaveURL('/register');
  });
});