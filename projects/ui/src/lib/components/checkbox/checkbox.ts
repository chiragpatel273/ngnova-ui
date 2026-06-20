import {
  ChangeDetectionStrategy,
  booleanAttribute,
  Component,
  ElementRef,
  forwardRef,
  Input,
  inject,
  output,
  signal,
} from '@angular/core';
import type { OnChanges, SimpleChanges } from '@angular/core';
import type { ControlValueAccessor } from '@angular/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { uiClassNames } from '../../shared/class-names';

let nextCheckboxId = 0;

@Component({
  selector: 'ui-checkbox',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiCheckboxComponent),
      multi: true,
    },
  ],
  template: `
    <div class="flex items-start gap-3">
      <input
        [id]="inputId"
        type="checkbox"
        [attr.name]="name || null"
        [checked]="checked"
        [disabled]="disabled"
        [required]="required"
        [indeterminate]="isIndeterminate()"
        [attr.aria-label]="ariaLabel || null"
        [attr.aria-describedby]="descriptionId"
        [class]="checkboxClasses"
        (change)="onChangeEvent($event)"
        (focus)="emitFocused($event)"
        (blur)="markTouched($event)"
      />

      <div class="min-w-0">
        @if (label) {
          <label
            [for]="inputId"
            class="block cursor-pointer text-sm font-medium text-slate-800 dark:text-slate-100"
            [class.cursor-not-allowed]="disabled"
          >
            {{ label }}
          </label>
        }

        @if (helperText) {
          <p [id]="messageId" class="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {{ helperText }}
          </p>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiCheckboxComponent implements ControlValueAccessor, OnChanges {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  @Input() label = '';
  @Input() helperText = '';
  @Input() inputId = `ui-checkbox-${++nextCheckboxId}`;
  @Input() name = '';
  @Input() ariaLabel = '';
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) required = false;
  @Input({ transform: booleanAttribute }) indeterminate = false;
  readonly valueChange = output<boolean>();
  readonly indeterminateChange = output<boolean>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();

  protected checked = false;
  protected readonly isIndeterminate = signal(false);

  private onChange: (value: boolean) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected get messageId(): string {
    return `${this.inputId}-message`;
  }

  protected get descriptionId(): string | null {
    return this.helperText ? this.messageId : null;
  }

  protected get checkboxClasses(): string {
    return uiClassNames(
      'mt-0.5 size-4 rounded border-slate-300 text-blue-600 shadow-sm transition-colors focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-blue-400/30',
      this.isIndeterminate() && 'accent-blue-600',
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['indeterminate']) {
      this.isIndeterminate.set(this.indeterminate);
    }
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
    if (this.isIndeterminate()) {
      this.isIndeterminate.set(false);
      this.indeterminateChange.emit(false);
    }
    this.onChange(checked);
    this.valueChange.emit(checked);
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
