import { DOCUMENT } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  inject,
  Input,
  output,
  Renderer2,
  signal,
} from '@angular/core';
import type { OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import type { ControlValueAccessor } from '@angular/forms';

function uiClassNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

function parseIso(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day, 12));
  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
    ? date
    : null;
}

function toIso(date: Date): string {
  return [
    date.getUTCFullYear().toString().padStart(4, '0'),
    (date.getUTCMonth() + 1).toString().padStart(2, '0'),
    date.getUTCDate().toString().padStart(2, '0'),
  ].join('-');
}

function addDays(value: string, days: number): string {
  const date = parseIso(value);
  if (!date) return value;
  date.setUTCDate(date.getUTCDate() + days);
  return toIso(date);
}

function startOfMonth(value: string): string {
  const date = parseIso(value);
  return date ? toIso(new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 12))) : value;
}

function addMonths(value: string, months: number): string {
  const date = parseIso(value);
  if (!date) return value;
  const day = date.getUTCDate();
  const target = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1, 12));
  const lastDay = new Date(
    Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0, 12),
  ).getUTCDate();
  target.setUTCDate(Math.min(day, lastDay));
  return toIso(target);
}

function todayIso(): string {
  const today = new Date();
  return [
    today.getFullYear().toString().padStart(4, '0'),
    (today.getMonth() + 1).toString().padStart(2, '0'),
    today.getDate().toString().padStart(2, '0'),
  ].join('-');
}

export interface UiDatePickerSelection {
  readonly value: string;
  readonly date: Date;
}

interface UiCalendarDay {
  readonly value: string;
  readonly day: number;
  readonly outside: boolean;
  readonly disabled: boolean;
  readonly today: boolean;
}

export type UiDatePickerSize = 'sm' | 'md' | 'lg';

let nextDatePickerId = 0;

