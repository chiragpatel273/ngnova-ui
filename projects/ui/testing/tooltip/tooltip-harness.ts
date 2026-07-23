import { ComponentHarness, HarnessPredicate, TestKey } from '@angular/cdk/testing';
import type { BaseHarnessFilters } from '@angular/cdk/testing';

export interface UiTooltipHarnessFilters extends BaseHarnessFilters {
  readonly triggerText?: string | RegExp;
}

export class UiTooltipHarness extends ComponentHarness {
  static hostSelector = '[uiTooltip]';

  static with(options: UiTooltipHarnessFilters = {}): HarnessPredicate<UiTooltipHarness> {
    return new HarnessPredicate(UiTooltipHarness, options).addOption(
      'triggerText',
      options.triggerText,
      async (harness, text) =>
        HarnessPredicate.stringMatches(await (await harness.host()).text(), text),
    );
  }

  async show(): Promise<void> {
    await (await this.host()).focus();
  }

  async hide(): Promise<void> {
    await (await this.host()).sendKeys(TestKey.ESCAPE);
  }

  async getTooltipText(): Promise<string | null> {
    const descriptionIds = (await (await this.host()).getAttribute('aria-describedby'))
      ?.split(/\s+/)
      .filter(Boolean);
    if (!descriptionIds?.length) {
      return null;
    }

    const root = this.documentRootLocatorFactory();
    for (const id of descriptionIds) {
      const tooltip = await root.locatorForOptional(`#${id}[role="tooltip"]`)();
      if (tooltip) {
        return tooltip.text();
      }
    }
    return null;
  }
}
