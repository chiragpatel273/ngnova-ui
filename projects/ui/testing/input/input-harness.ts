import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import type { BaseHarnessFilters } from '@angular/cdk/testing';

export interface UiInputHarnessFilters extends BaseHarnessFilters {
  readonly label?: string | RegExp;
}

export class UiInputHarness extends ComponentHarness {
  static hostSelector = 'ui-input';

  static with(options: UiInputHarnessFilters = {}): HarnessPredicate<UiInputHarness> {
    return new HarnessPredicate(UiInputHarness, options).addOption(
      'label',
      options.label,
      async (harness, label) => HarnessPredicate.stringMatches(await harness.getLabel(), label),
    );
  }

  private readonly getInput = this.locatorFor('input');
  private readonly getLabelElement = this.locatorForOptional('label');

  async getLabel(): Promise<string> {
    const label = await this.getLabelElement();
    const text = label ? await label.text() : '';
    return text.replace('*', '').trim();
  }

  async getValue(): Promise<string> {
    return (await this.getInput()).getProperty<string>('value');
  }

  async setValue(value: string): Promise<void> {
    const input = await this.getInput();
    await input.setInputValue(value);
    await input.dispatchEvent('input');
  }

  async focus(): Promise<void> {
    return (await this.getInput()).focus();
  }

  async blur(): Promise<void> {
    return (await this.getInput()).blur();
  }

  async isDisabled(): Promise<boolean> {
    return (await this.getInput()).getProperty<boolean>('disabled');
  }

  async isRequired(): Promise<boolean> {
    return (await this.getInput()).getProperty<boolean>('required');
  }

  async isInvalid(): Promise<boolean> {
    return (await this.getInput()).getAttribute('aria-invalid').then((value) => value === 'true');
  }
}
