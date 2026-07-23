import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  forwardRef,
  inject,
  InjectionToken,
  Input,
  Renderer2,
} from '@angular/core';
import type { OnChanges, OnDestroy, OnInit } from '@angular/core';

export type UiFormFieldAppearance = 'filled' | 'outline';
export type UiFormFieldSize = 'sm' | 'md' | 'lg';

interface UiFormFieldRegistration {
  registerControl(control: UiFormFieldControlDirective): void;
  unregisterControl(control: UiFormFieldControlDirective): void;
}

const UI_FORM_FIELD = new InjectionToken<UiFormFieldRegistration>('UI_FORM_FIELD');

const SIZE_CLASSES: Record<UiFormFieldSize, string> = {
  sm: 'min-h-9 gap-2 px-3 text-sm',
  md: 'min-h-10 gap-2.5 px-3.5 text-sm',
  lg: 'min-h-12 gap-3 px-4 text-base',
};

const APPEARANCE_CLASSES: Record<UiFormFieldAppearance, string> = {
  outline: 'border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950',
  filled: 'border-transparent bg-slate-100 dark:bg-slate-900',
};

function uiClassNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

@Directive({
  selector: '[uiFormFieldControl]',
  standalone: true,
  host: {
    class:
      'block min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-inherit text-slate-950 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed dark:text-slate-50 dark:placeholder:text-slate-500',
  },
})
export class UiFormFieldControlDirective implements OnInit, OnDestroy {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly field = inject(UI_FORM_FIELD, { optional: true });
  private readonly originalAttributes = new Map<string, string | null>();
  private connected = false;

  ngOnInit(): void {
    this.capture('id');
    this.capture('aria-describedby');
    this.capture('aria-invalid');
    this.capture('aria-required');
    this.capture('aria-disabled');
    this.field?.registerControl(this);
  }

  ngOnDestroy(): void {
    this.field?.unregisterControl(this);
    this.disconnect();
  }

  resolveId(fallback: string): string {
    return this.originalAttributes.get('id') || fallback;
  }

  connect(
    id: string,
    describedBy: readonly string[],
    invalid: boolean,
    required: boolean,
    disabled: boolean,
  ): void {
    this.connected = true;
    this.setAttribute('id', id);
    const originalDescriptions = (this.originalAttributes.get('aria-describedby') ?? '')
      .split(/\s+/)
      .filter(Boolean);
    this.setAttribute(
      'aria-describedby',
      [...new Set([...originalDescriptions, ...describedBy])].join(' ') || null,
    );
    this.setAttribute('aria-invalid', invalid ? 'true' : this.original('aria-invalid'));
    this.setAttribute('aria-required', required ? 'true' : this.original('aria-required'));
    this.setAttribute('aria-disabled', disabled ? 'true' : this.original('aria-disabled'));
  }

  disconnect(): void {
    if (!this.connected) return;
    for (const [name, value] of this.originalAttributes) {
      this.setAttribute(name, value);
    }
    this.connected = false;
  }

  private capture(name: string): void {
    this.originalAttributes.set(name, this.element.nativeElement.getAttribute(name));
  }

  private original(name: string): string | null {
    return this.originalAttributes.get(name) ?? null;
  }

  private setAttribute(name: string, value: string | null): void {
    if (value === null || value === '') {
      this.renderer.removeAttribute(this.element.nativeElement, name);
    } else {
      this.renderer.setAttribute(this.element.nativeElement, name, value);
    }
  }
}

@Directive({
  selector: '[uiFormFieldPrefix]',
  standalone: true,
  host: {
    class: 'inline-flex shrink-0 items-center text-slate-500 dark:text-slate-400',
  },
})
export class UiFormFieldPrefixDirective {}

@Directive({
  selector: '[uiFormFieldSuffix]',
  standalone: true,
  host: {
    class: 'inline-flex shrink-0 items-center text-slate-500 dark:text-slate-400',
  },
})
export class UiFormFieldSuffixDirective {}

let nextFormFieldId = 0;

@Component({
  selector: 'ui-form-field',
  standalone: true,
  providers: [
    {
      provide: UI_FORM_FIELD,
      useExisting: forwardRef(() => UiFormFieldComponent),
    },
  ],
  template: `
    <div class="grid min-w-0 gap-1.5" [attr.data-invalid]="invalid ? 'true' : null">
      <label
        [attr.for]="controlId"
        [class]="
          hideLabel ? 'sr-only' : 'text-sm font-medium leading-5 text-slate-800 dark:text-slate-200'
        "
      >
        {{ label }}
        @if (required) {
          <span class="text-red-600 dark:text-red-400" aria-hidden="true">*</span>
        }
      </label>

      <div [class]="frameClasses">
        <ng-content select="[uiFormFieldPrefix]" />
        <ng-content select="[uiFormFieldControl]" />
        <ng-content select="[uiFormFieldSuffix]" />
      </div>

      @if (invalid && errorText) {
        <p
          [id]="errorId"
          class="m-0 text-xs leading-5 text-red-700 dark:text-red-300"
          aria-live="polite"
        >
          {{ errorText }}
        </p>
      } @else if (helperText) {
        <p [id]="helperId" class="m-0 text-xs leading-5 text-slate-500 dark:text-slate-400">
          {{ helperText }}
        </p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiFormFieldComponent implements UiFormFieldRegistration, OnChanges {
  @Input() id = `ui-form-field-${++nextFormFieldId}`;
  @Input() label = '';
  @Input() helperText = '';
  @Input() errorText = '';
  @Input() appearance: UiFormFieldAppearance = 'outline';
  @Input() size: UiFormFieldSize = 'md';
  @Input({ transform: booleanAttribute }) invalid = false;
  @Input({ transform: booleanAttribute }) required = false;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) hideLabel = false;

  private control: UiFormFieldControlDirective | null = null;

  protected get controlId(): string {
    return this.control?.resolveId(`${this.id}-control`) ?? `${this.id}-control`;
  }

  protected get helperId(): string {
    return `${this.id}-helper`;
  }

  protected get errorId(): string {
    return `${this.id}-error`;
  }

  protected get frameClasses(): string {
    return uiClassNames(
      'flex min-w-0 items-center rounded-[var(--ui-control-radius,0.625rem)] border text-slate-950 shadow-sm transition-colors focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/20 dark:text-slate-50 dark:focus-within:border-blue-400 dark:focus-within:ring-blue-400/20',
      SIZE_CLASSES[this.size],
      APPEARANCE_CLASSES[this.appearance],
      this.invalid &&
        'border-red-600 focus-within:border-red-600 focus-within:ring-red-600/20 dark:border-red-400 dark:focus-within:border-red-400 dark:focus-within:ring-red-400/20',
      this.disabled && 'cursor-not-allowed opacity-60',
    );
  }

  ngOnChanges(): void {
    this.syncControl();
  }

  registerControl(control: UiFormFieldControlDirective): void {
    this.control?.disconnect();
    this.control = control;
    this.syncControl();
  }

  unregisterControl(control: UiFormFieldControlDirective): void {
    if (this.control !== control) return;
    control.disconnect();
    this.control = null;
  }

  private syncControl(): void {
    if (!this.control) return;
    const describedBy =
      this.invalid && this.errorText ? [this.errorId] : this.helperText ? [this.helperId] : [];
    this.control.connect(this.controlId, describedBy, this.invalid, this.required, this.disabled);
  }
}
