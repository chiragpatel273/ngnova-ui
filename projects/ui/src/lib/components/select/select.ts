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

export interface UiSelectOption {
  readonly label: string;
  readonly value: string;
  readonly disabled?: boolean;
}

export type UiSelectSize = 'sm' | 'md' | 'lg';

let nextSelectId = 0;

@Component({
  selector: 'ui-select',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiSelectComponent),
      multi: true,
    },
  ],
  template: `
    <label class="block">
      @if (label) {
        <span class="mb-1.5 block text-sm font-medium text-slate-800 dark:text-slate-100">{{
          label
        }}</span>
      }

      <select
        [id]="inputId"
        [attr.name]="name || null"
        [value]="value"
        [disabled]="disabled"
        [required]="required"
        [attr.aria-label]="ariaLabel || null"
        [attr.aria-invalid]="!!errorText"
        [attr.aria-describedby]="descriptionId"
        [class]="selectClasses"
        (change)="onSelect($event)"
        (focus)="focused.emit($event)"
        (blur)="markTouched($event)"
      >
        @if (placeholder) {
          <option value="" [disabled]="required" [selected]="value === ''">
            {{ placeholder }}
          </option>
        }
        @for (option of options; track option.value) {
          <option
            [value]="option.value"
            [disabled]="option.disabled"
            [selected]="option.value === value"
          >
            {{ option.label }}
          </option>
        }
      </select>
    </label>

    @if (errorText) {
      <p [id]="messageId" class="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">
        {{ errorText }}
      </p>
    } @else if (helperText) {
      <p [id]="messageId" class="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
        {{ helperText }}
      </p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSelectComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() helperText = '';
  @Input() errorText = '';
  @Input() inputId = `ui-select-${++nextSelectId}`;
  @Input() name = '';
  @Input() ariaLabel = '';
  @Input() size: UiSelectSize = 'md';
  @Input() options: readonly UiSelectOption[] = [];
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) required = false;
  readonly valueChange = output<string>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();

  protected value = '';

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected get messageId(): string {
    return `${this.inputId}-message`;
  }

  protected get descriptionId(): string | null {
    return this.errorText || this.helperText ? this.messageId : null;
  }

  protected get selectClasses(): string {
    return uiClassNames(
      'block w-full appearance-none rounded-md border bg-white text-slate-900 shadow-sm transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 dark:bg-slate-950 dark:text-slate-100 dark:disabled:bg-slate-900',
      'bg-[right_0.75rem_center] bg-no-repeat pr-10',
      this.size === 'sm' && 'h-8 px-2.5 py-1.5 text-sm',
      this.size === 'md' && 'h-10 px-3 py-2 text-sm',
      this.size === 'lg' && 'h-12 px-4 py-2.5 text-base',
      this.errorText
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30 dark:border-red-400'
        : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/30 dark:border-slate-700 dark:focus:border-blue-400',
    );
  }

  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  protected onSelect(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.value = value;
    this.onChange(value);
    this.valueChange.emit(value);
  }

  protected markTouched(event: FocusEvent): void {
    this.onTouched();
    this.blurred.emit(event);
  }
}
