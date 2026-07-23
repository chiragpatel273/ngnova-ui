import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  UiFormFieldComponent,
  UiFormFieldControlDirective,
  UiFormFieldPrefixDirective,
  UiFormFieldSuffixDirective,
} from '../../../../form-field/src/form-field';

@Component({
  standalone: true,
  imports: [
    UiFormFieldComponent,
    UiFormFieldControlDirective,
    UiFormFieldPrefixDirective,
    UiFormFieldSuffixDirective,
  ],
  template: `
    <ui-form-field
      label="Work email"
      helperText="Use your company address."
      errorText="Enter a valid email."
      [invalid]="invalid"
      [required]="required"
      [disabled]="disabled"
      [size]="size"
      [appearance]="appearance"
    >
      <span uiFormFieldPrefix>@</span>
      <input
        uiFormFieldControl
        type="email"
        value="dev@example.com"
        aria-describedby="external-description"
      />
      <span uiFormFieldSuffix>.com</span>
    </ui-form-field>
  `,
})
class HostComponent {
  invalid = false;
  required = false;
  disabled = false;
  size: 'sm' | 'md' | 'lg' = 'md';
  appearance: 'filled' | 'outline' = 'outline';
}

describe('UiFormFieldComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
  });

  it('associates its label, helper, and projected control with stable IDs', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('label') as HTMLLabelElement;
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const helper = fixture.nativeElement.querySelector('p') as HTMLParagraphElement;

    expect(label.htmlFor).toBe(input.id);
    expect(input.id).toContain('ui-form-field-');
    expect(helper.id).toContain('-helper');
    expect(input.getAttribute('aria-describedby')?.split(' ')).toEqual([
      'external-description',
      helper.id,
    ]);
  });

  it('switches from helper to polite error messaging and updates control state', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.invalid = true;
    fixture.componentInstance.required = true;
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const message = fixture.nativeElement.querySelector('p') as HTMLParagraphElement;

    expect(message.textContent?.trim()).toBe('Enter a valid email.');
    expect(message.getAttribute('aria-live')).toBe('polite');
    expect(message.id).toContain('-error');
    expect(input.getAttribute('aria-describedby')).toContain(message.id);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-required')).toBe('true');
    expect(fixture.nativeElement.querySelector('label').textContent).toContain('*');
  });

  it('supports disabled presentation, sizes, appearances, and prefix/suffix slots', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.disabled = true;
    fixture.componentInstance.size = 'lg';
    fixture.componentInstance.appearance = 'filled';
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const frame = input.parentElement as HTMLElement;

    expect(input.getAttribute('aria-disabled')).toBe('true');
    expect(frame.className).toContain('min-h-12');
    expect(frame.className).toContain('bg-slate-100');
    expect(frame.className).toContain('opacity-60');
    expect(frame.textContent).toContain('@');
    expect(frame.textContent).toContain('.com');
  });

  it('honors a consumer control ID and supports visually hidden labels', () => {
    const fixture = TestBed.createComponent(UiFormFieldComponent);
    fixture.componentRef.setInput('label', 'Search');
    fixture.componentRef.setInput('hideLabel', true);
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label') as HTMLLabelElement;
    expect(label.className).toBe('sr-only');
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
  });

  it('allows the control directive to exist outside a form field', () => {
    @Component({
      standalone: true,
      imports: [UiFormFieldControlDirective],
      template: `<input uiFormFieldControl id="standalone-control" />`,
    })
    class StandaloneControlComponent {}

    const fixture = TestBed.createComponent(StandaloneControlComponent);
    expect(() => fixture.detectChanges()).not.toThrow();
    expect((fixture.nativeElement.querySelector('input') as HTMLInputElement).id).toBe(
      'standalone-control',
    );
  });

  it('generates unique field IDs', () => {
    const first = TestBed.createComponent(UiFormFieldComponent);
    const second = TestBed.createComponent(UiFormFieldComponent);
    expect(first.componentInstance.id).not.toBe(second.componentInstance.id);
  });
});
