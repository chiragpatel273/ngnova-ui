import {
  ChangeDetectionStrategy,
  booleanAttribute,
  Component,
  forwardRef,
  Input,
  output,
} from '@angular/core';
import type { ControlValueAccessor } from '@angular/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { uiClassNames } from '../../shared/class-names';

let nextSwitchId = 0;

@Component({
  selector: 'ui-switch',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiSwitchComponent),
      multi: true,
    },
  ],
  template: `
    <label [class]="labelClasses">
      <span class="min-w-0 flex-1">
        @if (label) {
          <span class="block text-sm font-medium text-slate-800 dark:text-slate-100">
            {{ label }}
          </span>
        }
        @if (helperText) {
          <span [id]="messageId" class="mt-1 block text-sm text-slate-500 dark:text-slate-400">
            {{ helperText }}
          </span>
        }
      </span>

      <span class="relative inline-flex">
        <input
          [id]="inputId"
          type="checkbox"
          class="peer sr-only"
          role="switch"
          [attr.name]="name || null"
          [checked]="checked"
          [disabled]="disabled"
          [required]="required"
          [attr.aria-label]="ariaLabel || null"
          [attr.aria-describedby]="descriptionId"
          (change)="onChangeEvent($event)"
          (focus)="focused.emit($event)"
          (blur)="markTouched($event)"
        />
        <span
          class="h-6 w-11 rounded-full bg-slate-300 transition-colors peer-checked:bg-blue-600 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 peer-disabled:opacity-60 dark:bg-slate-700 dark:peer-checked:bg-blue-500"
          aria-hidden="true"
        ></span>
        <span
          class="absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5"
          aria-hidden="true"
        ></span>
      </span>
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSwitchComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() helperText = '';
  @Input() inputId = `ui-switch-${++nextSwitchId}`;
  @Input() name = '';
  @Input() ariaLabel = '';
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) required = false;
  readonly valueChange = output<boolean>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();

  protected checked = false;

  private onChange: (value: boolean) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected get messageId(): string {
    return `${this.inputId}-message`;
  }

  protected get descriptionId(): string | null {
    return this.helperText ? this.messageId : null;
  }

  protected get labelClasses(): string {
    return uiClassNames(
      'flex items-center justify-between gap-4',
      this.disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer',
    );
  }

  writeValue(value: boolean | null): void {
    this.checked = value ?? false;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  protected onChangeEvent(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.checked = checked;
    this.onChange(checked);
    this.valueChange.emit(checked);
  }

  protected markTouched(event: FocusEvent): void {
    this.onTouched();
    this.blurred.emit(event);
  }
}
