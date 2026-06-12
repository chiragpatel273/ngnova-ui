import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { UiRadioGroupComponent } from './radio';
import type { UiRadioOption } from './radio';

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
});
