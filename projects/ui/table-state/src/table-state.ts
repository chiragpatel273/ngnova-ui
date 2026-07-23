import { computed, signal } from '@angular/core';

export type UiTableKey = string | number;
export type UiTableStateSortDirection = 'asc' | 'desc';

export interface UiTableStateSort {
  readonly key: string;
  readonly direction: UiTableStateSortDirection;
}

export interface UiTableStateOptions {
  readonly sort?: UiTableStateSort | null;
  readonly selectedKeys?: readonly UiTableKey[];
  readonly page?: number;
  readonly pageSize?: number;
}

export interface UiTableStateSnapshot {
  readonly sort: UiTableStateSort | null;
  readonly selectedKeys: readonly UiTableKey[];
  readonly page: number;
  readonly pageSize: number;
  readonly offset: number;
}

export class UiTableStateController {
  private readonly sortState;
  private readonly selectionState;
  private readonly pageState;
  private readonly pageSizeState;

  readonly sort;
  readonly selectedKeys;
  readonly page;
  readonly pageSize;
  readonly offset;
  readonly snapshot;

  constructor(options: UiTableStateOptions = {}) {
    this.sortState = signal<UiTableStateSort | null>(options.sort ?? null);
    this.selectionState = signal<ReadonlySet<UiTableKey>>(new Set(options.selectedKeys ?? []));
    this.pageState = signal(this.normalizePositive(options.page, 1));
    this.pageSizeState = signal(this.normalizePositive(options.pageSize, 10));

    this.sort = this.sortState.asReadonly();
    this.selectedKeys = computed<readonly UiTableKey[]>(() => [...this.selectionState()]);
    this.page = this.pageState.asReadonly();
    this.pageSize = this.pageSizeState.asReadonly();
    this.offset = computed(() => (this.page() - 1) * this.pageSize());
    this.snapshot = computed<UiTableStateSnapshot>(() => ({
      sort: this.sort(),
      selectedKeys: this.selectedKeys(),
      page: this.page(),
      pageSize: this.pageSize(),
      offset: this.offset(),
    }));
  }

  setSort(sort: UiTableStateSort | null): void {
    this.sortState.set(sort);
  }

  toggleSort(key: string): void {
    const current = this.sort();
    const direction: UiTableStateSortDirection =
      current?.key === key && current.direction === 'asc' ? 'desc' : 'asc';
    this.sortState.set({ key, direction });
  }

  isSelected(key: UiTableKey): boolean {
    return this.selectionState().has(key);
  }

  toggleSelection(key: UiTableKey, multiple = true): void {
    const next = multiple ? new Set(this.selectionState()) : new Set<UiTableKey>();
    if (multiple && next.has(key)) next.delete(key);
    else next.add(key);
    this.selectionState.set(next);
  }

  selectOnly(key: UiTableKey): void {
    this.selectionState.set(new Set([key]));
  }

  selectMany(keys: readonly UiTableKey[]): void {
    this.selectionState.set(new Set(keys));
  }

  clearSelection(): void {
    if (this.selectionState().size) this.selectionState.set(new Set());
  }

  reconcileSelection(validKeys: readonly UiTableKey[]): void {
    const valid = new Set(validKeys);
    const next = new Set([...this.selectionState()].filter((key) => valid.has(key)));
    if (
      next.size !== this.selectionState().size ||
      [...next].some((key) => !this.selectionState().has(key))
    ) {
      this.selectionState.set(next);
    }
  }

  setPage(page: number): void {
    this.pageState.set(this.normalizePositive(page, 1));
  }

  setPageSize(pageSize: number, resetPage = true): void {
    this.pageSizeState.set(this.normalizePositive(pageSize, 10));
    if (resetPage) this.pageState.set(1);
  }

  private normalizePositive(value: number | undefined, fallback: number): number {
    return Number.isFinite(value) && Number(value) > 0 ? Math.floor(Number(value)) : fallback;
  }
}

export function createUiTableState(options: UiTableStateOptions = {}): UiTableStateController {
  return new UiTableStateController(options);
}
