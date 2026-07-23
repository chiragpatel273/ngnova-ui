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

export interface UiComboboxOption {
  readonly value: string;
  readonly label: string;
  readonly description?: string;
  readonly disabled?: boolean;
}

export interface UiComboboxSelection {
  readonly option: UiComboboxOption;
  readonly index: number;
}

interface UiComboboxDisplayOption {
  readonly option: UiComboboxOption;
  readonly index: number;
}

export type UiComboboxSize = 'sm' | 'md' | 'lg';

let nextComboboxId = 0;

@Component({
  selector: 'ui-combobox',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiComboboxComponent),
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
            role="combobox"
            type="text"
            [id]="inputId"
            [attr.name]="name || null"
            [attr.placeholder]="placeholder || null"
            [attr.autocomplete]="autocomplete"
            [attr.aria-label]="label ? null : ariaLabel || null"
            [attr.aria-autocomplete]="filterOptions ? 'list' : 'both'"
            [attr.aria-expanded]="isOpen()"
            [attr.aria-controls]="listboxId"
            [attr.aria-activedescendant]="activeOptionId"
            [attr.aria-describedby]="messageId"
            [attr.aria-invalid]="errorText ? 'true' : null"
            [attr.aria-required]="required ? 'true' : null"
            [value]="query()"
            [disabled]="isDisabled"
            class="min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-inherit text-slate-950 outline-none placeholder:text-slate-400 dark:text-slate-50 dark:placeholder:text-slate-500"
            (input)="handleInput($event)"
            (focus)="handleFocus($event)"
            (blur)="handleBlur($event)"
            (keydown)="handleKeydown($event)"
          />

          @if (loading) {
            <svg
              class="size-4 shrink-0 animate-spin fill-none stroke-slate-500 motion-reduce:animate-none dark:stroke-slate-400"
              viewBox="0 0 24 24"
              stroke-width="2"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" class="opacity-25" />
              <path d="M21 12a9 9 0 0 0-9-9" />
            </svg>
          }

          @if (clearable && query() && !isDisabled && !loading) {
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
              class="size-4 fill-none stroke-current transition-transform"
              [class.rotate-180]="isOpen()"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>

        @if (isOpen() && !isDisabled) {
          <div
            [id]="listboxId"
            role="listbox"
            [attr.aria-label]="label || ariaLabel || 'Suggestions'"
            [attr.aria-busy]="loading ? 'true' : null"
            class="absolute left-0 right-0 top-[calc(100%+0.375rem)] z-[950] max-h-64 overflow-y-auto rounded-[var(--ui-surface-radius,0.75rem)] border border-slate-200 bg-white p-1 shadow-xl dark:border-slate-700 dark:bg-slate-950"
          >
            @if (loading) {
              <div class="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                {{ loadingText }}
              </div>
            } @else if (!visibleOptions.length) {
              <div
                class="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400"
                role="status"
              >
                {{ noResultsText }}
              </div>
            } @else {
              @for (entry of visibleOptions; track entry.option.value; let visibleIndex = $index) {
                <button
                  type="button"
                  role="option"
                  tabindex="-1"
                  [id]="optionId(entry)"
                  [disabled]="entry.option.disabled"
                  [attr.aria-disabled]="entry.option.disabled ? 'true' : null"
                  [attr.aria-selected]="entry.option.value === value"
                  [attr.data-active]="visibleIndex === activeIndex() ? 'true' : null"
                  [class]="optionClasses(entry, visibleIndex)"
                  (mouseenter)="activate(visibleIndex)"
                  (mousedown)="$event.preventDefault()"
                  (click)="select(entry)"
                >
                  <span class="min-w-0 flex-1">
                    <span class="block truncate font-medium">{{ entry.option.label }}</span>
                    @if (entry.option.description) {
                      <span
                        class="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400"
                      >
                        {{ entry.option.description }}
                      </span>
                    }
                  </span>
                  @if (entry.option.value === value) {
                    <svg
                      class="size-4 shrink-0 fill-none stroke-blue-700 dark:stroke-blue-400"
                      viewBox="0 0 24 24"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m5 12 4 4L19 6" />
                    </svg>
                  }
                </button>
              }
            }
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
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiComboboxComponent implements ControlValueAccessor, OnChanges, OnDestroy {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() helperText = '';
  @Input() errorText = '';
  @Input() inputId = `ui-combobox-${++nextComboboxId}`;
  @Input() name = '';
  @Input() ariaLabel = '';
  @Input() autocomplete = 'off';
  @Input() size: UiComboboxSize = 'md';
  @Input() options: readonly UiComboboxOption[] = [];
  @Input({ transform: booleanAttribute }) open = false;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) required = false;
  @Input({ transform: booleanAttribute }) clearable = false;
  @Input({ transform: booleanAttribute }) loading = false;
  @Input({ transform: booleanAttribute }) filterOptions = true;
  @Input({ transform: booleanAttribute }) openOnFocus = true;
  @Input() noResultsText = 'No results found';
  @Input() loadingText = 'Loading suggestions';
  @Input() clearAriaLabel = 'Clear selection';
  @Input() openAriaLabel = 'Open suggestions';
  @Input() closeAriaLabel = 'Close suggestions';

  readonly valueChange = output<string>();
  readonly queryChange = output<string>();
  readonly openChange = output<boolean>();
  readonly optionSelected = output<UiComboboxSelection>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();

  protected value = '';
  protected readonly query = signal('');
  protected readonly isOpen = signal(false);
  protected readonly activeIndex = signal(-1);
  private readonly formDisabled = signal(false);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly document = inject(DOCUMENT);
  private readonly renderer = inject(Renderer2);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private removeOutsideListener: (() => void) | null = null;
  private editing = false;

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected get listboxId(): string {
    return `${this.inputId}-listbox`;
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

  protected get visibleOptions(): readonly UiComboboxDisplayOption[] {
    const entries = this.options.map((option, index) => ({ option, index }));
    if (!this.filterOptions) return entries;
    const term = this.query().trim().toLocaleLowerCase();
    if (!term || this.selectedOption?.label === this.query()) return entries;
    return entries.filter(
      ({ option }) =>
        option.label.toLocaleLowerCase().includes(term) ||
        option.description?.toLocaleLowerCase().includes(term),
    );
  }

  protected get activeOptionId(): string | null {
    const entry = this.visibleOptions[this.activeIndex()];
    return this.isOpen() && entry && !entry.option.disabled ? this.optionId(entry) : null;
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
    if (changes['options'] && !this.editing) this.syncQueryToValue();
    if (this.isDisabled && this.isOpen()) this.applyOpen(false, true);
  }

  ngOnDestroy(): void {
    this.removeOutside();
  }

  writeValue(value: string | null): void {
    this.value = value ?? '';
    this.syncQueryToValue();
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

  protected handleInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.editing = true;
    this.query.set(query);
    this.queryChange.emit(query);
    if (this.value && query !== this.selectedOption?.label) this.commitValue('');
    this.applyOpen(true, true);
    this.resetActive();
  }

  protected handleFocus(event: FocusEvent): void {
    this.editing = true;
    this.focused.emit(event);
    if (this.openOnFocus) this.applyOpen(true, true);
  }

  protected handleBlur(event: FocusEvent): void {
    if (event.relatedTarget && this.host.contains(event.relatedTarget as Node)) return;
    this.editing = false;
    this.onTouched();
    this.applyOpen(false, true);
    this.blurred.emit(event);
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!this.isOpen()) this.applyOpen(true, true);
      this.moveActive(event.key === 'ArrowDown' ? 1 : -1);
    } else if (event.key === 'Home' && this.isOpen()) {
      event.preventDefault();
      this.moveToBoundary(1);
    } else if (event.key === 'End' && this.isOpen()) {
      event.preventDefault();
      this.moveToBoundary(-1);
    } else if (event.key === 'Enter' && this.isOpen()) {
      const entry = this.visibleOptions[this.activeIndex()];
      if (entry && !entry.option.disabled) {
        event.preventDefault();
        this.select(entry);
      }
    } else if (event.key === 'Escape' && this.isOpen()) {
      event.preventDefault();
      this.syncQueryToValue();
      this.applyOpen(false, true);
    } else if (event.key === 'Tab') {
      this.editing = false;
      this.applyOpen(false, true);
    }
  }

  protected activate(index: number): void {
    if (!this.visibleOptions[index]?.option.disabled) this.activeIndex.set(index);
  }

  protected select(entry: UiComboboxDisplayOption): void {
    if (entry.option.disabled) return;
    this.editing = false;
    this.query.set(entry.option.label);
    this.queryChange.emit(entry.option.label);
    this.commitValue(entry.option.value);
    this.optionSelected.emit({ option: entry.option, index: entry.index });
    this.applyOpen(false, true);
  }

  protected clear(input: HTMLInputElement): void {
    this.editing = true;
    this.query.set('');
    this.queryChange.emit('');
    this.commitValue('');
    this.applyOpen(true, true);
    this.resetActive();
    input.focus();
  }

  protected toggle(input: HTMLInputElement): void {
    this.applyOpen(!this.isOpen(), true);
    input.focus();
  }

  protected optionId(entry: UiComboboxDisplayOption): string {
    return `${this.listboxId}-option-${this.toDomId(entry.option.value)}-${entry.index}`;
  }

  protected optionClasses(entry: UiComboboxDisplayOption, visibleIndex: number): string {
    return uiClassNames(
      'flex w-full min-w-0 items-center gap-3 rounded-[var(--ui-control-radius,0.625rem)] px-3 py-2 text-left text-sm outline-none',
      entry.option.disabled && 'cursor-not-allowed text-slate-400 opacity-60 dark:text-slate-600',
      !entry.option.disabled &&
        visibleIndex === this.activeIndex() &&
        'bg-blue-50 text-slate-950 dark:bg-blue-950/60 dark:text-white',
      !entry.option.disabled &&
        visibleIndex !== this.activeIndex() &&
        'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
    );
  }

  private get selectedOption(): UiComboboxOption | undefined {
    return this.options.find((option) => option.value === this.value);
  }

  private commitValue(value: string): void {
    if (this.value === value) return;
    this.value = value;
    this.onChange(value);
    this.valueChange.emit(value);
  }

  private syncQueryToValue(): void {
    this.query.set(this.selectedOption?.label ?? '');
  }

  private applyOpen(open: boolean, emit: boolean): void {
    const next = open && !this.isDisabled;
    if (this.isOpen() === next) return;
    this.isOpen.set(next);
    if (next) {
      this.resetActive();
      this.installOutside();
    } else {
      this.activeIndex.set(-1);
      this.removeOutside();
    }
    if (emit) this.openChange.emit(next);
  }

  private resetActive(): void {
    const selected = this.visibleOptions.findIndex(
      ({ option }) => option.value === this.value && !option.disabled,
    );
    if (selected >= 0) {
      this.activeIndex.set(selected);
      return;
    }
    this.moveToBoundary(1);
  }

  private moveActive(direction: 1 | -1): void {
    const options = this.visibleOptions;
    if (!options.length) {
      this.activeIndex.set(-1);
      return;
    }
    const currentIndex = this.activeIndex();
    const candidateIndices = options.map(
      (_, offset) =>
        (currentIndex + direction * (offset + 1) + options.length * (offset + 1)) % options.length,
    );
    for (const index of candidateIndices) {
      if (!options[index]?.option.disabled) {
        this.activeIndex.set(index);
        return;
      }
    }
    this.activeIndex.set(-1);
  }

  private moveToBoundary(direction: 1 | -1): void {
    const options = this.visibleOptions;
    const indices = options.map((_, index) => index);
    const orderedIndices = direction === 1 ? indices : indices.reverse();
    for (const index of orderedIndices) {
      if (!options[index]?.option.disabled) {
        this.activeIndex.set(index);
        return;
      }
    }
    this.activeIndex.set(-1);
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

  private toDomId(value: string): string {
    return (
      value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'option'
    );
  }
}
