import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  Input,
  numberAttribute,
  output,
} from '@angular/core';

export type UiPaginatorItem = number | 'ellipsis-start' | 'ellipsis-end';

@Component({
  selector: 'ui-paginator',
  standalone: true,
  template: `
    <nav [attr.aria-label]="ariaLabel" class="flex flex-wrap items-center justify-between gap-3">
      <p class="text-sm text-slate-600 dark:text-slate-300" aria-live="polite">
        {{ displayRange() }}
      </p>

      <div class="flex flex-wrap items-center gap-3">
        @if (pageSizeOptions.length) {
          <label class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <span>{{ itemsPerPageLabel }}</span>
            <select
              class="h-[var(--ui-control-height-sm,2rem)] rounded-[var(--ui-control-radius,0.625rem)] border border-slate-300 bg-white px-2 text-sm text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950"
              [value]="safePageSize()"
              [disabled]="disabled"
              (change)="changePageSize($event)"
            >
              @for (size of pageSizeOptions; track size) {
                <option [value]="size">{{ size }}</option>
              }
            </select>
          </label>
        }

        <div class="flex items-center gap-1">
          @if (showFirstLast) {
            <button
              type="button"
              [class]="navigationButtonClasses"
              [disabled]="disabled || currentPage() === 1"
              [attr.aria-label]="firstPageAriaLabel"
              (click)="requestPage(1)"
            >
              <span aria-hidden="true">«</span>
            </button>
          }
          <button
            type="button"
            [class]="navigationButtonClasses"
            [disabled]="disabled || currentPage() === 1"
            [attr.aria-label]="previousPageAriaLabel"
            (click)="requestPage(currentPage() - 1)"
          >
            <span aria-hidden="true">‹</span>
          </button>

          @for (item of pageItems(); track $index) {
            @if (typeof item === 'number') {
              <button
                type="button"
                [class]="pageButtonClasses(item)"
                [disabled]="disabled"
                [attr.aria-label]="pageAriaLabel(item)"
                [attr.aria-current]="item === currentPage() ? 'page' : null"
                (click)="requestPage(item)"
              >
                {{ item }}
              </button>
            } @else {
              <span class="grid size-9 place-items-center text-slate-500" aria-hidden="true"
                >…</span
              >
            }
          }

          <button
            type="button"
            [class]="navigationButtonClasses"
            [disabled]="disabled || currentPage() === totalPages()"
            [attr.aria-label]="nextPageAriaLabel"
            (click)="requestPage(currentPage() + 1)"
          >
            <span aria-hidden="true">›</span>
          </button>
          @if (showFirstLast) {
            <button
              type="button"
              [class]="navigationButtonClasses"
              [disabled]="disabled || currentPage() === totalPages()"
              [attr.aria-label]="lastPageAriaLabel"
              (click)="requestPage(totalPages())"
            >
              <span aria-hidden="true">»</span>
            </button>
          }
        </div>
      </div>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiPaginatorComponent {
  @Input({ transform: numberAttribute }) page = 1;
  @Input({ transform: numberAttribute }) pageSize = 10;
  @Input({ transform: numberAttribute }) totalItems = 0;
  @Input() pageSizeOptions: readonly number[] = [];
  @Input({ transform: numberAttribute }) siblingCount = 1;
  @Input({ transform: booleanAttribute }) showFirstLast = true;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input() ariaLabel = 'Pagination';
  @Input() itemsPerPageLabel = 'Items per page';
  @Input() firstPageAriaLabel = 'First page';
  @Input() previousPageAriaLabel = 'Previous page';
  @Input() nextPageAriaLabel = 'Next page';
  @Input() lastPageAriaLabel = 'Last page';
  @Input() getPageAriaLabel: (page: number) => string = (page) => `Page ${page}`;
  @Input() getRangeLabel: (start: number, end: number, total: number) => string = (
    start,
    end,
    total,
  ) => `${start}–${end} of ${total}`;
  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();

  protected safePageSize(): number {
    return Math.max(1, Math.floor(this.pageSize));
  }

  protected totalPages(): number {
    return Math.max(1, Math.ceil(Math.max(0, this.totalItems) / this.safePageSize()));
  }

  protected currentPage(): number {
    return Math.min(this.totalPages(), Math.max(1, Math.floor(this.page)));
  }

  protected displayRange(): string {
    const total = Math.max(0, Math.floor(this.totalItems));
    if (total === 0) return this.getRangeLabel(0, 0, 0);
    const start = (this.currentPage() - 1) * this.safePageSize() + 1;
    const end = Math.min(total, start + this.safePageSize() - 1);
    return this.getRangeLabel(start, end, total);
  }

  protected pageItems(): readonly UiPaginatorItem[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const siblings = Math.max(0, Math.floor(this.siblingCount));
    const visible = 2 * siblings + 5;
    if (total <= visible) return Array.from({ length: total }, (_, index) => index + 1);

    const left = Math.max(2, current - siblings);
    const right = Math.min(total - 1, current + siblings);
    const items: UiPaginatorItem[] = [1];
    if (left > 2) items.push('ellipsis-start');
    for (let page = left; page <= right; page += 1) items.push(page);
    if (right < total - 1) items.push('ellipsis-end');
    items.push(total);
    return items;
  }

  protected readonly navigationButtonClasses =
    'grid size-9 place-items-center rounded-[var(--ui-control-radius,0.625rem)] border border-slate-300 bg-white text-sm font-semibold text-slate-700 outline-none hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950';

  protected pageButtonClasses(page: number): string {
    return page === this.currentPage()
      ? 'grid size-9 place-items-center rounded-[var(--ui-control-radius,0.625rem)] bg-blue-600 text-sm font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:bg-blue-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950'
      : this.navigationButtonClasses;
  }

  protected pageAriaLabel(page: number): string {
    return this.getPageAriaLabel(page);
  }

  protected requestPage(page: number): void {
    if (this.disabled) return;
    const requested = Math.min(this.totalPages(), Math.max(1, Math.floor(page)));
    if (requested !== this.currentPage()) this.pageChange.emit(requested);
  }

  protected changePageSize(event: Event): void {
    if (this.disabled) return;
    const value = Number((event.target as HTMLSelectElement).value);
    if (Number.isFinite(value) && value > 0 && value !== this.safePageSize()) {
      this.pageSizeChange.emit(value);
    }
  }
}
