import {
  ChangeDetectionStrategy,
  booleanAttribute,
  Component,
  ElementRef,
  forwardRef,
  Input,
  inject,
  output,
} from '@angular/core';
import type { ControlValueAccessor } from '@angular/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { uiClassNames } from '../../shared/class-names';

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
    <fieldset [attr.aria-describedby]="descriptionId" [disabled]="disabled">
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
              class="mt-0.5 size-4 border-slate-300 text-blue-600 shadow-sm focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-blue-400/30"
              [attr.name]="name || groupId"
              [value]="option.value"
              [checked]="value === option.value"
              [disabled]="disabled || !!option.disabled"
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

  @Input() label = '';
  @Input() helperText = '';
  @Input() errorText = '';
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

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected get messageId(): string {
    return `${this.groupId}-message`;
  }

  protected get descriptionId(): string | null {
    return this.errorText || this.helperText ? this.messageId : null;
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
      'flex items-start gap-3 rounded-md',
      this.disabled || option.disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer',
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

  protected selectOption(option: UiRadioOption): void {
    if (this.disabled || option.disabled || option.value === this.value) {
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
