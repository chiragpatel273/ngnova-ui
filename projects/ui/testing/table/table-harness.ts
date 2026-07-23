import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import type { BaseHarnessFilters } from '@angular/cdk/testing';

export interface UiTableHarnessFilters extends BaseHarnessFilters {
  readonly caption?: string | RegExp;
}

export class UiTableHarness extends ComponentHarness {
  static hostSelector = 'ui-table';

  static with(options: UiTableHarnessFilters = {}): HarnessPredicate<UiTableHarness> {
    return new HarnessPredicate(UiTableHarness, options).addOption(
      'caption',
      options.caption,
      async (harness, caption) =>
        HarnessPredicate.stringMatches(await harness.getCaption(), caption),
    );
  }

  private readonly getCaptionElement = this.locatorForOptional('caption');
  private readonly getHeaders = this.locatorForAll('th');
  private readonly getRows = this.locatorForAll('tbody tr');
  private readonly getSortButtons = this.locatorForAll('th button');
  private readonly getSelectionInputs = this.locatorForAll('tbody input');
  private readonly getStateMessageElement = this.locatorForOptional(
    'tbody [role="status"], tbody [role="alert"]',
  );

  async getCaption(): Promise<string> {
    return (await this.getCaptionElement())?.text() ?? '';
  }

  async getHeadersText(): Promise<string[]> {
    const headers = await this.getHeaders();
    return Promise.all(headers.map((header) => header.text()));
  }

  async getRowsText(): Promise<string[]> {
    const rows = await this.getRows();
    return Promise.all(rows.map((row) => row.text()));
  }

  async sortBy(header: string | RegExp): Promise<void> {
    const buttons = await this.getSortButtons();
    for (const button of buttons) {
      if (await HarnessPredicate.stringMatches(await button.text(), header)) {
        await button.click();
        return;
      }
    }
    throw new Error(`Could not find sortable table header matching ${header.toString()}`);
  }

  async selectRow(index: number): Promise<void> {
    const rows = await this.getRows();
    const row = rows[index];
    if (!row) {
      throw new Error(`Could not find table row at index ${index}`);
    }
    await row.click();
  }

  async toggleRowSelection(index: number): Promise<void> {
    const inputs = await this.getSelectionInputs();
    const input = inputs[index];
    if (!input) {
      throw new Error(`Could not find table row selection control at index ${index}`);
    }
    await input.click();
  }

  async getSelectedRowIndexes(): Promise<number[]> {
    const rows = await this.getRows();
    const selected = await Promise.all(
      rows.map(async (row, index) =>
        (await row.getAttribute('aria-selected')) === 'true' ? index : -1,
      ),
    );
    return selected.filter((index) => index >= 0);
  }

  async getStateMessage(): Promise<string> {
    return (await this.getStateMessageElement())?.text() ?? '';
  }
}
