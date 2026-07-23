import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { UiCheckboxComponent } from '../../../../checkbox/src/checkbox';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, UiCheckboxComponent],
  template: `<ui-checkbox
    label="Email updates"
    helperText="Product news"
    [formControl]="control"
  />`,
})
class HostComponent {
  control = new FormControl(true);
}

describe('UiCheckboxComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('works as a ControlValueAccessor', () => {
    const checkbox = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);

    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change'));

    expect(fixture.componentInstance.control.value).toBe(false);
  });

  it('reflects programmatic form values without emitting a user value change', () => {
    const component = fixture.debugElement.query(By.directive(UiCheckboxComponent))
      .componentInstance as UiCheckboxComponent;
    let emittedValue: boolean | null = null;
    component.valueChange.subscribe((value) => {
      emittedValue = value;
    });
    fixture.componentInstance.control.setValue(false);
    fixture.detectChanges();

    const checkbox = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    expect(checkbox.checked).toBe(false);
    expect(emittedValue).toBeNull();
  });

  it('reflects the disabled state from Angular forms', () => {
    fixture.componentInstance.control.disable();
    fixture.detectChanges();

    const checkbox = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    expect(checkbox.disabled).toBe(true);

    fixture.componentInstance.control.enable();
    fixture.detectChanges();

    expect(checkbox.disabled).toBe(false);
  });

  it('does not clear an explicitly disabled input when the form is enabled', () => {
    const checkboxFixture = TestBed.createComponent(UiCheckboxComponent);
    checkboxFixture.componentRef.setInput('disabled', true);
    checkboxFixture.componentInstance.setDisabledState(false);
    checkboxFixture.detectChanges();

    const checkbox = checkboxFixture.nativeElement.querySelector('input') as HTMLInputElement;

    expect(checkbox.disabled).toBe(true);
    expect(checkboxFixture.componentInstance.disabled).toBe(true);
  });

  it('keeps helper text connected with aria-describedby', () => {
    const checkbox = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const helper = fixture.nativeElement.querySelector('p') as HTMLParagraphElement;

    expect(checkbox.getAttribute('aria-describedby')).toBe(helper.id);
  });

  it('emits value and focus outputs', () => {
    const checkboxFixture = TestBed.createComponent(UiCheckboxComponent);
    let value: boolean | null = null;
    let focused = false;
    checkboxFixture.componentInstance.valueChange.subscribe((nextValue) => {
      value = nextValue;
    });
    checkboxFixture.nativeElement.addEventListener('focus', () => {
      focused = true;
    });
    checkboxFixture.detectChanges();

    const checkbox = checkboxFixture.nativeElement.querySelector('input') as HTMLInputElement;
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));
    checkbox.dispatchEvent(new FocusEvent('focus'));

    expect(value).toBe(true);
    expect(focused).toBe(true);
  });

  it('clears internal mixed state without mutating the indeterminate input', () => {
    const checkboxFixture = TestBed.createComponent(UiCheckboxComponent);
    let indeterminate: boolean | null = null;
    checkboxFixture.componentRef.setInput('indeterminate', true);
    checkboxFixture.componentInstance.indeterminateChange.subscribe((nextValue) => {
      indeterminate = nextValue;
    });
    checkboxFixture.detectChanges();

    const checkbox = checkboxFixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);

    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));
    checkboxFixture.detectChanges();

    expect(indeterminate).toBe(false);
    expect(checkboxFixture.componentInstance.indeterminate).toBe(true);
    expect(checkbox.indeterminate).toBe(false);
  });

  it('forwards native name, required, and accessible label attributes', () => {
    const checkboxFixture = TestBed.createComponent(UiCheckboxComponent);
    checkboxFixture.componentRef.setInput('name', 'terms');
    checkboxFixture.componentRef.setInput('required', true);
    checkboxFixture.componentRef.setInput('ariaLabel', 'Accept the terms');
    checkboxFixture.detectChanges();

    const checkbox = checkboxFixture.nativeElement.querySelector('input') as HTMLInputElement;

    expect(checkbox.name).toBe('terms');
    expect(checkbox.required).toBe(true);
    expect(checkbox.getAttribute('aria-label')).toBe('Accept the terms');
  });

  it('connects the visible label to the generated native input ID', () => {
    const checkboxFixture = TestBed.createComponent(UiCheckboxComponent);
    checkboxFixture.componentRef.setInput('label', 'Accept terms');
    checkboxFixture.detectChanges();

    const checkbox = checkboxFixture.nativeElement.querySelector('input') as HTMLInputElement;
    const label = checkboxFixture.nativeElement.querySelector('label') as HTMLLabelElement;

    expect(checkbox.id).toMatch(/^ui-checkbox-\d+$/);
    expect(label.htmlFor).toBe(checkbox.id);
  });

  it('marks the CVA touched and emits semantic blur when focus leaves', () => {
    const checkboxFixture = TestBed.createComponent(UiCheckboxComponent);
    let touched = false;
    let blurred = false;
    let hostBlurred = false;
    checkboxFixture.componentInstance.registerOnTouched(() => {
      touched = true;
    });
    checkboxFixture.componentInstance.blurred.subscribe(() => {
      blurred = true;
    });
    checkboxFixture.nativeElement.addEventListener('blur', () => {
      hostBlurred = true;
    });
    checkboxFixture.detectChanges();

    const checkbox = checkboxFixture.nativeElement.querySelector('input') as HTMLInputElement;
    checkbox.dispatchEvent(new FocusEvent('blur'));

    expect(touched).toBe(true);
    expect(blurred).toBe(true);
    expect(hostBlurred).toBe(true);
  });

  it('ships the common focus-visible and dark-mode visual contracts', () => {
    const checkboxFixture = TestBed.createComponent(UiCheckboxComponent);
    checkboxFixture.detectChanges();

    const checkbox = checkboxFixture.nativeElement.querySelector('input') as HTMLInputElement;

    expect(checkbox.className).toContain('focus-visible:ring-2');
    expect(checkbox.className).toContain('dark:focus-visible:ring-blue-400');
    expect(checkbox.className).toContain('dark:bg-slate-950');
    expect(checkbox.className).toContain('disabled:opacity-60');
  });
});
