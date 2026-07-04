import { TestBed } from '@angular/core/testing';

import type { UiTableColumn, UiTableRow } from '../../../../table/src/table';
import { UiTableComponent } from '../../../../table/src/table';

describe('UiTableComponent', () => {
  const columns: readonly UiTableColumn[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'status', header: 'Status' },
  ];
  const rows: readonly UiTableRow[] = [{ name: 'NgNova', status: 'Ready' }];

  it('renders columns and rows', async () => {
    await TestBed.configureTestingModule({ imports: [UiTableComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UiTableComponent);
    fixture.componentRef.setInput('columns', columns);
    fixture.componentRef.setInput('rows', rows);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('NgNova');
    expect(fixture.nativeElement.textContent).toContain('Ready');
  });

  it('emits rowSelected only when selectable', async () => {
    await TestBed.configureTestingModule({ imports: [UiTableComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UiTableComponent);
    let selected: UiTableRow | null = null;
    fixture.componentRef.setInput('columns', columns);
    fixture.componentRef.setInput('rows', rows);
    fixture.componentRef.setInput('selectable', true);
    fixture.componentInstance.rowSelected.subscribe((row) => {
      selected = row;
    });
    fixture.detectChanges();

    fixture.nativeElement.querySelector('tbody tr').click();

    expect(selected).toEqual(rows[0]);
  });

  it('emits sort changes from sortable headers', async () => {
    await TestBed.configureTestingModule({ imports: [UiTableComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UiTableComponent);
    let sortKey = '';
    fixture.componentRef.setInput('columns', columns);
    fixture.componentRef.setInput('rows', rows);
    fixture.componentInstance.sortChange.subscribe((sort) => {
      sortKey = sort.key;
    });
    fixture.detectChanges();

    fixture.nativeElement.querySelector('th button').click();

    expect(sortKey).toBe('name');
  });

  it('exposes aria-sort for sortable headers', async () => {
    await TestBed.configureTestingModule({ imports: [UiTableComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UiTableComponent);
    fixture.componentRef.setInput('columns', columns);
    fixture.componentRef.setInput('rows', rows);
    fixture.detectChanges();

    const sortableHeader = fixture.nativeElement.querySelector('th') as HTMLTableCellElement;
    const sortButton = sortableHeader.querySelector('button') as HTMLButtonElement;

    expect(sortableHeader.getAttribute('aria-sort')).toBe('none');

    sortButton.click();
    fixture.detectChanges();
    expect(sortableHeader.getAttribute('aria-sort')).toBe('ascending');

    sortButton.click();
    fixture.detectChanges();
    expect(sortableHeader.getAttribute('aria-sort')).toBe('descending');
  });
});
