import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { UiTabsComponent } from '../../../../tabs/src/tabs';
import type { UiTabItem } from '../../../../tabs/src/tabs';

const TABS: readonly UiTabItem[] = [
  { label: 'Overview', value: 'overview' },
  { label: 'API', value: 'api' },
  { label: 'Disabled', value: 'disabled', disabled: true },
];

@Component({
  standalone: true,
  imports: [UiTabsComponent],
  template: ` <ui-tabs [tabs]="tabs" [(active)]="active"> {{ active }} content </ui-tabs> `,
})
class HostComponent {
  readonly tabs = TABS;
  active = 'overview';
}

describe('UiTabsComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('renders tabs with selected state', () => {
    const buttons = fixture.nativeElement.querySelectorAll(
      'button',
    ) as NodeListOf<HTMLButtonElement>;

    expect(buttons[0].getAttribute('aria-selected')).toBe('true');
    expect(buttons[1].getAttribute('aria-selected')).toBe('false');
  });

  it('emits active changes when a tab is selected', () => {
    const buttons = fixture.nativeElement.querySelectorAll(
      'button',
    ) as NodeListOf<HTMLButtonElement>;
    buttons[1].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.active).toBe('api');
    expect(fixture.nativeElement.textContent).toContain('api content');
  });

  it('supports keyboard navigation across enabled tabs', () => {
    const tablist = fixture.nativeElement.querySelector('[role="tablist"]') as HTMLDivElement;
    const buttons = fixture.nativeElement.querySelectorAll(
      'button',
    ) as NodeListOf<HTMLButtonElement>;
    buttons[0].focus();
    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();

    expect(fixture.componentInstance.active).toBe('api');
    expect(document.activeElement).toBe(buttons[1]);
  });

  it('wraps, skips disabled tabs, and supports Home and End', () => {
    const tablist = fixture.nativeElement.querySelector('[role="tablist"]') as HTMLDivElement;
    const buttons = fixture.nativeElement.querySelectorAll(
      'button',
    ) as NodeListOf<HTMLButtonElement>;
    buttons[1].focus();

    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.active).toBe('overview');
    expect(document.activeElement).toBe(buttons[0]);

    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.active).toBe('api');

    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.active).toBe('overview');
  });

  it('uses vertical arrow keys only for vertical tablists', () => {
    const tabsFixture = TestBed.createComponent(UiTabsComponent);
    tabsFixture.componentRef.setInput('tabs', TABS);
    tabsFixture.componentRef.setInput('active', 'overview');
    tabsFixture.componentRef.setInput('orientation', 'vertical');
    let selected = '';
    tabsFixture.componentInstance.activeChange.subscribe((value) => {
      selected = value;
    });
    tabsFixture.detectChanges();

    const tablist = tabsFixture.nativeElement.querySelector('[role="tablist"]') as HTMLDivElement;
    const buttons = tabsFixture.nativeElement.querySelectorAll(
      'button',
    ) as NodeListOf<HTMLButtonElement>;
    buttons[0].focus();
    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

    expect(selected).toBe('api');
    expect(document.activeElement).toBe(buttons[1]);
    expect(tablist.getAttribute('aria-orientation')).toBe('vertical');
    expect(tablist.className).toContain('flex-col');

    selected = '';
    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(selected).toBe('');
  });

  it('provides one fallback roving tab stop for an empty or invalid active value', () => {
    const tabsFixture = TestBed.createComponent(UiTabsComponent);
    tabsFixture.componentRef.setInput('tabs', TABS);
    tabsFixture.componentRef.setInput('active', 'missing');
    tabsFixture.detectChanges();

    const buttons = tabsFixture.nativeElement.querySelectorAll(
      'button',
    ) as NodeListOf<HTMLButtonElement>;
    const panel = tabsFixture.nativeElement.querySelector('[role="tabpanel"]') as HTMLDivElement;

    expect(buttons[0].getAttribute('aria-selected')).toBe('true');
    expect(buttons[0].tabIndex).toBe(0);
    expect(buttons[1].tabIndex).toBe(-1);
    expect(buttons[2].tabIndex).toBe(-1);
    expect(panel.getAttribute('aria-labelledby')).toBe(buttons[0].id);
  });

  it('does not emit for the active or a disabled tab', () => {
    const tabsFixture = TestBed.createComponent(UiTabsComponent);
    tabsFixture.componentRef.setInput('tabs', TABS);
    tabsFixture.componentRef.setInput('active', 'overview');
    let changes = 0;
    tabsFixture.componentInstance.activeChange.subscribe(() => {
      changes += 1;
    });
    tabsFixture.detectChanges();

    const buttons = tabsFixture.nativeElement.querySelectorAll(
      'button',
    ) as NodeListOf<HTMLButtonElement>;
    buttons[0].click();
    buttons[2].click();

    expect(changes).toBe(0);
    expect(buttons[2].disabled).toBe(true);
  });

  it('uses stable sanitized ids for tab and panel relationships', () => {
    const tabsFixture = TestBed.createComponent(UiTabsComponent);
    tabsFixture.componentInstance.id = 'release-tabs';
    tabsFixture.componentInstance.tabs = [{ label: 'Release Notes', value: 'Release Notes' }];
    tabsFixture.componentInstance.active = 'Release Notes';
    tabsFixture.detectChanges();

    const button = tabsFixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const panel = tabsFixture.nativeElement.querySelector('[role="tabpanel"]') as HTMLDivElement;

    expect(button.id).toBe('release-tabs-tab-release-notes');
    expect(button.getAttribute('aria-controls')).toBe('release-tabs-panel-release-notes');
    expect(panel.id).toBe('release-tabs-panel-release-notes');
    expect(panel.getAttribute('aria-labelledby')).toBe('release-tabs-tab-release-notes');
  });

  it('generates unique component IDs and exposes the accessible tablist label', () => {
    const first = TestBed.createComponent(UiTabsComponent);
    const second = TestBed.createComponent(UiTabsComponent);
    first.componentRef.setInput('ariaLabel', 'Release sections');
    first.detectChanges();

    const tablist = first.nativeElement.querySelector('[role="tablist"]') as HTMLDivElement;

    expect(first.componentInstance.id).not.toBe(second.componentInstance.id);
    expect(tablist.getAttribute('aria-label')).toBe('Release sections');
    expect(tablist.getAttribute('aria-orientation')).toBe('horizontal');
  });

  it('supports full-width tabs and localized overflow without widening the page', () => {
    const tabsFixture = TestBed.createComponent(UiTabsComponent);
    tabsFixture.componentRef.setInput('tabs', TABS);
    tabsFixture.componentRef.setInput('active', 'overview');
    tabsFixture.componentRef.setInput('fullWidth', true);
    tabsFixture.detectChanges();

    const tablist = tabsFixture.nativeElement.querySelector('[role="tablist"]') as HTMLDivElement;
    const button = tabsFixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(tablist.className).toContain('max-w-full');
    expect(tablist.className).toContain('overflow-x-auto');
    expect(tablist.className).toContain('overflow-y-hidden');
    expect(tablist.className).toContain('dark:bg-slate-900');
    expect(tablist.className).toContain('w-full');
    expect(button.className).toContain('flex-1');
    expect(button.className).toContain('dark:focus-visible:ring-blue-400');
  });

  it('renders segmented, underline, and pills variants', () => {
    const tabsFixture = TestBed.createComponent(UiTabsComponent);
    tabsFixture.componentRef.setInput('tabs', TABS);
    tabsFixture.componentRef.setInput('active', 'overview');
    tabsFixture.detectChanges();

    let tablist = tabsFixture.nativeElement.querySelector('[role="tablist"]') as HTMLDivElement;
    let button = tabsFixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(tablist.className).toContain('bg-slate-100');
    expect(button.className).toContain('rounded-md');
    expect(button.className).toContain('bg-white');

    tabsFixture.componentRef.setInput('variant', 'underline');
    tabsFixture.detectChanges();
    tablist = tabsFixture.nativeElement.querySelector('[role="tablist"]') as HTMLDivElement;
    button = tabsFixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(tablist.className).toContain('border-b');
    expect(button.className).toContain('border-b-2');
    expect(button.className).toContain('border-blue-600');

    tabsFixture.componentRef.setInput('variant', 'pills');
    tabsFixture.detectChanges();
    tablist = tabsFixture.nativeElement.querySelector('[role="tablist"]') as HTMLDivElement;
    button = tabsFixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(tablist.className).toContain('gap-2');
    expect(button.className).toContain('rounded-full');
    expect(button.className).toContain('bg-blue-600');
  });

  it('uses a vertical indicator for underline tabs in vertical orientation', () => {
    const tabsFixture = TestBed.createComponent(UiTabsComponent);
    tabsFixture.componentRef.setInput('tabs', TABS);
    tabsFixture.componentRef.setInput('active', 'overview');
    tabsFixture.componentRef.setInput('variant', 'underline');
    tabsFixture.componentRef.setInput('orientation', 'vertical');
    tabsFixture.detectChanges();

    const tablist = tabsFixture.nativeElement.querySelector('[role="tablist"]') as HTMLDivElement;
    const button = tabsFixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(tablist.className).toContain('border-l');
    expect(tablist.className).toContain('overflow-x-hidden');
    expect(tablist.className).toContain('overflow-y-auto');
    expect(button.className).toContain('border-l-2');
    expect(button.className).not.toContain('border-b-2');
  });
});
