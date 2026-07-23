import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { UiToastComponent, UiToastService } from '../../../../toast/src/toast';

describe('UiToastComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [UiToastComponent] }).compileComponents();
    TestBed.inject(UiToastService).clear();
  });

  afterEach(() => {
    TestBed.inject(UiToastService).clear();
    vi.useRealTimers();
  });

  it('renders and dismisses service messages', async () => {
    const service = TestBed.inject(UiToastService);
    service.success('Saved', 'Changes are ready.');

    const fixture = TestBed.createComponent(UiToastComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Saved');

    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Saved');
  });

  it('uses the shared SVG contract for notification dismiss actions', async () => {
    const service = TestBed.inject(UiToastService);
    service.success('Saved');

    const fixture = TestBed.createComponent(UiToastComponent);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const icon = button.querySelector('svg') as SVGElement;

    expect(button.getAttribute('aria-label')).toBe('Dismiss notification');
    expect(button.textContent?.trim()).toBe('');
    expect(icon.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(icon.getAttribute('stroke-width')).toBe('2');
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.getAttribute('focusable')).toBe('false');
  });

  it('uses a configurable safe-area-aware top viewport offset', async () => {
    const fixture = TestBed.createComponent(UiToastComponent);
    fixture.detectChanges();

    const viewport = fixture.nativeElement.querySelector('[aria-live="polite"]') as HTMLElement;

    expect(viewport.style.getPropertyValue('--ui-toast-viewport-offset')).toBe(
      'var(--ui-toast-offset, 1rem)',
    );
    expect(viewport.className).toContain('top-0');
    expect(viewport.className).toContain(
      'pt-[max(var(--ui-toast-viewport-offset),env(safe-area-inset-top))]',
    );
    expect(viewport.className).toContain(
      'pr-[max(var(--ui-toast-viewport-offset),env(safe-area-inset-right))]',
    );
    expect(viewport.className).toContain(
      'pl-[max(var(--ui-toast-viewport-offset),env(safe-area-inset-left))]',
    );
  });

  it('applies a custom offset and bottom safe-area inset for bottom placement', async () => {
    const fixture = TestBed.createComponent(UiToastComponent);
    fixture.componentRef.setInput('position', 'bottom-right');
    fixture.componentRef.setInput('viewportOffset', '1.5rem');
    fixture.detectChanges();

    const viewport = fixture.nativeElement.querySelector('[aria-live="polite"]') as HTMLElement;

    expect(viewport.style.getPropertyValue('--ui-toast-viewport-offset')).toBe('1.5rem');
    expect(viewport.className).toContain('bottom-0');
    expect(viewport.className).toContain(
      'pb-[max(var(--ui-toast-viewport-offset),env(safe-area-inset-bottom))]',
    );
    expect(viewport.className).not.toContain('top-0');
  });

  it('creates unique IDs and typed variant helper messages', () => {
    const service = TestBed.inject(UiToastService);

    const infoId = service.info('Info');
    const successId = service.success('Success');
    const warningId = service.warning('Warning');
    const dangerId = service.danger('Danger');

    expect(new Set([infoId, successId, warningId, dangerId]).size).toBe(4);
    expect(service.messages().map((message) => message.variant)).toEqual([
      'info',
      'success',
      'warning',
      'danger',
    ]);
  });

  it('replaces duplicate explicit IDs instead of rendering duplicate tracked messages', () => {
    const service = TestBed.inject(UiToastService);

    service.show({ id: 'save-result', title: 'Saving' });
    service.show({ id: 'save-result', title: 'Saved', variant: 'success' });

    expect(service.messages()).toEqual([
      expect.objectContaining({ id: 'save-result', title: 'Saved', variant: 'success' }),
    ]);
  });

  it('keeps messages persistent by default and supports opt-in timed dismissal', () => {
    vi.useFakeTimers();
    const service = TestBed.inject(UiToastService);

    const persistentId = service.success('Persistent');
    const timedId = service.warning('Timed', undefined, 1000);
    vi.advanceTimersByTime(999);
    expect(service.messages().map((message) => message.id)).toEqual([persistentId, timedId]);

    vi.advanceTimersByTime(1);
    expect(service.messages().map((message) => message.id)).toEqual([persistentId]);
    vi.useRealTimers();
  });

  it('resets a timed dismissal when an explicit ID is replaced', () => {
    vi.useFakeTimers();
    const service = TestBed.inject(UiToastService);

    service.show({ id: 'progress', title: 'Working', duration: 500 });
    vi.advanceTimersByTime(400);
    service.show({ id: 'progress', title: 'Still working', duration: 500 });
    vi.advanceTimersByTime(400);
    expect(service.messages()[0]?.title).toBe('Still working');

    vi.advanceTimersByTime(100);
    expect(service.messages()).toEqual([]);
    vi.useRealTimers();
  });

  it('clears messages and pending dismissal timers', () => {
    vi.useFakeTimers();
    const service = TestBed.inject(UiToastService);
    service.info('One', undefined, 500);
    service.success('Two');

    service.clear();
    vi.advanceTimersByTime(500);

    expect(service.messages()).toEqual([]);
    vi.useRealTimers();
  });

  it('renders atomic status and danger alert semantics with variant styling', () => {
    const service = TestBed.inject(UiToastService);
    service.info('Update');
    service.danger('Upload failed');
    const fixture = TestBed.createComponent(UiToastComponent);
    fixture.detectChanges();

    const messages = fixture.nativeElement.querySelectorAll('section') as NodeListOf<HTMLElement>;

    expect(messages[0].getAttribute('role')).toBe('status');
    expect(messages[0].getAttribute('aria-atomic')).toBe('true');
    expect(messages[0].className).toContain('dark:bg-blue-950');
    expect(messages[1].getAttribute('role')).toBe('alert');
    expect(messages[1].className).toContain('dark:bg-red-950');
  });

  it('renders only the newest configured number of service messages', () => {
    const service = TestBed.inject(UiToastService);
    for (let index = 1; index <= 4; index++) {
      service.info(`Message ${index}`);
    }
    const fixture = TestBed.createComponent(UiToastComponent);
    fixture.componentRef.setInput('maxMessages', 2);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(fixture.nativeElement.querySelectorAll('section').length).toBe(2);
    expect(text).not.toContain('Message 2');
    expect(text).toContain('Message 3');
    expect(text).toContain('Message 4');
    expect(service.messages().length).toBe(4);
  });

  it('localizes dismiss actions and keeps long content shrink-safe', () => {
    const service = TestBed.inject(UiToastService);
    service.success('A very long translated notification title', 'Supporting detail');
    const fixture = TestBed.createComponent(UiToastComponent);
    fixture.componentRef.setInput('dismissAriaLabel', 'Benachrichtigung schließen');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const content = fixture.nativeElement.querySelector('section > div') as HTMLDivElement;

    expect(button.getAttribute('aria-label')).toBe('Benachrichtigung schließen');
    expect(content.className).toContain('min-w-0');
  });
});
