import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  UiOverlayComponent,
  UiOverlayContentDirective,
  UiOverlayTriggerDirective,
} from '../../../../overlay/src/overlay';
import type { UiOverlayPositionChange } from '../../../../overlay/src/overlay';

@Component({
  standalone: true,
  imports: [UiOverlayComponent, UiOverlayContentDirective, UiOverlayTriggerDirective],
  template: `
    <button type="button" class="before">Before</button>
    <ui-overlay
      [open]="open"
      (openChange)="open = $event"
      [hasBackdrop]="hasBackdrop"
      [initialFocus]="initialFocus"
      (opened)="openedCount = openedCount + 1"
      (closed)="closedCount = closedCount + 1"
      (escapeKeyDown)="escapeCount = escapeCount + 1"
      (positionChange)="position = $event"
      ariaLabel="Release actions"
      panelId="release-overlay"
    >
      <button uiOverlayTrigger type="button">Open actions</button>
      <div uiOverlayContent>
        <button type="button" class="first-action">Run checks</button>
        <button type="button">Publish</button>
      </div>
    </ui-overlay>
  `,
})
class HostComponent {
  open = false;
  hasBackdrop = false;
  initialFocus: 'none' | 'panel' | 'first' = 'none';
  openedCount = 0;
  closedCount = 0;
  escapeCount = 0;
  position: UiOverlayPositionChange | null = null;
}

describe('UiOverlayComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  function trigger(): HTMLButtonElement {
    return fixture.debugElement.query(By.css('[uiOverlayTrigger]')).nativeElement;
  }

  function panel(): HTMLElement | null {
    return document.querySelector<HTMLElement>('#release-overlay');
  }

  it('opens a labelled CDK connected overlay and wires trigger semantics', async () => {
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    trigger().click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.open).toBe(true);
    expect(host.openedCount).toBe(1);
    expect(trigger().getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger().getAttribute('aria-controls')).toBe('release-overlay');
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(panel()?.getAttribute('role')).toBe('dialog');
    expect(panel()?.getAttribute('aria-label')).toBe('Release actions');
    expect(panel()?.textContent).toContain('Run checks');
    expect(host.position).not.toBeNull();
  });

  it('supports keyboard opening and Escape dismissal', async () => {
    trigger().dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }),
    );
    fixture.detectChanges();
    await fixture.whenStable();

    panel()?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    );
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.escapeCount).toBe(1);
    expect(host.open).toBe(false);
    expect(host.closedCount).toBe(1);
  });

  it('emits controlled closure from the configured backdrop', async () => {
    host.hasBackdrop = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    trigger().click();
    fixture.detectChanges();
    await fixture.whenStable();

    const backdrop = document.querySelector<HTMLElement>('.cdk-overlay-backdrop');
    backdrop?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(backdrop).not.toBeNull();
    expect(host.open).toBe(false);
  });

  it('focuses the first action and restores the trigger after close', async () => {
    host.initialFocus = 'first';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    trigger().focus();
    trigger().click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.activeElement?.classList.contains('first-action')).toBe(true);
    panel()?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    );
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.activeElement).toBe(trigger());
  });
});
