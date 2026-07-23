import { ComponentHarness, HarnessPredicate, TestKey } from '@angular/cdk/testing';
import type { BaseHarnessFilters } from '@angular/cdk/testing';

export interface UiDatePickerHarnessFilters extends BaseHarnessFilters {
  readonly label?: string | RegExp;
}

export class UiDatePickerHarness extends ComponentHarness {
  static hostSelector = 'ui-date-picker';

  static with(options: UiDatePickerHarnessFilters = {}): HarnessPredicate<UiDatePickerHarness> {
    return new HarnessPredicate(UiDatePickerHarness, options).addOption(
      'label',
      options.label,
      async (harness, label) =>
        HarnessPredicate.stringMatches((await harness.getLabel()) ?? '', label),
    );
  }

  private readonly getInput = this.locatorFor('input');

  async getLabel(): Promise<string | null> {
    const label = await this.locatorForOptional('label')();
    if (label) return (await label.text()).replace('*', '').trim();
    return (await this.getInput()).getAttribute('aria-label');
  }

  async getDisplayValue(): Promise<string> {
    return (await this.getInput()).getProperty<string>('value');
  }

  async isOpen(): Promise<boolean> {
    return (await (await this.getInput()).getAttribute('aria-expanded')) === 'true';
  }

  async open(): Promise<void> {
    if (!(await this.isOpen())) await (await this.getInput()).click();
  }

  async close(): Promise<void> {
    if (await this.isOpen()) await (await this.getInput()).sendKeys(TestKey.ESCAPE);
  }

  async getMonthLabel(): Promise<string> {
    await this.open();
    return (await (await this.locatorFor('[role="dialog"] h2')()).text()).trim();
  }

  async getVisibleDates(): Promise<string[]> {
    await this.open();
    const dates = await this.locatorForAll('[role="gridcell"][data-date]')();
    return Promise.all(dates.map(async (date) => (await date.getAttribute('data-date')) ?? ''));
  }

  async selectDate(value: string): Promise<void> {
    await this.open();
    const date = await this.locatorForOptional(`[data-date="${value}"]`)();
    if (!date) throw new Error(`Date is not visible: ${value}`);
    await date.click();
  }

  async nextMonth(): Promise<void> {
    await this.open();
    await (await this.locatorFor('button[aria-label="Next month"]')()).click();
  }

  async previousMonth(): Promise<void> {
    await this.open();
    await (await this.locatorFor('button[aria-label="Previous month"]')()).click();
  }

  async clear(): Promise<void> {
    const clear = await this.locatorForOptional('button[aria-label="Clear date"]')();
    if (!clear) throw new Error('Date Picker has no clear action');
    await clear.click();
  }

  async isDateDisabled(value: string): Promise<boolean> {
    await this.open();
    const date = await this.locatorForOptional(`[data-date="${value}"]`)();
    return date ? date.getProperty<boolean>('disabled') : true;
  }

  async isDisabled(): Promise<boolean> {
    return (await this.getInput()).getProperty<boolean>('disabled');
  }

  async getMessageText(): Promise<string> {
    const message = await this.locatorForOptional('p')();
    return message ? (await message.text()).trim() : '';
  }
}
