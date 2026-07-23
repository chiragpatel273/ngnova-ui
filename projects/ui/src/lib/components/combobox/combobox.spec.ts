import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';

import { UiComboboxComponent } from '../../../../combobox/src/combobox';
import type { UiComboboxOption, UiComboboxSelection } from '../../../../combobox/src/combobox';

const OPTIONS: readonly UiComboboxOption[] = [
  { value: 'angular', label: 'Angular', description: 'Application framework' },
  { value: 'react', label: 'React', description: 'UI library', disabled: true },
  { value: 'vue', label: 'Vue', description: 'Progressive framework' },
];

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, UiComboboxComponent],
  template: `
    <ui-combobox
      label="Framework"
      placeholder="Choose a framework"
      helperText="Select one option."
      [options]="options"
      [formControl]="control"
      clearable
      (optionSelected)="selection = $event"
      (queryChange)="lastQuery = $event"
    />
  `,
})
class HostComponent {
  readonly options = OPTIONS;
  readonly control = new FormControl('angular');
  selection: UiComboboxSelection | null = null;
  lastQuery = '';
}

describe('UiComboboxComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
  });

  it('renders an accessible labelled combobox and selected display value', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const label = fixture.nativeElement.querySelector('label') as HTMLLabelElement;

    expect(label.htmlFor).toBe(input.id);
    expect(input.value).toBe('Angular');
    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('aria-autocomplete')).toBe('list');
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(input.getAttribute('aria-describedby')).toContain('-message');
  });

  it('filters options from user input and clears a prior selected value', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'vu';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const options = fixture.nativeElement.querySelectorAll(
      '[role="option"]',
    ) as NodeListOf<HTMLButtonElement>;

    expect(options).toHaveLength(1);
    expect(options[0].textContent).toContain('Vue');
    expect(fixture.componentInstance.control.value).toBe('');
    expect(fixture.componentInstance.lastQuery).toBe('vu');
  });

  it('uses active-descendant keyboard navigation, skips disabled options, and selects', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.focus();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();

    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(input.getAttribute('aria-activedescendant')).toContain('vue');

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.control.value).toBe('vue');
    expect(fixture.componentInstance.selection).toEqual({ option: OPTIONS[2], index: 2 });
    expect(input.value).toBe('Vue');
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });

  it('supports Home, End, wraparound, and Escape restoration', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.focus();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    fixture.detectChanges();
    expect(input.getAttribute('aria-activedescendant')).toContain('vue');

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();
    expect(input.getAttribute('aria-activedescendant')).toContain('angular');

    input.value = 'changed';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    expect(input.value).toBe('');
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });

  it('clears selection and integrates with disabled Angular form state', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const clear = fixture.nativeElement.querySelector(
      'button[aria-label="Clear selection"]',
    ) as HTMLButtonElement;
    clear.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.control.value).toBe('');

    fixture.componentInstance.control.disable();
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.disabled).toBe(true);
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });

  it('renders localized loading and empty states', () => {
    const fixture = TestBed.createComponent(UiComboboxComponent);
    fixture.componentRef.setInput('options', []);
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('loading', true);
    fixture.componentRef.setInput('loadingText', 'Fetching frameworks');
    fixture.detectChanges();
    let listbox = fixture.nativeElement.querySelector('[role="listbox"]') as HTMLElement;
    expect(listbox.getAttribute('aria-busy')).toBe('true');
    expect(listbox.textContent).toContain('Fetching frameworks');

    fixture.componentRef.setInput('loading', false);
    fixture.componentRef.setInput('noResultsText', 'Nothing matches');
    fixture.detectChanges();
    listbox = fixture.nativeElement.querySelector('[role="listbox"]') as HTMLElement;
    expect(listbox.querySelector('[role="status"]')?.textContent).toContain('Nothing matches');
  });
});
