import { ComponentHarness, HarnessPredicate, TestKey } from '@angular/cdk/testing';
import type { BaseHarnessFilters } from '@angular/cdk/testing';

export interface UiMenuHarnessFilters extends BaseHarnessFilters {
  readonly triggerText?: string | RegExp;
}

export class UiMenuHarness extends ComponentHarness {
  static hostSelector = 'ui-menu';
  static with(options: UiMenuHarnessFilters = {}): HarnessPredicate<UiMenuHarness> {
    return new HarnessPredicate(UiMenuHarness, options).addOption(
      'triggerText',
      options.triggerText,
      async (harness, text) => HarnessPredicate.stringMatches(await harness.getTriggerText(), text),
    );
  }
  private readonly getTrigger = this.locatorFor('[uiMenuTrigger]');
  private readonly getItems = this.locatorForAll('[role="menuitem"]');
  async open(): Promise<void> {
    if (!(await this.isOpen())) await (await this.getTrigger()).click();
  }
  async close(): Promise<void> {
    if (await this.isOpen()) await (await this.getItems())[0]?.sendKeys(TestKey.ESCAPE);
  }
  async isOpen(): Promise<boolean> {
    return (await (await this.getTrigger()).getAttribute('aria-expanded')) === 'true';
  }
  async getTriggerText(): Promise<string> {
    return (await this.getTrigger()).text();
  }
  async getItemTexts(): Promise<string[]> {
    return Promise.all((await this.getItems()).map((item) => item.text()));
  }
  async selectItem(text: string): Promise<void> {
    for (const item of await this.getItems())
      if ((await item.text()).trim() === text) {
        await item.click();
        return;
      }
    throw new Error(`Menu item not found: ${text}`);
  }
}
