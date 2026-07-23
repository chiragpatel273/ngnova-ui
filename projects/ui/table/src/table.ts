import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Directive,
  inject,
  Input,
  booleanAttribute,
  computed,
  input,
  numberAttribute,
  output,
  signal,
  TemplateRef,
} from '@angular/core';
import type { QueryList } from '@angular/core';

function uiClassNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

let nextTableId = 0;

export type UiTableRow = Record<string, unknown>;
export type UiTableAlign = 'left' | 'center' | 'right';
export type UiTableSortDirection = 'asc' | 'desc';
export type UiTableSelectionMode = 'none' | 'single' | 'multiple';
export type UiTableRowKey = string | number;

export interface UiTableColumn {
  readonly key: string;
  readonly header: string;
  readonly align?: UiTableAlign;
  readonly sortable?: boolean;
  readonly sticky?: 'start' | 'end';
}

export interface UiTableSort {
  readonly key: string;
  readonly direction: UiTableSortDirection;
}

export interface UiTableCellContext {
  readonly $implicit: unknown;
  readonly value: unknown;
  readonly row: UiTableRow;
  readonly column: UiTableColumn;
  readonly rowIndex: number;
}

export interface UiTableHeaderContext {
  readonly $implicit: UiTableColumn;
  readonly column: UiTableColumn;
}

@Directive({
  selector: 'ng-template[uiTableCell]',
  standalone: true,
})
export class UiTableCellDirective {
  @Input('uiTableCell') key = '';
  readonly template = inject<TemplateRef<UiTableCellContext>>(TemplateRef);
}

@Directive({
  selector: 'ng-template[uiTableHeader]',
  standalone: true,
})
export class UiTableHeaderDirective {
  @Input('uiTableHeader') key = '';
  readonly template = inject<TemplateRef<UiTableHeaderContext>>(TemplateRef);
}

const ALIGN_CLASSES: Record<UiTableAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

