import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { expect, test } from '@playwright/test';

interface ComponentState {
  readonly slug: string;
  readonly visualIds: readonly string[];
}

interface InteractiveState {
  readonly slug: string;
  readonly triggerRole: 'button' | 'combobox';
  readonly triggerName: string;
  readonly stateName: string;
  readonly targetRole: 'alertdialog' | 'dialog' | 'listbox' | 'menu' | 'tooltip';
  readonly action?: 'hover';
}

interface VisualManifest {
  readonly themes: readonly ('light' | 'dark')[];
  readonly componentStates: readonly ComponentState[];
  readonly interactiveStates: readonly InteractiveState[];
}

const manifest = JSON.parse(
  readFileSync(join(process.cwd(), 'docs', 'visual-regression-manifest.json'), 'utf8'),
) as VisualManifest;

async function applyTheme(page: import('@playwright/test').Page, theme: 'light' | 'dark') {
  await page.evaluate((dark) => {
    document.documentElement.classList.toggle('dark', dark);
  }, theme === 'dark');
}

async function waitForStablePage(page: import('@playwright/test').Page) {
  await page.locator('app-docs-layout').waitFor();
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
}

for (const component of manifest.componentStates) {
  test(`${component.slug} documented visual states`, async ({ page }, testInfo) => {
    await page.goto(`/#/components/${component.slug}`);
    await waitForStablePage(page);

    const isDesktopChromium = testInfo.project.name === 'chromium-desktop';
    const themes = isDesktopChromium ? manifest.themes : (['light'] as const);
    const visualIds =
      testInfo.project.name === 'chromium-mobile'
        ? component.visualIds.slice(0, 1)
        : component.visualIds;

    for (const theme of themes) {
      await applyTheme(page, theme);
      for (const visualId of visualIds) {
        const preview = page.locator(`[data-visual-example="${visualId}"]`);
        await preview.scrollIntoViewIfNeeded();
        await expect(preview).toBeVisible();
        await expect(preview).toHaveScreenshot(`${visualId}-${theme}.png`);
      }
    }
  });
}

for (const state of manifest.interactiveStates) {
  test(`${state.slug} ${state.stateName} visual state`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium-desktop');
    await page.goto(`/#/components/${state.slug}`);
    await waitForStablePage(page);
    const preview = page.locator(`[data-visual-example="${state.slug}-default"]`);
    await preview.scrollIntoViewIfNeeded();

    const trigger = page.getByRole(state.triggerRole, { name: state.triggerName });
    if (state.action === 'hover') {
      await trigger.hover();
    } else {
      await trigger.click();
    }

    const target = page.getByRole(state.targetRole);
    await expect(target).toBeVisible();
    await expect(target).toHaveScreenshot(`${state.slug}-${state.stateName}-light.png`);
  });
}
