import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  UiPopoverComponent,
  UiPopoverContentDirective,
  UiPopoverTriggerDirective,
} from '../../../../popover/src/popover';

@Component({
  standalone: true,
  imports: [UiPopoverComponent, UiPopoverContentDirective, UiPopoverTriggerDirective],
  template: `
    <button class="external-toggle" type="button" (click)="open = !open">External toggle</button>
    <ui-popover
      [(open)]="open"
      [position]="position"
      [closeOnOutside]="closeOnOutside"
      [closeOnEscape]="closeOnEscape"
      titleId="popover-title"
      (opened)="handleOpened()"
      (closed)="handleClosed()"
    >
      <button uiPopoverTrigger type="button">Account</button>
      <div uiPopoverContent>
        <h2 id="popover-title">Account actions</h2>
        <button type="button">Sign out</button>
      </div>
    </ui-popover>
  `,
})
class HostComponent {
  open = false;
  position: 'top' | 'right' | 'bottom' | 'left' = 'bottom';
  closeOnOutside = true;
  closeOnEscape = true;
  openedCount = 0;
  closedCount = 0;

  handleOpened(): void {
    this.openedCount += 1;
  }

  handleClosed(): void {
    this.closedCount += 1;
  }
}

describe('UiPopoverComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
  });

  it('connects the trigger and toggles an accessible interactive panel', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector('[uiPopoverTrigger]') as HTMLButtonElement;
    const panel = fixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement;

    expect(panel.hidden).toBe(true);
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-controls')).toBe(panel.id);

    trigger.click();
    fixture.detectChanges();

    expect(panel.hidden).toBe(false);
    expect(panel.getAttribute('aria-labelledby')).toBe('popover-title');
    expect(panel.textContent).toContain('Sign out');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(fixture.componentInstance.open).toBe(true);
    expect(fixture.componentInstance.openedCount).toBe(1);

    trigger.click();
    fixture.detectChanges();
    expect(panel.hidden).toBe(true);
    expect(fixture.componentInstance.closedCount).toBe(1);
  });

  it('opens with ArrowDown and closes with Escape while restoring trigger focus', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector('[uiPopoverTrigger]') as HTMLButtonElement;
    const panel = fixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement;

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();
    expect(panel.hidden).toBe(false);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(panel.hidden).toBe(true);
    expect(document.activeElement).toBe(trigger);
  });

  it('closes on an outside pointer interaction when enabled', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector('[uiPopoverTrigger]') as HTMLButtonElement;
    const panel = fixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement;
    trigger.click();
    fixture.detectChanges();

    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    fixture.detectChanges();
    expect(panel.hidden).toBe(true);
  });

  it('keeps the panel open on outside interaction when dismissal is disabled', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.closeOnOutside = false;
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector('[uiPopoverTrigger]') as HTMLButtonElement;
    const panel = fixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement;
    trigger.click();
    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    fixture.detectChanges();
    expect(panel.hidden).toBe(false);
  });

  it('respects closeOnEscape=false', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.closeOnEscape = false;
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector('[uiPopoverTrigger]') as HTMLButtonElement;
    const panel = fixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement;
    trigger.click();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(panel.hidden).toBe(false);
  });

  it('syncs external open state without duplicating lifecycle outputs', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const externalToggle = fixture.nativeElement.querySelector(
      '.external-toggle',
    ) as HTMLButtonElement;
    externalToggle.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="dialog"]').hidden).toBe(false);
    expect(fixture.componentInstance.openedCount).toBe(1);

    externalToggle.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.closedCount).toBe(1);
  });

  it('flips from bottom to top when the preferred side collides', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector('[uiPopoverTrigger]') as HTMLButtonElement;
    const panel = fixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement;
    vi.spyOn(trigger, 'getBoundingClientRect').mockReturnValue({
      x: 100,
      y: window.innerHeight - 30,
      top: window.innerHeight - 30,
      right: 180,
      bottom: window.innerHeight,
      left: 100,
      width: 80,
      height: 30,
      toJSON: () => ({}),
    });
    vi.spyOn(panel, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      right: 200,
      bottom: 120,
      left: 0,
      width: 200,
      height: 120,
      toJSON: () => ({}),
    });

    trigger.click();
    fixture.detectChanges();
    expect(panel.dataset['position']).toBe('top');
  });

  it('removes document listeners when destroyed', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector('[uiPopoverTrigger]') as HTMLButtonElement;
    trigger.click();
    fixture.destroy();

    expect(() =>
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })),
    ).not.toThrow();
  });
});
