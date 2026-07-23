import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

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

  it('reflects programmatic form values without emitting a user value change', () => {
    const component = fixture.debugElement.query(By.directive(UiSwitchComponent))
      .componentInstance as UiSwitchComponent;
    let emittedValue: boolean | null = null;
    component.valueChange.subscribe((value) => {
      emittedValue = value;
    });

    fixture.componentInstance.control.setValue(true);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    expect(input.checked).toBe(true);
    expect(emittedValue).toBeNull();
  });

  it('reflects the disabled state from Angular forms', () => {
    fixture.componentInstance.control.disable();
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    expect(input.disabled).toBe(true);

    fixture.componentInstance.control.enable();
    fixture.detectChanges();

    expect(input.disabled).toBe(false);
  });

  it('does not clear an explicitly disabled input when the form is enabled', () => {
    const switchFixture = TestBed.createComponent(UiSwitchComponent);
    switchFixture.componentRef.setInput('disabled', true);
    switchFixture.componentInstance.setDisabledState(false);
    switchFixture.detectChanges();

    const input = switchFixture.nativeElement.querySelector('input') as HTMLInputElement;

    expect(input.disabled).toBe(true);
    expect(switchFixture.componentInstance.disabled).toBe(true);
  });

  it('uses native switch semantics', () => {
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    expect(input.getAttribute('role')).toBe('switch');
    expect(input.type).toBe('checkbox');
    expect(input.closest('label')?.textContent).toContain('Notifications');
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

  it('connects helper text and forwards native attributes', () => {
    const switchFixture = TestBed.createComponent(UiSwitchComponent);
    switchFixture.componentRef.setInput('label', 'Notifications');
    switchFixture.componentRef.setInput('helperText', 'Send product updates');
    switchFixture.componentRef.setInput('name', 'notifications');
    switchFixture.componentRef.setInput('required', true);
    switchFixture.detectChanges();

    const input = switchFixture.nativeElement.querySelector('input') as HTMLInputElement;
    const helper = switchFixture.nativeElement.querySelector('[id$="-message"]') as HTMLSpanElement;

    expect(input.name).toBe('notifications');
    expect(input.required).toBe(true);
    expect(input.getAttribute('aria-describedby')).toBe(helper.id);
    expect(input.id).toMatch(/^ui-switch-\d+$/);
  });

  it('uses ariaLabel only when visible label text is absent', () => {
    const switchFixture = TestBed.createComponent(UiSwitchComponent);
    switchFixture.componentRef.setInput('ariaLabel', 'Enable notifications');
    switchFixture.detectChanges();

    const input = switchFixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('aria-label')).toBe('Enable notifications');

    switchFixture.componentRef.setInput('label', 'Notifications');
    switchFixture.detectChanges();

    expect(input.getAttribute('aria-label')).toBeNull();
  });

  it('marks the CVA touched and emits semantic focus and blur events', () => {
    const component = fixture.debugElement.query(By.directive(UiSwitchComponent))
      .componentInstance as UiSwitchComponent;
    const host = fixture.debugElement.query(By.directive(UiSwitchComponent)).nativeElement;
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

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new FocusEvent('focus'));
    input.dispatchEvent(new FocusEvent('blur'));

    expect(touched).toBe(true);
    expect(focused).toBe(true);
    expect(blurred).toBe(true);
    expect(hostFocused).toBe(true);
    expect(hostBlurred).toBe(true);
  });

  it('ships checked, disabled, focus-visible, and dark-mode visual contracts', () => {
    const track = fixture.nativeElement.querySelector('input + span') as HTMLSpanElement;

    expect(track.className).toContain('peer-checked:bg-blue-600');
    expect(track.className).toContain('peer-disabled:opacity-60');
    expect(track.className).toContain('peer-focus-visible:ring-2');
    expect(track.className).toContain('dark:peer-checked:bg-blue-500');
    expect(track.className).toContain('dark:peer-focus-visible:ring-blue-400');
  });
});
