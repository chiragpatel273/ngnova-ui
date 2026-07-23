import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import type { BaseHarnessFilters } from '@angular/cdk/testing';

export interface UiTreeTableHarnessFilters extends BaseHarnessFilters {
  readonly caption?: string | RegExp;
}

export class UiTreeTableHarness extends ComponentHarness {
  static hostSelector = 'ui-tree-table';

  static with(options: UiTreeTableHarnessFilters = {}): HarnessPredicate<UiTreeTableHarness> {
    return new HarnessPredicate(UiTreeTableHarness, options).addOption(
      'caption',
      options.caption,
      async (harness, caption) =>
        HarnessPredicate.stringMatches(await harness.getCaption(), caption),
    );
  }

  private readonly getTable = this.locatorFor('table');
  private readonly getHeaders = this.locatorForAll('th');
  private readonly getRows = this.locatorForAll('tbody tr[aria-level]');
  private readonly getSortButtons = this.locatorForAll('thead button');

  async getCaption(): Promise<string> {
    return (await this.getTable()).getAttribute('aria-label').then((value) => value ?? '');
  }

  async getHeadersText(): Promise<string[]> {
    const headers = await this.getHeaders();
    return Promise.all(headers.map((header) => header.text()));
  }

  async getVisibleRowsText(): Promise<string[]> {
    const rows = await this.getRows();
    return Promise.all(rows.map((row) => row.text()));
  }

  async activateRow(index: number): Promise<void> {
    const row = (await this.getRows())[index];
    if (!row) throw new Error(`Could not find tree-table row at index ${index}.`);
    await row.click();
  }

  async sortBy(header: string | RegExp): Promise<void> {
    for (const button of await this.getSortButtons()) {
      if (await HarnessPredicate.stringMatches(await button.text(), header)) {
        await button.click();
        return;
      }
    }
    throw new Error(`Could not find sortable tree-table header matching ${header.toString()}.`);
  }
}
