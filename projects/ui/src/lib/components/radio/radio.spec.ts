import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { UiRadioGroupComponent } from '../../../../radio/src/radio';
import type { UiRadioOption } from '../../../../radio/src/radio';

const OPTIONS: readonly UiRadioOption[] = [
  { label: 'Email', value: 'email' },
  { label: 'SMS', value: 'sms', helperText: 'Carrier charges may apply.' },
  { label: 'Phone', value: 'phone', disabled: true },
];

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, UiRadioGroupComponent],
  template: `<ui-radio-group
    label="Contact"
    helperText="Choose one"
    [options]="options"
    [formControl]="control"
  />`,
})
class HostComponent {
  readonly options = OPTIONS;
  control = new FormControl('email');
}

describe('UiRadioGroupComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('works as a ControlValueAccessor', () => {
    const radios = fixture.nativeElement.querySelectorAll('input') as NodeListOf<HTMLInputElement>;
    expect(radios[0].checked).toBe(true);

    radios[1].checked = true;
    radios[1].dispatchEvent(new Event('change'));

    expect(fixture.componentInstance.control.value).toBe('sms');
  });

  it('reflects programmatic form values without emitting a user value change', () => {
    const component = fixture.debugElement.query(By.directive(UiRadioGroupComponent))
      .componentInstance as UiRadioGroupComponent;
    let emittedValue: string | null = null;
    component.valueChange.subscribe((value) => {
      emittedValue = value;
    });

    fixture.componentInstance.control.setValue('sms');
    fixture.detectChanges();

    const radios = fixture.nativeElement.querySelectorAll('input') as NodeListOf<HTMLInputElement>;

    expect(radios[1].checked).toBe(true);
    expect(emittedValue).toBeNull();
  });

  it('reflects the disabled state from Angular forms', () => {
    fixture.componentInstance.control.disable();
    fixture.detectChanges();

    const fieldset = fixture.nativeElement.querySelector('fieldset') as HTMLFieldSetElement;
    const radios = fixture.nativeElement.querySelectorAll('input') as NodeListOf<HTMLInputElement>;

    expect(fieldset.disabled).toBe(true);
    expect(Array.from(radios).every((radio) => radio.disabled)).toBe(true);

    fixture.componentInstance.control.enable();
    fixture.detectChanges();

    expect(fieldset.disabled).toBe(false);
    expect(radios[0].disabled).toBe(false);
    expect(radios[2].disabled).toBe(true);
  });

  it('does not clear an explicitly disabled input when the form is enabled', () => {
    const radioFixture = TestBed.createComponent(UiRadioGroupComponent);
    radioFixture.componentRef.setInput('options', OPTIONS);
    radioFixture.componentRef.setInput('disabled', true);
    radioFixture.componentInstance.setDisabledState(false);
    radioFixture.detectChanges();

    const fieldset = radioFixture.nativeElement.querySelector('fieldset') as HTMLFieldSetElement;

    expect(fieldset.disabled).toBe(true);
    expect(radioFixture.componentInstance.disabled).toBe(true);
  });

  it('does not select disabled options', () => {
    const radios = fixture.nativeElement.querySelectorAll('input') as NodeListOf<HTMLInputElement>;
    radios[2].checked = true;
    radios[2].dispatchEvent(new Event('change'));

    expect(fixture.componentInstance.control.value).toBe('email');
  });

  it('connects helper text with aria-describedby', () => {
    const fieldset = fixture.nativeElement.querySelector('fieldset') as HTMLFieldSetElement;
    const helper = fixture.nativeElement.querySelector('p') as HTMLParagraphElement;

    expect(fieldset.getAttribute('aria-describedby')).toBe(helper.id);
  });

  it('uses fieldset and legend semantics with one generated native name', () => {
    const fieldset = fixture.nativeElement.querySelector('fieldset') as HTMLFieldSetElement;
    const legend = fixture.nativeElement.querySelector('legend') as HTMLLegendElement;
    const radios = fixture.nativeElement.querySelectorAll('input') as NodeListOf<HTMLInputElement>;
    const names = new Set(Array.from(radios, (radio) => radio.name));

    expect(legend.textContent?.trim()).toBe('Contact');
    expect(names.size).toBe(1);
    expect([...names][0]).toMatch(/^ui-radio-group-\d+$/);
    expect(fieldset.getAttribute('aria-label')).toBeNull();
  });

  it('supports an accessible group label without a visible legend', () => {
    const radioFixture = TestBed.createComponent(UiRadioGroupComponent);
    radioFixture.componentRef.setInput('ariaLabel', 'Contact preference');
    radioFixture.componentRef.setInput('options', OPTIONS);
    radioFixture.detectChanges();

    const fieldset = radioFixture.nativeElement.querySelector('fieldset') as HTMLFieldSetElement;

    expect(radioFixture.nativeElement.querySelector('legend')).toBeNull();
    expect(fieldset.getAttribute('aria-label')).toBe('Contact preference');
  });

  it('forwards a custom name and required state to every native radio', () => {
    const radioFixture = TestBed.createComponent(UiRadioGroupComponent);
    radioFixture.componentRef.setInput('label', 'Contact');
    radioFixture.componentRef.setInput('name', 'contact-method');
    radioFixture.componentRef.setInput('required', true);
    radioFixture.componentRef.setInput('options', OPTIONS);
    radioFixture.detectChanges();

    const radios = radioFixture.nativeElement.querySelectorAll(
      'input',
    ) as NodeListOf<HTMLInputElement>;

    expect(Array.from(radios).every((radio) => radio.name === 'contact-method')).toBe(true);
    expect(Array.from(radios).every((radio) => radio.required)).toBe(true);
  });

  it('marks an error group invalid and associates its alert message', () => {
    const radioFixture = TestBed.createComponent(UiRadioGroupComponent);
    radioFixture.componentRef.setInput('label', 'Environment');
    radioFixture.componentRef.setInput('errorText', 'Choose an environment.');
    radioFixture.componentRef.setInput('options', OPTIONS);
    radioFixture.detectChanges();

    const fieldset = radioFixture.nativeElement.querySelector('fieldset') as HTMLFieldSetElement;
    const error = radioFixture.nativeElement.querySelector(
      '[role="alert"]',
    ) as HTMLParagraphElement;

    expect(fieldset.getAttribute('aria-invalid')).toBe('true');
    expect(fieldset.getAttribute('aria-describedby')).toBe(error.id);
  });

  it('marks the CVA touched and emits semantic focus and blur events', () => {
    const component = fixture.debugElement.query(By.directive(UiRadioGroupComponent))
      .componentInstance as UiRadioGroupComponent;
    let touched = false;
    let focused = false;
    let blurred = false;
    let hostFocused = false;
    let hostBlurred = false;
    component.registerOnTouched(() => {
      touched = true;
    });
    component.focused.subscribe(() => {
      focused = true;
    });
    component.blurred.subscribe(() => {
      blurred = true;
    });
    const host = fixture.debugElement.query(By.directive(UiRadioGroupComponent)).nativeElement;
    host.addEventListener('focus', () => {
      hostFocused = true;
    });
    host.addEventListener('blur', () => {
      hostBlurred = true;
    });

    const radio = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    radio.dispatchEvent(new FocusEvent('focus'));
    radio.dispatchEvent(new FocusEvent('blur'));

    expect(touched).toBe(true);
    expect(focused).toBe(true);
    expect(blurred).toBe(true);
    expect(hostFocused).toBe(true);
    expect(hostBlurred).toBe(true);
  });

  it('supports horizontal wrapping and the shared visual state contracts', () => {
    const radioFixture = TestBed.createComponent(UiRadioGroupComponent);
    radioFixture.componentRef.setInput('orientation', 'horizontal');
    radioFixture.componentRef.setInput('options', OPTIONS);
    radioFixture.detectChanges();

    const group = radioFixture.nativeElement.querySelector('fieldset > div') as HTMLDivElement;
    const radio = radioFixture.nativeElement.querySelector('input') as HTMLInputElement;

    expect(group.className).toContain('flex-row');
    expect(group.className).toContain('flex-wrap');
    expect(radio.className).toContain('focus-visible:ring-2');
    expect(radio.className).toContain('dark:focus-visible:ring-blue-400');
    expect(radio.className).toContain('dark:bg-slate-950');
  });
});
