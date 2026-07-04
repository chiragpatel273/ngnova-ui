import {
  ChangeDetectionStrategy,
  booleanAttribute,
  Component,
  ElementRef,
  Input,
  inject,
  numberAttribute,
  output,
} from '@angular/core';
import type { ControlValueAccessor, ValidationErrors } from '@angular/forms';
import { NgControl } from '@angular/forms';

function uiClassNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export type UiTextareaSize = 'sm' | 'md' | 'lg';
export type UiTextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';
export type UiTextareaAppearance = 'outline' | 'filled';

const SIZE_CLASSES: Record<UiTextareaSize, string> = {
  sm: 'px-2.5 py-1.5 text-sm',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-2.5 text-base',
};

const DEFAULT_VALIDATION_MESSAGES: Record<string, string> = {
  required: 'This field is required.',
  minlength: 'The value is too short.',
  maxlength: 'The value is too long.',
};

let nextTextareaId = 0;

@Component({
  selector: 'ui-textarea',
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

      <textarea
        [id]="inputId"
        [attr.name]="name || null"
        [value]="value"
        [placeholder]="placeholder"
        [attr.maxlength]="maxLength ?? null"
        [attr.minlength]="minLength ?? null"
        [attr.rows]="rows"
        [attr.aria-label]="ariaLabel || null"
        [attr.aria-required]="required"
        [attr.aria-invalid]="isInvalid"
        [attr.aria-describedby]="describedBy"
        [disabled]="disabled"
        [readOnly]="readonly"
        [required]="required"
        [class]="textareaClasses"
        (input)="onInput($event)"
        (focus)="emitFocused($event)"
        (blur)="markTouched($event)"
      ></textarea>

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
export class UiTextareaComponent implements ControlValueAccessor {
  private readonly ngControl = inject(NgControl, { self: true, optional: true });
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  @Input() label = '';
  @Input() placeholder = '';
  @Input() helperText = '';
  @Input() errorText = '';
  @Input() size: UiTextareaSize = 'md';
  @Input() resize: UiTextareaResize = 'vertical';
  @Input() appearance: UiTextareaAppearance = 'outline';
  @Input() inputId = `ui-textarea-${++nextTextareaId}`;
  @Input() name = '';
  @Input() ariaLabel = '';
  @Input() validationMessages: Record<string, string> = {};
  @Input({ transform: numberAttribute }) rows = 4;
  @Input({ transform: numberAttribute }) maxLength: number | null = null;
  @Input({ transform: numberAttribute }) minLength: number | null = null;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) readonly = false;
  @Input({ transform: booleanAttribute }) required = false;
  @Input({ transform: booleanAttribute }) hideCounter = false;

  readonly valueChange = output<string>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();

  protected value = '';

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

  protected get textareaClasses(): string {
    return uiClassNames(
      'block w-full rounded-md border text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 dark:text-slate-100 dark:placeholder:text-slate-500 dark:disabled:bg-slate-900',
      SIZE_CLASSES[this.size],
      this.appearance === 'filled'
        ? 'bg-slate-100 dark:bg-slate-900'
        : 'bg-white dark:bg-slate-950',
      this.resize === 'none' && 'resize-none',
      this.resize === 'vertical' && 'resize-y',
      this.resize === 'horizontal' && 'resize-x',
      this.resize === 'both' && 'resize',
      this.isInvalid
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30 dark:border-red-400'
        : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/30 dark:border-slate-700 dark:focus:border-blue-400',
    );
  }

  protected get supportTextClasses(): string {
    return this.isInvalid
      ? 'text-sm text-red-600 dark:text-red-400'
      : 'text-sm text-slate-500 dark:text-slate-400';
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
    const value = (event.target as HTMLTextAreaElement).value;
    this.value = value;
    this.onChange(value);
    this.valueChange.emit(value);
  }

  protected emitFocused(event: FocusEvent): void {
    this.dispatchHostFocusEvent(event, 'focus');
    this.focused.emit(event);
  }

  protected markTouched(event: FocusEvent): void {
    this.onTouched();
    this.dispatchHostFocusEvent(event, 'blur');
    this.blurred.emit(event);
  }

  private dispatchHostFocusEvent(event: FocusEvent, type: 'focus' | 'blur'): void {
    this.host.nativeElement.dispatchEvent(
      new FocusEvent(type, {
        relatedTarget: event.relatedTarget,
      }),
    );
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
