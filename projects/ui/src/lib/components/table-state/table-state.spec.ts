import {
  createUiTableState,
  UiTableStateController,
} from '../../../../table-state/src/table-state';

describe('UiTableStateController', () => {
  it('normalizes and exposes immutable pagination snapshots', () => {
    const state = createUiTableState({ page: 3, pageSize: 25 });
    expect(state.snapshot()).toEqual({
      sort: null,
      selectedKeys: [],
      page: 3,
      pageSize: 25,
      offset: 50,
    });

    state.setPage(-10);
    state.setPageSize(50);
    expect(state.page()).toBe(1);
    expect(state.pageSize()).toBe(50);
    expect(state.offset()).toBe(0);
  });

  it('cycles deterministic sort requests', () => {
    const state = new UiTableStateController();
    state.toggleSort('name');
    expect(state.sort()).toEqual({ key: 'name', direction: 'asc' });
    state.toggleSort('name');
    expect(state.sort()).toEqual({ key: 'name', direction: 'desc' });
    state.toggleSort('status');
    expect(state.sort()).toEqual({ key: 'status', direction: 'asc' });
    state.setSort(null);
    expect(state.sort()).toBeNull();
  });

  it('supports single, multiple, bulk, and reconciled immutable selection', () => {
    const state = createUiTableState({ selectedKeys: [1] });
    const firstSnapshot = state.selectedKeys();
    state.toggleSelection(2);
    expect(state.selectedKeys()).toEqual([1, 2]);
    expect(state.selectedKeys()).not.toBe(firstSnapshot);

    state.toggleSelection(1);
    expect(state.selectedKeys()).toEqual([2]);
    state.selectOnly(3);
    expect(state.selectedKeys()).toEqual([3]);
    state.selectMany([1, 2, 3]);
    state.reconcileSelection([2, 3, 4]);
    expect(state.selectedKeys()).toEqual([2, 3]);
    state.clearSelection();
    expect(state.selectedKeys()).toEqual([]);
  });

  it('supports radio-style toggle selection', () => {
    const state = createUiTableState({ selectedKeys: ['first'] });
    state.toggleSelection('second', false);
    expect(state.selectedKeys()).toEqual(['second']);
    expect(state.isSelected('first')).toBe(false);
    expect(state.isSelected('second')).toBe(true);
  });
});
