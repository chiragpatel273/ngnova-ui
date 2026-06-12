import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { UiInputComponent } from './input';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, UiInputComponent],
  template: `<ui-input label="Email" helperText="Use work email" [formControl]="control" />`,
})
class HostComponent {
  control = new FormControl('hello@example.com');
}

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, UiInputComponent],
  template: `
    <ui-input
      label="Name"
      maxLength="10"
      clearable
      [formControl]="control"
      [validationMessages]="{ required: 'Name is required.' }"
    >
      <span uiInputPrefix>@</span>
      <span uiInputSuffix>.com</span>
    </ui-input>
  `,
})
class RichHostComponent {
  control = new FormControl('', { nonNullable: true, validators: [Validators.required] });
}

describe('UiInputComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent, RichHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('works as a ControlValueAccessor', () => {
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('hello@example.com');

    input.value = 'team@example.com';
    input.dispatchEvent(new Event('input'));

    expect(fixture.componentInstance.control.value).toBe('team@example.com');
  });

  it('keeps aria-describedby aligned with a custom input id', () => {
    const inputFixture = TestBed.createComponent(UiInputComponent);
    inputFixture.componentInstance.inputId = 'email-field';
    inputFixture.componentInstance.helperText = 'Use work email';
    inputFixture.detectChanges();

    const input = inputFixture.nativeElement.querySelector('input') as HTMLInputElement;
    const message = inputFixture.nativeElement.querySelector('p') as HTMLParagraphElement;

    expect(input.getAttribute('aria-describedby')).toBe('email-field-message');
    expect(message.id).toBe('email-field-message');
  });

  it('emits native-aligned focus and blur outputs', () => {
    const inputFixture = TestBed.createComponent(UiInputComponent);
    let focused = false;
    let blurred = false;
    inputFixture.componentInstance.focused.subscribe(() => {
      focused = true;
    });
    inputFixture.componentInstance.blurred.subscribe(() => {
      blurred = true;
    });
    inputFixture.detectChanges();

    const input = inputFixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new FocusEvent('focus'));
    input.dispatchEvent(new FocusEvent('blur'));

    expect(focused).toBe(true);
    expect(blurred).toBe(true);
  });

  it('projects prefix and suffix content', () => {
    const richFixture = TestBed.createComponent(RichHostComponent);
    richFixture.detectChanges();

    expect(richFixture.nativeElement.textContent).toContain('@');
    expect(richFixture.nativeElement.textContent).toContain('.com');
  });

  it('shows a counter and clears the value', () => {
    const richFixture = TestBed.createComponent(RichHostComponent);
    richFixture.componentInstance.control.setValue('alice');
    richFixture.detectChanges();

    expect(richFixture.nativeElement.textContent).toContain('5 / 10');

    richFixture.nativeElement.querySelector('button').click();
    richFixture.detectChanges();

    expect(richFixture.componentInstance.control.value).toBe('');
  });

  it('uses Angular validation state for error messages', () => {
    const richFixture = TestBed.createComponent(RichHostComponent);
    richFixture.componentInstance.control.markAsTouched();
    richFixture.detectChanges();

    const input = richFixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(richFixture.nativeElement.textContent).toContain('Name is required.');
  });
});
