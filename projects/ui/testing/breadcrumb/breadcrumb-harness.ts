import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import type { BaseHarnessFilters } from '@angular/cdk/testing';

export interface UiBreadcrumbHarnessFilters extends BaseHarnessFilters {
  readonly ariaLabel?: string | RegExp;
}

export class UiBreadcrumbHarness extends ComponentHarness {
  static hostSelector = 'ui-breadcrumb';
  static with(options: UiBreadcrumbHarnessFilters = {}): HarnessPredicate<UiBreadcrumbHarness> {
    return new HarnessPredicate(UiBreadcrumbHarness, options).addOption(
      'ariaLabel',
      options.ariaLabel,
      async (harness, label) =>
        HarnessPredicate.stringMatches((await harness.getAriaLabel()) ?? '', label),
    );
  }
  private readonly getNav = this.locatorFor('nav');
  private readonly getLabels = this.locatorForAll(
    'li a, li [aria-current="page"], li > span:not([data-breadcrumb-ellipsis])',
  );

  async getAriaLabel(): Promise<string | null> {
    return (await this.getNav()).getAttribute('aria-label');
  }
  async getLabelsText(): Promise<string[]> {
    return Promise.all((await this.getLabels()).map(async (item) => (await item.text()).trim()));
  }
  async getCurrentLabel(): Promise<string | null> {
    const current = await this.locatorForOptional('[aria-current="page"]')();
    return current ? (await current.text()).trim() : null;
  }
  async isCollapsed(): Promise<boolean> {
    return (await this.locatorForOptional('[data-breadcrumb-ellipsis]')()) !== null;
  }
  async follow(label: string): Promise<void> {
    const links = await this.locatorForAll('a')();
    for (const link of links) {
      if ((await link.text()).trim() === label) {
        await link.click();
        return;
      }
    }
    throw new Error(`Breadcrumb link not found: ${label}`);
  }
}
