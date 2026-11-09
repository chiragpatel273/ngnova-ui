import { Component, inject } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  UiConfirmationDialogComponent,
  UiConfirmationService,
} from '../../../../confirmation/src/confirmation';
import type {
  UiConfirmationOptions,
  UiConfirmationResult,
} from '../../../../confirmation/src/confirmation';
import { provideUiConfirmationLabels } from '../../../../confirmation/src/confirmation-labels';

@Component({
  standalone: true,
  imports: [UiConfirmationDialogComponent],
  template: `
    <button type="button" class="opener" (click)="request(defaultOptions)">Delete release</button>
    <ui-confirmation-dialog
      (responded)="lastResponse = $event"
      (escapeKeyDown)="escapeCount = escapeCount + 1"
    />
  `,
})
class HostComponent {
  private readonly confirmations = inject(UiConfirmationService);
  readonly defaultOptions: UiConfirmationOptions = {
    title: 'Delete release?',
    message: 'This permanently removes version 1.0.0.',
    confirmLabel: 'Delete',
    intent: 'danger',
  };
  lastPromise: Promise<UiConfirmationResult> | null = null;
  lastResponse: UiConfirmationResult | null = null;
  escapeCount = 0;

  request(options: UiConfirmationOptions): Promise<UiConfirmationResult> {
    this.lastPromise = this.confirmations.confirm(options);
    return this.lastPromise;
  }
}

describe('UiConfirmationDialogComponent and UiConfirmationService', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let service: UiConfirmationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    service = TestBed.inject(UiConfirmationService);
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('renders an alertdialog, focuses the safe action, and resolves a typed result', async () => {
    const opener = fixture.debugElement.query(By.css('.opener')).nativeElement as HTMLButtonElement;
    opener.focus();
    opener.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const dialog = fixture.debugElement.query(By.css('[role="alertdialog"]'));
    const buttons = dialog.queryAll(By.css('button'));
    expect(dialog.nativeElement.getAttribute('aria-modal')).toBe('true');
    expect(dialog.nativeElement.textContent).toContain('Delete release?');
    expect(document.activeElement).toBe(buttons[0]?.nativeElement);
    expect(document.body.style.overflow).toBe('hidden');

    const confirm = buttons[1]?.nativeElement as HTMLButtonElement;
    confirm.focus();
    confirm.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }),
    );
    expect(document.activeElement).toBe(buttons[0]?.nativeElement);
    confirm.click();
    fixture.detectChanges();
    const result = await host.lastPromise;
    await fixture.whenStable();

    expect(result?.confirmed).toBe(true);
    expect(result?.reason).toBe('confirm');
    expect(host.lastResponse?.request.title).toBe('Delete release?');
    expect(document.activeElement).toBe(opener);
    expect(document.body.style.overflow).toBe('');
  });

  it('requires exact confirmation text before enabling the destructive action', async () => {
    const resultPromise = host.request({
      title: 'Delete workspace?',
      message: 'All projects will be removed.',
      requireText: 'DELETE',
      requireTextLabel: 'Type DELETE to continue',
      intent: 'danger',
    });
    fixture.detectChanges();
    await fixture.whenStable();

    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    const buttons = fixture.debugElement.queryAll(By.css('[role="alertdialog"] button'));
    const confirm = buttons[1]?.nativeElement as HTMLButtonElement;
    expect(document.activeElement).toBe(input);
    expect(confirm.disabled).toBe(true);

    input.value = 'DELETE';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(confirm.disabled).toBe(false);
    confirm.click();
    fixture.detectChanges();

    expect((await resultPromise).reason).toBe('confirm');
  });

  it('honors Escape policy while always exposing the key event', async () => {
    const resultPromise = host.request({
      title: 'Publish release?',
      message: 'The package will become public.',
      closeOnEscape: false,
    });
    fixture.detectChanges();
    await fixture.whenStable();

    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    );
    fixture.detectChanges();
    expect(host.escapeCount).toBe(1);
    expect(service.current()?.title).toBe('Publish release?');

    const cancel = fixture.debugElement.query(By.css('[role="alertdialog"] button'))
      .nativeElement as HTMLButtonElement;
    cancel.click();
    fixture.detectChanges();
    expect((await resultPromise).reason).toBe('cancel');
  });

  it('keeps the safe backdrop default and supports explicit backdrop cancellation', async () => {
    const firstPromise = host.request({
      title: 'Keep open?',
      message: 'Backdrop is ignored by default.',
    });
    fixture.detectChanges();
    await fixture.whenStable();
    const backdrop = fixture.debugElement.query(By.css('[role="presentation"]'))
      .nativeElement as HTMLElement;
    backdrop.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    fixture.detectChanges();
    expect(service.current()).not.toBeNull();
    service.respond('cancel');
    expect((await firstPromise).reason).toBe('cancel');

    const secondPromise = host.request({
      title: 'Dismissible?',
      message: 'Backdrop cancellation is explicit.',
      closeOnBackdrop: true,
    });
    fixture.detectChanges();
    await fixture.whenStable();
    const nextBackdrop = fixture.debugElement.query(By.css('[role="presentation"]'))
      .nativeElement as HTMLElement;
    nextBackdrop.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    fixture.detectChanges();
    expect((await secondPromise).reason).toBe('backdrop');
  });

  it('queues concurrent requests in FIFO order and resolves cleanup deterministically', async () => {
    const first = service.confirm({ title: 'First', message: 'First request' });
    const second = service.confirm({ title: 'Second', message: 'Second request' });
    fixture.detectChanges();
    expect(service.current()?.title).toBe('First');
    expect(service.pendingCount()).toBe(1);

    service.respond('confirm');
    expect((await first).reason).toBe('confirm');
    expect(service.current()?.title).toBe('Second');
    service.cancelAll('destroyed');
    expect((await second).reason).toBe('destroyed');
    expect(service.current()).toBeNull();
    expect(service.pendingCount()).toBe(0);
  });

  it('announces queued confirmations in English by default', async () => {
    void service.confirm({ title: 'First', message: 'First request' });
    void service.confirm({ title: 'Second', message: 'Second request' });
    void service.confirm({ title: 'Third', message: 'Third request' });
    fixture.detectChanges();
    await fixture.whenStable();

    const status = fixture.debugElement.query(By.css('[aria-live="polite"]'))
      .nativeElement as HTMLElement;
    expect(status.textContent?.trim()).toBe('2 more confirmations pending');
    service.cancelAll();
  });

  it('resolves pending work when its application-shell host is destroyed', async () => {
    const shell = TestBed.createComponent(HostComponent);
    shell.detectChanges();
    const resultPromise = shell.componentInstance.request({
      title: 'Pending request',
      message: 'The shell is leaving.',
    });
    shell.detectChanges();

    shell.destroy();

    expect((await resultPromise).reason).toBe('destroyed');
    expect(service.current()).toBeNull();
  });
});

