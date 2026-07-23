import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiMenuComponent, UiMenuTriggerDirective } from '../../../../menu/src/menu';
import type { UiMenuItem, UiMenuSelection } from '../../../../menu/src/menu';

const ITEMS: readonly UiMenuItem[] = [
  { value: 'edit', label: 'Edit' },
  { value: 'duplicate', label: 'Duplicate', disabled: true },
  { value: 'delete', label: 'Delete', danger: true, separatorBefore: true },
];

@Component({
  standalone: true,
  imports: [UiMenuComponent, UiMenuTriggerDirective],
  template: `<ui-menu
    [(open)]="open"
    [items]="items"
    [closeOnSelect]="closeOnSelect"
    (itemSelected)="selection = $event"
  >
    <button uiMenuTrigger type="button">Actions</button>
  </ui-menu>`,
})
class HostComponent {
  readonly items = ITEMS;
  open = false;
  closeOnSelect = true;
  selection: UiMenuSelection | null = null;
}

describe('UiMenuComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
  });

  it('connects its trigger and exposes menu semantics', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector('[uiMenuTrigger]') as HTMLButtonElement;
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    trigger.click();
    fixture.detectChanges();
    const menu = fixture.nativeElement.querySelector('[role="menu"]') as HTMLElement;
    expect(menu.getAttribute('aria-label')).toBe('Actions');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(menu.querySelectorAll('[role="menuitem"]')).toHaveLength(3);
    expect(menu.querySelector('[role="separator"]')).not.toBeNull();
  });

  it('selects enabled items, closes, and restores trigger focus', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector('[uiMenuTrigger]') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('[data-menu-index="0"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selection?.item.value).toBe('edit');
    expect(fixture.componentInstance.open).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it('skips disabled items during arrow navigation and supports Home and End', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector('[uiMenuTrigger]') as HTMLButtonElement;
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();
    await Promise.resolve();
    const enabled = fixture.nativeElement.querySelectorAll(
      '[role="menuitem"]:not([disabled])',
    ) as NodeListOf<HTMLButtonElement>;
    expect(document.activeElement).toBe(enabled[0]);
    enabled[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(document.activeElement).toBe(enabled[1]);
    enabled[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    expect(document.activeElement).toBe(enabled[0]);
  });

  it('supports typeahead and Escape dismissal', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector('[uiMenuTrigger]') as HTMLButtonElement;
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();
    await Promise.resolve();
    (document.activeElement as HTMLElement).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'd', bubbles: true }),
    );
    expect((document.activeElement as HTMLElement).textContent?.trim()).toBe('Delete');
    document.activeElement?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.open).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it('closes after outside pointer interaction', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('[uiMenuTrigger]') as HTMLButtonElement).click();
    fixture.detectChanges();
    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.open).toBe(false);
  });

  it('can remain open after selection', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.closeOnSelect = false;
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('[uiMenuTrigger]') as HTMLButtonElement).click();
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('[data-menu-index="2"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.open).toBe(true);
  });
});
