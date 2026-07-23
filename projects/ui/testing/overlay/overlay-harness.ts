import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import type { BaseHarnessFilters } from '@angular/cdk/testing';

export interface UiOverlayHarnessFilters extends BaseHarnessFilters {
  readonly open?: boolean;
}

export class UiOverlayHarness extends ComponentHarness {
  static hostSelector = 'ui-overlay';

  static with(options: UiOverlayHarnessFilters = {}): HarnessPredicate<UiOverlayHarness> {
    return new HarnessPredicate(UiOverlayHarness, options).addOption(
      'open',
      options.open,
      async (harness, open) => (await harness.isOpen()) === open,
    );
  }

  private readonly getTrigger = this.locatorFor('[uiOverlayTrigger]');

  async isOpen(): Promise<boolean> {
    return (await this.host()).getAttribute('data-open').then((value) => value === 'true');
  }

  async getTriggerText(): Promise<string> {
    return (await this.getTrigger()).text();
  }

  async toggle(): Promise<void> {
    await (await this.getTrigger()).click();
  }

  async open(): Promise<void> {
    if (!(await this.isOpen())) await this.toggle();
  }

  async close(): Promise<void> {
    if (await this.isOpen()) await this.toggle();
  }
}
