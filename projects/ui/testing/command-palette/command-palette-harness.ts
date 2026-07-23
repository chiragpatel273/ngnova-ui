import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import type { BaseHarnessFilters } from '@angular/cdk/testing';

export interface UiCommandPaletteHarnessFilters extends BaseHarnessFilters {
  readonly ariaLabel?: string | RegExp;
}

export class UiCommandPaletteHarness extends ComponentHarness {
  static hostSelector = 'ui-command-palette';

  static with(
    options: UiCommandPaletteHarnessFilters = {},
  ): HarnessPredicate<UiCommandPaletteHarness> {
    return new HarnessPredicate(UiCommandPaletteHarness, options).addOption(
      'ariaLabel',
      options.ariaLabel,
      async (harness, label) => HarnessPredicate.stringMatches(await harness.getAriaLabel(), label),
    );
  }

  private readonly getDialog = this.locatorForOptional('[role="dialog"]');
  private readonly getInput = this.locatorForOptional('input');
  private readonly getOptions = this.locatorForAll('[role="option"]');

  async isOpen(): Promise<boolean> {
    return (await this.getDialog()) !== null;
  }

  async getAriaLabel(): Promise<string> {
    return (await this.getDialog())?.getAttribute('aria-label').then((value) => value ?? '') ?? '';
  }

  async search(query: string): Promise<void> {
    const input = await this.getInput();
    if (!input) throw new Error('Command Palette is closed.');
    await input.clear();
    await input.sendKeys(query);
  }

  async getCommandTexts(): Promise<string[]> {
    const options = await this.getOptions();
    return Promise.all(options.map((option) => option.text()));
  }

  async selectCommand(index: number): Promise<void> {
    const options = await this.getOptions();
    const option = options[index];
    if (!option) throw new Error(`Could not find command at index ${index}.`);
    await option.click();
  }
}
