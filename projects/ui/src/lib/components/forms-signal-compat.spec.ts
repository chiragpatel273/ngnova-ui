import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { debounce, disabled, form, FormField, required } from '@angular/forms/signals';

import { UiCheckboxComponent } from '../../../checkbox/src/checkbox';
import { UiComboboxComponent } from '../../../combobox/src/combobox';
import type { UiComboboxOption } from '../../../combobox/src/combobox';
import { UiDatePickerComponent } from '../../../date-picker/src/date-picker';
import { UiInputComponent } from '../../../input/src/input';
import { UiRadioGroupComponent } from '../../../radio/src/radio';
import type { UiRadioOption } from '../../../radio/src/radio';
import { UiSelectComponent } from '../../../select/src/select';
import type { UiSelectOption } from '../../../select/src/select';
import { UiSwitchComponent } from '../../../switch/src/switch';
import { UiTextareaComponent } from '../../../textarea/src/textarea';

const PLAN_OPTIONS: readonly UiSelectOption[] = [
  { label: 'Starter', value: 'starter' },
  { label: 'Pro', value: 'pro' },
];

const FRAMEWORK_OPTIONS: readonly UiComboboxOption[] = [
  { label: 'Angular', value: 'angular' },
  { label: 'Vue', value: 'vue' },
];

const CADENCE_OPTIONS: readonly UiRadioOption[] = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Annual', value: 'annual' },
];

@Component({
  standalone: true,
  imports: [
    FormField,
    UiCheckboxComponent,
    UiComboboxComponent,
    UiDatePickerComponent,
    UiInputComponent,
    UiRadioGroupComponent,
    UiSelectComponent,
    UiSwitchComponent,
    UiTextareaComponent,
  ],
  template: `
    <ui-input label="Email" [validationMessages]="validationMessages" [formField]="fields.email" />
    <ui-textarea label="Notes" [formField]="fields.notes" />
    <ui-checkbox label="Accept terms" [formField]="fields.acceptTerms" />
    <ui-switch label="Notifications" [formField]="fields.notifications" />
    <ui-switch label="Managed setting" [formField]="fields.lockedSetting" />
    <ui-radio-group
      label="Billing cadence"
      [options]="cadenceOptions"
      [formField]="fields.cadence"
    />
    <ui-select label="Plan" [options]="planOptions" [formField]="fields.plan" />
    <ui-combobox label="Framework" [options]="frameworkOptions" [formField]="fields.framework" />
    <ui-date-picker label="Release date" startAt="2026-08-01" [formField]="fields.releaseDate" />
  `,
})
class SignalFormsHostComponent {
  readonly planOptions = PLAN_OPTIONS;
  readonly frameworkOptions = FRAMEWORK_OPTIONS;
  readonly cadenceOptions = CADENCE_OPTIONS;
  readonly validationMessages = { required: 'Email is required.' };
  readonly model = signal({
    email: 'team@ngnova.dev',
    notes: 'Initial notes',
    acceptTerms: true,
    notifications: false,
    lockedSetting: false,
    cadence: 'annual',
    plan: 'pro',
    framework: 'angular',
    releaseDate: '2026-08-25',
  });
  readonly fields = form(this.model, (path) => {
    required(path.email, { message: 'Email is required.' });
    required(path.releaseDate);
    disabled(path.lockedSetting, { when: 'Managed by organization' });
    debounce(path.email, 'blur');
  });
}

