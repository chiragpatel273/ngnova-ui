import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import type { BaseHarnessFilters } from '@angular/cdk/testing';

export interface UiTagHarnessFilters extends BaseHarnessFilters {
  readonly text?: string | RegExp;
}

export class UiTagHarness extends ComponentHarness {
  static hostSelector = 'ui-tag';

  static with(options: UiTagHarnessFilters = {}): HarnessPredicate<UiTagHarness> {
    return new HarnessPredicate(UiTagHarness, options).addOption(
      'text',
      options.text,
      async (harness, value) => HarnessPredicate.stringMatches(await harness.getText(), value),
    );
  }

  private readonly getTextElement = this.locatorFor('span.min-w-0');
  private readonly getRemoveButton = this.locatorForOptional('button');

  async getText(): Promise<string> {
    return (await this.getTextElement()).text();
  }

  async isRemovable(): Promise<boolean> {
    return (await this.getRemoveButton()) !== null;
  }

  async remove(): Promise<void> {
    const button = await this.getRemoveButton();
    if (!button) {
      throw new Error('Tag is not removable.');
    }
    await button.click();
  }
}
