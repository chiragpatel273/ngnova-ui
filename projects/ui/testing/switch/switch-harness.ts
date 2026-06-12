import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import type { BaseHarnessFilters } from '@angular/cdk/testing';

export interface UiSwitchHarnessFilters extends BaseHarnessFilters {
  readonly label?: string | RegExp;
}

export class UiSwitchHarness extends ComponentHarness {
  static hostSelector = 'ui-switch';

  static with(options: UiSwitchHarnessFilters = {}): HarnessPredicate<UiSwitchHarness> {
    return new HarnessPredicate(UiSwitchHarness, options).addOption(
      'label',
      options.label,
      async (harness, label) => HarnessPredicate.stringMatches(await harness.getLabel(), label),
    );
  }

  private readonly getInput = this.locatorFor('input[role="switch"]');
  private readonly getLabelText = this.locatorForOptional('label > span:first-child > span');

  async getLabel(): Promise<string> {
    return (await this.getLabelText())?.text() ?? '';
  }

  async toggle(): Promise<void> {
    return (await this.getInput()).click();
  }

  async isChecked(): Promise<boolean> {
    return (await this.getInput()).getProperty<boolean>('checked');
  }

  async isDisabled(): Promise<boolean> {
    return (await this.getInput()).getProperty<boolean>('disabled');
  }
}
