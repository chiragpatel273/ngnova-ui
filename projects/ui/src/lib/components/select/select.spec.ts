import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { UiSelectComponent } from './select';
import type { UiSelectOption } from './select';

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
});
