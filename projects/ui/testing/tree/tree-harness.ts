import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import type { BaseHarnessFilters } from '@angular/cdk/testing';

export interface UiTreeHarnessFilters extends BaseHarnessFilters {
  readonly ariaLabel?: string | RegExp;
}

export class UiTreeHarness extends ComponentHarness {
  static hostSelector = 'ui-tree';

  static with(options: UiTreeHarnessFilters = {}): HarnessPredicate<UiTreeHarness> {
    return new HarnessPredicate(UiTreeHarness, options).addOption(
      'ariaLabel',
      options.ariaLabel,
      async (harness, label) => HarnessPredicate.stringMatches(await harness.getAriaLabel(), label),
    );
  }

  private readonly getTree = this.locatorFor('[role="tree"]');
  private readonly getItems = this.locatorForAll('[role="treeitem"]');

  async getAriaLabel(): Promise<string> {
    return (await this.getTree()).getAttribute('aria-label').then((value) => value ?? '');
  }

  async getVisibleLabels(): Promise<string[]> {
    const items = await this.getItems();
    return Promise.all(items.map((item) => item.text()));
  }

  async activate(label: string | RegExp): Promise<void> {
    const items = await this.getItems();
    for (const item of items) {
      if (await HarnessPredicate.stringMatches(await item.text(), label)) {
        await item.click();
        return;
      }
    }
    throw new Error(`Could not find tree item matching ${label.toString()}.`);
  }

  async isExpanded(label: string | RegExp): Promise<boolean | null> {
    const items = await this.getItems();
    for (const item of items) {
      if (await HarnessPredicate.stringMatches(await item.text(), label)) {
        const value = await item.getAttribute('aria-expanded');
        return value === null ? null : value === 'true';
      }
    }
    throw new Error(`Could not find tree item matching ${label.toString()}.`);
  }
}
