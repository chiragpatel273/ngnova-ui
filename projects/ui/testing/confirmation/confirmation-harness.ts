import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import type { BaseHarnessFilters } from '@angular/cdk/testing';

export interface UiConfirmationDialogHarnessFilters extends BaseHarnessFilters {
  readonly title?: string | RegExp;
}

export class UiConfirmationDialogHarness extends ComponentHarness {
  static hostSelector = 'ui-confirmation-dialog';

  static with(
    options: UiConfirmationDialogHarnessFilters = {},
  ): HarnessPredicate<UiConfirmationDialogHarness> {
    return new HarnessPredicate(UiConfirmationDialogHarness, options).addOption(
      'title',
      options.title,
      async (harness, title) => HarnessPredicate.stringMatches(await harness.getTitle(), title),
    );
  }

  private readonly getDialog = this.locatorForOptional('[role="alertdialog"]');
  private readonly getTitleElement = this.locatorForOptional('h2');
  private readonly getMessageElement = this.locatorForOptional('h2 + p');
  private readonly getPromptInput = this.locatorForOptional('input');
  private readonly getButtons = this.locatorForAll('button');

  async isOpen(): Promise<boolean> {
    return (await this.getDialog()) !== null;
  }

  async getTitle(): Promise<string> {
    return (await this.getTitleElement())?.text() ?? '';
  }

  async getMessage(): Promise<string> {
    return (await this.getMessageElement())?.text() ?? '';
  }

  async setConfirmationText(value: string): Promise<void> {
    const input = await this.getPromptInput();
    if (!input) throw new Error('The active confirmation does not require text.');
    await input.clear();
    await input.sendKeys(value);
  }

  async cancel(): Promise<void> {
    const buttons = await this.getButtons();
    const button = buttons[0];
    if (!button) throw new Error('No active confirmation.');
    await button.click();
  }

  async confirm(): Promise<void> {
    const buttons = await this.getButtons();
    const button = buttons[1];
    if (!button) throw new Error('No active confirmation.');
    await button.click();
  }

  async isConfirmDisabled(): Promise<boolean> {
    const buttons = await this.getButtons();
    return (await buttons[1]?.getAttribute('disabled')) !== null;
  }
}
