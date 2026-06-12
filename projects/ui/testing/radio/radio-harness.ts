import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import type { BaseHarnessFilters } from '@angular/cdk/testing';

export interface UiRadioGroupHarnessFilters extends BaseHarnessFilters {
  readonly label?: string | RegExp;
}

export class UiRadioGroupHarness extends ComponentHarness {
  static hostSelector = 'ui-radio-group';

  static with(options: UiRadioGroupHarnessFilters = {}): HarnessPredicate<UiRadioGroupHarness> {
    return new HarnessPredicate(UiRadioGroupHarness, options).addOption(
      'label',
      options.label,
      async (harness, label) => HarnessPredicate.stringMatches(await harness.getLabel(), label),
    );
  }

  private readonly getLegend = this.locatorForOptional('legend');
  private readonly getOptions = this.locatorForAll('label');
  private readonly getInputs = this.locatorForAll('input[type="radio"]');

  async getLabel(): Promise<string> {
    return (await this.getLegend())?.text() ?? '';
  }

  async getOptionLabels(): Promise<string[]> {
    const options = await this.getOptions();
    return Promise.all(options.map((option) => option.text()));
  }

  async selectOption(label: string | RegExp): Promise<void> {
    const optionIndex = await this.findOptionIndex(label);
    if (optionIndex === -1) {
      throw new Error(`Could not find radio option matching ${label.toString()}`);
    }
    const options = await this.getOptions();
    return options[optionIndex].click();
  }

  async getValue(): Promise<string> {
    const inputs = await this.getInputs();
    for (const input of inputs) {
      if (await input.getProperty<boolean>('checked')) {
        return (await input.getAttribute('value')) ?? '';
      }
    }
    return '';
  }

  private async findOptionIndex(label: string | RegExp): Promise<number> {
    const options = await this.getOptions();
    for (let index = 0; index < options.length; index++) {
      const text = await options[index].text();
      if (typeof label === 'string' ? text.trim().startsWith(label) : label.test(text)) {
        return index;
      }
    }
    return -1;
  }
}
