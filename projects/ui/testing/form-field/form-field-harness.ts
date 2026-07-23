import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import type { BaseHarnessFilters } from '@angular/cdk/testing';

export interface UiFormFieldHarnessFilters extends BaseHarnessFilters {
  readonly label?: string | RegExp;
}

export class UiFormFieldHarness extends ComponentHarness {
  static hostSelector = 'ui-form-field';

  static with(options: UiFormFieldHarnessFilters = {}): HarnessPredicate<UiFormFieldHarness> {
    return new HarnessPredicate(UiFormFieldHarness, options).addOption(
      'label',
      options.label,
      async (harness, label) => HarnessPredicate.stringMatches(await harness.getLabel(), label),
    );
  }

  private readonly getLabelElement = this.locatorFor('label');
  private readonly getControl = this.locatorFor('[uiFormFieldControl]');
  private readonly getMessage = this.locatorForOptional('p');

  async getLabel(): Promise<string> {
    return (await (await this.getLabelElement()).text()).replace('*', '').trim();
  }

  async getValue(): Promise<string> {
    return (await this.getControl()).getProperty<string>('value');
  }

  async setValue(value: string): Promise<void> {
    await (await this.getControl()).setInputValue(value);
  }

  async getMessageText(): Promise<string> {
    const message = await this.getMessage();
    return message ? (await message.text()).trim() : '';
  }

  async isInvalid(): Promise<boolean> {
    return (await (await this.getControl()).getAttribute('aria-invalid')) === 'true';
  }

  async isRequired(): Promise<boolean> {
    return (await (await this.getControl()).getAttribute('aria-required')) === 'true';
  }

  async isDisabled(): Promise<boolean> {
    return (await (await this.getControl()).getAttribute('aria-disabled')) === 'true';
  }
}
