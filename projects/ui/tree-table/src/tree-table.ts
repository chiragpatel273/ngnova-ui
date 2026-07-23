import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import type { ElementRef } from '@angular/core';

export type UiTreeTableAlign = 'left' | 'center' | 'right';
export type UiTreeTableSortDirection = 'asc' | 'desc';

export interface UiTreeTableColumn {
  readonly key: string;
  readonly header: string;
  readonly align?: UiTreeTableAlign;
  readonly sortable?: boolean;
}

export interface UiTreeTableNode {
  readonly value: string;
  readonly data: Readonly<Record<string, unknown>>;
  readonly disabled?: boolean;
  readonly children?: readonly UiTreeTableNode[];
}

export interface UiTreeTableSort {
  readonly key: string;
  readonly direction: UiTreeTableSortDirection;
}

export interface UiTreeTableVisibleNode {
  readonly node: UiTreeTableNode;
  readonly level: number;
  readonly parentValue: string | null;
}

const ALIGN_CLASSES: Record<UiTreeTableAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

function flattenNodes(
  nodes: readonly UiTreeTableNode[],
  expanded: ReadonlySet<string>,
  level = 1,
  parentValue: string | null = null,
): UiTreeTableVisibleNode[] {
  return nodes.flatMap((node) => {
    const current = { node, level, parentValue };
    return node.children?.length && expanded.has(node.value)
      ? [current, ...flattenNodes(node.children, expanded, level + 1, node.value)]
      : [current];
  });
}

