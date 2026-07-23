import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { UiSelectComponent } from '../../../../select/src/select';
import type { UiSelectOption } from '../../../../select/src/select';

const OPTIONS: readonly UiSelectOption[] = [
  { label: 'Starter', value: 'starter' },
  { label: 'Pro', value: 'pro' },
  { label: 'Enterprise', value: 'enterprise', disabled: true },
];

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, UiSelectComponent],
  template: `<ui-select label="Plan" [options]="options" [formControl]="control" />`,
})
class HostComponent {
  readonly options = OPTIONS;
  control = new FormControl('pro');
}

describe('UiSelectComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('works as a ControlValueAccessor', () => {
    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    expect(select.value).toBe('pro');

    select.value = 'starter';
    select.dispatchEvent(new Event('change'));

    expect(fixture.componentInstance.control.value).toBe('starter');
  });

  it('reflects programmatic form values without emitting a user value change', () => {
    const component = fixture.debugElement.query(By.directive(UiSelectComponent))
      .componentInstance as UiSelectComponent;
    let emittedValue: string | null = null;
    component.valueChange.subscribe((value) => {
      emittedValue = value;
    });

    fixture.componentInstance.control.setValue('starter');
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;

    expect(select.value).toBe('starter');
    expect(emittedValue).toBeNull();
  });

  it('reflects the disabled state from Angular forms', () => {
    fixture.componentInstance.control.disable();
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;

    expect(select.disabled).toBe(true);

    fixture.componentInstance.control.enable();
    fixture.detectChanges();

    expect(select.disabled).toBe(false);
  });

  it('does not clear an explicitly disabled input when the form is enabled', () => {
    const selectFixture = TestBed.createComponent(UiSelectComponent);
    selectFixture.componentRef.setInput('disabled', true);
    selectFixture.componentInstance.setDisabledState(false);
    selectFixture.detectChanges();

    const select = selectFixture.nativeElement.querySelector('select') as HTMLSelectElement;

    expect(select.disabled).toBe(true);
    expect(selectFixture.componentInstance.disabled).toBe(true);
  });

  it('renders disabled options', () => {
    const options = fixture.nativeElement.querySelectorAll(
      'option',
    ) as NodeListOf<HTMLOptionElement>;

    expect(options[2].disabled).toBe(true);
  });

  it('emits value changes', () => {
    const selectFixture = TestBed.createComponent(UiSelectComponent);
    let value = '';
    selectFixture.componentInstance.options = OPTIONS;
    selectFixture.componentInstance.valueChange.subscribe((nextValue) => {
      value = nextValue;
    });
    selectFixture.detectChanges();

    const select = selectFixture.nativeElement.querySelector('select') as HTMLSelectElement;
    select.value = 'pro';
    select.dispatchEvent(new Event('change'));

    expect(value).toBe('pro');
  });

  it('renders placeholder rules for optional and required fields', () => {
    const selectFixture = TestBed.createComponent(UiSelectComponent);
    selectFixture.componentRef.setInput('placeholder', 'Choose a plan');
    selectFixture.componentRef.setInput('options', OPTIONS);
    selectFixture.detectChanges();

    const select = selectFixture.nativeElement.querySelector('select') as HTMLSelectElement;
    const placeholder = select.options[0];

    expect(placeholder.value).toBe('');
    expect(placeholder.disabled).toBe(false);
    expect(select.value).toBe('');

    selectFixture.componentRef.setInput('required', true);
    selectFixture.detectChanges();

    expect(placeholder.disabled).toBe(true);
    expect(select.required).toBe(true);
  });

  it('uses visible labels or ariaLabel without conflicting accessible names', () => {
    const selectFixture = TestBed.createComponent(UiSelectComponent);
    selectFixture.componentRef.setInput('ariaLabel', 'Choose a plan');
    selectFixture.componentRef.setInput('options', OPTIONS);
    selectFixture.detectChanges();

    const select = selectFixture.nativeElement.querySelector('select') as HTMLSelectElement;
    expect(select.getAttribute('aria-label')).toBe('Choose a plan');

    selectFixture.componentRef.setInput('label', 'Plan');
    selectFixture.detectChanges();

    expect(select.getAttribute('aria-label')).toBeNull();
    expect(select.closest('label')?.textContent).toContain('Plan');
  });

  it('connects helper and error messages with accurate validation ARIA', () => {
    const selectFixture = TestBed.createComponent(UiSelectComponent);
    selectFixture.componentRef.setInput('label', 'Plan');
    selectFixture.componentRef.setInput('helperText', 'Choose the billing plan.');
    selectFixture.componentRef.setInput('options', OPTIONS);
    selectFixture.detectChanges();

    const select = selectFixture.nativeElement.querySelector('select') as HTMLSelectElement;
    let message = selectFixture.nativeElement.querySelector('p') as HTMLParagraphElement;

    expect(select.getAttribute('aria-describedby')).toBe(message.id);
    expect(select.getAttribute('aria-invalid')).toBeNull();

    selectFixture.componentRef.setInput('errorText', 'Choose a valid plan.');
    selectFixture.detectChanges();
    message = selectFixture.nativeElement.querySelector('[role="alert"]') as HTMLParagraphElement;

    expect(select.getAttribute('aria-describedby')).toBe(message.id);
    expect(select.getAttribute('aria-invalid')).toBe('true');
  });

  it('forwards native name and generated ID', () => {
    const selectFixture = TestBed.createComponent(UiSelectComponent);
    selectFixture.componentRef.setInput('name', 'plan');
    selectFixture.detectChanges();

    const select = selectFixture.nativeElement.querySelector('select') as HTMLSelectElement;

    expect(select.name).toBe('plan');
    expect(select.id).toMatch(/^ui-select-\d+$/);
  });

  it('renders all sizes with a visible decorative chevron', () => {
    const selectFixture = TestBed.createComponent(UiSelectComponent);
    selectFixture.detectChanges();

    const select = selectFixture.nativeElement.querySelector('select') as HTMLSelectElement;
    const chevron = selectFixture.nativeElement.querySelector('svg') as SVGElement;

    expect(select.className).toContain('h-[var(--ui-control-height-md,2.5rem)]');
    expect(select.className).toContain('text-sm');
    expect(chevron.getAttribute('aria-hidden')).toBe('true');
    expect(chevron.querySelector('path')?.getAttribute('d')).toBe('m6 8 4 4 4-4');

    selectFixture.componentRef.setInput('size', 'sm');
    selectFixture.detectChanges();
    expect(select.className).toContain('h-[var(--ui-control-height-sm,2rem)]');

    selectFixture.componentRef.setInput('size', 'lg');
    selectFixture.detectChanges();
    expect(select.className).toContain('h-[var(--ui-control-height-lg,3rem)]');
    expect(select.className).toContain('text-base');
  });

  it('marks the CVA touched and emits semantic focus and blur events', () => {
    const component = fixture.debugElement.query(By.directive(UiSelectComponent))
      .componentInstance as UiSelectComponent;
    const host = fixture.debugElement.query(By.directive(UiSelectComponent)).nativeElement;
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
    host.addEventListener('focus', () => {
      hostFocused = true;
    });
    host.addEventListener('blur', () => {
      hostBlurred = true;
    });

    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    select.dispatchEvent(new FocusEvent('focus'));
    select.dispatchEvent(new FocusEvent('blur'));

    expect(touched).toBe(true);
    expect(focused).toBe(true);
    expect(blurred).toBe(true);
    expect(hostFocused).toBe(true);
    expect(hostBlurred).toBe(true);
  });

  it('ships focus-visible, disabled, error, and dark-mode visual contracts', () => {
    const selectFixture = TestBed.createComponent(UiSelectComponent);
    selectFixture.componentRef.setInput('errorText', 'Required');
    selectFixture.detectChanges();

    const select = selectFixture.nativeElement.querySelector('select') as HTMLSelectElement;

    expect(select.className).toContain('focus-visible:ring-2');
    expect(select.className).toContain('disabled:bg-slate-100');
    expect(select.className).toContain('border-red-500');
    expect(select.className).toContain('dark:bg-slate-950');
    expect(select.className).toContain('dark:focus-visible:ring-blue-400');
  });
});
