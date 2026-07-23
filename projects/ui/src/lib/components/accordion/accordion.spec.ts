import { Component, signal } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import type { UiAccordionItem } from '../../../../accordion/src/accordion';
import { UiAccordionComponent } from '../../../../accordion/src/accordion';

@Component({
  standalone: true,
  imports: [UiAccordionComponent],
  template: `<ui-accordion
    [items]="items"
    [active]="active()"
    (activeChange)="active.set($event)"
  />`,
})
class HostComponent {
  readonly active = signal<readonly string[]>([]);
  readonly items: readonly UiAccordionItem[] = [
    { value: 'overview', title: 'Overview', content: 'Overview content' },
    { value: 'api', title: 'API', content: 'API content' },
    { value: 'disabled', title: 'Disabled', content: 'Unavailable', disabled: true },
  ];
}

describe('UiAccordionComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('emits activeChange when an item is toggled', () => {
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();

    expect(fixture.componentInstance.active()).toEqual(['overview']);
    expect(fixture.nativeElement.textContent).toContain('Overview content');
  });

  it('connects every trigger and region with unique generated instance IDs', () => {
    const firstButton = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    firstButton.click();
    fixture.detectChanges();

    const panel = fixture.nativeElement.querySelector('[role="region"]') as HTMLElement;
    const secondFixture = TestBed.createComponent(UiAccordionComponent);
    const firstComponent = fixture.debugElement.query(By.directive(UiAccordionComponent))
      .componentInstance as UiAccordionComponent;

    expect(firstButton.getAttribute('aria-controls')).toBe(panel.id);
    expect(panel.getAttribute('aria-labelledby')).toBe(firstButton.id);
    expect(firstComponent.id()).not.toBe(secondFixture.componentInstance.id());
    expect(firstButton.id).toMatch(/^ui-accordion-\d+-overview-button$/);
  });

  it('does not toggle disabled items', () => {
    const buttons = fixture.nativeElement.querySelectorAll(
      'button',
    ) as NodeListOf<HTMLButtonElement>;

    buttons[2].click();
    fixture.detectChanges();

    expect(buttons[2].disabled).toBe(true);
    expect(fixture.componentInstance.active()).toEqual([]);
    expect(fixture.nativeElement.textContent).not.toContain('Unavailable');
  });

  it('supports multiple controlled panels without mutating the active input', () => {
    const accordionFixture = TestBed.createComponent(UiAccordionComponent);
    const active = ['overview'] as const;
    let emitted: readonly string[] = [];
    accordionFixture.componentRef.setInput('items', fixture.componentInstance.items);
    accordionFixture.componentRef.setInput('active', active);
    accordionFixture.componentRef.setInput('multiple', true);
    accordionFixture.componentInstance.activeChange.subscribe((value) => {
      emitted = value;
    });
    accordionFixture.detectChanges();

    const buttons = accordionFixture.nativeElement.querySelectorAll(
      'button',
    ) as NodeListOf<HTMLButtonElement>;
    buttons[1].click();

    expect(emitted).toEqual(['overview', 'api']);
    expect(accordionFixture.componentInstance.active()).toBe(active);
  });

  it('emits a filtered copy when an expanded item closes', () => {
    const accordionFixture = TestBed.createComponent(UiAccordionComponent);
    const active = ['overview', 'api'] as const;
    let emitted: readonly string[] = [];
    accordionFixture.componentRef.setInput('items', fixture.componentInstance.items);
    accordionFixture.componentRef.setInput('active', active);
    accordionFixture.componentRef.setInput('multiple', true);
    accordionFixture.componentInstance.activeChange.subscribe((value) => {
      emitted = value;
    });
    accordionFixture.detectChanges();

    (accordionFixture.nativeElement.querySelector('button') as HTMLButtonElement).click();

    expect(emitted).toEqual(['api']);
    expect(emitted).not.toBe(active);
  });

  it('exposes a configurable clamped heading level', () => {
    const accordionFixture = TestBed.createComponent(UiAccordionComponent);
    accordionFixture.componentRef.setInput('items', fixture.componentInstance.items);
    accordionFixture.componentRef.setInput('headingLevel', 8);
    accordionFixture.detectChanges();

    const heading = accordionFixture.nativeElement.querySelector('[role="heading"]') as HTMLElement;
    expect(heading.getAttribute('aria-level')).toBe('6');

    accordionFixture.componentRef.setInput('headingLevel', 2);
    accordionFixture.detectChanges();
    expect(heading.getAttribute('aria-level')).toBe('2');
  });

  it('uses the shared decorative chevron contract for disclosure state', () => {
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const icon = button.querySelector('svg') as SVGElement;

    expect(button.textContent?.trim()).toBe('Overview');
    expect(icon.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(icon.getAttribute('stroke-width')).toBe('2');
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.getAttribute('focusable')).toBe('false');
    expect(icon.querySelector('path')?.getAttribute('d')).toBe('m6 9 6 6 6-6');
    expect(icon.classList.contains('rotate-180')).toBe(false);

    button.click();
    fixture.detectChanges();

    expect(icon.classList.contains('rotate-180')).toBe(true);
  });

  it('ships full-width, focus-visible, disabled, long-copy, and dark-mode classes', () => {
    const container = fixture.nativeElement.querySelector('ui-accordion > div') as HTMLDivElement;
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(container.className).toContain('dark:border-slate-800');
    expect(button.className).toContain('w-full');
    expect(button.className).toContain('focus-visible:ring-inset');
    expect(button.className).toContain('disabled:opacity-50');
    expect(button.className).toContain('dark:focus-visible:ring-blue-400');
  });
});
