import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import type { BaseHarnessFilters, TestElement } from '@angular/cdk/testing';

export interface UiAccordionHarnessFilters extends BaseHarnessFilters {
  readonly title?: string | RegExp;
}

export class UiAccordionHarness extends ComponentHarness {
  static hostSelector = 'ui-accordion';

  static with(options: UiAccordionHarnessFilters = {}): HarnessPredicate<UiAccordionHarness> {
    return new HarnessPredicate(UiAccordionHarness, options).addOption(
      'title',
      options.title,
      async (harness, title) => {
        const trigger = await harness.findTrigger(title);
        return trigger !== null;
      },
    );
  }

  private readonly getTriggers = this.locatorForAll('button[aria-expanded]');

  async getTitles(): Promise<string[]> {
    const triggers = await this.getTriggers();
    return Promise.all(triggers.map((trigger) => trigger.text()));
  }

  async isExpanded(title: string | RegExp): Promise<boolean> {
    const trigger = await this.requireTrigger(title);
    return (await trigger.getAttribute('aria-expanded')) === 'true';
  }

  async toggle(title: string | RegExp): Promise<void> {
    return (await this.requireTrigger(title)).click();
  }

  async isDisabled(title: string | RegExp): Promise<boolean> {
    return (await this.requireTrigger(title)).getProperty<boolean>('disabled');
  }

  private async requireTrigger(title: string | RegExp): Promise<TestElement> {
    const trigger = await this.findTrigger(title);
    if (!trigger) {
      throw new Error(`Could not find accordion item matching ${title.toString()}`);
    }
    return trigger;
  }

  private async findTrigger(title: string | RegExp): Promise<TestElement | null> {
    const triggers = await this.getTriggers();
    for (const trigger of triggers) {
      if (await HarnessPredicate.stringMatches(await trigger.text(), title)) {
        return trigger;
      }
    }
    return null;
  }
}
