import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  booleanAttribute,
  Component,
  ElementRef,
  forwardRef,
  Input,
  inject,
  output,
  signal,
} from '@angular/core';
import type { ControlValueAccessor } from '@angular/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

function uiClassNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export interface UiRadioOption {
  readonly label: string;
  readonly value: string;
  readonly disabled?: boolean;
  readonly helperText?: string;
}

export type UiRadioOrientation = 'vertical' | 'horizontal';

let nextRadioGroupId = 0;

@Component({
  selector: 'ui-radio-group',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiRadioGroupComponent),
      multi: true,
    },
  ],
  template: `
    <fieldset
      [attr.aria-label]="label ? null : ariaLabel || null"
      [attr.aria-describedby]="descriptionId"
      [attr.aria-invalid]="errorText ? 'true' : null"
      [disabled]="isDisabled"
    >
      @if (label) {
        <legend class="mb-2 text-sm font-medium text-slate-800 dark:text-slate-100">
          {{ label }}
        </legend>
      }

      <div [class]="groupClasses">
        @for (option of options; track option.value) {
          <label [class]="optionClasses(option)">
            <input
              type="radio"
              class="mt-0.5 size-4 border-slate-300 text-blue-600 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950"
              [attr.name]="name || groupId"
              [value]="option.value"
              [checked]="value === option.value"
              [disabled]="isDisabled || !!option.disabled"
              [required]="required"
              (change)="selectOption(option)"
              (focus)="emitFocused($event)"
              (blur)="markTouched($event)"
            />
            <span class="min-w-0">
              <span class="block text-sm font-medium text-slate-800 dark:text-slate-100">
                {{ option.label }}
              </span>
              @if (option.helperText) {
                <span class="mt-0.5 block text-sm text-slate-500 dark:text-slate-400">
                  {{ option.helperText }}
                </span>
              }
            </span>
          </label>
        }
      </div>
    </fieldset>

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
export class UiRadioGroupComponent implements ControlValueAccessor {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly changeDetector = inject(ChangeDetectorRef);

  @Input() label = '';
  @Input() helperText = '';
  @Input() errorText = '';
  @Input() ariaLabel = '';
  @Input() name = '';
  @Input() groupId = `ui-radio-group-${++nextRadioGroupId}`;
  @Input() orientation: UiRadioOrientation = 'vertical';
  @Input() options: readonly UiRadioOption[] = [];
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) required = false;
  readonly valueChange = output<string>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();

  protected value = '';
  private readonly formDisabled = signal(false);

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected get messageId(): string {
    return `${this.groupId}-message`;
  }

  protected get descriptionId(): string | null {
    return this.errorText || this.helperText ? this.messageId : null;
  }

  protected get isDisabled(): boolean {
    return this.disabled || this.formDisabled();
  }

  protected get groupClasses(): string {
    return uiClassNames(
      'flex gap-3',
      this.orientation === 'vertical' && 'flex-col',
      this.orientation === 'horizontal' && 'flex-row flex-wrap',
    );
  }

  protected optionClasses(option: UiRadioOption): string {
    return uiClassNames(
      'flex items-start gap-3 rounded-lg',
      this.isDisabled || option.disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer',
    );
  }

  writeValue(value: string | null): void {
    this.value = value ?? '';
    this.changeDetector.markForCheck();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
    this.changeDetector.markForCheck();
  }

  protected selectOption(option: UiRadioOption): void {
    if (this.isDisabled || option.disabled || option.value === this.value) {
      return;
    }

    this.value = option.value;
    this.onChange(option.value);
    this.valueChange.emit(option.value);
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
}
