import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import type { BaseHarnessFilters, TestElement } from '@angular/cdk/testing';

export interface UiTabsHarnessFilters extends BaseHarnessFilters {
  readonly selectedLabel?: string | RegExp;
}

export class UiTabsHarness extends ComponentHarness {
  static hostSelector = 'ui-tabs';

  static with(options: UiTabsHarnessFilters = {}): HarnessPredicate<UiTabsHarness> {
    return new HarnessPredicate(UiTabsHarness, options).addOption(
      'selectedLabel',
      options.selectedLabel,
      async (harness, label) =>
        HarnessPredicate.stringMatches(await harness.getSelectedLabel(), label),
    );
  }

  private readonly getTabs = this.locatorForAll('button[role="tab"]');
  private readonly getPanel = this.locatorFor('[role="tabpanel"]');

  async getLabels(): Promise<string[]> {
    const tabs = await this.getTabs();
    return Promise.all(tabs.map((tab) => tab.text()));
  }

  async getSelectedLabel(): Promise<string> {
    const selected = await this.getSelectedTab();
    return selected?.text() ?? '';
  }

  async selectTab(label: string | RegExp): Promise<void> {
    const tab = await this.findTab(label);
    if (!tab) {
      throw new Error(`Could not find tab matching ${label.toString()}`);
    }

    return tab.click();
  }

  async getPanelText(): Promise<string> {
    return (await this.getPanel()).text();
  }

  private async getSelectedTab(): Promise<TestElement | null> {
    const tabs = await this.getTabs();
    for (const tab of tabs) {
      if ((await tab.getAttribute('aria-selected')) === 'true') {
        return tab;
      }
    }
    return null;
  }

  private async findTab(label: string | RegExp): Promise<TestElement | null> {
    const tabs = await this.getTabs();
    for (const tab of tabs) {
      const text = await tab.text();
      if (typeof label === 'string' ? text.trim() === label : label.test(text)) {
        return tab;
      }
    }
    return null;
  }
}
