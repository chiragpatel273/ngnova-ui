import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import type { BaseHarnessFilters } from '@angular/cdk/testing';

export interface UiAlertHarnessFilters extends BaseHarnessFilters {
  readonly title?: string | RegExp;
}

export class UiAlertHarness extends ComponentHarness {
  static hostSelector = 'ui-alert';

  static with(options: UiAlertHarnessFilters = {}): HarnessPredicate<UiAlertHarness> {
    return new HarnessPredicate(UiAlertHarness, options).addOption(
      'title',
      options.title,
      async (harness, title) => HarnessPredicate.stringMatches(await harness.getTitle(), title),
    );
  }

  private readonly getContainer = this.locatorForOptional('[role]');
  private readonly getTitleElement = this.locatorForOptional('h3');
  private readonly getDismissButton = this.locatorForOptional('button');

  async isOpen(): Promise<boolean> {
    return (await this.getContainer()) !== null;
  }

  async getTitle(): Promise<string> {
    return (await this.getTitleElement())?.text() ?? '';
  }

  async getRole(): Promise<string | null> {
    return (await this.getContainer())?.getAttribute('role') ?? null;
  }

  async dismiss(): Promise<void> {
    const button = await this.getDismissButton();
    if (!button) {
      throw new Error('Alert is not dismissible.');
    }
    await button.click();
  }
}
