import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Input,
  output,
} from '@angular/core';

function uiClassNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export type UiButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type UiButtonSize = 'sm' | 'md' | 'lg';
export type UiButtonType = 'button' | 'submit' | 'reset';
export type UiButtonIntent = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
export type UiButtonAppearance = 'solid' | 'outline' | 'ghost' | 'text' | 'tonal';

const BASE_CLASSES =
  'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-60';

const VARIANT_CLASSES: Record<UiButtonVariant, string> = {
  primary:
    'bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus-visible:outline-blue-600 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:outline-blue-400',
  secondary:
    'bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:outline-slate-500 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
  outline:
    'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900',
  ghost:
    'bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:outline-slate-500 dark:text-slate-200 dark:hover:bg-slate-800',
  danger:
    'bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:outline-red-600 dark:bg-red-500 dark:hover:bg-red-400 dark:focus-visible:outline-red-400',
};

const APPEARANCE_INTENT_CLASSES: Record<UiButtonAppearance, Record<UiButtonIntent, string>> = {
  solid: {
    primary:
      'bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus-visible:outline-blue-600 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:outline-blue-400',
    secondary:
      'bg-slate-600 text-white shadow-sm hover:bg-slate-700 focus-visible:outline-slate-600 dark:bg-slate-500 dark:hover:bg-slate-400 dark:focus-visible:outline-slate-400',
    success:
      'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 focus-visible:outline-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:focus-visible:outline-emerald-400',
    warning:
      'bg-amber-500 text-slate-950 shadow-sm hover:bg-amber-600 focus-visible:outline-amber-500 dark:bg-amber-400 dark:hover:bg-amber-300 dark:focus-visible:outline-amber-300',
    danger:
      'bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:outline-red-600 dark:bg-red-500 dark:hover:bg-red-400 dark:focus-visible:outline-red-400',
    neutral:
      'bg-zinc-900 text-white shadow-sm hover:bg-zinc-800 focus-visible:outline-zinc-700 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white dark:focus-visible:outline-zinc-300',
  },
  outline: {
    primary:
      'border border-blue-300 bg-white text-blue-700 hover:bg-blue-50 focus-visible:outline-blue-600 dark:border-blue-800 dark:bg-slate-950 dark:text-blue-300 dark:hover:bg-blue-950/40 dark:focus-visible:outline-blue-400',
    secondary:
      'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900 dark:focus-visible:outline-slate-400',
    success:
      'border border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-50 focus-visible:outline-emerald-600 dark:border-emerald-800 dark:bg-slate-950 dark:text-emerald-300 dark:hover:bg-emerald-950/40 dark:focus-visible:outline-emerald-400',
    warning:
      'border border-amber-300 bg-white text-amber-700 hover:bg-amber-50 focus-visible:outline-amber-600 dark:border-amber-800 dark:bg-slate-950 dark:text-amber-300 dark:hover:bg-amber-950/40 dark:focus-visible:outline-amber-400',
    danger:
      'border border-red-300 bg-white text-red-700 hover:bg-red-50 focus-visible:outline-red-600 dark:border-red-800 dark:bg-slate-950 dark:text-red-300 dark:hover:bg-red-950/40 dark:focus-visible:outline-red-400',
    neutral:
      'border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50 focus-visible:outline-zinc-600 dark:border-zinc-700 dark:bg-slate-950 dark:text-zinc-100 dark:hover:bg-zinc-900 dark:focus-visible:outline-zinc-400',
  },
  ghost: {
    primary:
      'bg-transparent text-blue-700 hover:bg-blue-50 focus-visible:outline-blue-600 dark:text-blue-300 dark:hover:bg-blue-950/40 dark:focus-visible:outline-blue-400',
    secondary:
      'bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:outline-slate-500 dark:text-slate-200 dark:hover:bg-slate-800',
    success:
      'bg-transparent text-emerald-700 hover:bg-emerald-50 focus-visible:outline-emerald-600 dark:text-emerald-300 dark:hover:bg-emerald-950/40 dark:focus-visible:outline-emerald-400',
    warning:
      'bg-transparent text-amber-700 hover:bg-amber-50 focus-visible:outline-amber-600 dark:text-amber-300 dark:hover:bg-amber-950/40 dark:focus-visible:outline-amber-400',
    danger:
      'bg-transparent text-red-700 hover:bg-red-50 focus-visible:outline-red-600 dark:text-red-300 dark:hover:bg-red-950/40 dark:focus-visible:outline-red-400',
    neutral:
      'bg-transparent text-zinc-700 hover:bg-zinc-100 focus-visible:outline-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:focus-visible:outline-zinc-400',
  },
  text: {
    primary:
      'bg-transparent p-0 text-blue-700 hover:text-blue-800 focus-visible:outline-blue-600 dark:text-blue-300 dark:hover:text-blue-200',
    secondary:
      'bg-transparent p-0 text-slate-700 hover:text-slate-900 focus-visible:outline-slate-600 dark:text-slate-300 dark:hover:text-slate-100',
    success:
      'bg-transparent p-0 text-emerald-700 hover:text-emerald-800 focus-visible:outline-emerald-600 dark:text-emerald-300 dark:hover:text-emerald-200',
    warning:
      'bg-transparent p-0 text-amber-700 hover:text-amber-800 focus-visible:outline-amber-600 dark:text-amber-300 dark:hover:text-amber-200',
    danger:
      'bg-transparent p-0 text-red-700 hover:text-red-800 focus-visible:outline-red-600 dark:text-red-300 dark:hover:text-red-200',
    neutral:
      'bg-transparent p-0 text-zinc-700 hover:text-zinc-900 focus-visible:outline-zinc-600 dark:text-zinc-300 dark:hover:text-zinc-100',
  },
  tonal: {
    primary:
      'bg-blue-100 text-blue-900 hover:bg-blue-200 focus-visible:outline-blue-600 dark:bg-blue-950 dark:text-blue-200 dark:hover:bg-blue-900',
    secondary:
      'bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:outline-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
    success:
      'bg-emerald-100 text-emerald-900 hover:bg-emerald-200 focus-visible:outline-emerald-600 dark:bg-emerald-950 dark:text-emerald-200 dark:hover:bg-emerald-900',
    warning:
      'bg-amber-100 text-amber-950 hover:bg-amber-200 focus-visible:outline-amber-600 dark:bg-amber-950 dark:text-amber-200 dark:hover:bg-amber-900',
    danger:
      'bg-red-100 text-red-900 hover:bg-red-200 focus-visible:outline-red-600 dark:bg-red-950 dark:text-red-200 dark:hover:bg-red-900',
    neutral:
      'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 focus-visible:outline-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700',
  },
};

