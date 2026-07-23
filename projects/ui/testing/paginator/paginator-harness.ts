import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import type { BaseHarnessFilters } from '@angular/cdk/testing';

export interface UiPaginatorHarnessFilters extends BaseHarnessFilters {
  readonly ariaLabel?: string | RegExp;
}

export class UiPaginatorHarness extends ComponentHarness {
  static hostSelector = 'ui-paginator';
  static with(options: UiPaginatorHarnessFilters = {}): HarnessPredicate<UiPaginatorHarness> {
    return new HarnessPredicate(UiPaginatorHarness, options).addOption(
      'ariaLabel',
      options.ariaLabel,
      async (harness, label) =>
        HarnessPredicate.stringMatches((await harness.getAriaLabel()) ?? '', label),
    );
  }
  private readonly getNav = this.locatorFor('nav');
  private readonly getCurrent = this.locatorForOptional('[aria-current="page"]');
  private readonly getRange = this.locatorFor('[aria-live]');
  private readonly getPageSize = this.locatorForOptional('select');

  async getAriaLabel(): Promise<string | null> {
    return (await this.getNav()).getAttribute('aria-label');
  }
  async getCurrentPage(): Promise<number | null> {
    const current = await this.getCurrent();
    return current ? Number((await current.text()).trim()) : null;
  }
  async getRangeText(): Promise<string> {
    return (await this.getRange()).text();
  }
  async goToPage(page: number): Promise<void> {
    const button = await this.locatorForOptional(`button[aria-label="Page ${page}"]`)();
    if (!button) throw new Error(`Visible page button not found: ${page}`);
    await button.click();
  }
  async next(): Promise<void> {
    await (await this.locatorFor('button[aria-label="Next page"]')()).click();
  }
  async setPageSize(size: number): Promise<void> {
    const select = await this.getPageSize();
    if (!select) throw new Error('Paginator does not expose page-size options.');
    const options = await this.locatorForAll('select option')();
    const labels = await Promise.all(options.map((option) => option.text()));
    const index = labels.findIndex((label) => Number(label.trim()) === size);
    if (index < 0) throw new Error(`Page-size option not found: ${size}`);
    await select.selectOptions(index);
  }
}
