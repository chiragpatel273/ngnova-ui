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
    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();

    expect(fixture.componentInstance.active).toBe('api');
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
});
