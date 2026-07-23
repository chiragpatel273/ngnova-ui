import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import type { BaseHarnessFilters } from '@angular/cdk/testing';

export interface UiToastHarnessFilters extends BaseHarnessFilters {
  readonly message?: string | RegExp;
}

export class UiToastHarness extends ComponentHarness {
  static hostSelector = 'ui-toast';

  static with(options: UiToastHarnessFilters = {}): HarnessPredicate<UiToastHarness> {
    return new HarnessPredicate(UiToastHarness, options).addOption(
      'message',
      options.message,
      async (harness, message) => {
        const titles = await harness.getTitles();
        for (const title of titles) {
          if (await HarnessPredicate.stringMatches(title, message)) {
            return true;
          }
        }
        return false;
      },
    );
  }

  private readonly getToasts = this.locatorForAll('section');
  private readonly getTitleElements = this.locatorForAll('section p:first-child');
  private readonly getDismissButtons = this.locatorForAll('section button');

  async getTitles(): Promise<string[]> {
    const titles = await this.getTitleElements();
    return Promise.all(titles.map((title) => title.text()));
  }

  async getCount(): Promise<number> {
    return (await this.getToasts()).length;
  }

  async dismiss(title: string | RegExp): Promise<void> {
    const titles = await this.getTitleElements();
    const dismissButtons = await this.getDismissButtons();
    for (let index = 0; index < titles.length; index++) {
      const toastTitle = await titles[index].text();
      if (await HarnessPredicate.stringMatches(toastTitle, title)) {
        await dismissButtons[index].click();
        return;
      }
    }
    throw new Error(`Could not find toast matching ${title.toString()}`);
  }
}