describe('UiConfirmationDialogComponent labels', () => {
  let fixture: ComponentFixture<UiConfirmationDialogComponent>;
  let service: UiConfirmationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiConfirmationDialogComponent],
      providers: [
        provideUiConfirmationLabels({
          cancel: 'Annuler',
          pendingConfirmations: (count) => `Encore ${count} confirmation(s) en attente`,
        }),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(UiConfirmationDialogComponent);
    service = TestBed.inject(UiConfirmationService);
  });

  afterEach(() => fixture.destroy());

  function openQueue(): HTMLElement {
    void service.confirm({ title: 'First', message: 'First request' });
    void service.confirm({ title: 'Second', message: 'Second request' });
    fixture.detectChanges();
    return fixture.nativeElement.querySelector('[role="alertdialog"]') as HTMLElement;
  }

  it('uses provided labels for button text and the pending count', () => {
    const dialog = openQueue();

    expect(dialog.querySelector('button')?.textContent?.trim()).toBe('Annuler');
    expect(dialog.querySelector('[aria-live="polite"]')?.textContent?.trim()).toBe(
      'Encore 1 confirmation(s) en attente',
    );
  });

  it('lets explicit inputs and request fields win over provided labels', () => {
    fixture.componentRef.setInput('cancelLabel', 'Dismiss');
    fixture.componentRef.setInput('queueLabel', 'queued');
    void service.confirm({ title: 'First', message: 'First request', cancelLabel: 'Keep' });
    void service.confirm({ title: 'Second', message: 'Second request' });
    fixture.detectChanges();
    const dialog = fixture.nativeElement.querySelector('[role="alertdialog"]') as HTMLElement;

    expect(dialog.querySelector('button')?.textContent?.trim()).toBe('Keep');
    expect(dialog.querySelector('[aria-live="polite"]')?.textContent?.trim()).toBe('1 queued');

    service.respond('cancel');
    void service.confirm({ title: 'Third', message: 'Third request' });
    fixture.detectChanges();
    const next = fixture.nativeElement.querySelector('[role="alertdialog"]') as HTMLElement;
    expect(next.querySelector('button')?.textContent?.trim()).toBe('Dismiss');
  });
});
