import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import type { BaseHarnessFilters } from '@angular/cdk/testing';

export interface UiStepperHarnessFilters extends BaseHarnessFilters {
  readonly ariaLabel?: string | RegExp;
  readonly currentLabel?: string | RegExp;
}

export class UiStepperHarness extends ComponentHarness {
  static hostSelector = 'ui-stepper';

  static with(options: UiStepperHarnessFilters = {}): HarnessPredicate<UiStepperHarness> {
    return new HarnessPredicate(UiStepperHarness, options)
      .addOption('ariaLabel', options.ariaLabel, async (harness, label) =>
        HarnessPredicate.stringMatches((await harness.getAriaLabel()) ?? '', label),
      )
      .addOption('currentLabel', options.currentLabel, async (harness, label) =>
        HarnessPredicate.stringMatches((await harness.getCurrentLabel()) ?? '', label),
      );
  }

  private readonly getNav = this.locatorFor('nav');
  private readonly getItems = this.locatorForAll('li[data-step-state]');
  private readonly getStepLabels = this.locatorForAll('[data-step-label]');
  private readonly getPanel = this.locatorForOptional('[role="region"]');

  async getAriaLabel(): Promise<string | null> {
    return (await this.getNav()).getAttribute('aria-label');
  }

  async getLabels(): Promise<string[]> {
    const labels = await this.getStepLabels();
    return Promise.all(labels.map(async (label) => (await label.text()).trim()));
  }

  async getStates(): Promise<string[]> {
    const items = await this.getItems();
    return Promise.all(
      items.map(async (item) => (await item.getAttribute('data-step-state')) ?? ''),
    );
  }

  async getCurrentLabel(): Promise<string | null> {
    const label = await this.locatorForOptional('[aria-current="step"] [data-step-label]')();
    return label ? (await label.text()).trim() : null;
  }

  async getOrientation(): Promise<'horizontal' | 'vertical'> {
    const listClass = await (await this.locatorFor('ol')()).getAttribute('class');
    return listClass?.includes('flex-col') ? 'vertical' : 'horizontal';
  }

  async getPanelText(): Promise<string> {
    const panel = await this.getPanel();
    return panel ? (await panel.text()).trim() : '';
  }

  async selectStep(label: string | RegExp): Promise<void> {
    const buttons = await this.locatorForAll('button')();
    for (const button of buttons) {
      const ariaLabel = (await button.getAttribute('aria-label')) ?? '';
      const text = ariaLabel.split(',')[0]?.trim() ?? '';
      if (typeof label === 'string' ? text === label : label.test(text)) {
        await button.click();
        return;
      }
    }
    throw new Error(`Selectable step not found: ${label.toString()}`);
  }
}
