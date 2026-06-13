import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
  output,
  signal,
} from '@angular/core';

import { uiClassNames } from '../../shared/class-names';

export type UiTableRow = Record<string, unknown>;
export type UiTableAlign = 'left' | 'center' | 'right';
export type UiTableSortDirection = 'asc' | 'desc';

export interface UiTableColumn {
  readonly key: string;
  readonly header: string;
  readonly align?: UiTableAlign;
  readonly sortable?: boolean;
}

export interface UiTableSort {
  readonly key: string;
  readonly direction: UiTableSortDirection;
}

const ALIGN_CLASSES: Record<UiTableAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

@Component({
  selector: 'ui-table',
  standalone: true,
  template: `
    <div
      class="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
    >
      <div class="overflow-x-auto">
        <table class="w-full min-w-full text-sm">
          <thead class="bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
            <tr>
              @for (column of columns(); track column.key) {
                <th [class]="headerClasses(column)" scope="col" [attr.aria-sort]="ariaSort(column)">
                  @if (column.sortable) {
                    <button
                      type="button"
                      class="inline-flex items-center gap-1 rounded text-inherit focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      (click)="toggleSort(column)"
                    >
                      <span>{{ column.header }}</span>
                      <span aria-hidden="true">{{ sortIcon(column) }}</span>
                    </button>
                  } @else {
                    {{ column.header }}
                  }
                </th>
              }
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
            @if (loading()) {
              <tr>
                <td
                  [attr.colspan]="columns().length"
                  class="px-4 py-8 text-center text-slate-500 dark:text-slate-400"
                >
                  {{ loadingText() }}
                </td>
              </tr>
            } @else if (!rows().length) {
              <tr>
                <td
                  [attr.colspan]="columns().length"
                  class="px-4 py-8 text-center text-slate-500 dark:text-slate-400"
                >
                  {{ emptyText() }}
                </td>
              </tr>
            } @else {
              @for (row of rows(); track trackRow(row, $index)) {
                <tr
                  class="transition hover:bg-slate-50 dark:hover:bg-slate-900"
                  [class.cursor-pointer]="selectable()"
                  (click)="selectRow(row)"
                >
                  @for (column of columns(); track column.key) {
                    <td [class]="cellClasses(column)">{{ cellValue(row, column) }}</td>
                  }
                </tr>
              }
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTableComponent {
  readonly columns = input<readonly UiTableColumn[]>([]);
  readonly rows = input<readonly UiTableRow[]>([]);
  readonly emptyText = input('No records found.');
  readonly loadingText = input('Loading records...');
  readonly loading = input(false, { transform: booleanAttribute });
  readonly selectable = input(false, { transform: booleanAttribute });
  readonly rowSelected = output<UiTableRow>();
  readonly sortChange = output<UiTableSort>();

  private readonly sortState = signal<UiTableSort | null>(null);
  protected readonly currentSort = computed(() => this.sortState());

  protected headerClasses(column: UiTableColumn): string {
    return uiClassNames(
      'px-4 py-3 text-xs font-semibold uppercase tracking-wide',
      ALIGN_CLASSES[column.align ?? 'left'],
    );
  }

  protected cellClasses(column: UiTableColumn): string {
    return uiClassNames(
      'px-4 py-3 text-slate-700 dark:text-slate-200',
      ALIGN_CLASSES[column.align ?? 'left'],
    );
  }

  protected cellValue(row: UiTableRow, column: UiTableColumn): string {
    const value = row[column.key];
    return value == null ? '' : String(value);
  }

  protected trackRow(_row: UiTableRow, index: number): number {
    return index;
  }

  protected selectRow(row: UiTableRow): void {
    if (this.selectable()) {
      this.rowSelected.emit(row);
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

  protected sortIcon(column: UiTableColumn): string {
    const current = this.currentSort();
    if (current?.key !== column.key) {
      return 'sort';
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
