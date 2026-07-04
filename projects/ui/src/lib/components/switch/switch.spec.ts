import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { UiSwitchComponent } from '../../../../switch/src/switch';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, UiSwitchComponent],
  template: `<ui-switch label="Notifications" helperText="Send updates" [formControl]="control" />`,
})
class HostComponent {
  control = new FormControl(false);
}

describe('UiSwitchComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('works as a ControlValueAccessor', () => {
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.checked).toBe(false);

    input.checked = true;
    input.dispatchEvent(new Event('change'));

    expect(fixture.componentInstance.control.value).toBe(true);
  });

  it('uses native switch semantics', () => {
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    expect(input.getAttribute('role')).toBe('switch');
  });

  it('emits value changes', () => {
    const switchFixture = TestBed.createComponent(UiSwitchComponent);
    let value: boolean | null = null;
    switchFixture.componentInstance.valueChange.subscribe((nextValue) => {
      value = nextValue;
    });
    switchFixture.detectChanges();

    const input = switchFixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event('change'));

    expect(value).toBe(true);
  });
});
