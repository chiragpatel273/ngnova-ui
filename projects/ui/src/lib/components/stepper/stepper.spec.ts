import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { UiStepperComponent } from '../../../../stepper/src/stepper';
import type { UiStepItem, UiStepperSelection } from '../../../../stepper/src/stepper';

const STEPS: readonly UiStepItem[] = [
  { value: 'account', label: 'Account', description: 'Your details', completed: true },
  { value: 'plan', label: 'Plan', description: 'Choose a plan' },
  { value: 'review', label: 'Review', optional: true },
  { value: 'publish', label: 'Publish', disabled: true },
];

@Component({
  standalone: true,
  imports: [UiStepperComponent],
  template: `
    <ui-stepper
      [steps]="steps"
      [(active)]="active"
      [linear]="linear"
      [orientation]="orientation"
      ariaLabel="Onboarding progress"
      (stepSelected)="selection = $event"
    >
      {{ active }} content
    </ui-stepper>
  `,
})
class HostComponent {
  readonly steps = STEPS;
  active = 'plan';
  linear = false;
  orientation: 'horizontal' | 'vertical' = 'horizontal';
  selection: UiStepperSelection | null = null;
}

describe('UiStepperComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
  });

  it('renders a named ordered progress list and labelled active region', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const nav = fixture.nativeElement.querySelector('nav') as HTMLElement;
    const current = nav.querySelector('[aria-current="step"]') as HTMLElement;
    const panel = fixture.nativeElement.querySelector('[role="region"]') as HTMLElement;

    expect(nav.getAttribute('aria-label')).toBe('Onboarding progress');
    expect(nav.querySelectorAll('ol > li')).toHaveLength(4);
    expect(current.textContent).toContain('Plan');
    expect(panel.getAttribute('aria-labelledby')).toBe(current.id);
  });

  it('emits controlled active and rich selection changes', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const account = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    account.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.active).toBe('account');
    expect(fixture.componentInstance.selection).toEqual({ step: STEPS[0], index: 0 });
    expect(fixture.nativeElement.querySelector('[aria-current="step"]').textContent).toContain(
      'Account',
    );
  });

  it('prevents forward header navigation in linear mode while allowing backward navigation', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.linear = true;
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll(
      'button',
    ) as NodeListOf<HTMLButtonElement>;

    expect(buttons).toHaveLength(1);
    expect(buttons[0].textContent).toContain('Account');
    expect(fixture.nativeElement.textContent).toContain('Review');

    buttons[0].click();
    expect(fixture.componentInstance.active).toBe('account');
  });

  it('shows complete, current, upcoming, error, optional, and disabled states', () => {
    const fixture = TestBed.createComponent(UiStepperComponent);
    fixture.componentRef.setInput('steps', [
      STEPS[0],
      STEPS[1],
      { ...STEPS[2], error: true },
      STEPS[3],
    ]);
    fixture.componentRef.setInput('active', 'plan');
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('li') as NodeListOf<HTMLLIElement>;

    expect(Array.from(items, (item) => item.dataset['stepState'])).toEqual([
      'complete',
      'current',
      'error',
      'upcoming',
    ]);
    expect(items[2].textContent).toContain('Optional');
    expect(items[3].getAttribute('aria-disabled')).toBe('true');
  });

  it('supports vertical presentation and completed connectors', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.orientation = 'vertical';
    fixture.detectChanges();
    const list = fixture.nativeElement.querySelector('ol') as HTMLOListElement;
    const connector = fixture.nativeElement.querySelector('[data-step-connector]') as HTMLElement;

    expect(list.className).toContain('flex-col');
    expect(connector.className).toContain('w-px');
    expect(connector.className).toContain('bg-blue-700');
  });

  it('spans horizontal connectors between adjacent step markers', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const connector = fixture.nativeElement.querySelector('[data-step-connector]') as HTMLElement;

    expect(connector.className).toContain('left-[calc(50%+1.25rem)]');
    expect(connector.className).toContain('right-[calc(-50%+1.25rem)]');
  });

  it('falls back to the first enabled step and generates unique stable relationships', () => {
    const first = TestBed.createComponent(UiStepperComponent);
    const second = TestBed.createComponent(UiStepperComponent);
    first.componentRef.setInput('steps', STEPS);
    first.componentRef.setInput('active', 'missing');
    first.detectChanges();

    const current = first.nativeElement.querySelector('[aria-current="step"]') as HTMLElement;
    const panel = first.nativeElement.querySelector('[role="region"]') as HTMLElement;
    expect(current.textContent).toContain('Account');
    expect(current.id).toContain('-step-account');
    expect(panel.getAttribute('aria-labelledby')).toBe(current.id);
    expect(first.componentInstance.id).not.toBe(second.componentInstance.id);
  });
});