const SIZE_CLASSES: Record<UiButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
};

@Component({
  selector: 'ui-button-group',
  standalone: true,
  template: `
    <div role="group" [attr.aria-label]="ariaLabel || null" [class]="classes">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiButtonGroupComponent {
  @Input() ariaLabel = '';
  @Input({ transform: booleanAttribute }) fullWidth = false;

  protected get classes(): string {
    return uiClassNames(
      'inline-flex items-stretch overflow-hidden rounded-md shadow-sm [&_ui-button:not(:first-child)_button]:rounded-l-none [&_ui-button:not(:last-child)_button]:rounded-r-none [&_ui-button:not(:last-child)_button]:border-r-0',
      this.fullWidth && 'flex w-full [&_ui-button]:flex-1 [&_ui-button_button]:w-full',
    );
  }
}

@Component({
  selector: 'ui-button',
  standalone: true,
  template: `
    <button
      [attr.type]="type"
      [attr.aria-label]="ariaLabel || null"
      [disabled]="disabled || loading"
      [attr.aria-busy]="loading ? 'true' : null"
      [class]="classes"
      (click)="emitPressed($event)"
      (focus)="emitFocused($event)"
      (blur)="emitBlurred($event)"
    >
      @if (loading) {
        <span
          class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        ></span>
        @if (loadingLabel) {
          <span class="sr-only">{{ loadingLabel }}</span>
        }
      }
      <span><ng-content /></span>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiButtonComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  @Input() variant: UiButtonVariant = 'primary';
  @Input() size: UiButtonSize = 'md';
  @Input() intent: UiButtonIntent | null = null;
  @Input() appearance: UiButtonAppearance | null = null;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) loading = false;
  @Input({ transform: booleanAttribute }) fullWidth = false;
  @Input() ariaLabel = '';
  @Input() loadingLabel = 'Loading';
  @Input() type: UiButtonType = 'button';
  readonly pressed = output<MouseEvent>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();

  protected get classes(): string {
    return uiClassNames(
      BASE_CLASSES,
      this.visualClasses,
      SIZE_CLASSES[this.size],
      this.fullWidth && 'w-full',
    );
  }

  protected get visualClasses(): string {
    if (this.intent || this.appearance) {
      return APPEARANCE_INTENT_CLASSES[this.appearance ?? 'solid'][this.intent ?? 'primary'];
    }

    return VARIANT_CLASSES[this.variant];
  }

  protected emitPressed(event: MouseEvent): void {
    if (this.disabled || this.loading) {
      event.preventDefault();
      return;
    }

    this.pressed.emit(event);
  }

  protected emitFocused(event: FocusEvent): void {
    this.dispatchHostFocusEvent(event, 'focus');
    this.focused.emit(event);
  }

  protected emitBlurred(event: FocusEvent): void {
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
