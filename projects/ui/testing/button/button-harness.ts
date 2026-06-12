import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import type { BaseHarnessFilters } from '@angular/cdk/testing';

export interface UiButtonHarnessFilters extends BaseHarnessFilters {
  readonly text?: string | RegExp;
}

export class UiButtonHarness extends ComponentHarness {
  static hostSelector = 'ui-button';

  static with(options: UiButtonHarnessFilters = {}): HarnessPredicate<UiButtonHarness> {
    return new HarnessPredicate(UiButtonHarness, options).addOption(
      'text',
      options.text,
      async (harness, text) => HarnessPredicate.stringMatches(await harness.getText(), text),
    );
  }

  private readonly getButton = this.locatorFor('button');

  async click(): Promise<void> {
    return (await this.getButton()).click();
  }

  async getText(): Promise<string> {
    return (await this.getButton()).text();
  }

  async isDisabled(): Promise<boolean> {
    return (await this.getButton()).getProperty<boolean>('disabled');
  }

  async isLoading(): Promise<boolean> {
    return (await this.getButton()).getAttribute('aria-busy').then((value) => value === 'true');
  }

  async getType(): Promise<string | null> {
    return (await this.getButton()).getAttribute('type');
  }
}
