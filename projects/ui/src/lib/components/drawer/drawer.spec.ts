import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  UiDrawerComponent,
  UiDrawerFooterDirective,
  UiDrawerHeaderDirective,
} from '../../../../drawer/src/drawer';

@Component({
  standalone: true,
  imports: [UiDrawerComponent, UiDrawerFooterDirective, UiDrawerHeaderDirective],
  template: `
    <button class="opener" type="button" (click)="open = true">Open</button>
    <ui-drawer
      [(open)]="open"
      [position]="position"
      [size]="size"
      [closeOnBackdrop]="closeOnBackdrop"
      [closeOnEscape]="closeOnEscape"
      titleId="drawer-title"
      descriptionId="drawer-description"
      initialFocus=".primary-action"
      (backdropClick)="backdropClicks += 1"
      (escapeKeyDown)="escapeCount += 1"
    >
      <span uiDrawerHeader>Filters</span>
      <p id="drawer-description">Refine visible records.</p>
      <button class="primary-action" type="button">Apply</button>
      <button uiDrawerFooter type="button">Reset</button>
    </ui-drawer>
  `,
})
class HostComponent {
  open = false;
  position: 'left' | 'right' | 'top' | 'bottom' = 'right';
  size: 'sm' | 'md' | 'lg' = 'md';
  closeOnBackdrop = true;
  closeOnEscape = true;
  backdropClicks = 0;
  escapeCount = 0;
}

describe('UiDrawerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('opens a named modal dialog, locks scroll, and focuses the requested control', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const opener = fixture.nativeElement.querySelector('.opener') as HTMLButtonElement;
    opener.click();
    fixture.detectChanges();

    const panel = fixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement;
    expect(panel.getAttribute('aria-modal')).toBe('true');
    expect(panel.getAttribute('aria-labelledby')).toBe('drawer-title');
    expect(panel.getAttribute('aria-describedby')).toBe('drawer-description');
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.activeElement).toBe(fixture.nativeElement.querySelector('.primary-action'));
  });

  it('closes from its close action and restores opener focus', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const opener = fixture.nativeElement.querySelector('.opener') as HTMLButtonElement;
    opener.focus();
    opener.click();
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('header button') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();
    expect(fixture.componentInstance.open).toBe(false);
    expect(document.activeElement).toBe(opener);
    expect(document.body.style.overflow).toBe('');
  });

  it('emits backdrop and Escape events and respects dismissal configuration', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.open = true;
    fixture.componentInstance.closeOnBackdrop = false;
    fixture.componentInstance.closeOnEscape = false;
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('[aria-hidden="true"]') as HTMLElement).click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.backdropClicks).toBe(1);
    expect(fixture.componentInstance.escapeCount).toBe(0);
    expect(fixture.componentInstance.open).toBe(true);
  });

  it('closes on Escape and emits the keyboard event when enabled', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.open = true;
    fixture.detectChanges();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.escapeCount).toBe(1);
    expect(fixture.componentInstance.open).toBe(false);
  });

  it('wraps keyboard focus within the panel', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.open = true;
    fixture.detectChanges();
    const focusable = Array.from(
      fixture.nativeElement.querySelectorAll('[role="dialog"] button'),
    ) as HTMLButtonElement[];
    const last = focusable[focusable.length - 1];
    const first = focusable[0];
    last.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    expect(document.activeElement).toBe(first);

    first.focus();
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }),
    );
    expect(document.activeElement).toBe(last);
  });

  it('applies all edge positions and sizes from static class maps', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.open = true;
    fixture.componentInstance.position = 'bottom';
    fixture.componentInstance.size = 'lg';
    fixture.detectChanges();
    const panel = fixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement;
    expect(panel.className).toContain('bottom-0');
    expect(panel.className).toContain('--ui-drawer-height-lg');
  });

  it('restores document state when destroyed while open', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.open = true;
    fixture.detectChanges();
    expect(document.body.style.overflow).toBe('hidden');
    fixture.destroy();
    expect(document.body.style.overflow).toBe('');
  });
});
