import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import type { BaseHarnessFilters } from '@angular/cdk/testing';

export interface UiFileUploadHarnessFilters extends BaseHarnessFilters {
  readonly ariaLabel?: string | RegExp;
}

export class UiFileUploadHarness extends ComponentHarness {
  static hostSelector = 'ui-file-upload';

  static with(options: UiFileUploadHarnessFilters = {}): HarnessPredicate<UiFileUploadHarness> {
    return new HarnessPredicate(UiFileUploadHarness, options).addOption(
      'ariaLabel',
      options.ariaLabel,
      async (harness, label) => HarnessPredicate.stringMatches(await harness.getAriaLabel(), label),
    );
  }

  private readonly getSection = this.locatorFor('section');
  private readonly getFileItems = this.locatorForAll('li');
  private readonly getAlert = this.locatorForOptional('[role="alert"]');
  private readonly getButtons = this.locatorForAll('button');

  async getAriaLabel(): Promise<string> {
    return (await this.getSection()).getAttribute('aria-label').then((value) => value ?? '');
  }

  async getFileNames(): Promise<string[]> {
    const items = await this.getFileItems();
    return Promise.all(items.map((item) => item.text()));
  }

  async getRejectionText(): Promise<string> {
    return (await this.getAlert())?.text() ?? '';
  }

  async removeFile(index: number): Promise<void> {
    const buttons = await this.getButtons();
    const button = buttons[index + 1];
    if (!button) throw new Error(`Could not find file remove action at index ${index}.`);
    await button.click();
  }

  async clear(): Promise<void> {
    const buttons = await this.getButtons();
    const button = buttons.at(-2);
    if (!button) throw new Error('File Upload clear action is unavailable.');
    await button.click();
  }

  async upload(): Promise<void> {
    const buttons = await this.getButtons();
    const button = buttons.at(-1);
    if (!button) throw new Error('File Upload action is unavailable.');
    await button.click();
  }
}
