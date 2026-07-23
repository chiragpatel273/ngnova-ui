import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiBreadcrumbComponent } from '../../../../breadcrumb/src/breadcrumb';
import type {
  UiBreadcrumbItem,
  UiBreadcrumbSelection,
} from '../../../../breadcrumb/src/breadcrumb';

const ITEMS: readonly UiBreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Components', href: '/components' },
  { label: 'Navigation', href: '/components/navigation' },
  { label: 'Breadcrumb' },
];

@Component({
  standalone: true,
  imports: [UiBreadcrumbComponent],
  template: `<ui-breadcrumb
    [items]="items"
    [maxItems]="maxItems"
    ariaLabel="Documentation path"
    (itemSelected)="selection = $event"
  />`,
})
class HostComponent {
  items: readonly UiBreadcrumbItem[] = ITEMS;
  maxItems = 0;
  selection: UiBreadcrumbSelection | null = null;
}

describe('UiBreadcrumbComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
  });

  it('renders a named navigation list with the last item as current', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const nav = fixture.nativeElement.querySelector('nav') as HTMLElement;
    expect(nav.getAttribute('aria-label')).toBe('Documentation path');
    expect(nav.querySelectorAll('ol > li')).toHaveLength(4);
    expect(nav.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe('Breadcrumb');
    expect(nav.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(3);
  });

  it('emits link selection with original item, index, and event', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    link.addEventListener('click', (event) => event.preventDefault());
    link.click();
    expect(fixture.componentInstance.selection?.item.label).toBe('Home');
    expect(fixture.componentInstance.selection?.index).toBe(0);
    expect(fixture.componentInstance.selection?.event).toBeInstanceOf(MouseEvent);
  });

  it('collapses only middle items while preserving original indices', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.maxItems = 3;
    fixture.detectChanges();
    const nav = fixture.nativeElement.querySelector('nav') as HTMLElement;
    expect(nav.querySelectorAll('ol > li')).toHaveLength(3);
    expect(nav.querySelector('[data-breadcrumb-ellipsis]')).not.toBeNull();
    expect(nav.textContent).toContain('Home');
    expect(nav.textContent).toContain('Breadcrumb');
    expect(nav.textContent).not.toContain('Components');
  });

  it('honors an explicitly current item', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.items = ITEMS.map((item, index) =>
      index === 1 ? { ...item, current: true } : item,
    );
    fixture.detectChanges();
    const current = fixture.nativeElement.querySelectorAll('[aria-current="page"]');
    expect(current).toHaveLength(1);
    expect(current[0].textContent.trim()).toBe('Components');
  });
});
