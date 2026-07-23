import { TestBed } from '@angular/core/testing';

import type { UiTreeNode } from '../../../../tree/src/tree';
import { UiTreeComponent } from '../../../../tree/src/tree';

describe('UiTreeComponent', () => {
  const nodes: readonly UiTreeNode[] = [
    {
      value: 'components',
      label: 'Components',
      children: [
        { value: 'button', label: 'Button' },
        { value: 'input', label: 'Input', disabled: true },
      ],
    },
    { value: 'guides', label: 'Guides' },
  ];

  it('renders flattened controlled expansion with complete tree metadata', async () => {
    await TestBed.configureTestingModule({ imports: [UiTreeComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UiTreeComponent);
    fixture.componentRef.setInput('nodes', nodes);
    fixture.componentRef.setInput('expanded', ['components']);
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('[role="treeitem"]');
    expect(items.length).toBe(4);
    expect(items[0].getAttribute('aria-expanded')).toBe('true');
    expect(items[1].getAttribute('aria-level')).toBe('2');
    expect(items[1].getAttribute('aria-posinset')).toBe('1');
    expect(items[1].getAttribute('aria-setsize')).toBe('2');
  });

  it('emits immutable controlled expansion and selection requests', async () => {
    await TestBed.configureTestingModule({ imports: [UiTreeComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UiTreeComponent);
    let expanded: readonly string[] = [];
    let selected: string | null = null;
    fixture.componentRef.setInput('nodes', nodes);
    fixture.componentInstance.expandedChange.subscribe((value) => (expanded = value));
    fixture.componentInstance.selectedChange.subscribe((value) => (selected = value));
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('[role="treeitem"]') as HTMLButtonElement).click();
    expect(expanded).toEqual(['components']);
    expect(Object.isFrozen(expanded)).toBe(true);
    expect(selected).toBe('components');
  });

  it('supports arrow, Home, End, parent, and typeahead focus navigation', async () => {
    await TestBed.configureTestingModule({ imports: [UiTreeComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UiTreeComponent);
    fixture.componentRef.setInput('nodes', nodes);
    fixture.componentRef.setInput('expanded', ['components']);
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll(
      '[role="treeitem"]',
    ) as NodeListOf<HTMLButtonElement>;
    items[0].focus();
    items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    await Promise.resolve();
    expect(document.activeElement?.textContent).toContain('Guides');
    items[3].dispatchEvent(new KeyboardEvent('keydown', { key: 'c', bubbles: true }));
    await Promise.resolve();
    expect(document.activeElement?.textContent).toContain('Components');
    items[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    await Promise.resolve();
    expect(document.activeElement?.textContent).toContain('Components');
  });

  it('does not activate disabled nodes', async () => {
    await TestBed.configureTestingModule({ imports: [UiTreeComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UiTreeComponent);
    let selected = '';
    fixture.componentRef.setInput('nodes', nodes);
    fixture.componentRef.setInput('expanded', ['components']);
    fixture.componentInstance.selectedChange.subscribe((value) => (selected = value ?? ''));
    fixture.detectChanges();
    const disabled = fixture.nativeElement.querySelectorAll(
      '[role="treeitem"]',
    )[2] as HTMLButtonElement;
    expect(disabled.getAttribute('aria-disabled')).toBe('true');
    disabled.click();
    expect(selected).toBe('');
  });
});
