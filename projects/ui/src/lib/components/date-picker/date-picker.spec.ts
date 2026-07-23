import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';

import { UiDatePickerComponent } from '../../../../date-picker/src/date-picker';
import type { UiDatePickerSelection } from '../../../../date-picker/src/date-picker';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, UiDatePickerComponent],
  template: `
    <ui-date-picker
      label="Release date"
      helperText="Choose the publication date."
      [formControl]="control"
      min="2026-06-10"
      max="2026-07-10"
      [disabledDates]="['2026-06-18']"
      startAt="2026-06-01"
      clearable
      (dateSelected)="selection = $event"
    />
  `,
})
class HostComponent {
  readonly control = new FormControl('2026-06-15');
  selection: UiDatePickerSelection | null = null;
}

describe('UiDatePickerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
  });

  it('renders a labelled readonly dialog trigger with localized selected value', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const label = fixture.nativeElement.querySelector('label') as HTMLLabelElement;

    expect(label.htmlFor).toBe(input.id);
    expect(input.readOnly).toBe(true);
    expect(input.value).toBe('Jun 15, 2026');
    expect(input.getAttribute('aria-haspopup')).toBe('dialog');
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(input.getAttribute('aria-describedby')).toContain('-message');
  });

  it('opens a named calendar grid with weekdays and a stable 42-day layout', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.click();
    fixture.detectChanges();
    await fixture.whenStable();
    const dialog = fixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement;

    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(input.getAttribute('aria-controls')).toBe(dialog.id);
    expect(dialog.getAttribute('aria-label')).toBe('Choose date');
    expect(dialog.querySelector('h2')?.textContent?.trim()).toBe('June 2026');
    expect(dialog.querySelectorAll('[role="columnheader"]')).toHaveLength(7);
    expect(dialog.querySelectorAll('[role="gridcell"]')).toHaveLength(42);
    expect(document.activeElement?.getAttribute('data-date')).toBe('2026-06-15');
  });

  it('selects an enabled date and writes the ISO value through Angular Forms', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('input') as HTMLInputElement).click();
    fixture.detectChanges();
    const date = fixture.nativeElement.querySelector(
      '[data-date="2026-06-20"]',
    ) as HTMLButtonElement;
    date.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.control.value).toBe('2026-06-20');
    expect(fixture.componentInstance.selection?.value).toBe('2026-06-20');
    expect(fixture.componentInstance.selection?.date).toBeInstanceOf(Date);
    expect(fixture.nativeElement.querySelector('input').value).toBe('Jun 20, 2026');
    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();
  });

  it('enforces min, max, and explicitly disabled dates', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('input') as HTMLInputElement).click();
    fixture.detectChanges();

    expect(
      (fixture.nativeElement.querySelector('[data-date="2026-06-09"]') as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    expect(
      (fixture.nativeElement.querySelector('[data-date="2026-06-18"]') as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    const next = fixture.nativeElement.querySelector(
      'button[aria-label="Next month"]',
    ) as HTMLButtonElement;
    next.click();
    fixture.detectChanges();
    expect(
      (fixture.nativeElement.querySelector('[data-date="2026-07-11"]') as HTMLButtonElement)
        .disabled,
    ).toBe(true);
  });

  it('supports arrow navigation, skips disabled dates, and selects with Enter', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.click();
    fixture.detectChanges();
    await fixture.whenStable();
    let active = document.activeElement as HTMLButtonElement;
    active.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    active = document.activeElement as HTMLButtonElement;
    expect(active.dataset['date']).toBe('2026-06-16');

    active.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    active = document.activeElement as HTMLButtonElement;
    expect(active.dataset['date']).toBe('2026-06-17');

    active.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    active = document.activeElement as HTMLButtonElement;
    expect(active.dataset['date']).toBe('2026-06-19');

    active.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.control.value).toBe('2026-06-19');
  });

  it('clears values and follows Angular Forms disabled state', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const clear = fixture.nativeElement.querySelector(
      'button[aria-label="Clear date"]',
    ) as HTMLButtonElement;
    clear.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.control.value).toBe('');
    expect(fixture.nativeElement.querySelector('input').value).toBe('');

    fixture.componentInstance.control.disable();
    fixture.detectChanges();
    expect((fixture.nativeElement.querySelector('input') as HTMLInputElement).disabled).toBe(true);
  });

  it('supports localized weekday order and hides outside days without changing grid shape', () => {
    const fixture = TestBed.createComponent(UiDatePickerComponent);
    fixture.componentRef.setInput('locale', 'en-GB');
    fixture.componentRef.setInput('startAt', '2026-06-01');
    fixture.componentRef.setInput('firstDayOfWeek', 1);
    fixture.componentRef.setInput('showOutsideDays', false);
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    const headers = fixture.nativeElement.querySelectorAll(
      '[role="columnheader"]',
    ) as NodeListOf<HTMLElement>;
    expect(headers[0].getAttribute('aria-label')).toBe('Monday');
    expect(fixture.nativeElement.querySelectorAll('[role="gridcell"]')).toHaveLength(42);
    expect(fixture.nativeElement.querySelectorAll('[data-date]').length).toBeLessThan(42);
  });
});
