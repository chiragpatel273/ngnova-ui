import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import type { BaseHarnessFilters } from '@angular/cdk/testing';
export interface UiChipHarnessFilters extends BaseHarnessFilters {
  readonly text?: string | RegExp;
}
export class UiChipHarness extends ComponentHarness {
  static hostSelector = 'ui-chip';
  static with(options: UiChipHarnessFilters = {}): HarnessPredicate<UiChipHarness> {
    return new HarnessPredicate(UiChipHarness, options).addOption(
      'text',
      options.text,
      async (h, text) =>
        typeof text === 'string'
          ? (await h.getText()).includes(text)
          : HarnessPredicate.stringMatches(await h.getText(), text),
    );
  }
  private readonly getSelect = this.locatorForOptional('button[aria-pressed]');
  private readonly getRemove = this.locatorForOptional('button[aria-label]');
  async getText(): Promise<string> {
    return (await (await this.host()).text()).replace(/\s+/g, ' ').trim();
  }
  async isSelected(): Promise<boolean> {
    return (
      (await this.getSelect())?.getAttribute('aria-pressed').then((v) => v === 'true') ?? false
    );
  }
  async toggle(): Promise<void> {
    await (await this.getSelect())?.click();
  }
  async remove(): Promise<void> {
    await (await this.getRemove())?.click();
  }
}
