import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import type { BaseHarnessFilters } from '@angular/cdk/testing';

export interface UiModalHarnessFilters extends BaseHarnessFilters {
  readonly title?: string | RegExp;
}

export class UiModalHarness extends ComponentHarness {
  static hostSelector = 'ui-modal';

  static with(options: UiModalHarnessFilters = {}): HarnessPredicate<UiModalHarness> {
    return new HarnessPredicate(UiModalHarness, options).addOption(
      'title',
      options.title,
      async (harness, title) => HarnessPredicate.stringMatches(await harness.getTitle(), title),
    );
  }

  private readonly getDialog = this.locatorForOptional('[role="dialog"]');
  private readonly getTitleElement = this.locatorForOptional('header [id]');
  private readonly getCloseButton = this.locatorForOptional('header button');

  async isOpen(): Promise<boolean> {
    return (await this.getDialog()) !== null;
  }

  async getTitle(): Promise<string> {
    return (await this.getTitleElement())?.text() ?? '';
  }

  async getAriaLabel(): Promise<string | null> {
    return (await this.getDialog())?.getAttribute('aria-label') ?? null;
  }

  async close(): Promise<void> {
    await (await this.getCloseButton())?.click();
  }
}