@Component({
  selector: 'ui-date-picker',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiDatePickerComponent),
      multi: true,
    },
  ],
  template: `
    <div class="grid min-w-0 gap-1.5">
      @if (label) {
        <label
          [for]="inputId"
          class="text-sm font-medium leading-5 text-slate-800 dark:text-slate-200"
        >
          {{ label }}
          @if (required) {
            <span class="text-red-600 dark:text-red-400" aria-hidden="true">*</span>
          }
        </label>
      }

      <div class="relative min-w-0">
        <div [class]="frameClasses">
          <input
            #input
            type="text"
            readonly
            [id]="inputId"
            [attr.name]="name || null"
            [attr.placeholder]="placeholder || null"
            [attr.aria-label]="label ? null : ariaLabel || null"
            [attr.aria-haspopup]="'dialog'"
            [attr.aria-expanded]="isOpen()"
            [attr.aria-controls]="calendarId"
            [attr.aria-describedby]="messageId"
            [attr.aria-invalid]="errorText ? 'true' : null"
            [attr.aria-required]="required ? 'true' : null"
            [value]="displayValue"
            [disabled]="isDisabled"
            class="min-w-0 flex-1 cursor-default border-0 bg-transparent p-0 font-sans text-inherit text-slate-950 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed dark:text-slate-50 dark:placeholder:text-slate-500"
            (click)="openCalendar()"
            (focus)="focused.emit($event)"
            (keydown)="handleInputKeydown($event)"
          />

          @if (clearable && value && !isDisabled) {
            <button
              type="button"
              tabindex="-1"
              [attr.aria-label]="clearAriaLabel"
              class="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-slate-500 outline-none hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white dark:focus-visible:ring-blue-400"
              (mousedown)="$event.preventDefault()"
              (click)="clear(input)"
            >
              <svg
                class="size-4 fill-none stroke-current"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke-linecap="round"
                aria-hidden="true"
              >
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          }

          <button
            type="button"
            tabindex="-1"
            [disabled]="isDisabled"
            [attr.aria-label]="isOpen() ? closeAriaLabel : openAriaLabel"
            class="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-slate-500 outline-none hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white dark:focus-visible:ring-blue-400"
            (mousedown)="$event.preventDefault()"
            (click)="toggle(input)"
          >
            <svg
              class="size-4 fill-none stroke-current"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path
                d="M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
              />
            </svg>
          </button>
        </div>

        @if (isOpen() && !isDisabled) {
          <div
            [id]="calendarId"
            role="dialog"
            [attr.aria-label]="calendarAriaLabel"
            class="absolute left-0 top-[calc(100%+0.375rem)] z-[950] w-80 max-w-[calc(100vw-2rem)] rounded-[var(--ui-surface-radius,0.875rem)] border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-950"
            (keydown)="handleCalendarKeydown($event)"
          >
            <div class="mb-3 flex items-center justify-between gap-2">
              <button
                type="button"
                [disabled]="!canNavigateMonth(-1)"
                [attr.aria-label]="previousMonthAriaLabel"
                class="inline-flex size-9 items-center justify-center rounded-lg text-slate-600 outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus-visible:ring-blue-400"
                (click)="navigateMonth(-1)"
              >
                <svg
                  class="size-4 fill-none stroke-current"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              <h2
                class="m-0 text-sm font-semibold text-slate-950 dark:text-white"
                aria-live="polite"
              >
                {{ monthLabel }}
              </h2>

              <button
                type="button"
                [disabled]="!canNavigateMonth(1)"
                [attr.aria-label]="nextMonthAriaLabel"
                class="inline-flex size-9 items-center justify-center rounded-lg text-slate-600 outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus-visible:ring-blue-400"
                (click)="navigateMonth(1)"
              >
                <svg
                  class="size-4 fill-none stroke-current"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>

            <div role="grid" [attr.aria-label]="monthLabel" class="grid grid-cols-7 gap-1">
              @for (weekday of weekdayLabels; track $index) {
                <div
                  role="columnheader"
                  [attr.aria-label]="weekday.long"
                  class="flex h-7 items-center justify-center text-xs font-medium text-slate-500 dark:text-slate-400"
                >
                  {{ weekday.short }}
                </div>
              }

              @for (day of calendarDays; track day.value) {
                @if (showOutsideDays || !day.outside) {
                  <button
                    type="button"
                    role="gridcell"
                    [attr.data-date]="day.value"
                    [attr.aria-label]="dateAriaLabel(day.value)"
                    [attr.aria-selected]="day.value === value"
                    [attr.aria-current]="day.today ? 'date' : null"
                    [disabled]="day.disabled"
                    [tabIndex]="day.value === activeDate() ? 0 : -1"
                    [class]="dayClasses(day)"
                    (click)="selectDate(day.value)"
                    (focus)="activeDate.set(day.value)"
                  >
                    {{ day.day }}
                  </button>
                } @else {
                  <span role="gridcell" aria-hidden="true" class="size-9"></span>
                }
              }
            </div>

            <div
              class="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 dark:border-slate-800"
            >
              <button
                type="button"
                [disabled]="isDateDisabled(today)"
                class="rounded-lg px-2.5 py-1.5 text-sm font-medium text-blue-700 outline-none hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:text-blue-300 dark:hover:bg-blue-950/60 dark:focus-visible:ring-blue-400"
                (click)="selectToday()"
              >
                {{ todayText }}
              </button>
              @if (value) {
                <span class="text-xs text-slate-500 dark:text-slate-400">{{ displayValue }}</span>
              }
            </div>
          </div>
        }
      </div>

      @if (errorText) {
        <p [id]="messageElementId" class="m-0 text-xs text-red-700 dark:text-red-300" role="alert">
          {{ errorText }}
        </p>
      } @else if (helperText) {
        <p [id]="messageElementId" class="m-0 text-xs text-slate-500 dark:text-slate-400">
          {{ helperText }}
        </p>
      }
    </div>
  `,
  host: {
    class: 'block min-w-0',
    '(focusout)': 'handleHostFocusOut($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiDatePickerComponent implements ControlValueAccessor, OnChanges, OnDestroy {
  @Input() label = '';
  @Input() placeholder = 'Select a date';
  @Input() helperText = '';
  @Input() errorText = '';
  @Input() inputId = `ui-date-picker-${++nextDatePickerId}`;
  @Input() name = '';
  @Input() ariaLabel = '';
  @Input() locale = 'en-US';
  @Input() size: UiDatePickerSize = 'md';
  @Input() min = '';
  @Input() max = '';
  @Input() startAt = '';
  @Input() disabledDates: readonly string[] = [];
  @Input({ transform: booleanAttribute }) open = false;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) required = false;
  @Input({ transform: booleanAttribute }) clearable = false;
  @Input({ transform: booleanAttribute }) showOutsideDays = true;
  @Input({ transform: booleanAttribute }) closeOnSelect = true;
  @Input({ transform: (value: unknown) => Math.max(0, Math.min(6, Number(value) || 0)) })
  firstDayOfWeek = 0;
  @Input() calendarAriaLabel = 'Choose date';
  @Input() openAriaLabel = 'Open calendar';
  @Input() closeAriaLabel = 'Close calendar';
  @Input() clearAriaLabel = 'Clear date';
  @Input() previousMonthAriaLabel = 'Previous month';
  @Input() nextMonthAriaLabel = 'Next month';
  @Input() todayText = 'Today';

  readonly valueChange = output<string>();
  readonly openChange = output<boolean>();
  readonly dateSelected = output<UiDatePickerSelection>();
  readonly monthChange = output<string>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();

  protected value = '';
  protected readonly isOpen = signal(false);
  protected readonly activeDate = signal(todayIso());
  private readonly visibleMonth = signal(startOfMonth(todayIso()));
  private readonly formDisabled = signal(false);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly document = inject(DOCUMENT);
  private readonly renderer = inject(Renderer2);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private removeOutsideListener: (() => void) | null = null;

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected get calendarId(): string {
    return `${this.inputId}-calendar`;
  }

  protected get messageElementId(): string {
    return `${this.inputId}-message`;
  }

  protected get messageId(): string | null {
    return this.errorText || this.helperText ? this.messageElementId : null;
  }

  protected get isDisabled(): boolean {
    return this.disabled || this.formDisabled();
  }

  protected get today(): string {
    return todayIso();
  }

  protected get displayValue(): string {
    const date = parseIso(this.value);
    return date
      ? new Intl.DateTimeFormat(this.locale, {
          dateStyle: 'medium',
          timeZone: 'UTC',
        }).format(date)
      : '';
  }

  protected get monthLabel(): string {
    const date = parseIso(this.visibleMonth());
    return date
      ? new Intl.DateTimeFormat(this.locale, {
          month: 'long',
          year: 'numeric',
          timeZone: 'UTC',
        }).format(date)
      : '';
  }

  protected get weekdayLabels(): readonly { readonly short: string; readonly long: string }[] {
    const sunday = '2024-01-07';
    return Array.from({ length: 7 }, (_, offset) => {
      const date = parseIso(addDays(sunday, (offset + this.firstDayOfWeek) % 7));
      return {
        short: date
          ? new Intl.DateTimeFormat(this.locale, {
              weekday: 'narrow',
              timeZone: 'UTC',
            }).format(date)
          : '',
        long: date
          ? new Intl.DateTimeFormat(this.locale, {
              weekday: 'long',
              timeZone: 'UTC',
            }).format(date)
          : '',
      };
    });
  }

  protected get calendarDays(): readonly UiCalendarDay[] {
    const month = this.visibleMonth();
    const monthDate = parseIso(month);
    if (!monthDate) return [];
    const offset = (monthDate.getUTCDay() - this.firstDayOfWeek + 7) % 7;
    const firstVisible = addDays(month, -offset);
    return Array.from({ length: 42 }, (_, index) => {
      const value = addDays(firstVisible, index);
      const date = parseIso(value);
      return {
        value,
        day: date?.getUTCDate() ?? 0,
        outside: startOfMonth(value) !== month,
        disabled: this.isDateDisabled(value),
        today: value === this.today,
      };
    });
  }

  protected get frameClasses(): string {
    return uiClassNames(
      'flex w-full min-w-0 items-center gap-2 rounded-[var(--ui-control-radius,0.625rem)] border bg-white text-slate-950 shadow-sm transition-colors focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/20 dark:bg-slate-950 dark:text-slate-50 dark:focus-within:border-blue-400 dark:focus-within:ring-blue-400/20',
      this.size === 'sm' && 'min-h-9 px-3 text-sm',
      this.size === 'md' && 'min-h-10 px-3.5 text-sm',
      this.size === 'lg' && 'min-h-12 px-4 text-base',
      this.errorText
        ? 'border-red-600 dark:border-red-400'
        : 'border-slate-300 dark:border-slate-700',
      this.isDisabled && 'cursor-not-allowed bg-slate-100 opacity-60 dark:bg-slate-900',
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']) this.applyOpen(this.open, false);
    if (this.isDisabled && this.isOpen()) this.applyOpen(false, true);
    if (changes['locale']) this.changeDetector.markForCheck();
  }

  ngOnDestroy(): void {
    this.removeOutside();
  }

  writeValue(value: string | null): void {
    this.value = value && parseIso(value) ? value : '';
    if (this.value) {
      this.activeDate.set(value as string);
      this.visibleMonth.set(startOfMonth(value as string));
    }
    this.changeDetector.markForCheck();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
    if (disabled) this.applyOpen(false, true);
    this.changeDetector.markForCheck();
  }

  protected openCalendar(): void {
    this.applyOpen(true, true);
  }

  protected toggle(input: HTMLInputElement): void {
    this.applyOpen(!this.isOpen(), true);
    if (!this.isOpen()) input.focus();
  }

  protected clear(input: HTMLInputElement): void {
    this.commitValue('');
    input.focus();
  }

  protected handleInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.applyOpen(true, true);
    } else if (event.key === 'Escape' && this.isOpen()) {
      event.preventDefault();
      this.applyOpen(false, true);
    }
  }

  protected handleCalendarKeydown(event: KeyboardEvent): void {
    let next: string | null = null;
    if (event.key === 'ArrowRight') next = this.nextEnabledDate(this.activeDate(), 1);
    else if (event.key === 'ArrowLeft') next = this.nextEnabledDate(this.activeDate(), -1);
    else if (event.key === 'ArrowDown') next = this.nextEnabledDate(this.activeDate(), 7);
    else if (event.key === 'ArrowUp') next = this.nextEnabledDate(this.activeDate(), -7);
    else if (event.key === 'Home') {
      const date = parseIso(this.activeDate());
      if (date) {
        const offset = (date.getUTCDay() - this.firstDayOfWeek + 7) % 7;
        next = this.nextEnabledDate(addDays(this.activeDate(), -offset), 1, true);
      }
    } else if (event.key === 'End') {
      const date = parseIso(this.activeDate());
      if (date) {
        const offset = 6 - ((date.getUTCDay() - this.firstDayOfWeek + 7) % 7);
        next = this.nextEnabledDate(addDays(this.activeDate(), offset), -1, true);
      }
    } else if (event.key === 'PageUp' || event.key === 'PageDown') {
      const amount = (event.shiftKey ? 12 : 1) * (event.key === 'PageUp' ? -1 : 1);
      next = this.nextEnabledDate(addMonths(this.activeDate(), amount), amount > 0 ? 1 : -1, true);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.selectDate(this.activeDate());
      return;
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.applyOpen(false, true);
      this.focusInput();
      return;
    } else {
      return;
    }

    event.preventDefault();
    if (next) this.setActiveDate(next);
  }

  protected handleHostFocusOut(event: FocusEvent): void {
    if (event.relatedTarget && this.host.contains(event.relatedTarget as Node)) return;
    queueMicrotask(() => {
      if (this.host.contains(this.document.activeElement)) return;
      this.onTouched();
      this.applyOpen(false, true);
      this.blurred.emit(event);
    });
  }

  protected selectDate(value: string): void {
    const date = parseIso(value);
    if (!date || this.isDateDisabled(value)) return;
    this.activeDate.set(value);
    this.visibleMonth.set(startOfMonth(value));
    this.commitValue(value);
    this.dateSelected.emit({ value, date: new Date(date) });
    if (this.closeOnSelect) {
      this.applyOpen(false, true);
      this.focusInput();
    }
  }

  protected selectToday(): void {
    this.selectDate(this.today);
  }

  protected navigateMonth(amount: 1 | -1): void {
    if (!this.canNavigateMonth(amount)) return;
    const month = startOfMonth(addMonths(this.visibleMonth(), amount));
    this.visibleMonth.set(month);
    const target = this.nextEnabledDate(addMonths(this.activeDate(), amount), amount, true);
    if (target) this.activeDate.set(target);
    this.monthChange.emit(month);
    this.changeDetector.markForCheck();
    queueMicrotask(() => this.focusActiveDate());
  }

  protected canNavigateMonth(amount: 1 | -1): boolean {
    const target = startOfMonth(addMonths(this.visibleMonth(), amount));
    if (amount < 0 && this.min) return addMonths(target, 1) > startOfMonth(this.min);
    if (amount > 0 && this.max) return target <= startOfMonth(this.max);
    return true;
  }

  protected isDateDisabled(value: string): boolean {
    if (!parseIso(value)) return true;
    if (this.min && parseIso(this.min) && value < this.min) return true;
    if (this.max && parseIso(this.max) && value > this.max) return true;
    return this.disabledDates.includes(value);
  }

  protected dateAriaLabel(value: string): string {
    const date = parseIso(value);
    return date
      ? new Intl.DateTimeFormat(this.locale, {
          dateStyle: 'full',
          timeZone: 'UTC',
        }).format(date)
      : value;
  }

  protected dayClasses(day: UiCalendarDay): string {
    return uiClassNames(
      'inline-flex size-9 items-center justify-center rounded-lg text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400',
      day.value === this.value &&
        'bg-blue-700 font-semibold text-white hover:bg-blue-800 dark:bg-blue-500 dark:text-slate-950 dark:hover:bg-blue-400',
      day.value !== this.value &&
        !day.disabled &&
        'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
      day.outside && day.value !== this.value && 'text-slate-400 dark:text-slate-600',
      day.today && day.value !== this.value && 'font-semibold text-blue-700 dark:text-blue-300',
      day.disabled && 'cursor-not-allowed text-slate-300 opacity-50 dark:text-slate-700',
    );
  }

  private commitValue(value: string): void {
    if (this.value === value) return;
    this.value = value;
    this.onChange(value);
    this.valueChange.emit(value);
  }

  private applyOpen(open: boolean, emit: boolean): void {
    const next = open && !this.isDisabled;
    if (this.isOpen() === next) return;
    this.isOpen.set(next);
    if (next) {
      const target = this.resolveInitialDate();
      this.activeDate.set(target);
      this.visibleMonth.set(startOfMonth(target));
      this.installOutside();
      queueMicrotask(() => this.focusActiveDate());
    } else {
      this.removeOutside();
    }
    if (emit) this.openChange.emit(next);
  }

  private resolveInitialDate(): string {
    const candidates = [this.value, this.startAt, this.today].filter(
      (value) => Boolean(value) && Boolean(parseIso(value)),
    );
    for (const candidate of candidates) {
      const enabled = this.nextEnabledDate(candidate, 1, true);
      if (enabled) return enabled;
    }
    return this.today;
  }

  private nextEnabledDate(value: string, direction: number, includeStart = false): string | null {
    let candidate = includeStart ? value : addDays(value, direction);
    const step = direction >= 0 ? Math.max(1, direction) : Math.min(-1, direction);
    for (let attempt = 0; attempt < 732; attempt += 1) {
      if (!this.isDateDisabled(candidate)) return candidate;
      candidate = addDays(candidate, step);
      if ((this.min && candidate < this.min) || (this.max && candidate > this.max)) return null;
    }
    return null;
  }

  private setActiveDate(value: string): void {
    this.activeDate.set(value);
    const month = startOfMonth(value);
    if (month !== this.visibleMonth()) {
      this.visibleMonth.set(month);
      this.monthChange.emit(month);
    }
    this.changeDetector.markForCheck();
    queueMicrotask(() => this.focusActiveDate());
  }

  private focusActiveDate(): void {
    this.host
      .querySelector<HTMLElement>(`[data-date="${this.activeDate()}"]:not([disabled])`)
      ?.focus();
  }

  private focusInput(): void {
    queueMicrotask(() => this.host.querySelector<HTMLInputElement>('input')?.focus());
  }

  private installOutside(): void {
    if (this.removeOutsideListener) return;
    this.removeOutsideListener = this.renderer.listen(
      this.document,
      'pointerdown',
      (event: PointerEvent) => {
        if (!this.host.contains(event.target as Node)) this.applyOpen(false, true);
      },
    );
  }

  private removeOutside(): void {
    this.removeOutsideListener?.();
    this.removeOutsideListener = null;
  }
}
