import {
  ChangeDetectionStrategy,
  booleanAttribute,
  Component,
  Input,
  inject,
  numberAttribute,
  output,
} from '@angular/core';
import type { ControlValueAccessor, ValidationErrors } from '@angular/forms';
import { NgControl } from '@angular/forms';

import { uiClassNames } from '../../shared/class-names';

export type UiInputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
export type UiInputSize = 'sm' | 'md' | 'lg';
export type UiInputAppearance = 'outline' | 'filled';

const SIZE_CLASSES: Record<UiInputSize, string> = {
  sm: 'min-h-8 px-2.5 py-1.5 text-sm',
  md: 'min-h-10 px-3 py-2 text-sm',
  lg: 'min-h-12 px-4 py-2.5 text-base',
};

const DEFAULT_VALIDATION_MESSAGES: Record<string, string> = {
  required: 'This field is required.',
  email: 'Enter a valid email address.',
  minlength: 'The value is too short.',
  maxlength: 'The value is too long.',
  min: 'The value is below the minimum.',
  max: 'The value is above the maximum.',
  pattern: 'Enter a valid value.',
};

let nextInputId = 0;

@Component({
  selector: 'ui-input',
  standalone: true,
  template: `
    <div class="block">
      @if (label) {
        <label
          [for]="inputId"
          class="mb-1.5 block text-sm font-medium text-slate-800 dark:text-slate-100"
        >
          {{ label }}
          @if (required) {
            <span class="text-red-600 dark:text-red-400" aria-hidden="true">*</span>
          }
        </label>
      }

      <div [class]="controlFrameClasses">
        <ng-content select="[uiInputPrefix]" />
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
          [attr.aria-required]="required"
          [disabled]="disabled"
          [readOnly]="readonly"
          [required]="required"
          [attr.aria-invalid]="isInvalid"
          [attr.aria-describedby]="describedBy"
          [class]="nativeControlClasses"
          (input)="onInput($event)"
          (focus)="emitFocused($event)"
          (blur)="markTouched($event)"
        />
        @if (clearable && value && !disabled && !readonly) {
          <button
            type="button"
            class="rounded px-1 text-sm text-slate-400 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:hover:text-slate-200"
            aria-label="Clear input"
            (click)="clearValue()"
          >
            x
          </button>
        }
        <ng-content select="[uiInputSuffix]" />
      </div>

      @if (supportText || showCounter) {
        <div class="mt-1.5 flex items-start justify-between gap-3">
          @if (supportText) {
            <p
              [id]="messageId"
              [class]="supportTextClasses"
              [attr.role]="isInvalid ? 'alert' : null"
            >
              {{ supportText }}
            </p>
          }
          @if (showCounter) {
            <p [id]="counterId" class="ml-auto shrink-0 text-sm text-slate-500 dark:text-slate-400">
              {{ value.length }} / {{ maxLength }}
            </p>
          }
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiInputComponent implements ControlValueAccessor {
  private readonly ngControl = inject(NgControl, { self: true, optional: true });

  @Input() label = '';
  @Input() placeholder = '';
  @Input() helperText = '';
  @Input() errorText = '';
  @Input() type: UiInputType = 'text';
  @Input() size: UiInputSize = 'md';
  @Input() appearance: UiInputAppearance = 'outline';
  @Input() inputId = `ui-input-${++nextInputId}`;
  @Input() name = '';
  @Input() autocomplete = '';
  @Input() inputMode = '';
  @Input() ariaLabel = '';
  @Input() validationMessages: Record<string, string> = {};
  @Input({ transform: numberAttribute }) maxLength: number | null = null;
  @Input({ transform: numberAttribute }) minLength: number | null = null;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) readonly = false;
  @Input({ transform: booleanAttribute }) required = false;
  @Input({ transform: booleanAttribute }) clearable = false;
  @Input({ transform: booleanAttribute }) hideCounter = false;

  readonly valueChange = output<string>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();
  readonly cleared = output<void>();

  value = '';

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  protected get messageId(): string {
    return `${this.inputId}-message`;
  }

  protected get counterId(): string {
    return `${this.inputId}-counter`;
  }

  protected get describedBy(): string | null {
    const ids = [
      this.supportText ? this.messageId : '',
      this.showCounter ? this.counterId : '',
    ].filter(Boolean);
    return ids.length ? ids.join(' ') : null;
  }

  protected get isInvalid(): boolean {
    return !!this.supportErrorText || this.controlInvalid;
  }

  protected get supportText(): string {
    return this.supportErrorText || this.helperText;
  }

  protected get showCounter(): boolean {
    return !!this.maxLength && !this.hideCounter;
  }

  protected get controlFrameClasses(): string {
    return uiClassNames(
      'flex w-full items-center gap-2 rounded-md border shadow-sm transition-colors focus-within:ring-2',
      SIZE_CLASSES[this.size],
      this.appearance === 'filled'
        ? 'bg-slate-100 dark:bg-slate-900'
        : 'bg-white dark:bg-slate-950',
      this.disabled && 'cursor-not-allowed bg-slate-100 opacity-70 dark:bg-slate-900',
      this.isInvalid
        ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/30 dark:border-red-400'
        : 'border-slate-300 focus-within:border-blue-500 focus-within:ring-blue-500/30 dark:border-slate-700 dark:focus-within:border-blue-400',
    );
  }

  protected readonly nativeControlClasses =
    'min-w-0 flex-1 border-0 bg-transparent p-0 text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:text-slate-500 dark:text-slate-100 dark:placeholder:text-slate-500';

  protected get supportTextClasses(): string {
    return this.isInvalid
      ? 'text-sm text-red-600 dark:text-red-400'
      : 'text-sm text-slate-500 dark:text-slate-400';
  }

  writeValue(value: string | number | null): void {
    this.value = value == null ? '' : String(value);
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
    this.setValue((event.target as HTMLInputElement).value);
  }

  protected emitFocused(event: FocusEvent): void {
    this.focused.emit(event);
  }

  protected markTouched(event: FocusEvent): void {
    this.onTouched();
    this.blurred.emit(event);
  }

  protected clearValue(): void {
    this.setValue('');
    this.cleared.emit();
  }

  private setValue(value: string): void {
    this.value = value;
    this.onChange(value);
    this.valueChange.emit(value);
  }

  private get controlInvalid(): boolean {
    const control = this.ngControl?.control;
    return !!control?.invalid && (control.touched || control.dirty);
  }

  private get supportErrorText(): string {
    if (this.errorText) {
      return this.errorText;
    }

    const control = this.ngControl?.control;
    if (!control?.errors || !(control.touched || control.dirty)) {
      return '';
    }

    return this.resolveValidationMessage(control.errors);
  }

  private resolveValidationMessage(errors: ValidationErrors): string {
    const key = Object.keys(errors)[0];
    return (
      this.validationMessages[key] || DEFAULT_VALIDATION_MESSAGES[key] || 'Enter a valid value.'
    );
  }
}
