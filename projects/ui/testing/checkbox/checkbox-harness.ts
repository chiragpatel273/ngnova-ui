import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import type { BaseHarnessFilters } from '@angular/cdk/testing';

export interface UiCheckboxHarnessFilters extends BaseHarnessFilters {
  readonly label?: string | RegExp;
}

export class UiCheckboxHarness extends ComponentHarness {
  static hostSelector = 'ui-checkbox';

  static with(options: UiCheckboxHarnessFilters = {}): HarnessPredicate<UiCheckboxHarness> {
    return new HarnessPredicate(UiCheckboxHarness, options).addOption(
      'label',
      options.label,
      async (harness, label) => HarnessPredicate.stringMatches(await harness.getLabel(), label),
    );
  }

  private readonly getCheckbox = this.locatorFor('input[type="checkbox"]');
  private readonly getLabelElement = this.locatorForOptional('label');

  async getLabel(): Promise<string> {
    return (await this.getLabelElement())?.text() ?? '';
  }

  async toggle(): Promise<void> {
    return (await this.getCheckbox()).click();
  }

  async isChecked(): Promise<boolean> {
    return (await this.getCheckbox()).getProperty<boolean>('checked');
  }

  async isIndeterminate(): Promise<boolean> {
    return (await this.getCheckbox()).getProperty<boolean>('indeterminate');
  }

  async isDisabled(): Promise<boolean> {
    return (await this.getCheckbox()).getProperty<boolean>('disabled');
  }
}