@Component({
  selector: 'ui-table',
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `
    <div
      class="overflow-hidden rounded-[var(--ui-surface-radius,0.75rem)] border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
    >
      <div [class]="overflowClasses()">
        <table class="w-full min-w-full text-sm" [attr.aria-busy]="loading() ? 'true' : null">
          @if (caption()) {
            <caption
              class="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-slate-100"
              [class.sr-only]="!captionVisible()"
            >
              {{
                caption()
              }}
            </caption>
          }
          <thead
            class="bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-300"
            [class.sticky]="stickyHeader()"
            [class.top-0]="stickyHeader()"
            [class.z-20]="stickyHeader()"
          >
            <tr>
              @if (showsSelectionColumn()) {
                <th
                  class="w-12 px-4 py-3 text-left"
                  scope="col"
                  [class.sticky]="stickySelectionColumn()"
                  [class.left-0]="stickySelectionColumn()"
                  [class.z-30]="stickySelectionColumn()"
                  [class.bg-slate-50]="stickySelectionColumn()"
                  [class.dark:bg-slate-900]="stickySelectionColumn()"
                >
                  @if (resolvedSelectionMode() === 'multiple') {
                    <input
                      type="checkbox"
                      class="size-4 rounded border-slate-300 accent-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:accent-blue-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950"
                      [checked]="allVisibleRowsSelected()"
                      [indeterminate]="someVisibleRowsSelected()"
                      [disabled]="!selectableRowKeys().length"
                      [attr.aria-label]="selectAllAriaLabel()"
                      (click)="$event.stopPropagation()"
                      (change)="toggleAllVisibleRows()"
                    />
                  } @else {
                    <span class="sr-only">{{ selectionColumnLabel() }}</span>
                  }
                </th>
              }
              @for (column of columns(); track column.key) {
                <th [class]="headerClasses(column)" scope="col" [attr.aria-sort]="ariaSort(column)">
                  @if (column.sortable) {
                    <button
                      type="button"
                      class="inline-flex items-center gap-1 rounded text-inherit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950"
                      (click)="toggleSort(column)"
                    >
                      <span>
                        @if (headerTemplate(column); as template) {
                          <ng-container
                            [ngTemplateOutlet]="template"
                            [ngTemplateOutletContext]="headerContext(column)"
                          />
                        } @else {
                          {{ column.header }}
                        }
                      </span>
                      <svg
                        class="size-4 shrink-0 fill-none stroke-current transition-transform"
                        [class.rotate-180]="sortDirection(column) === 'desc'"
                        viewBox="0 0 20 20"
                        stroke-width="1.75"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                        focusable="false"
                      >
                        @if (sortDirection(column) === 'none') {
                          <path d="m7 7 3-3 3 3M13 13l-3 3-3-3" />
                        } @else {
                          <path d="m6 12 4-4 4 4" />
                        }
                      </svg>
                    </button>
                  } @else {
                    @if (headerTemplate(column); as template) {
                      <ng-container
                        [ngTemplateOutlet]="template"
                        [ngTemplateOutletContext]="headerContext(column)"
                      />
                    } @else {
                      {{ column.header }}
                    }
                  }
                </th>
              }
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
            @if (loading()) {
              <tr>
                <td
                  [attr.colspan]="columnSpan"
                  class="px-4 py-8 text-center text-slate-500 dark:text-slate-400"
                >
                  <span role="status">{{ loadingText() }}</span>
                </td>
              </tr>
            } @else if (error()) {
              <tr>
                <td
                  [attr.colspan]="columnSpan"
                  class="px-4 py-8 text-center text-red-700 dark:text-red-300"
                >
                  <span role="alert">{{ errorText() }}</span>
                </td>
              </tr>
            } @else if (!rows().length) {
              <tr>
                <td
                  [attr.colspan]="columnSpan"
                  class="px-4 py-8 text-center text-slate-500 dark:text-slate-400"
                >
                  <span role="status">{{ emptyText() }}</span>
                </td>
              </tr>
            } @else {
              @for (row of rows(); track trackRow(row, $index); let rowIndex = $index) {
                <tr
                  [class]="rowClasses(row)"
                  [attr.aria-selected]="showsSelectionColumn() ? isRowSelected(row) : null"
                  [attr.tabindex]="rowsAreInteractive() ? 0 : null"
                  (click)="activateRow(row)"
                  (keydown)="onRowKeydown($event, row)"
                >
                  @if (showsSelectionColumn()) {
                    <td [class]="selectionCellClasses(row)">
                      <input
                        [type]="resolvedSelectionMode() === 'single' ? 'radio' : 'checkbox'"
                        [name]="resolvedSelectionMode() === 'single' ? selectionGroupName : ''"
                        class="size-4 border-slate-300 accent-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:accent-blue-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950"
                        [class.rounded]="resolvedSelectionMode() === 'multiple'"
                        [checked]="isRowSelected(row)"
                        [disabled]="rowKeyValue(row) === null"
                        [attr.aria-label]="rowSelectionLabel(row)"
                        (click)="$event.stopPropagation()"
                        (change)="toggleRowSelection(row)"
                      />
                    </td>
                  }
                  @for (column of columns(); track column.key) {
                    <td [class]="cellClasses(column)">
                      @if (cellTemplate(column); as template) {
                        <ng-container
                          [ngTemplateOutlet]="template"
                          [ngTemplateOutletContext]="cellContext(row, column, rowIndex)"
                        />
                      } @else {
                        {{ cellValue(row, column) }}
                      }
                    </td>
                  }
                </tr>
              }
            }
          </tbody>
        </table>
      </div>
      @if (paginationEnabled()) {
        <div
          class="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300"
        >
          <span aria-live="polite">{{ paginationSummary() }}</span>
          <nav class="flex items-center gap-2" [attr.aria-label]="paginationAriaLabel()">
            <button
              type="button"
              class="inline-flex min-h-9 items-center rounded-lg border border-slate-300 px-3 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950"
              [disabled]="normalizedPage() <= 1"
              [attr.aria-label]="previousPageAriaLabel()"
              (click)="requestPage(normalizedPage() - 1)"
            >
              {{ previousPageLabel() }}
            </button>
            <span>{{ pageStatus() }}</span>
            <button
              type="button"
              class="inline-flex min-h-9 items-center rounded-lg border border-slate-300 px-3 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950"
              [disabled]="normalizedPage() >= totalPages()"
              [attr.aria-label]="nextPageAriaLabel()"
              (click)="requestPage(normalizedPage() + 1)"
            >
              {{ nextPageLabel() }}
            </button>
          </nav>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTableComponent {
  @ContentChildren(UiTableCellDirective)
  private readonly cellTemplateDirectives?: QueryList<UiTableCellDirective>;
  @ContentChildren(UiTableHeaderDirective)
  private readonly headerTemplateDirectives?: QueryList<UiTableHeaderDirective>;

  readonly columns = input<readonly UiTableColumn[]>([]);
  readonly rows = input<readonly UiTableRow[]>([]);
  readonly emptyText = input('No records found.');
  readonly loadingText = input('Loading records...');
  readonly errorText = input('Unable to load records.');
  readonly caption = input('');
  readonly captionVisible = input(false, { transform: booleanAttribute });
  readonly rowKey = input('');
  readonly sort = input<UiTableSort | null>(null);
  readonly loading = input(false, { transform: booleanAttribute });
  readonly error = input(false, { transform: booleanAttribute });
  readonly selectable = input(false, { transform: booleanAttribute });
  readonly selectionMode = input<UiTableSelectionMode>('none');
  readonly selectedKeys = input<readonly UiTableRowKey[] | null>(null);
  readonly selectionColumnLabel = input('Row selection');
  readonly selectAllAriaLabel = input('Select all rows on this page');
  readonly rowSelectionAriaLabel = input('Select row');
  readonly stickyHeader = input(false, { transform: booleanAttribute });
  readonly stickySelectionColumn = input(false, { transform: booleanAttribute });
  readonly page = input(1, { transform: numberAttribute });
  readonly pageSize = input(0, { transform: numberAttribute });
  readonly totalItems = input(0, { transform: numberAttribute });
  readonly paginationAriaLabel = input('Table pagination');
  readonly previousPageLabel = input('Previous');
  readonly nextPageLabel = input('Next');
  readonly previousPageAriaLabel = input('Previous page');
  readonly nextPageAriaLabel = input('Next page');
  readonly rowSelected = output<UiTableRow>();
  readonly sortChange = output<UiTableSort>();
  readonly selectedKeysChange = output<readonly UiTableRowKey[]>();
  readonly pageChange = output<number>();

  private readonly sortState = signal<UiTableSort | null>(null);
  private readonly selectionState = signal<readonly UiTableRowKey[]>([]);
  protected readonly selectionGroupName = `ui-table-selection-${nextTableId++}`;
  protected readonly currentSort = computed(() => this.sort() ?? this.sortState());
  protected readonly resolvedSelectionMode = computed<UiTableSelectionMode>(() =>
    this.selectionMode() === 'none' && this.selectable() ? 'none' : this.selectionMode(),
  );
  protected readonly currentSelectedKeys = computed(
    () => this.selectedKeys() ?? this.selectionState(),
  );
  protected readonly showsSelectionColumn = computed(() => this.resolvedSelectionMode() !== 'none');
  protected readonly rowsAreInteractive = computed(
    () => this.selectable() || this.showsSelectionColumn(),
  );
  protected readonly selectableRowKeys = computed(() =>
    this.rows()
      .map((row) => this.rowKeyValue(row))
      .filter((key): key is UiTableRowKey => key !== null),
  );
  protected readonly allVisibleRowsSelected = computed(() => {
    const visible = this.selectableRowKeys();
    const selected = new Set(this.currentSelectedKeys());
    return visible.length > 0 && visible.every((key) => selected.has(key));
  });
  protected readonly someVisibleRowsSelected = computed(() => {
    const visible = this.selectableRowKeys();
    const selected = new Set(this.currentSelectedKeys());
    const count = visible.filter((key) => selected.has(key)).length;
    return count > 0 && count < visible.length;
  });
  protected readonly paginationEnabled = computed(() => this.pageSize() > 0);
  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(Math.max(0, this.totalItems()) / Math.max(1, this.pageSize()))),
  );
  protected readonly normalizedPage = computed(() =>
    Math.min(this.totalPages(), Math.max(1, Math.trunc(this.page()))),
  );
  protected readonly paginationSummary = computed(() => {
    const total = Math.max(0, Math.trunc(this.totalItems()));
    if (total === 0) {
      return '0 items';
    }
    const start = (this.normalizedPage() - 1) * Math.max(1, this.pageSize()) + 1;
    const end = Math.min(total, start + this.rows().length - 1);
    return `${start}–${Math.max(start, end)} of ${total}`;
  });
  protected readonly pageStatus = computed(
    () => `Page ${this.normalizedPage()} of ${this.totalPages()}`,
  );

  protected get columnSpan(): number {
    return Math.max(1, this.columns().length + (this.showsSelectionColumn() ? 1 : 0));
  }

  protected headerClasses(column: UiTableColumn): string {
    return uiClassNames(
      'px-4 py-3 text-xs font-semibold uppercase tracking-wide',
      ALIGN_CLASSES[column.align ?? 'left'],
      column.sticky === 'start' &&
        uiClassNames(
          'sticky z-10 bg-slate-50 dark:bg-slate-900',
          this.showsSelectionColumn() ? 'left-12' : 'left-0',
        ),
      column.sticky === 'end' && 'sticky right-0 z-10 bg-slate-50 dark:bg-slate-900',
    );
  }

  protected overflowClasses(): string {
    return uiClassNames('overflow-x-auto', this.stickyHeader() && 'max-h-[32rem]');
  }

  protected rowClasses(row: UiTableRow): string {
    return uiClassNames(
      'transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:hover:bg-slate-900 dark:focus-visible:ring-blue-400',
      this.rowsAreInteractive() && 'cursor-pointer',
      this.isRowSelected(row) && 'bg-blue-50 dark:bg-blue-950/30',
    );
  }

  protected selectionCellClasses(row: UiTableRow): string {
    return uiClassNames(
      'w-12 px-4 py-3',
      this.stickySelectionColumn() && 'sticky left-0 z-10',
      this.stickySelectionColumn() &&
        (this.isRowSelected(row) ? 'bg-blue-50 dark:bg-blue-950' : 'bg-white dark:bg-slate-950'),
    );
  }

  protected cellClasses(column: UiTableColumn): string {
    return uiClassNames(
      'px-4 py-3 text-slate-700 dark:text-slate-200',
      ALIGN_CLASSES[column.align ?? 'left'],
      column.sticky === 'start' &&
        uiClassNames(
          'sticky z-10 bg-white dark:bg-slate-950',
          this.showsSelectionColumn() ? 'left-12' : 'left-0',
        ),
      column.sticky === 'end' && 'sticky right-0 z-10 bg-white dark:bg-slate-950',
    );
  }

  protected cellValue(row: UiTableRow, column: UiTableColumn): string {
    const value = row[column.key];
    return value == null ? '' : String(value);
  }

  protected cellTemplate(column: UiTableColumn): TemplateRef<UiTableCellContext> | null {
    return (
      this.cellTemplateDirectives?.find((directive) => directive.key === column.key)?.template ??
      null
    );
  }

  protected headerTemplate(column: UiTableColumn): TemplateRef<UiTableHeaderContext> | null {
    return (
      this.headerTemplateDirectives?.find((directive) => directive.key === column.key)?.template ??
      null
    );
  }

  protected cellContext(
    row: UiTableRow,
    column: UiTableColumn,
    rowIndex: number,
  ): UiTableCellContext {
    const value = row[column.key];
    return { $implicit: value, value, row, column, rowIndex };
  }

  protected headerContext(column: UiTableColumn): UiTableHeaderContext {
    return { $implicit: column, column };
  }

  protected trackRow(row: UiTableRow, index: number): unknown {
    const key = this.rowKey();
    return key ? (row[key] ?? index) : index;
  }

  protected activateRow(row: UiTableRow): void {
    if (this.rowsAreInteractive()) {
      this.rowSelected.emit(row);
    }
    if (this.showsSelectionColumn()) {
      this.toggleRowSelection(row);
    }
  }

  protected onRowKeydown(event: KeyboardEvent, row: UiTableRow): void {
    if (!this.rowsAreInteractive() || (event.key !== 'Enter' && event.key !== ' ')) {
      return;
    }

    event.preventDefault();
    this.activateRow(row);
  }

  protected rowKeyValue(row: UiTableRow): UiTableRowKey | null {
    const key = this.rowKey();
    const value = key ? row[key] : null;
    return typeof value === 'string' || typeof value === 'number' ? value : null;
  }

  protected isRowSelected(row: UiTableRow): boolean {
    const key = this.rowKeyValue(row);
    return key !== null && this.currentSelectedKeys().includes(key);
  }

  protected rowSelectionLabel(row: UiTableRow): string {
    const key = this.rowKeyValue(row);
    return key === null ? this.rowSelectionAriaLabel() : `${this.rowSelectionAriaLabel()} ${key}`;
  }

  protected toggleRowSelection(row: UiTableRow): void {
    const key = this.rowKeyValue(row);
    if (key === null || this.resolvedSelectionMode() === 'none') {
      return;
    }

    const current = this.currentSelectedKeys();
    const next =
      this.resolvedSelectionMode() === 'single'
        ? current.includes(key)
          ? []
          : [key]
        : current.includes(key)
          ? current.filter((selectedKey) => selectedKey !== key)
          : [...current, key];
    this.commitSelection(next);
  }

  protected toggleAllVisibleRows(): void {
    if (this.resolvedSelectionMode() !== 'multiple') {
      return;
    }

    const visible = this.selectableRowKeys();
    const selected = new Set(this.currentSelectedKeys());
    if (this.allVisibleRowsSelected()) {
      visible.forEach((key) => selected.delete(key));
    } else {
      visible.forEach((key) => selected.add(key));
    }
    this.commitSelection([...selected]);
  }

  private commitSelection(keys: readonly UiTableRowKey[]): void {
    const next = Object.freeze([...keys]);
    this.selectionState.set(next);
    this.selectedKeysChange.emit(next);
  }

  protected requestPage(page: number): void {
    const next = Math.min(this.totalPages(), Math.max(1, Math.trunc(page)));
    if (next !== this.normalizedPage()) {
      this.pageChange.emit(next);
    }
  }

  protected toggleSort(column: UiTableColumn): void {
    if (!column.sortable) {
      return;
    }

    const current = this.currentSort();
    const direction: UiTableSortDirection =
      current?.key === column.key && current.direction === 'asc' ? 'desc' : 'asc';
    const next = { key: column.key, direction };
    this.sortState.set(next);
    this.sortChange.emit(next);
  }

  protected sortDirection(column: UiTableColumn): UiTableSortDirection | 'none' {
    const current = this.currentSort();
    if (current?.key !== column.key) {
      return 'none';
    }

    return current.direction;
  }

  protected ariaSort(column: UiTableColumn): 'ascending' | 'descending' | 'none' | null {
    if (!column.sortable) {
      return null;
    }

    const current = this.currentSort();
    if (current?.key !== column.key) {
      return 'none';
    }

    return current.direction === 'asc' ? 'ascending' : 'descending';
  }
}
