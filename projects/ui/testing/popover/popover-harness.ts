import { ComponentHarness, HarnessPredicate, TestKey } from '@angular/cdk/testing';
import type { BaseHarnessFilters } from '@angular/cdk/testing';

export interface UiPopoverHarnessFilters extends BaseHarnessFilters {
  readonly triggerText?: string | RegExp;
}

export class UiPopoverHarness extends ComponentHarness {
  static hostSelector = 'ui-popover';

  static with(options: UiPopoverHarnessFilters = {}): HarnessPredicate<UiPopoverHarness> {
    return new HarnessPredicate(UiPopoverHarness, options).addOption(
      'triggerText',
      options.triggerText,
      async (harness, text) => HarnessPredicate.stringMatches(await harness.getTriggerText(), text),
    );
  }

  private readonly getTrigger = this.locatorFor('[uiPopoverTrigger]');
  private readonly getPanel = this.locatorFor('[role="dialog"]');

  async open(): Promise<void> {
    if (!(await this.isOpen())) await (await this.getTrigger()).click();
  }

  async close(): Promise<void> {
    if (await this.isOpen()) await (await this.getTrigger()).sendKeys(TestKey.ESCAPE);
  }

  async isOpen(): Promise<boolean> {
    return (await (await this.getTrigger()).getAttribute('aria-expanded')) === 'true';
  }

  async getTriggerText(): Promise<string> {
    return (await this.getTrigger()).text();
  }

  async getPanelText(): Promise<string> {
    return (await this.getPanel()).text();
  }
}
