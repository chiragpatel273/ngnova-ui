import {
  ChangeDetectionStrategy,
  booleanAttribute,
  Component,
  forwardRef,
  Input,
  numberAttribute,
  output,
} from '@angular/core';
import type { ControlValueAccessor } from '@angular/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { uiClassNames } from '../../shared/class-names';

export type UiInputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
export type UiInputSize = 'sm' | 'md' | 'lg';

let nextInputId = 0;

@Component({
  selector: 'ui-input',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiInputComponent),
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

      <input
        [id]="inputId"
        [attr.name]="name || null"
        [type]="type"
        [value]="value"
        [placeholder]="placeholder"
        [attr.autocomplete]="autocomplete || null"
        [attr.inputmode]="inputMode || null"
        [attr.maxlength]="maxLength ?? null"
        [attr.minlength]="minLength ?? null"
        [attr.aria-label]="ariaLabel || null"
        [disabled]="disabled"
        [readOnly]="readonly"
        [required]="required"
        [attr.aria-invalid]="!!errorText"
        [attr.aria-describedby]="descriptionId"
        [class]="inputClasses"
        (input)="onInput($event)"
        (focus)="emitFocused($event)"
        (blur)="markTouched($event)"
      />
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
export class UiInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() helperText = '';
  @Input() errorText = '';
  @Input() type: UiInputType = 'text';
  @Input() size: UiInputSize = 'md';
  @Input() inputId = `ui-input-${++nextInputId}`;
  @Input() name = '';
  @Input() autocomplete = '';
  @Input() inputMode = '';
  @Input() ariaLabel = '';
  @Input({ transform: numberAttribute }) maxLength: number | null = null;
  @Input({ transform: numberAttribute }) minLength: number | null = null;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) readonly = false;
  @Input({ transform: booleanAttribute }) required = false;
  readonly valueChange = output<string>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();

  value = '';

  private onChange: (value: string) => void = () => undefined;
  protected onTouched: () => void = () => undefined;

  protected get messageId(): string {
    return `${this.inputId}-message`;
  }

  protected get descriptionId(): string | null {
    return this.errorText || this.helperText ? this.messageId : null;
  }

  protected get inputClasses(): string {
    return uiClassNames(
      'block w-full rounded-md border bg-white text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:disabled:bg-slate-900',
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

  protected onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
    this.valueChange.emit(value);
  }

  protected emitFocused(event: FocusEvent): void {
    this.focused.emit(event);
  }

  protected markTouched(event: FocusEvent): void {
    this.onTouched();
    this.blurred.emit(event);
  }
}
