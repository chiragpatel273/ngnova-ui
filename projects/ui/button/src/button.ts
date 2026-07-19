import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  inject,
  Input,
  output,
} from '@angular/core';
import type { OnDestroy, OnInit } from '@angular/core';

function uiClassNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export type UiButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type UiButtonSize = 'sm' | 'md' | 'lg';
export type UiButtonType = 'button' | 'submit' | 'reset';
export type UiButtonIntent = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
export type UiButtonAppearance = 'solid' | 'outline' | 'ghost' | 'text' | 'tonal';

const BASE_CLASSES =
  'relative isolate inline-flex shrink-0 cursor-pointer select-none items-center justify-center rounded-lg font-medium tracking-[-0.006em] whitespace-nowrap transition-[color,background-color,border-color,box-shadow,transform] duration-150 ease-out focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 active:translate-y-px active:shadow-none active:duration-75 motion-reduce:transform-none motion-reduce:transition-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:transform-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950';

const RAISED_FINISH_CLASSES =
  'shadow-sm shadow-slate-950/10 ring-1 ring-inset ring-white/10 hover:shadow-md hover:shadow-slate-950/15';
const OUTLINED_FINISH_CLASSES =
  'shadow-sm shadow-slate-950/5 hover:shadow-md hover:shadow-slate-950/10';
const TONAL_FINISH_CLASSES = 'ring-1 ring-inset ring-slate-900/5 dark:ring-white/10';

function getFinishClasses(
  variant: UiButtonVariant,
  appearance?: UiButtonAppearance | null,
): string {
  if (appearance === 'outline' || (!appearance && variant === 'outline')) {
    return OUTLINED_FINISH_CLASSES;
  }

  if (appearance === 'tonal' || (!appearance && variant === 'secondary')) {
    return TONAL_FINISH_CLASSES;
  }

  if (!appearance || appearance === 'solid') {
    return RAISED_FINISH_CLASSES;
  }

  return '';
}

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
  sm: 'h-8 gap-1.5 px-3 text-sm leading-5',
  md: 'h-10 gap-2 px-4 text-sm leading-5',
  lg: 'h-12 gap-2.5 px-5 text-base leading-6',
};

const ICON_ONLY_SIZE_CLASSES: Record<UiButtonSize, string> = {
  sm: 'size-8 p-0 text-sm',
  md: 'size-10 p-0 text-sm',
  lg: 'size-12 p-0 text-base',
};

const ICON_ONLY_GLYPH_SIZE_CLASSES: Record<UiButtonSize, string> = {
  sm: '[--ui-button-icon-size:1rem]',
  md: '[--ui-button-icon-size:1.125rem]',
  lg: '[--ui-button-icon-size:1.25rem]',
};

@Directive({
  selector: '[uiButtonIconStart]',
  standalone: true,
  host: {
    class:
      'pointer-events-none inline-flex size-[var(--ui-button-icon-size,1rem)] shrink-0 items-center justify-center leading-none [--ng-icon__stroke-width:2] [&_svg]:block [&_svg]:size-full',
    'aria-hidden': 'true',
  },
})
export class UiButtonIconStartDirective {}

@Directive({
  selector: '[uiButtonIconEnd]',
  standalone: true,
  host: {
    class:
      'pointer-events-none inline-flex size-[var(--ui-button-icon-size,1rem)] shrink-0 items-center justify-center leading-none [--ng-icon__stroke-width:2] [&_svg]:block [&_svg]:size-full',
    'aria-hidden': 'true',
  },
})
export class UiButtonIconEndDirective {}

@Directive({
  selector: '[uiButton]',
  standalone: true,
  host: {
    '[class]': 'classes',
    '[attr.aria-disabled]': "disabled ? 'true' : null",
    '[attr.tabindex]': 'disabled ? -1 : null',
    '[attr.disabled]': 'buttonHost && disabled ? true : null',
  },
})
export class UiButtonDirective implements OnInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private removeCaptureClickListener: (() => void) | null = null;

  @Input() variant: UiButtonVariant = 'primary';
  @Input() size: UiButtonSize = 'md';
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) fullWidth = false;

  protected get buttonHost(): boolean {
    return this.host.nativeElement.tagName.toLowerCase() === 'button';
  }

  ngOnInit(): void {
    const element = this.host.nativeElement;
    const listener = (event: MouseEvent): void => this.onClick(event);
    element.addEventListener('click', listener, { capture: true });
    this.removeCaptureClickListener = () => {
      element.removeEventListener('click', listener, { capture: true });
    };
  }

  ngOnDestroy(): void {
    this.removeCaptureClickListener?.();
    this.removeCaptureClickListener = null;
  }

  protected get classes(): string {
    return uiClassNames(
      BASE_CLASSES,
      VARIANT_CLASSES[this.variant],
      getFinishClasses(this.variant),
      SIZE_CLASSES[this.size],
      this.fullWidth && 'w-full',
      this.disabled && 'pointer-events-none',
    );
  }

  private onClick(event: MouseEvent): void {
    if (!this.disabled) {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
  }
}

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
      'inline-flex items-stretch overflow-hidden rounded-lg shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 [&_ui-button:not(:first-child)_button]:rounded-l-none [&_ui-button:not(:last-child)_button]:rounded-r-none [&_ui-button:not(:last-child)_button]:border-r-0',
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
          class="size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        ></span>
        @if (loadingLabel) {
          <span class="sr-only">{{ loadingLabel }}</span>
        }
      }
      <ng-content select="[uiButtonIconStart]" />
      <span class="inline-flex min-w-0 items-center justify-center" [class.hidden]="iconOnly"
        ><ng-content
      /></span>
      <ng-content select="[uiButtonIconEnd]" />
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
  @Input({ transform: booleanAttribute }) iconOnly = false;
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
      getFinishClasses(this.variant, this.appearance),
      this.iconOnly ? ICON_ONLY_SIZE_CLASSES[this.size] : SIZE_CLASSES[this.size],
      this.iconOnly && ICON_ONLY_GLYPH_SIZE_CLASSES[this.size],
      this.iconOnly && '[&>span]:hidden',
      this.loading &&
        '[&_[uiButtonIconStart]]:hidden [&_[uiButtonIconEnd]]:hidden [&>[aria-hidden=true]]:m-0',
      this.fullWidth && !this.iconOnly && 'w-full',
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
