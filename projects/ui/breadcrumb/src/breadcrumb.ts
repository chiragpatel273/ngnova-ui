import { ChangeDetectionStrategy, Component, Input, numberAttribute, output } from '@angular/core';

export interface UiBreadcrumbItem {
  readonly label: string;
  readonly href?: string;
  readonly current?: boolean;
}

export interface UiBreadcrumbSelection {
  readonly item: UiBreadcrumbItem;
  readonly index: number;
  readonly event: MouseEvent;
}

export type UiBreadcrumbDisplayItem =
  | { readonly kind: 'item'; readonly item: UiBreadcrumbItem; readonly index: number }
  | { readonly kind: 'ellipsis' };

@Component({
  selector: 'ui-breadcrumb',
  standalone: true,
  template: `
    <nav [attr.aria-label]="ariaLabel">
      <ol class="flex min-w-0 flex-wrap items-center gap-1 text-sm">
        @for (entry of displayItems(); track $index; let last = $last) {
          <li class="flex min-w-0 items-center gap-1">
            @if (entry.kind === 'ellipsis') {
              <span
                class="px-1 text-slate-500 dark:text-slate-400"
                aria-hidden="true"
                data-breadcrumb-ellipsis
              >
                &hellip;
              </span>
            } @else if (isCurrent(entry)) {
              <span
                class="max-w-64 truncate px-1 font-medium text-slate-950 dark:text-slate-50"
                aria-current="page"
              >
                {{ entry.item.label }}
              </span>
            } @else if (entry.item.href) {
              <a
                class="max-w-64 truncate rounded-[var(--ui-control-radius,0.625rem)] px-1.5 py-1 text-slate-600 outline-none hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950"
                [attr.href]="entry.item.href"
                (click)="select(entry, $event)"
              >
                {{ entry.item.label }}
              </a>
            } @else {
              <span class="max-w-64 truncate px-1 text-slate-500 dark:text-slate-400">
                {{ entry.item.label }}
              </span>
            }

            @if (!last) {
              <svg
                class="size-4 shrink-0 fill-none stroke-slate-400 dark:stroke-slate-600"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiBreadcrumbComponent {
  @Input() items: readonly UiBreadcrumbItem[] = [];
  @Input() ariaLabel = 'Breadcrumb';
  @Input({ transform: numberAttribute }) maxItems = 0;
  readonly itemSelected = output<UiBreadcrumbSelection>();

  protected displayItems(): readonly UiBreadcrumbDisplayItem[] {
    const indexed = this.items.map(
      (item, index): UiBreadcrumbDisplayItem => ({ kind: 'item', item, index }),
    );
    const max = Math.max(0, Math.floor(this.maxItems));
    if (max === 0 || indexed.length <= max || max < 3) return indexed;
    return [indexed[0], { kind: 'ellipsis' }, ...indexed.slice(-(max - 2))];
  }

  protected isCurrent(entry: Extract<UiBreadcrumbDisplayItem, { kind: 'item' }>): boolean {
    const hasExplicitCurrent = this.items.some((item) => item.current === true);
    return (
      entry.item.current === true || (!hasExplicitCurrent && entry.index === this.items.length - 1)
    );
  }

  protected select(
    entry: Extract<UiBreadcrumbDisplayItem, { kind: 'item' }>,
    event: MouseEvent,
  ): void {
    this.itemSelected.emit({ item: entry.item, index: entry.index, event });
  }
}
