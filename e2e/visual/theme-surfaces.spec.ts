import { expect, test } from '@playwright/test';

async function waitForFonts(page: import('@playwright/test').Page): Promise<void> {
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
}

test('theme playground dark mode', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop');

  await page.goto('/#/theming');
  await page.locator('app-docs-layout').waitFor();
  await waitForFonts(page);
  await page.getByRole('button', { name: 'Preview dark mode' }).click();

  const playground = page.locator('.ui-theme');
  await expect(playground).toHaveAttribute('data-ui-theme', 'dark');
  await expect(playground).toHaveScreenshot('theme-playground-dark.png');
});

test('admin dashboard dark mode', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop');

  await page.goto('/#/templates/admin-dashboard');
  await page.locator('[data-admin-template]').waitFor();
  await waitForFonts(page);
  await page.getByRole('button', { name: 'Use dark dashboard theme' }).click();

  const dashboard = page.locator('[data-admin-template]');
  await expect(dashboard).toHaveClass(/dark/);
  await expect(dashboard).toHaveScreenshot('admin-dashboard-dark.png');
});
