import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  booleanAttribute,
  Component,
  ElementRef,
  Input,
  inject,
  numberAttribute,
  output,
  signal,
} from '@angular/core';
import type { ControlValueAccessor, ValidationErrors } from '@angular/forms';
import { NgControl } from '@angular/forms';

function uiClassNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export type UiInputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
export type UiInputSize = 'sm' | 'md' | 'lg';
export type UiInputAppearance = 'outline' | 'filled';
export type UiInputIntent = 'default' | 'success' | 'warning' | 'danger';
export type UiInputLabelMode = 'top' | 'floating' | 'hidden';
export type UiInputCounterMode = 'characters' | 'words';

const SIZE_CLASSES: Record<UiInputSize, string> = {
  sm: 'min-h-8 px-2.5 py-1.5 text-sm',
  md: 'min-h-10 px-3 py-2 text-sm',
  lg: 'min-h-12 px-4 py-2.5 text-base',
};

const FLOATING_SIZE_CLASSES: Record<UiInputSize, string> = {
  sm: 'min-h-11 px-2.5 pb-1.5 pt-5 text-sm',
  md: 'min-h-12 px-3 pb-2 pt-5 text-sm',
  lg: 'min-h-14 px-4 pb-2.5 pt-6 text-base',
};

const INTENT_CLASSES: Record<UiInputIntent, string> = {
  default:
    'border-slate-300 focus-within:border-blue-500 focus-within:ring-blue-500/30 dark:border-slate-700 dark:focus-within:border-blue-400',
  success:
    'border-emerald-500 focus-within:border-emerald-500 focus-within:ring-emerald-500/30 dark:border-emerald-400',
  warning:
    'border-amber-500 focus-within:border-amber-500 focus-within:ring-amber-500/30 dark:border-amber-400',
  danger:
    'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/30 dark:border-red-400',
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
      @if (label && labelMode === 'top') {
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
      @if (label && labelMode === 'hidden') {
        <label [for]="inputId" class="sr-only">{{ label }}</label>
      }

      <div [class]="controlFrameClasses">
        <ng-content select="[uiInputPrefix]" />
        <input
          [id]="inputId"
          [attr.name]="name || null"
          [type]="nativeType"
          [value]="value()"
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
          (keydown.enter)="emitSubmitted()"
        />
        @if (label && labelMode === 'floating') {
          <label [for]="inputId" [class]="floatingLabelClasses">
            {{ label }}
            @if (required) {
              <span class="text-red-600 dark:text-red-400" aria-hidden="true">*</span>
            }
          </label>
        }
        @if (clearable && value() && !disabled && !readonly) {
          <button
            type="button"
            class="rounded px-1.5 py-0.5 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            [attr.aria-label]="clearLabel"
            (click)="clearValue()"
          >
            {{ clearButtonText }}
          </button>
        }
        @if (type === 'password' && revealable) {
          <button
            type="button"
            class="rounded px-1.5 py-0.5 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            [attr.aria-label]="passwordVisible() ? hidePasswordLabel : showPasswordLabel"
            [attr.aria-pressed]="passwordVisible()"
            [disabled]="disabled"
            (click)="togglePasswordVisibility()"
          >
            {{ passwordVisible() ? hideButtonText : showButtonText }}
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
            <p [id]="counterId" [class]="counterTextClasses">
              {{ counterValue }} / {{ counterLimit }}
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
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  @Input() label = '';
  @Input() placeholder = '';
  @Input() helperText = '';
  @Input() errorText = '';
  @Input() type: UiInputType = 'text';
  @Input() size: UiInputSize = 'md';
  @Input() appearance: UiInputAppearance = 'outline';
  @Input() intent: UiInputIntent = 'default';
  @Input() labelMode: UiInputLabelMode = 'top';
  @Input() inputId = `ui-input-${++nextInputId}`;
  @Input() name = '';
  @Input() autocomplete = '';
  @Input() inputMode = '';
  @Input() ariaLabel = '';
  @Input() validationMessages: Record<string, string> = {};
  @Input() clearLabel = 'Clear input';
  @Input() showPasswordLabel = 'Show password';
  @Input() hidePasswordLabel = 'Hide password';
  @Input() counterMode: UiInputCounterMode = 'characters';
  @Input({ transform: numberAttribute }) maxLength: number | null = null;
  @Input({ transform: numberAttribute }) minLength: number | null = null;
  @Input({ transform: numberAttribute }) counterMax: number | null = null;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) readonly = false;
  @Input({ transform: booleanAttribute }) required = false;
  @Input({ transform: booleanAttribute }) clearable = false;
  @Input({ transform: booleanAttribute }) hideCounter = false;
  @Input({ transform: booleanAttribute }) revealable = false;

  readonly valueChange = output<string>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();
  readonly cleared = output<void>();
  readonly submitted = output<string>();
  readonly passwordVisibilityChange = output<boolean>();

  readonly value = signal('');
  readonly passwordVisible = signal(false);
  private readonly focusedState = signal(false);

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
    return this.counterLimit !== null && !this.hideCounter;
  }

  protected get controlFrameClasses(): string {
    return uiClassNames(
      'relative flex w-full items-center gap-2 rounded-md border shadow-sm transition-colors focus-within:ring-2',
      this.labelMode === 'floating' ? FLOATING_SIZE_CLASSES[this.size] : SIZE_CLASSES[this.size],
      this.appearance === 'filled'
        ? 'bg-slate-100 dark:bg-slate-900'
        : 'bg-white dark:bg-slate-950',
      this.disabled && 'cursor-not-allowed bg-slate-100 opacity-70 dark:bg-slate-900',
      INTENT_CLASSES[this.effectiveIntent],
    );
  }

  protected readonly nativeControlClasses =
    'min-w-0 flex-1 border-0 bg-transparent p-0 text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:text-slate-500 dark:text-slate-100 dark:placeholder:text-slate-500';

  protected get supportTextClasses(): string {
    if (this.effectiveIntent === 'danger') {
      return 'text-sm text-red-600 dark:text-red-400';
    }

    if (this.effectiveIntent === 'warning') {
      return 'text-sm text-amber-700 dark:text-amber-300';
    }

    if (this.effectiveIntent === 'success') {
      return 'text-sm text-emerald-700 dark:text-emerald-300';
    }

    return 'text-sm text-slate-500 dark:text-slate-400';
  }

  protected get floatingLabelClasses(): string {
    return uiClassNames(
      'pointer-events-none absolute left-3 origin-left transition-all duration-150',
      this.isFloatingLabelRaised
        ? 'top-1 text-xs text-slate-500 dark:text-slate-400'
        : 'top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-slate-500',
      this.effectiveIntent === 'danger' && 'text-red-600 dark:text-red-400',
      this.effectiveIntent === 'warning' && 'text-amber-700 dark:text-amber-300',
      this.effectiveIntent === 'success' && 'text-emerald-700 dark:text-emerald-300',
    );
  }

  protected get counterTextClasses(): string {
    return uiClassNames(
      'ml-auto shrink-0 text-sm text-slate-500 dark:text-slate-400',
      this.isCounterExceeded && 'font-medium text-red-600 dark:text-red-400',
    );
  }

  protected get nativeType(): UiInputType {
    return this.type === 'password' && this.revealable && this.passwordVisible()
      ? 'text'
      : this.type;
  }

  protected get counterLimit(): number | null {
    return this.counterMax ?? this.maxLength;
  }

  protected get counterValue(): number {
    if (this.counterMode === 'words') {
      return this.value().trim() ? this.value().trim().split(/\s+/).length : 0;
    }

    return this.value().length;
  }

  protected get clearButtonText(): string {
    return this.clearLabel === 'Clear input' ? 'Clear' : this.clearLabel;
  }

  protected get showButtonText(): string {
    return this.showPasswordLabel === 'Show password' ? 'Show' : this.showPasswordLabel;
  }

  protected get hideButtonText(): string {
    return this.hidePasswordLabel === 'Hide password' ? 'Hide' : this.hidePasswordLabel;
  }

  writeValue(value: string | number | null): void {
    this.value.set(value == null ? '' : String(value));
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.changeDetectorRef.markForCheck();
  }

  protected onInput(event: Event): void {
    this.setValue((event.target as HTMLInputElement).value);
  }

  protected emitFocused(event: FocusEvent): void {
    this.focusedState.set(true);
    this.dispatchHostFocusEvent(event, 'focus');
    this.focused.emit(event);
  }

  protected markTouched(event: FocusEvent): void {
    this.focusedState.set(false);
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

  protected clearValue(): void {
    this.setValue('');
    this.cleared.emit();
  }

  protected togglePasswordVisibility(): void {
    if (this.disabled) {
      return;
    }

    this.passwordVisible.update((visible) => !visible);
    this.passwordVisibilityChange.emit(this.passwordVisible());
  }

  protected emitSubmitted(): void {
    this.submitted.emit(this.value());
  }

  private setValue(value: string): void {
    this.value.set(value);
    this.onChange(value);
    this.valueChange.emit(value);
  }

  private get effectiveIntent(): UiInputIntent {
    return this.isInvalid ? 'danger' : this.intent;
  }

  private get isFloatingLabelRaised(): boolean {
    return this.focusedState() || !!this.value() || !!this.placeholder;
  }

  private get isCounterExceeded(): boolean {
    return this.counterLimit !== null && this.counterValue > this.counterLimit;
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