describe('NgNova Signal Forms compatibility', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalFormsHostComponent],
    }).compileComponents();
  });

  it('renders values from an Angular Signal Forms model across the form-control suite', () => {
    const fixture = TestBed.createComponent(SignalFormsHostComponent);
    fixture.detectChanges();

    expect((fixture.nativeElement.querySelector('ui-input input') as HTMLInputElement).value).toBe(
      'team@ngnova.dev',
    );
    expect(
      (fixture.nativeElement.querySelector('ui-textarea textarea') as HTMLTextAreaElement).value,
    ).toBe('Initial notes');
    expect(
      (fixture.nativeElement.querySelector('ui-checkbox input') as HTMLInputElement).checked,
    ).toBe(true);
    expect(
      (fixture.nativeElement.querySelector('ui-switch input') as HTMLInputElement).checked,
    ).toBe(false);
    expect(
      (fixture.nativeElement.querySelectorAll('ui-switch input')[1] as HTMLInputElement).disabled,
    ).toBe(true);
    expect(fixture.componentInstance.fields.lockedSetting().disabled()).toBe(true);
    expect(
      (
        fixture.nativeElement.querySelector(
          'ui-radio-group input[value="annual"]',
        ) as HTMLInputElement
      ).checked,
    ).toBe(true);
    expect(
      (fixture.nativeElement.querySelector('ui-select select') as HTMLSelectElement).value,
    ).toBe('pro');
    expect(
      (fixture.nativeElement.querySelector('ui-combobox input') as HTMLInputElement).value,
    ).toBe('Angular');
    expect(
      (fixture.nativeElement.querySelector('ui-date-picker input') as HTMLInputElement).value,
    ).toBe('Aug 25, 2026');
  });

  it('writes user changes back to the Signal Forms model', () => {
    const fixture = TestBed.createComponent(SignalFormsHostComponent);
    fixture.detectChanges();

    const textarea = fixture.nativeElement.querySelector(
      'ui-textarea textarea',
    ) as HTMLTextAreaElement;
    textarea.value = 'Updated notes';
    textarea.dispatchEvent(new Event('input'));

    const checkbox = fixture.nativeElement.querySelector('ui-checkbox input') as HTMLInputElement;
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change'));

    const switchControl = fixture.nativeElement.querySelector(
      'ui-switch input',
    ) as HTMLInputElement;
    switchControl.checked = true;
    switchControl.dispatchEvent(new Event('change'));

    const radio = fixture.nativeElement.querySelector(
      'ui-radio-group input[value="monthly"]',
    ) as HTMLInputElement;
    radio.checked = true;
    radio.dispatchEvent(new Event('change'));

    const select = fixture.nativeElement.querySelector('ui-select select') as HTMLSelectElement;
    select.value = 'starter';
    select.dispatchEvent(new Event('change'));

    const combobox = fixture.nativeElement.querySelector('ui-combobox input') as HTMLInputElement;
    combobox.dispatchEvent(new FocusEvent('focus'));
    combobox.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    combobox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    const dateInput = fixture.nativeElement.querySelector(
      'ui-date-picker input',
    ) as HTMLInputElement;
    dateInput.click();
    fixture.detectChanges();
    (
      fixture.nativeElement.querySelector(
        'ui-date-picker [data-date="2026-08-27"]',
      ) as HTMLButtonElement
    ).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.model()).toEqual({
      email: 'team@ngnova.dev',
      notes: 'Updated notes',
      acceptTerms: false,
      notifications: true,
      lockedSetting: false,
      cadence: 'monthly',
      plan: 'starter',
      framework: 'vue',
      releaseDate: '2026-08-27',
    });
  });

  it('supports blur debouncing, touched state, and validation messages', () => {
    const fixture = TestBed.createComponent(SignalFormsHostComponent);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('ui-input input') as HTMLInputElement;

    input.value = '';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.model().email).toBe('team@ngnova.dev');
    expect(fixture.componentInstance.fields.email().touched()).toBe(false);

    input.dispatchEvent(new FocusEvent('blur'));
    fixture.detectChanges();

    expect(fixture.componentInstance.model().email).toBe('');
    expect(fixture.componentInstance.fields.email().touched()).toBe(true);
    expect(fixture.componentInstance.fields.email().invalid()).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(fixture.nativeElement.textContent).toContain('Email is required.');
  });
});
