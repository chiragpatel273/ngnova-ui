import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

// Behaviour checks for the Northstar admin template built by `npm run build:admin-template` into
// dist/docs/browser/templates/admin. They assert behaviour, not pixels, so they run on every OS.

const BASE = '/templates/admin/';

async function open(page: Page, path = ''): Promise<void> {
  await page.goto(BASE + path);
  await page.locator('app-shell').waitFor();
}

test.describe('desktop', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name === 'chromium-mobile', 'Covered by the mobile describe block.');
  });

  test('overview shows metrics, chart, and recent orders', async ({ page }) => {
    await open(page);
    await expect(page).toHaveTitle('Overview · Northstar');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      /Good (morning|afternoon|evening), Maya/,
    );
    await expect(
      page.getByRole('region', { name: 'Key metrics' }).locator('app-kpi-card'),
    ).toHaveCount(4);
    await expect(page.locator('app-line-chart figure')).toBeVisible();
    await page.getByRole('tab', { name: 'Visitors' }).click();
    await expect(page.getByRole('region', { name: 'Performance' })).toContainText(
      'visitors in 30 days',
    );
    await expect(page.locator('app-donut-chart')).toContainText('48');
    await expect(page.getByRole('region', { name: 'Recent orders' }).getByRole('link')).toHaveCount(
      7,
    );
  });

  test('deep links render the requested page', async ({ page }) => {
    await page.goto(`${BASE}orders/NS-4117`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Order NS-4117');
    await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toContainText('Orders');

    // GitHub Pages sends unknown paths through 404.html to "<base>?redirect=<path>".
    await page.goto(`${BASE}?redirect=${encodeURIComponent(`${BASE}does-not-exist`)}`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
    await expect(page).toHaveURL(/\/templates\/admin\/does-not-exist$/);
  });

  test('the command palette jumps to pages and records', async ({ page }) => {
    await open(page);
    await page.locator('ui-table, app-kpi-card').first().waitFor();
    await page.getByTestId('open-command-palette').click();
    const search = page.getByRole('dialog').getByRole('combobox');
    await expect(search).toBeFocused();
    await page.keyboard.type('Settings');
    await expect(page.getByRole('dialog').getByRole('option').first()).toHaveText('Settings');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/templates\/admin\/settings$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Settings');
  });

  test('customers can be searched, sorted, paged, added, and opened', async ({ page }) => {
    await open(page, 'customers');
    const table = page.locator('ui-table');
    await expect(table.getByRole('row')).toHaveCount(11);

    const search = page.getByRole('textbox', { name: 'Search customers' });
    await search.fill('no-such-customer');
    await expect(table).toContainText('No customers match your filters.');
    await page.getByRole('button', { name: 'Clear filters' }).click();
    await expect(table.getByRole('row')).toHaveCount(11);

    await table.getByRole('button', { name: /Lifetime spend/ }).click();
    await expect(table.locator('th[aria-sort="ascending"]')).toContainText('Lifetime spend');
    await table.getByRole('button', { name: 'Next' }).click();
    await expect(table).toContainText('Page 2 of 5');

    await page.getByTestId('add-customer').click();
    const dialog = page.getByRole('dialog', { name: 'Add customer' });
    await dialog.getByRole('button', { name: 'Add customer' }).click();
    await expect(dialog).toContainText('Enter the customer’s name.');
    await dialog.getByLabel('Full name').fill('Grace Hopper');
    await dialog.getByLabel('Email').fill('grace@example.com');
    await dialog.getByLabel('Company').fill('Navy Labs');
    await dialog.getByRole('button', { name: 'Add customer' }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByText('Customer added')).toBeVisible();
    await expect(table.getByRole('row').nth(1)).toContainText('Grace Hopper');

    await table.getByRole('row').nth(1).getByRole('button').first().click();
    const drawer = page.getByRole('dialog', { name: 'Customer details' });
    await expect(drawer).toContainText('grace@example.com');
    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
  });

  test('orders filter by status and ship from the detail page', async ({ page }) => {
    await open(page, 'orders');
    await page.getByRole('tab', { name: /^Processing/ }).click();
    const firstOrder = page.locator('ui-table').getByRole('link').first();
    const id = (await firstOrder.textContent())?.trim() ?? '';
    expect(id).toMatch(/^NS-\d+$/);
    await firstOrder.click();

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(`Order ${id}`);
    await page.getByRole('button', { name: 'Mark as shipped' }).click();
    await expect(page.getByText(`Order ${id} marked as shipped`)).toBeVisible();
    await expect(page.locator('app-page-header ui-tag')).toHaveText('Shipped');
    await expect(page.getByRole('button', { name: 'Mark as shipped' })).toHaveCount(0);
  });

  test('theme and direction preferences apply and persist', async ({ page }) => {
    await open(page);
    const html = page.locator('html');
    const startsDark = (await html.getAttribute('class'))?.includes('dark') ?? false;
    await page.getByTestId('theme-toggle').click();
    await expect(html).toHaveClass(startsDark ? /^(?!.*dark)/ : /dark/);

    await page.getByRole('button', { name: 'Switch to right-to-left' }).click();
    await expect(html).toHaveAttribute('dir', 'rtl');
    const sidebar = await page.getByRole('complementary', { name: 'Sidebar' }).boundingBox();
    expect(sidebar?.x ?? 0).toBeGreaterThan(600);

    await page.reload();
    await expect(html).toHaveAttribute('dir', 'rtl');
    await expect(html).toHaveClass(startsDark ? /^(?!.*dark)/ : /dark/);
  });
});

test.describe('sign-in', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name === 'chromium-mobile', 'Covered on desktop.');
  });

  test('signing out opens the sign-in page, which validates and signs back in', async ({
    page,
  }) => {
    await open(page);
    await page.getByRole('button', { name: 'Account menu for Maya Chen' }).click();
    await page.getByRole('menuitem', { name: 'Sign out' }).click();
    await expect(page).toHaveURL(/\/templates\/admin\/sign-in$/);
    await expect(page).toHaveTitle('Sign in · Northstar');

    const password = page.locator('input[autocomplete="current-password"]');
    await password.fill('short');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByText('Passwords have at least 8 characters.')).toBeVisible();

    await password.fill('northstar-demo');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL(/\/templates\/admin\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Maya');
  });
});

test.describe('mobile', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium-mobile', 'Mobile layout only.');
  });

  test('navigation opens in a drawer and closes after navigating', async ({ page }) => {
    await open(page);
    await expect(page.getByRole('complementary', { name: 'Sidebar' })).toBeHidden();
    await page.getByRole('button', { name: 'Open navigation' }).click();
    const drawer = page.getByRole('dialog');
    await drawer.getByRole('link', { name: 'Orders' }).click();
    await expect(page).toHaveURL(/\/templates\/admin\/orders$/);
    await expect(drawer).toBeHidden();
    await expect(
      page.getByRole('list', { name: 'Orders' }).getByRole('link').first(),
    ).toBeVisible();
  });
});
