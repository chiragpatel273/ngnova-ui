import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

// Layout and keyboard checks for the right-to-left preview on /right-to-left. They assert mirrored
// geometry rather than pixels so they run identically on every operating system.

async function openPlayground(page: Page): Promise<Locator> {
  await page.goto('/right-to-left');
  const playground = page.locator('[data-rtl-playground]');
  await playground.waitFor();
  await expect(playground).toHaveAttribute('dir', 'rtl');
  return playground;
}

async function box(
  locator: Locator,
): Promise<{ x: number; y: number; width: number; right: number }> {
  const rect = await locator.boundingBox();
  if (!rect) throw new Error('Element is not visible.');
  return { x: rect.x, y: rect.y, width: rect.width, right: rect.x + rect.width };
}

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name === 'chromium-mobile', 'Two-column geometry is desktop-only.');
});

test('tabs order and arrow keys follow the right-to-left direction', async ({ page }) => {
  const playground = await openPlayground(page);
  const tabs = playground.getByRole('tab');

  const first = await box(tabs.nth(0));
  const second = await box(tabs.nth(1));
  expect(first.x).toBeGreaterThan(second.x);

  await tabs.nth(0).focus();
  await page.keyboard.press('ArrowLeft');
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(tabs.nth(1)).toBeFocused();

  await page.keyboard.press('ArrowRight');
  await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
});

test('form controls mirror their inline layout', async ({ page }) => {
  const playground = await openPlayground(page);

  const select = playground.locator('ui-select select');
  const selectBox = await box(select);
  const chevron = await box(playground.locator('ui-select svg'));
  expect(chevron.right).toBeLessThan(selectBox.x + selectBox.width / 2);

  await expect(playground.getByRole('switch')).toBeChecked();
  const track = await box(playground.locator('ui-switch span.w-11'));
  const thumb = await box(playground.locator('ui-switch span.size-5'));
  expect(thumb.right).toBeLessThanOrEqual(track.x + track.width / 2 + 1);

  const field = await box(playground.locator('ui-input input'));
  const label = await box(playground.locator('ui-input label').first());
  expect(Math.abs(label.right - field.right)).toBeLessThan(24);
});

test('tree expands and collapses with mirrored arrow keys', async ({ page }) => {
  const playground = await openPlayground(page);
  const items = playground.getByRole('treeitem');
  await expect(items).toHaveCount(4);

  await items.nth(1).focus();
  await page.keyboard.press('ArrowRight');
  await expect(items.nth(0)).toBeFocused();

  await page.keyboard.press('ArrowRight');
  await expect(items.nth(0)).toHaveAttribute('aria-expanded', 'false');

  await page.keyboard.press('ArrowLeft');
  await expect(items.nth(0)).toHaveAttribute('aria-expanded', 'true');
});

test('date picker moves to the next day with ArrowLeft', async ({ page }) => {
  const playground = await openPlayground(page);
  await playground.locator('ui-date-picker input').focus();
  await page.keyboard.press('ArrowDown');

  const active = playground.locator('[data-date="2026-11-16"]');
  await expect(active).toBeFocused();
  const next = await box(playground.locator('[data-date="2026-11-17"]'));
  const current = await box(active);
  expect(next.x).toBeLessThan(current.x);

  await page.keyboard.press('ArrowLeft');
  await expect(playground.locator('[data-date="2026-11-17"]')).toBeFocused();

  // Crossing into a month that is not rendered yet keeps focus in the grid.
  await page.keyboard.press('PageDown');
  await expect(playground.locator('[data-date="2026-12-17"]')).toBeFocused();
});

test('menu and drawer open from the logical end edge', async ({ page }) => {
  const playground = await openPlayground(page);

  const trigger = playground.locator('ui-menu [uiMenuTrigger]');
  await trigger.click();
  const menu = playground.getByRole('menu');
  await expect(menu).toBeVisible();
  const triggerBox = await box(trigger);
  const menuBox = await box(menu);
  expect(Math.abs(menuBox.x - triggerBox.x)).toBeLessThan(2);
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();

  // Opening from the keyboard moves focus to the first item.
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  await expect(playground.getByRole('menuitem').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();

  await playground.getByRole('button', { name: 'فتح الفلاتر' }).click();
  const drawer = page.getByRole('dialog', { name: 'الفلاتر' });
  await expect(drawer).toBeVisible();
  const drawerBox = await box(drawer);
  expect(drawerBox.x).toBeLessThan(2);
  await page.getByRole('button', { name: 'إغلاق' }).click();
  await expect(drawer).toBeHidden();
});

test('switching the preview to left-to-right restores physical order', async ({ page }) => {
  const playground = await openPlayground(page);
  await page.getByRole('button', { name: 'Preview left-to-right' }).click();
  await expect(playground).toHaveAttribute('dir', 'ltr');

  const tabs = playground.getByRole('tab');
  const first = await box(tabs.nth(0));
  const second = await box(tabs.nth(1));
  expect(first.x).toBeLessThan(second.x);

  await tabs.nth(0).focus();
  await page.keyboard.press('ArrowRight');
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
});