@Component({
  selector: 'ui-tree-table',
  standalone: true,
  template: `
    <div
      class="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
    >
      <div class="overflow-x-auto">
        <table
          #tableRoot
          class="w-full min-w-full text-sm"
          role="treegrid"
          [attr.aria-label]="caption()"
          [attr.aria-busy]="loading() ? 'true' : null"
        >
          <thead class="bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
            <tr role="row">
              @for (column of columns(); track column.key) {
                <th
                  role="columnheader"
                  scope="col"
                  [class]="headerClasses(column)"
                  [attr.aria-sort]="ariaSort(column)"
                >
                  @if (column.sortable) {
                    <button
                      type="button"
                      class="inline-flex items-center gap-1 rounded font-inherit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950"
                      (click)="requestSort(column)"
                    >
                      {{ column.header }}
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
                    {{ column.header }}
                  }
                </th>
              }
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
            @if (loading()) {
              <tr role="row">
                <td [attr.colspan]="columnSpan()" class="px-4 py-10 text-center" role="gridcell">
                  <span role="status">{{ loadingText() }}</span>
                </td>
              </tr>
            } @else if (error()) {
              <tr role="row">
                <td
                  [attr.colspan]="columnSpan()"
                  class="px-4 py-10 text-center text-red-700 dark:text-red-300"
                  role="gridcell"
                >
                  <span role="alert">{{ errorText() }}</span>
                </td>
              </tr>
            } @else if (!visibleNodes().length) {
              <tr role="row">
                <td [attr.colspan]="columnSpan()" class="px-4 py-10 text-center" role="gridcell">
                  <span role="status">{{ emptyText() }}</span>
                </td>
              </tr>
            } @else {
              @for (entry of visibleNodes(); track entry.node.value; let rowIndex = $index) {
                <tr
                  role="row"
                  [class]="rowClasses(entry)"
                  [attr.aria-level]="entry.level"
                  [attr.aria-expanded]="hasChildren(entry) ? isExpanded(entry) : null"
                  [attr.aria-selected]="selectable() ? isSelected(entry) : null"
                  [attr.aria-disabled]="entry.node.disabled ? 'true' : null"
                  [attr.tabindex]="rowIndex === activeIndex() ? 0 : -1"
                  (focus)="activeIndex.set(rowIndex)"
                  (click)="activate(entry, rowIndex)"
                  (keydown)="onRowKeydown($event, entry, rowIndex)"
                >
                  @for (column of columns(); track column.key; let columnIndex = $index) {
                    <td role="gridcell" [class]="cellClasses(column)">
                      @if (columnIndex === 0) {
                        <span
                          class="inline-flex min-w-0 items-center gap-2"
                          [style.padding-left.rem]="(entry.level - 1) * 1.25"
                        >
                          <button
                            type="button"
                            class="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-slate-800 dark:focus-visible:ring-blue-400"
                            [class.invisible]="!hasChildren(entry)"
                            [attr.tabindex]="hasChildren(entry) ? 0 : -1"
                            [attr.aria-label]="expansionLabel(entry)"
                            (click)="toggleFromButton($event, entry)"
                          >
                            <svg
                              class="size-4 fill-none stroke-current transition-transform"
                              [class.rotate-90]="isExpanded(entry)"
                              viewBox="0 0 20 20"
                              stroke-width="1.75"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              aria-hidden="true"
                            >
                              <path d="m8 6 4 4-4 4" />
                            </svg>
                          </button>
                          <span class="truncate">{{ cellValue(entry, column) }}</span>
                        </span>
                      } @else {
                        {{ cellValue(entry, column) }}
                      }
                    </td>
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
export class UiTreeTableComponent {
  readonly columns = input<readonly UiTreeTableColumn[]>([]);
  readonly nodes = input<readonly UiTreeTableNode[]>([]);
  readonly expanded = input<readonly string[]>([]);
  readonly selected = input<string | null>(null);
  readonly sort = input<UiTreeTableSort | null>(null);
  readonly caption = input('Tree table');
  readonly loading = input(false, { transform: booleanAttribute });
  readonly error = input(false, { transform: booleanAttribute });
  readonly selectable = input(true, { transform: booleanAttribute });
  readonly loadingText = input('Loading rows...');
  readonly errorText = input('Unable to load rows.');
  readonly emptyText = input('No rows found.');
  readonly expandAriaLabel = input('Expand row');
  readonly collapseAriaLabel = input('Collapse row');
  readonly expandedChange = output<readonly string[]>();
  readonly selectedChange = output<string | null>();
  readonly sortChange = output<UiTreeTableSort>();
  readonly nodeActivated = output<UiTreeTableNode>();

  protected readonly activeIndex = signal(0);
  private readonly tableRoot = viewChild.required<ElementRef<HTMLTableElement>>('tableRoot');
  protected readonly visibleNodes = computed(() =>
    flattenNodes(this.nodes(), new Set(this.expanded())),
  );
  protected readonly columnSpan = computed(() => Math.max(1, this.columns().length));

  protected hasChildren(entry: UiTreeTableVisibleNode): boolean {
    return Boolean(entry.node.children?.length);
  }

  protected isExpanded(entry: UiTreeTableVisibleNode): boolean {
    return this.expanded().includes(entry.node.value);
  }

  protected isSelected(entry: UiTreeTableVisibleNode): boolean {
    return this.selected() === entry.node.value;
  }

  protected activate(entry: UiTreeTableVisibleNode, index: number): void {
    if (entry.node.disabled) {
      return;
    }
    this.activeIndex.set(index);
    if (this.selectable()) {
      this.selectedChange.emit(entry.node.value);
    }
    this.nodeActivated.emit(entry.node);
  }

  protected toggleFromButton(event: MouseEvent, entry: UiTreeTableVisibleNode): void {
    event.stopPropagation();
    this.toggleExpanded(entry);
  }

  protected onRowKeydown(event: KeyboardEvent, entry: UiTreeTableVisibleNode, index: number): void {
    const last = this.visibleNodes().length - 1;
    let target: number | null = null;
    if (event.key === 'ArrowDown') target = Math.min(last, index + 1);
    else if (event.key === 'ArrowUp') target = Math.max(0, index - 1);
    else if (event.key === 'Home') target = 0;
    else if (event.key === 'End') target = last;
    else if (event.key === 'ArrowRight' && this.hasChildren(entry) && !this.isExpanded(entry)) {
      this.toggleExpanded(entry);
    } else if (event.key === 'ArrowLeft' && this.hasChildren(entry) && this.isExpanded(entry)) {
      this.toggleExpanded(entry);
    } else if (event.key === 'ArrowLeft' && entry.parentValue) {
      target = this.visibleNodes().findIndex(
        (candidate) => candidate.node.value === entry.parentValue,
      );
    } else if (event.key === 'Enter' || event.key === ' ') {
      this.activate(entry, index);
    } else {
      return;
    }
    event.preventDefault();
    if (target !== null && target >= 0) this.focusRow(target);
  }

  private toggleExpanded(entry: UiTreeTableVisibleNode): void {
    if (!this.hasChildren(entry) || entry.node.disabled) return;
    const values = new Set(this.expanded());
    if (values.has(entry.node.value)) {
      values.delete(entry.node.value);
    } else {
      values.add(entry.node.value);
    }
    this.expandedChange.emit(Object.freeze([...values]));
  }

  private focusRow(index: number): void {
    this.activeIndex.set(index);
    queueMicrotask(() => {
      const rows =
        this.tableRoot().nativeElement.querySelectorAll<HTMLElement>('tbody tr[role="row"]');
      rows[index]?.focus();
    });
  }

  protected requestSort(column: UiTreeTableColumn): void {
    if (!column.sortable) return;
    const direction: UiTreeTableSortDirection =
      this.sort()?.key === column.key && this.sort()?.direction === 'asc' ? 'desc' : 'asc';
    this.sortChange.emit({ key: column.key, direction });
  }

  protected ariaSort(column: UiTreeTableColumn): 'ascending' | 'descending' | 'none' | null {
    if (!column.sortable) return null;
    if (this.sort()?.key !== column.key) return 'none';
    return this.sort()?.direction === 'asc' ? 'ascending' : 'descending';
  }

  protected sortDirection(column: UiTreeTableColumn): UiTreeTableSortDirection | 'none' {
    return this.sort()?.key === column.key ? (this.sort()?.direction ?? 'none') : 'none';
  }

  protected expansionLabel(entry: UiTreeTableVisibleNode): string {
    return this.isExpanded(entry) ? this.collapseAriaLabel() : this.expandAriaLabel();
  }

  protected cellValue(entry: UiTreeTableVisibleNode, column: UiTreeTableColumn): string {
    const value = entry.node.data[column.key];
    return value == null ? '' : String(value);
  }

  protected headerClasses(column: UiTreeTableColumn): string {
    return `px-4 py-3 text-xs font-semibold uppercase tracking-wide ${ALIGN_CLASSES[column.align ?? 'left']}`;
  }

  protected cellClasses(column: UiTreeTableColumn): string {
    return `px-4 py-3 text-slate-700 dark:text-slate-200 ${ALIGN_CLASSES[column.align ?? 'left']}`;
  }

  protected rowClasses(entry: UiTreeTableVisibleNode): string {
    const base =
      'transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400';
    if (entry.node.disabled) return `${base} opacity-50`;
    if (this.isSelected(entry)) return `${base} bg-blue-50 dark:bg-blue-950/30`;
    return `${base} hover:bg-slate-50 dark:hover:bg-slate-900`;
  }
}
