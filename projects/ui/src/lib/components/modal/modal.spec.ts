import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { UiModalComponent } from '../../../../modal/src/modal';

@Component({
  standalone: true,
  imports: [UiModalComponent],
  template: `
    <ui-modal [(open)]="open">
      <span uiModalHeader>Confirm</span>
      Body
      <button uiModalFooter type="button">OK</button>
    </ui-modal>
  `,
})
class HostComponent {
  open = true;
}

@Component({
  standalone: true,
  imports: [UiModalComponent],
  template: `
    <ui-modal [open]="open" initialFocus="#confirm-action" (openChange)="open = $event">
      <span uiModalHeader>Focused dialog</span>
      <button id="secondary-action" type="button">Secondary</button>
      <button id="confirm-action" uiModalFooter type="button">Confirm</button>
    </ui-modal>
  `,
})
class FocusHostComponent {
  open = true;
}

describe('UiModalComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    document.body.style.overflow = '';
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    document.body.style.overflow = '';
  });

  it('renders projected dialog content', () => {
    expect(fixture.nativeElement.textContent).toContain('Confirm');
    expect(fixture.nativeElement.textContent).toContain('Body');

    const dialog = fixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement;
    const title = fixture.nativeElement.querySelector('header [id]') as HTMLElement;
    expect(dialog.getAttribute('aria-labelledby')).toBe(title.id);
    expect(dialog.getAttribute('aria-modal')).toBe('true');
  });

  it('uses the shared SVG contract for the labelled close action', () => {
    const closeButton = fixture.nativeElement.querySelector(
      'button[aria-label="Close dialog"]',
    ) as HTMLButtonElement;
    const icon = closeButton.querySelector('svg') as SVGElement;

    expect(closeButton.textContent?.trim()).toBe('');
    expect(icon.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(icon.getAttribute('stroke-width')).toBe('2');
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.getAttribute('focusable')).toBe('false');
  });

  it('closes on Escape', () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();

    expect(fixture.componentInstance.open).toBe(false);
  });

  it('emits lifecycle outputs only when the controlled open input changes', () => {
    const modalFixture = TestBed.createComponent(UiModalComponent);
    let opened = 0;
    let closed = 0;
    modalFixture.componentInstance.opened.subscribe(() => {
      opened += 1;
    });
    modalFixture.componentInstance.closed.subscribe(() => {
      closed += 1;
    });

    modalFixture.componentRef.setInput('open', true);
    modalFixture.detectChanges();
    modalFixture.componentRef.setInput('open', false);
    modalFixture.detectChanges();

    expect(opened).toBe(1);
    expect(closed).toBe(1);
    modalFixture.destroy();
  });

  it('emits backdrop clicks without closing when backdrop dismissal is disabled', () => {
    const modalFixture = TestBed.createComponent(UiModalComponent);
    let backdropClicks = 0;
    let requestedOpen: boolean | null = null;
    modalFixture.componentInstance.backdropClick.subscribe(() => {
      backdropClicks += 1;
    });
    modalFixture.componentInstance.openChange.subscribe((open) => {
      requestedOpen = open;
    });
    modalFixture.componentRef.setInput('closeOnBackdrop', false);
    modalFixture.componentRef.setInput('open', true);
    modalFixture.detectChanges();

    const backdrop = modalFixture.nativeElement.querySelector(
      '[aria-hidden="true"]',
    ) as HTMLElement;
    backdrop.click();

    expect(backdropClicks).toBe(1);
    expect(requestedOpen).toBeNull();
    modalFixture.destroy();
  });

  it('requests close from the default backdrop policy', () => {
    const backdrop = fixture.nativeElement.querySelector(
      'div > [aria-hidden="true"]',
    ) as HTMLElement;

    backdrop.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.open).toBe(false);
  });

  it('does not emit or close on Escape when Escape dismissal is disabled', () => {
    const modalFixture = TestBed.createComponent(UiModalComponent);
    let escapeEvents = 0;
    let closeRequests = 0;
    modalFixture.componentInstance.escapeKeyDown.subscribe(() => {
      escapeEvents += 1;
    });
    modalFixture.componentInstance.openChange.subscribe(() => {
      closeRequests += 1;
    });
    modalFixture.componentRef.setInput('closeOnEscape', false);
    modalFixture.componentRef.setInput('open', true);
    modalFixture.detectChanges();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(escapeEvents).toBe(0);
    expect(closeRequests).toBe(0);
    modalFixture.destroy();
  });

  it('generates unique title ids', () => {
    const first = TestBed.createComponent(UiModalComponent).componentInstance;
    const second = TestBed.createComponent(UiModalComponent).componentInstance;

    expect(first.titleId).not.toBe(second.titleId);
  });

  it('supports aria-label for headerless dialogs', () => {
    const modalFixture = TestBed.createComponent(UiModalComponent);
    modalFixture.componentInstance.open = true;
    modalFixture.componentInstance.ariaLabel = 'Quick settings';
    modalFixture.detectChanges();

    const dialog = modalFixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement;

    expect(dialog.getAttribute('aria-label')).toBe('Quick settings');
    expect(dialog.getAttribute('aria-labelledby')).toBeNull();

    modalFixture.destroy();
  });

  it('supports localized close labels and description association', () => {
    const modalFixture = TestBed.createComponent(UiModalComponent);
    modalFixture.componentRef.setInput('open', true);
    modalFixture.componentRef.setInput('closeAriaLabel', 'Dialog schließen');
    modalFixture.componentRef.setInput('descriptionId', 'dialog-description');
    modalFixture.detectChanges();

    const dialog = modalFixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement;
    const closeButton = modalFixture.nativeElement.querySelector(
      'header button',
    ) as HTMLButtonElement;

    expect(closeButton.getAttribute('aria-label')).toBe('Dialog schließen');
    expect(dialog.getAttribute('aria-describedby')).toBe('dialog-description');
    modalFixture.destroy();
  });

  it('keeps keyboard focus inside the dialog', () => {
    const dialog = fixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement;
    dialog.focus();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true }));

    const footerButton = fixture.nativeElement.querySelector(
      '[uiModalFooter]',
    ) as HTMLButtonElement;
    expect(document.activeElement).toBe(footerButton);
  });

  it('wraps forward Tab navigation from the last action to the close action', () => {
    const footerButton = fixture.nativeElement.querySelector(
      '[uiModalFooter]',
    ) as HTMLButtonElement;
    const closeButton = fixture.nativeElement.querySelector('header button') as HTMLButtonElement;
    footerButton.focus();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));

    expect(document.activeElement).toBe(closeButton);
  });

  it('focuses a requested element and restores the trigger after close', () => {
    fixture.destroy();
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.textContent = 'Open';
    document.body.append(trigger);
    trigger.focus();
    const focusFixture = TestBed.createComponent(FocusHostComponent);
    focusFixture.detectChanges();

    const confirm = focusFixture.nativeElement.querySelector(
      '#confirm-action',
    ) as HTMLButtonElement;
    expect(document.activeElement).toBe(confirm);

    const closeButton = focusFixture.nativeElement.querySelector(
      'header button',
    ) as HTMLButtonElement;
    closeButton.click();
    focusFixture.detectChanges();

    expect(document.activeElement).toBe(trigger);
    focusFixture.destroy();
    trigger.remove();
  });

  it('can opt out of restoring focus', () => {
    fixture.destroy();
    const trigger = document.createElement('button');
    trigger.type = 'button';
    document.body.append(trigger);
    trigger.focus();
    const modalFixture = TestBed.createComponent(UiModalComponent);
    modalFixture.componentRef.setInput('restoreFocus', false);
    modalFixture.componentRef.setInput('open', true);
    modalFixture.detectChanges();

    modalFixture.componentRef.setInput('open', false);
    modalFixture.detectChanges();

    expect(document.activeElement).not.toBe(trigger);
    modalFixture.destroy();
    trigger.remove();
  });

  it('renders every responsive maximum-width size', () => {
    const modalFixture = TestBed.createComponent(UiModalComponent);
    modalFixture.componentRef.setInput('open', true);
    modalFixture.detectChanges();
    const dialog = modalFixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement;

    expect(dialog.className).toContain('max-w-lg');

    const sizeClasses = [
      ['sm', 'max-w-sm'],
      ['lg', 'max-w-2xl'],
      ['xl', 'max-w-4xl'],
    ] as const;
    for (const [size, expectedClass] of sizeClasses) {
      modalFixture.componentRef.setInput('size', size);
      modalFixture.detectChanges();
      expect(dialog.className).toContain(expectedClass);
    }
    expect(dialog.className).toContain('dark:bg-slate-950');
    expect(dialog.className).toContain('max-h-[90dvh]');
    modalFixture.destroy();
  });

  it('locks body scroll while open', () => {
    fixture.destroy();
    document.body.style.overflow = '';

    const modalFixture = TestBed.createComponent(UiModalComponent);
    modalFixture.componentRef.setInput('open', true);
    modalFixture.detectChanges();

    expect(document.body.style.overflow).toBe('hidden');

    modalFixture.componentRef.setInput('open', false);
    modalFixture.detectChanges();

    expect(document.body.style.overflow).toBe('');
    modalFixture.destroy();
  });

  it('preserves scroll locking until the final stacked dialog closes', () => {
    fixture.destroy();
    document.body.style.overflow = 'scroll';
    const first = TestBed.createComponent(UiModalComponent);
    const second = TestBed.createComponent(UiModalComponent);

    first.componentRef.setInput('open', true);
    first.detectChanges();
    second.componentRef.setInput('open', true);
    second.detectChanges();
    expect(document.body.style.overflow).toBe('hidden');

    first.componentRef.setInput('open', false);
    first.detectChanges();
    expect(document.body.style.overflow).toBe('hidden');

    second.componentRef.setInput('open', false);
    second.detectChanges();
    expect(document.body.style.overflow).toBe('scroll');

    first.destroy();
    second.destroy();
  });

  it('lets only the topmost stacked dialog handle document keyboard events', () => {
    const first = TestBed.createComponent(UiModalComponent);
    const second = TestBed.createComponent(UiModalComponent);
    let firstCloseRequests = 0;
    let secondCloseRequests = 0;
    first.componentInstance.openChange.subscribe(() => {
      firstCloseRequests += 1;
    });
    second.componentInstance.openChange.subscribe(() => {
      secondCloseRequests += 1;
    });
    first.componentRef.setInput('open', true);
    first.detectChanges();
    second.componentRef.setInput('open', true);
    second.detectChanges();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(firstCloseRequests).toBe(0);
    expect(secondCloseRequests).toBe(1);

    second.componentRef.setInput('open', false);
    second.detectChanges();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(firstCloseRequests).toBe(1);
    first.destroy();
    second.destroy();
  });
});
