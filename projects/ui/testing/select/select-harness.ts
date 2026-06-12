import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import type { BaseHarnessFilters } from '@angular/cdk/testing';

export interface UiSelectHarnessFilters extends BaseHarnessFilters {
  readonly label?: string | RegExp;
}

export class UiSelectHarness extends ComponentHarness {
  static hostSelector = 'ui-select';

  static with(options: UiSelectHarnessFilters = {}): HarnessPredicate<UiSelectHarness> {
    return new HarnessPredicate(UiSelectHarness, options).addOption(
      'label',
      options.label,
      async (harness, label) => HarnessPredicate.stringMatches(await harness.getLabel(), label),
    );
  }

  private readonly getSelect = this.locatorFor('select');
  private readonly getLabelElement = this.locatorForOptional('label span');
  private readonly getOptions = this.locatorForAll('option');

  async getLabel(): Promise<string> {
    return (await this.getLabelElement())?.text() ?? '';
  }

  async getValue(): Promise<string> {
    return (await this.getSelect()).getProperty<string>('value');
  }

  async selectByValue(value: string): Promise<void> {
    const optionIndex = await this.findOptionIndexByAttribute('value', value);
    return (await this.getSelect()).selectOptions(optionIndex);
  }

  async selectByText(text: string | RegExp): Promise<void> {
    const optionIndex = await this.findOptionIndexByText(text);
    return (await this.getSelect()).selectOptions(optionIndex);
  }

  async getOptionsText(): Promise<string[]> {
    const options = await this.getOptions();
    return Promise.all(options.map((option) => option.text()));
  }

  async isDisabled(): Promise<boolean> {
    return (await this.getSelect()).getProperty<boolean>('disabled');
  }

  private async findOptionIndexByAttribute(attribute: string, value: string): Promise<number> {
    const options = await this.getOptions();
    for (let index = 0; index < options.length; index++) {
      if ((await options[index].getAttribute(attribute)) === value) {
        return index;
      }
    }
    throw new Error(`Could not find option with ${attribute}="${value}"`);
  }

  private async findOptionIndexByText(text: string | RegExp): Promise<number> {
    const options = await this.getOptions();
    for (let index = 0; index < options.length; index++) {
      const optionText = await options[index].text();
      if (typeof text === 'string' ? optionText.trim() === text : text.test(optionText)) {
        return index;
      }
    }
    throw new Error(`Could not find option matching ${text.toString()}`);
  }
}
