import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import type { BaseHarnessFilters } from '@angular/cdk/testing';

export interface UiTextareaHarnessFilters extends BaseHarnessFilters {
  readonly label?: string | RegExp;
}

export class UiTextareaHarness extends ComponentHarness {
  static hostSelector = 'ui-textarea';

  static with(options: UiTextareaHarnessFilters = {}): HarnessPredicate<UiTextareaHarness> {
    return new HarnessPredicate(UiTextareaHarness, options).addOption(
      'label',
      options.label,
      async (harness, label) => HarnessPredicate.stringMatches(await harness.getLabel(), label),
    );
  }

  private readonly getTextarea = this.locatorFor('textarea');
  private readonly getLabelElement = this.locatorForOptional('label');

  async getLabel(): Promise<string> {
    const label = await this.getLabelElement();
    const text = label ? await label.text() : '';
    return text.replace('*', '').trim();
  }

  async getValue(): Promise<string> {
    return (await this.getTextarea()).getProperty<string>('value');
  }

  async setValue(value: string): Promise<void> {
    const textarea = await this.getTextarea();
    await textarea.setInputValue(value);
    await textarea.dispatchEvent('input');
  }

  async isDisabled(): Promise<boolean> {
    return (await this.getTextarea()).getProperty<boolean>('disabled');
  }
}
