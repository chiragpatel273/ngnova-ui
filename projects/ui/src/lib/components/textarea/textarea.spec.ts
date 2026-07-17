import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { UiTextareaComponent } from '../../../../textarea/src/textarea';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, UiTextareaComponent],
  template: `
    <ui-textarea
      label="Message"
      helperText="Keep it short"
      [maxLength]="20"
      [formControl]="control"
      (valueChange)="valueChanges.push($event)"
      (focused)="focusedEvents.push($event)"
      (blurred)="blurredEvents.push($event)"
    />
  `,
})
class HostComponent {
  control = new FormControl('Hello', { nonNullable: true, validators: Validators.required });
  valueChanges: string[] = [];
  focusedEvents: FocusEvent[] = [];
  blurredEvents: FocusEvent[] = [];
}
@Component({
  standalone: true,
  imports: [ReactiveFormsModule, UiTextareaComponent],
  template: `
    <ui-textarea
      label="Summary"
      [formControl]="control"
      [validationMessages]="validationMessages"
    />
  `,
})
class CustomValidationHostComponent {
  control = new FormControl('', { nonNullable: true, validators: Validators.required });
  validationMessages: Record<string, string> = { required: 'Write a summary before publishing.' };
}

@Component({
  standalone: true,
  imports: [UiTextareaComponent],
  template: `
    <ui-textarea
      inputId="audit-notes"
      name="auditNotes"
      ariaLabel="Audit notes"
      errorText="Resolve the blocking issue."
      [rows]="6"
      [minLength]="10"
      [maxLength]="40"
      readonly
      required
      hideCounter
    />
  `,
})
class NativeAttributesHostComponent {}

