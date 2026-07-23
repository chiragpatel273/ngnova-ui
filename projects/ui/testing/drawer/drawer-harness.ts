import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import type { BaseHarnessFilters } from '@angular/cdk/testing';

export interface UiDrawerHarnessFilters extends BaseHarnessFilters {
  readonly title?: string | RegExp;
}

export class UiDrawerHarness extends ComponentHarness {
  static hostSelector = 'ui-drawer';

  static with(options: UiDrawerHarnessFilters = {}): HarnessPredicate<UiDrawerHarness> {
    return new HarnessPredicate(UiDrawerHarness, options).addOption(
      'title',
      options.title,
      async (harness, title) => HarnessPredicate.stringMatches(await harness.getTitle(), title),
    );
  }

  private readonly getPanel = this.locatorForOptional('[role="dialog"]');
  private readonly getTitleElement = this.locatorForOptional('header [id]');
  private readonly getCloseButton = this.locatorForOptional('header button');

  async isOpen(): Promise<boolean> {
    return (await this.getPanel()) !== null;
  }

  async getTitle(): Promise<string> {
    return (await this.getTitleElement())?.text() ?? '';
  }

  async getPosition(): Promise<string | null> {
    const panel = await this.getPanel();
    if (!panel) return null;
    const classes = (await panel.getAttribute('class')) ?? '';
    if (classes.includes('left-0')) return 'left';
    if (classes.includes('right-0')) return 'right';
    if (classes.includes('top-0')) return 'top';
    if (classes.includes('bottom-0')) return 'bottom';
    return null;
  }

  async close(): Promise<void> {
    await (await this.getCloseButton())?.click();
  }
}
