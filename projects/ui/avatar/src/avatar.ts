import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

function uiClassNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export type UiAvatarSize = 'sm' | 'md' | 'lg';
export type UiAvatarShape = 'circle' | 'square';

const SIZE_CLASSES: Record<UiAvatarSize, string> = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-12 text-base',
};

const SHAPE_CLASSES: Record<UiAvatarShape, string> = {
  circle: 'rounded-full',
  square: 'rounded-md',
};

@Component({
  selector: 'ui-avatar',
  standalone: true,
  template: `
    <span
      [class]="classes()"
      [attr.role]="hasImage() ? null : accessibleLabel() ? 'img' : null"
      [attr.aria-label]="hasImage() ? null : accessibleLabel() || null"
      [attr.aria-hidden]="!hasImage() && !accessibleLabel() ? 'true' : null"
    >
      @if (hasImage()) {
        <img
          [src]="src()"
          [alt]="accessibleLabel()"
          class="size-full object-cover"
          [class.rounded-full]="shape() === 'circle'"
          [class.rounded-md]="shape() === 'square'"
          (error)="handleImageError()"
        />
      } @else {
        <span aria-hidden="true">{{ initials() }}</span>
      }
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiAvatarComponent {
  readonly src = input('');
  readonly alt = input('');
  readonly label = input('');
  readonly size = input<UiAvatarSize>('md');
  readonly shape = input<UiAvatarShape>('circle');
  readonly ariaLabel = input('');

  private readonly failedSrc = signal('');

  protected readonly accessibleLabel = computed(
    () => this.ariaLabel().trim() || this.alt().trim() || this.label().trim(),
  );
  protected readonly hasImage = computed(
    () => Boolean(this.src()) && this.failedSrc() !== this.src(),
  );

  protected readonly initials = computed(() => {
    const value = this.label().trim();
    if (!value) {
      return '?';
    }

    return value
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  });

  protected readonly classes = computed(() =>
    uiClassNames(
      'inline-flex shrink-0 items-center justify-center overflow-hidden bg-slate-100 font-semibold text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700',
      SIZE_CLASSES[this.size()],
      SHAPE_CLASSES[this.shape()],
    ),
  );

  protected handleImageError(): void {
    this.failedSrc.set(this.src());
  }
}
