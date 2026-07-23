import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type { UiTableColumn, UiTableRow } from '../../../../table/src/table';
import {
  UiTableCellDirective,
  UiTableComponent,
  UiTableHeaderDirective,
} from '../../../../table/src/table';

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

  it('makes selectable rows keyboard operable with Enter and Space', async () => {
    await TestBed.configureTestingModule({ imports: [UiTableComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UiTableComponent);
    const selected: UiTableRow[] = [];
    fixture.componentRef.setInput('columns', columns);
    fixture.componentRef.setInput('rows', rows);
    fixture.componentRef.setInput('selectable', true);
    fixture.componentInstance.rowSelected.subscribe((row) => {
      selected.push(row);
    });
    fixture.detectChanges();

    const row = fixture.nativeElement.querySelector('tbody tr') as HTMLTableRowElement;
    expect(row.tabIndex).toBe(0);
    row.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    row.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

    expect(selected).toEqual([rows[0], rows[0]]);
  });

  it('keeps non-selectable rows out of the tab order', async () => {
    await TestBed.configureTestingModule({ imports: [UiTableComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UiTableComponent);
    fixture.componentRef.setInput('columns', columns);
    fixture.componentRef.setInput('rows', rows);
    fixture.detectChanges();

    const row = fixture.nativeElement.querySelector('tbody tr') as HTMLTableRowElement;
    expect(row.getAttribute('tabindex')).toBeNull();
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

  it('uses decorative SVG sort indicators without text glyphs', async () => {
    await TestBed.configureTestingModule({ imports: [UiTableComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UiTableComponent);
    fixture.componentRef.setInput('columns', columns);
    fixture.componentRef.setInput('rows', rows);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('th button') as HTMLButtonElement;
    const icon = button.querySelector('svg') as SVGElement;

    expect(button.textContent?.trim()).toBe('Name');
    expect(icon.getAttribute('viewBox')).toBe('0 0 20 20');
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.getAttribute('focusable')).toBe('false');

    button.click();
    fixture.detectChanges();
    expect(icon.classList.contains('rotate-180')).toBe(false);

    button.click();
    fixture.detectChanges();
    expect(icon.classList.contains('rotate-180')).toBe(true);
  });

  it('supports controlled sort indication while emitting the requested next state', async () => {
    await TestBed.configureTestingModule({ imports: [UiTableComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UiTableComponent);
    let requestedDirection = '';
    fixture.componentRef.setInput('columns', columns);
    fixture.componentRef.setInput('rows', rows);
    fixture.componentRef.setInput('sort', { key: 'name', direction: 'asc' });
    fixture.componentInstance.sortChange.subscribe((sort) => {
      requestedDirection = sort.direction;
    });
    fixture.detectChanges();

    const header = fixture.nativeElement.querySelector('th') as HTMLTableCellElement;
    (header.querySelector('button') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(requestedDirection).toBe('desc');
    expect(header.getAttribute('aria-sort')).toBe('ascending');

    fixture.componentRef.setInput('sort', { key: 'name', direction: 'desc' });
    fixture.detectChanges();
    expect(header.getAttribute('aria-sort')).toBe('descending');
  });

  it('renders an accessible caption with optional visual presentation', async () => {
    await TestBed.configureTestingModule({ imports: [UiTableComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UiTableComponent);
    fixture.componentRef.setInput('caption', 'Release status');
    fixture.componentRef.setInput('columns', columns);
    fixture.componentRef.setInput('rows', rows);
    fixture.detectChanges();

    const caption = fixture.nativeElement.querySelector('caption') as HTMLTableCaptionElement;
    expect(caption.textContent?.trim()).toBe('Release status');
    expect(caption.className).toContain('sr-only');

    fixture.componentRef.setInput('captionVisible', true);
    fixture.detectChanges();
    expect(caption.className).not.toContain('sr-only');
  });

  it('announces loading and empty states with valid column spans', async () => {
    await TestBed.configureTestingModule({ imports: [UiTableComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UiTableComponent);
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const table = fixture.nativeElement.querySelector('table') as HTMLTableElement;
    let stateCell = fixture.nativeElement.querySelector('td') as HTMLTableCellElement;
    expect(table.getAttribute('aria-busy')).toBe('true');
    expect(stateCell.colSpan).toBe(1);
    expect(stateCell.querySelector('[role="status"]')?.textContent).toContain('Loading records');

    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();
    stateCell = fixture.nativeElement.querySelector('td') as HTMLTableCellElement;
    expect(table.getAttribute('aria-busy')).toBeNull();
    expect(stateCell.querySelector('[role="status"]')?.textContent).toContain('No records found');
  });

  it('preserves row DOM identity across reordering when rowKey is provided', async () => {
    await TestBed.configureTestingModule({ imports: [UiTableComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UiTableComponent);
    const keyedRows: readonly UiTableRow[] = [
      { id: 1, name: 'First', status: 'Ready' },
      { id: 2, name: 'Second', status: 'Ready' },
    ];
    fixture.componentRef.setInput('columns', columns);
    fixture.componentRef.setInput('rows', keyedRows);
    fixture.componentRef.setInput('rowKey', 'id');
    fixture.detectChanges();

    const firstRow = fixture.nativeElement.querySelector('tbody tr') as HTMLTableRowElement;
    fixture.componentRef.setInput('rows', [...keyedRows].reverse());
    fixture.detectChanges();
    const reorderedRows = fixture.nativeElement.querySelectorAll(
      'tbody tr',
    ) as NodeListOf<HTMLTableRowElement>;

    expect(reorderedRows[1]).toBe(firstRow);
  });

  it('applies alignment, focus-visible, responsive overflow, and dark-mode classes', async () => {
    await TestBed.configureTestingModule({ imports: [UiTableComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UiTableComponent);
    fixture.componentRef.setInput('columns', [
      { key: 'name', header: 'Name', align: 'right', sortable: true },
    ]);
    fixture.componentRef.setInput('rows', [{ name: 'NgNova' }]);
    fixture.componentRef.setInput('selectable', true);
    fixture.detectChanges();

    const overflow = fixture.nativeElement.querySelector('.overflow-x-auto') as HTMLDivElement;
    const header = fixture.nativeElement.querySelector('th') as HTMLTableCellElement;
    const cell = fixture.nativeElement.querySelector('td') as HTMLTableCellElement;
    const row = fixture.nativeElement.querySelector('tbody tr') as HTMLTableRowElement;

    expect(overflow).not.toBeNull();
    expect(header.className).toContain('text-right');
    expect(cell.className).toContain('text-right');
    expect(cell.className).toContain('dark:text-slate-200');
    expect(row.className).toContain('focus-visible:ring-inset');
    expect(row.className).toContain('dark:focus-visible:ring-blue-400');
  });

  it('renders independently composed header and cell templates with typed context', async () => {
    @Component({
      standalone: true,
      imports: [UiTableCellDirective, UiTableComponent, UiTableHeaderDirective],
      template: `
        <ui-table [columns]="columns" [rows]="rows">
          <ng-template uiTableHeader="status" let-column> {{ column.header }} signal </ng-template>
          <ng-template
            uiTableCell="status"
            let-value
            let-row="row"
            let-column="column"
            let-rowIndex="rowIndex"
          >
            <strong
              data-custom-cell
              [attr.data-row]="row.name"
              [attr.data-column]="column.key"
              [attr.data-index]="rowIndex"
            >
              {{ value }}
            </strong>
          </ng-template>
        </ui-table>
      `,
    })
    class ComposedTableHostComponent {
      readonly columns = columns;
      readonly rows = rows;
    }

    await TestBed.configureTestingModule({
      imports: [ComposedTableHostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(ComposedTableHostComponent);
    fixture.detectChanges();
    const headers = fixture.nativeElement.querySelectorAll(
      'th',
    ) as NodeListOf<HTMLTableCellElement>;
    const custom = fixture.nativeElement.querySelector('[data-custom-cell]') as HTMLElement;

    expect(headers[1].textContent).toContain('Status signal');
    expect(custom.textContent?.trim()).toBe('Ready');
    expect(custom.dataset['row']).toBe('NgNova');
    expect(custom.dataset['column']).toBe('status');
    expect(custom.dataset['index']).toBe('0');
  });

  it('supports immutable controlled multiple selection and select-all', async () => {
    await TestBed.configureTestingModule({ imports: [UiTableComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UiTableComponent);
    const keyedRows: readonly UiTableRow[] = [
      { id: 1, name: 'First' },
      { id: 2, name: 'Second' },
    ];
    const changes: (readonly (string | number)[])[] = [];
    fixture.componentRef.setInput('columns', [{ key: 'name', header: 'Name' }]);
    fixture.componentRef.setInput('rows', keyedRows);
    fixture.componentRef.setInput('rowKey', 'id');
    fixture.componentRef.setInput('selectionMode', 'multiple');
    fixture.componentInstance.selectedKeysChange.subscribe((keys) => changes.push(keys));
    fixture.detectChanges();

    const inputs = fixture.nativeElement.querySelectorAll(
      'input[type="checkbox"]',
    ) as NodeListOf<HTMLInputElement>;
    inputs[1]?.click();
    fixture.detectChanges();
    expect(changes[0]).toEqual([1]);
    expect(Object.isFrozen(changes[0])).toBe(true);
    expect(
      (fixture.nativeElement.querySelectorAll('tbody tr')[0] as HTMLTableRowElement).getAttribute(
        'aria-selected',
      ),
    ).toBe('true');

    inputs[0]?.click();
    fixture.detectChanges();
    expect(changes[1]).toEqual([1, 2]);
  });

  it('keeps controlled selection visual state owned by the consumer', async () => {
    await TestBed.configureTestingModule({ imports: [UiTableComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UiTableComponent);
    fixture.componentRef.setInput('columns', [{ key: 'name', header: 'Name' }]);
    fixture.componentRef.setInput('rows', [{ id: 'one', name: 'First' }]);
    fixture.componentRef.setInput('rowKey', 'id');
    fixture.componentRef.setInput('selectionMode', 'single');
    fixture.componentRef.setInput('selectedKeys', ['one']);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('tbody input') as HTMLInputElement;
    expect(input.type).toBe('radio');
    expect(input.checked).toBe(true);

    input.click();
    fixture.detectChanges();
    expect(input.checked).toBe(true);
  });

  it('prioritizes loading, error, and empty states and announces errors', async () => {
    await TestBed.configureTestingModule({ imports: [UiTableComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UiTableComponent);
    fixture.componentRef.setInput('columns', columns);
    fixture.componentRef.setInput('error', true);
    fixture.componentRef.setInput('errorText', 'Network unavailable');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      'Network unavailable',
    );

    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="status"]').textContent).toContain(
      'Loading records',
    );
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
  });

  it('emits bounded page requests with localized pagination labels', async () => {
    await TestBed.configureTestingModule({ imports: [UiTableComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UiTableComponent);
    const pages: number[] = [];
    fixture.componentRef.setInput('columns', columns);
    fixture.componentRef.setInput('rows', rows);
    fixture.componentRef.setInput('page', 2);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.componentRef.setInput('totalItems', 23);
    fixture.componentRef.setInput('paginationAriaLabel', 'Results pages');
    fixture.componentInstance.pageChange.subscribe((page) => pages.push(page));
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('nav') as HTMLElement;
    const buttons = nav.querySelectorAll('button');
    expect(nav.getAttribute('aria-label')).toBe('Results pages');
    expect(nav.textContent).toContain('Page 2 of 3');
    expect(fixture.nativeElement.textContent).toContain('11–11 of 23');
    buttons[0]?.click();
    buttons[1]?.click();
    expect(pages).toEqual([1, 3]);
  });

  it('applies sticky header and column classes without changing table semantics', async () => {
    await TestBed.configureTestingModule({ imports: [UiTableComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UiTableComponent);
    fixture.componentRef.setInput('columns', [
      { key: 'name', header: 'Name', sticky: 'start' },
      { key: 'status', header: 'Status', sticky: 'end' },
    ]);
    fixture.componentRef.setInput('rows', rows);
    fixture.componentRef.setInput('stickyHeader', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('thead').className).toContain('sticky');
    const headers = fixture.nativeElement.querySelectorAll(
      'th',
    ) as NodeListOf<HTMLTableCellElement>;
    expect(headers[0].className).toContain('left-0');
    expect(headers[1].className).toContain('right-0');
    expect(fixture.nativeElement.querySelector('table')).not.toBeNull();
  });
});
