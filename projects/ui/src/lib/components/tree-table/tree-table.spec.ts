import { TestBed } from '@angular/core/testing';

import type { UiTreeTableColumn, UiTreeTableNode } from '../../../../tree-table/src/tree-table';
import { UiTreeTableComponent } from '../../../../tree-table/src/tree-table';

describe('UiTreeTableComponent', () => {
  const columns: readonly UiTreeTableColumn[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'status', header: 'Status' },
  ];
  const nodes: readonly UiTreeTableNode[] = [
    {
      value: 'components',
      data: { name: 'Components', status: 'Ready' },
      children: [{ value: 'button', data: { name: 'Button', status: 'Ready' } }],
    },
  ];

  it('renders controlled hierarchy with treegrid semantics', async () => {
    await TestBed.configureTestingModule({ imports: [UiTreeTableComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UiTreeTableComponent);
    fixture.componentRef.setInput('columns', columns);
    fixture.componentRef.setInput('nodes', nodes);
    fixture.componentRef.setInput('expanded', ['components']);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('table').getAttribute('role')).toBe('treegrid');
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
    expect(rows[0].getAttribute('aria-level')).toBe('1');
    expect(rows[0].getAttribute('aria-expanded')).toBe('true');
    expect(rows[1].getAttribute('aria-level')).toBe('2');
  });

  it('emits immutable expansion, selection, and controlled sort requests', async () => {
    await TestBed.configureTestingModule({ imports: [UiTreeTableComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UiTreeTableComponent);
    let expanded: readonly string[] = [];
    let selected = '';
    let direction = '';
    fixture.componentRef.setInput('columns', columns);
    fixture.componentRef.setInput('nodes', nodes);
    fixture.componentInstance.expandedChange.subscribe((value) => (expanded = value));
    fixture.componentInstance.selectedChange.subscribe((value) => (selected = value ?? ''));
    fixture.componentInstance.sortChange.subscribe((value) => (direction = value.direction));
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('tbody tr') as HTMLTableRowElement).click();
    (fixture.nativeElement.querySelector('tbody button') as HTMLButtonElement).click();
    (fixture.nativeElement.querySelector('thead button') as HTMLButtonElement).click();
    expect(selected).toBe('components');
    expect(expanded).toEqual(['components']);
    expect(Object.isFrozen(expanded)).toBe(true);
    expect(direction).toBe('asc');
  });

  it('supports row keyboard navigation and parent focus', async () => {
    await TestBed.configureTestingModule({ imports: [UiTreeTableComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UiTreeTableComponent);
    fixture.componentRef.setInput('columns', columns);
    fixture.componentRef.setInput('nodes', nodes);
    fixture.componentRef.setInput('expanded', ['components']);
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll(
      'tbody tr',
    ) as NodeListOf<HTMLTableRowElement>;
    rows[1].focus();
    rows[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    await Promise.resolve();
    expect(document.activeElement).toBe(rows[0]);
  });

  it('announces loading, error, and empty states with valid spans', async () => {
    await TestBed.configureTestingModule({ imports: [UiTreeTableComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UiTreeTableComponent);
    fixture.componentRef.setInput('columns', columns);
    fixture.componentRef.setInput('error', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
    expect((fixture.nativeElement.querySelector('td') as HTMLTableCellElement).colSpan).toBe(2);
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="status"]').textContent).toContain('Loading');
  });
});
