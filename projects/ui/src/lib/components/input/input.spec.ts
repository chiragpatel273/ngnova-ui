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

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, UiInputComponent],
  template: `
    <ui-input
      label="Password"
      type="password"
      labelMode="floating"
      counterMode="words"
      counterMax="3"
      intent="warning"
      revealable
      [formControl]="control"
      (submitted)="submittedValue = $event"
    />
  `,
})
class PremiumHostComponent {
  control = new FormControl('alpha beta gamma delta', { nonNullable: true });
  submittedValue = '';
}

describe('UiInputComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent, RichHostComponent, PremiumHostComponent],
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
    inputFixture.nativeElement.addEventListener('focus', () => {
      focused = true;
    });
    inputFixture.nativeElement.addEventListener('blur', () => {
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

  it('supports floating labels, warning intent, and word counters', () => {
    const premiumFixture = TestBed.createComponent(PremiumHostComponent);
    premiumFixture.detectChanges();

    const input = premiumFixture.nativeElement.querySelector('input') as HTMLInputElement;
    const label = premiumFixture.nativeElement.querySelector('label') as HTMLLabelElement;

    expect(input.type).toBe('password');
    expect(label.className).toContain('top-1');
    expect(premiumFixture.nativeElement.textContent).toContain('4 / 3');
    expect(premiumFixture.nativeElement.textContent).toContain('Show');
  });

  it('toggles password visibility and emits submitted value', () => {
    const premiumFixture = TestBed.createComponent(PremiumHostComponent);
    premiumFixture.detectChanges();

    const input = premiumFixture.nativeElement.querySelector('input') as HTMLInputElement;
    const button = premiumFixture.nativeElement.querySelector('button') as HTMLButtonElement;

    button.click();
    premiumFixture.detectChanges();

    expect(input.type).toBe('text');
    expect(button.getAttribute('aria-pressed')).toBe('true');

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    premiumFixture.detectChanges();

    expect(premiumFixture.componentInstance.submittedValue).toBe('alpha beta gamma delta');
  });
});