describe('UiTextareaComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('works as a ControlValueAccessor for user input', () => {
    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.value).toBe('Hello');

    textarea.value = 'Updated';
    textarea.dispatchEvent(new Event('input'));

    expect(fixture.componentInstance.control.value).toBe('Updated');
    expect(fixture.componentInstance.valueChanges).toEqual(['Updated']);
  });

  it('updates from reactive form writes without emitting valueChange', () => {
    fixture.componentInstance.control.setValue('Programmatic update');
    fixture.detectChanges();

    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;

    expect(textarea.value).toBe('Programmatic update');
    expect(fixture.componentInstance.valueChanges).toEqual([]);
  });

  it('keeps disabled state synced from the ControlValueAccessor API', () => {
    fixture.componentInstance.control.disable();
    fixture.detectChanges();

    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;

    expect(textarea.disabled).toBe(true);
  });

  it('marks the control touched on blur and emits focus events without native-name output collisions', () => {
    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;

    textarea.dispatchEvent(new FocusEvent('focus'));
    textarea.dispatchEvent(new FocusEvent('blur'));

    expect(fixture.componentInstance.control.touched).toBe(true);
    expect(fixture.componentInstance.focusedEvents.length).toBe(1);
    expect(fixture.componentInstance.blurredEvents.length).toBe(1);
  });

  it('connects helper text and counter with aria-describedby', () => {
    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    const descriptions = Array.from(
      fixture.nativeElement.querySelectorAll('p'),
    ) as HTMLParagraphElement[];

    expect(textarea.getAttribute('aria-describedby')).toBe(
      descriptions.map((description) => description.id).join(' '),
    );
    expect(descriptions[1].textContent?.trim()).toBe('5 / 20');
  });

  it('shows validation messages and aria-invalid after the control is touched', () => {
    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;

    expect(textarea.getAttribute('aria-invalid')).toBeNull();

    fixture.componentInstance.control.setValue('');
    fixture.componentInstance.control.markAsTouched();
    fixture.detectChanges();

    const message = fixture.nativeElement.querySelector('p') as HTMLParagraphElement;

    expect(textarea.getAttribute('aria-invalid')).toBe('true');
    expect(message.getAttribute('role')).toBe('alert');
    expect(message.textContent?.trim()).toBe('This field is required.');
  });

  it('supports custom validation messages', () => {
    const textareaFixture = TestBed.createComponent(CustomValidationHostComponent);
    textareaFixture.componentInstance.control.markAsTouched();
    textareaFixture.detectChanges();

    const textarea = textareaFixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    const message = textareaFixture.nativeElement.querySelector('p') as HTMLParagraphElement;

    expect(textarea.getAttribute('aria-invalid')).toBe('true');
    expect(message.getAttribute('role')).toBe('alert');
    expect(message.textContent?.trim()).toBe('Write a summary before publishing.');
  });

  it('passes through native textarea attributes and omits false ARIA states', () => {
    const textareaFixture = TestBed.createComponent(UiTextareaComponent);
    textareaFixture.componentRef.setInput('ariaLabel', 'Internal note');
    textareaFixture.componentRef.setInput('name', 'internal-note');
    textareaFixture.componentRef.setInput('minLength', 8);
    textareaFixture.componentRef.setInput('maxLength', 120);
    textareaFixture.componentRef.setInput('rows', 6);
    textareaFixture.componentRef.setInput('readonly', true);
    textareaFixture.detectChanges();

    const textarea = textareaFixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;

    expect(textarea.getAttribute('aria-label')).toBe('Internal note');
    expect(textarea.getAttribute('aria-required')).toBeNull();
    expect(textarea.getAttribute('aria-invalid')).toBeNull();
    expect(textarea.name).toBe('internal-note');
    expect(textarea.minLength).toBe(8);
    expect(textarea.maxLength).toBe(120);
    expect(textarea.rows).toBe(6);
    expect(textarea.readOnly).toBe(true);
  });

  it('hides the counter when requested while preserving helper text description', () => {
    const textareaFixture = TestBed.createComponent(UiTextareaComponent);
    textareaFixture.componentRef.setInput('helperText', 'Visible helper text.');
    textareaFixture.componentRef.setInput('maxLength', 120);
    textareaFixture.componentRef.setInput('hideCounter', true);
    textareaFixture.detectChanges();

    const textarea = textareaFixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    const descriptions = Array.from(
      textareaFixture.nativeElement.querySelectorAll('p'),
    ) as HTMLParagraphElement[];

    expect(descriptions.length).toBe(1);
    expect(descriptions[0].textContent?.trim()).toBe('Visible helper text.');
    expect(textarea.getAttribute('aria-describedby')).toBe(descriptions[0].id);
  });

  it('passes through native textarea attributes and can hide the counter', () => {
    const textareaFixture = TestBed.createComponent(NativeAttributesHostComponent);
    textareaFixture.detectChanges();

    const textarea = textareaFixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    const descriptions = textareaFixture.nativeElement.querySelectorAll('p');

    expect(textarea.id).toBe('audit-notes');
    expect(textarea.name).toBe('auditNotes');
    expect(textarea.getAttribute('aria-label')).toBe('Audit notes');
    expect(textarea.getAttribute('rows')).toBe('6');
    expect(textarea.getAttribute('minlength')).toBe('10');
    expect(textarea.getAttribute('maxlength')).toBe('40');
    expect(textarea.readOnly).toBe(true);
    expect(textarea.required).toBe(true);
    expect(textarea.getAttribute('aria-invalid')).toBe('true');
    expect(textarea.getAttribute('aria-describedby')).toBe('audit-notes-message');
    expect(descriptions.length).toBe(1);
    expect(descriptions[0].textContent?.trim()).toBe('Resolve the blocking issue.');
  });

  it('applies resize, appearance, size, and dark-mode ready classes', () => {
    const textareaFixture = TestBed.createComponent(UiTextareaComponent);
    textareaFixture.componentRef.setInput('resize', 'none');
    textareaFixture.componentRef.setInput('appearance', 'filled');
    textareaFixture.componentRef.setInput('size', 'lg');
    textareaFixture.detectChanges();

    const textarea = textareaFixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;

    expect(textarea.className).toContain('resize-none');
    expect(textarea.className).toContain('dark:bg-slate-900');
    expect(textarea.className).toContain('px-4');
    expect(textarea.className).toContain('py-2.5');
    expect(textarea.className).toContain('text-base');
  });
});
