import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { UiCheckboxComponent } from './checkbox';

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
    checkboxFixture.componentInstance.focused.subscribe(() => {
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
});
