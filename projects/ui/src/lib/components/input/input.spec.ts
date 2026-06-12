import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { UiInputComponent } from './input';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, UiInputComponent],
  template: `<ui-input label="Email" helperText="Use work email" [formControl]="control" />`,
})
class HostComponent {
  control = new FormControl('hello@example.com');
}

describe('UiInputComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
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
});
