import { ComponentHarness, HarnessPredicate, TestKey } from '@angular/cdk/testing';
import type { BaseHarnessFilters } from '@angular/cdk/testing';

export interface UiComboboxHarnessFilters extends BaseHarnessFilters {
  readonly label?: string | RegExp;
}

export class UiComboboxHarness extends ComponentHarness {
  static hostSelector = 'ui-combobox';

  static with(options: UiComboboxHarnessFilters = {}): HarnessPredicate<UiComboboxHarness> {
    return new HarnessPredicate(UiComboboxHarness, options).addOption(
      'label',
      options.label,
      async (harness, label) =>
        HarnessPredicate.stringMatches((await harness.getLabel()) ?? '', label),
    );
  }

  private readonly getInput = this.locatorFor('input[role="combobox"]');

  async getLabel(): Promise<string | null> {
    const label = await this.locatorForOptional('label')();
    if (label) return (await label.text()).replace('*', '').trim();
    return (await this.getInput()).getAttribute('aria-label');
  }

  async getQuery(): Promise<string> {
    return (await this.getInput()).getProperty<string>('value');
  }

  async setQuery(query: string): Promise<void> {
    const input = await this.getInput();
    await input.setInputValue(query);
    await input.dispatchEvent('input');
    await input.sendKeys(TestKey.DOWN_ARROW);
  }

  async isOpen(): Promise<boolean> {
    return (await (await this.getInput()).getAttribute('aria-expanded')) === 'true';
  }

  async open(): Promise<void> {
    if (await this.isOpen()) return;
    const input = await this.getInput();
    await input.focus();
    if ((await input.getAttribute('aria-expanded')) !== 'true') {
      await input.sendKeys(TestKey.DOWN_ARROW);
    }
  }

  async close(): Promise<void> {
    if (await this.isOpen()) await (await this.getInput()).sendKeys(TestKey.ESCAPE);
  }

  async getOptionsText(): Promise<string[]> {
    const options = await this.locatorForAll('[role="option"]')();
    return Promise.all(
      options.map(async (option) => (await option.text()).split('\n')[0]?.trim() ?? ''),
    );
  }

  async getActiveOptionText(): Promise<string | null> {
    const option = await this.locatorForOptional('[role="option"][data-active="true"]')();
    return option ? ((await option.text()).split('\n')[0]?.trim() ?? null) : null;
  }

  async selectOption(label: string | RegExp): Promise<void> {
    await this.open();
    const options = await this.locatorForAll('[role="option"]')();
    for (const option of options) {
      const text = (await option.text()).split('\n')[0]?.trim() ?? '';
      if (typeof label === 'string' ? text === label : label.test(text)) {
        await option.click();
        return;
      }
    }
    throw new Error(`Combobox option not found: ${label.toString()}`);
  }

  async clear(): Promise<void> {
    const button = await this.locatorForOptional('button[aria-label*="Clear"]')();
    if (!button) throw new Error('Combobox has no clear action');
    await button.click();
  }

  async isDisabled(): Promise<boolean> {
    return (await this.getInput()).getProperty<boolean>('disabled');
  }

  async getMessageText(): Promise<string> {
    const message = await this.locatorForOptional('p')();
    return message ? (await message.text()).trim() : '';
  }
}
