import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import type { BaseHarnessFilters } from '@angular/cdk/testing';

export interface UiDataViewHarnessFilters extends BaseHarnessFilters {
  readonly ariaLabel?: string | RegExp;
}

export class UiDataViewHarness extends ComponentHarness {
  static hostSelector = 'ui-data-view';

  static with(options: UiDataViewHarnessFilters = {}): HarnessPredicate<UiDataViewHarness> {
    return new HarnessPredicate(UiDataViewHarness, options).addOption(
      'ariaLabel',
      options.ariaLabel,
      async (harness, label) => HarnessPredicate.stringMatches(await harness.getAriaLabel(), label),
    );
  }

  private readonly getSection = this.locatorFor('section');
  private readonly getItems = this.locatorForAll('[role="listitem"]');
  private readonly getState = this.locatorForOptional('[role="status"], [role="alert"]');
  private readonly getLayoutButtons = this.locatorForAll('[aria-pressed]');

  async getAriaLabel(): Promise<string> {
    return (await this.getSection()).getAttribute('aria-label').then((value) => value ?? '');
  }

  async getItemCount(): Promise<number> {
    return (await this.getItems()).length;
  }

  async getStateText(): Promise<string> {
    return (await this.getState())?.text() ?? '';
  }

  async setLayout(layout: 'grid' | 'list'): Promise<void> {
    const buttons = await this.getLayoutButtons();
    const target = layout === 'grid' ? buttons[0] : buttons[1];
    if (!target) {
      throw new Error(`Data View layout toggle is not available for ${layout}.`);
    }
    await target.click();
  }
}
