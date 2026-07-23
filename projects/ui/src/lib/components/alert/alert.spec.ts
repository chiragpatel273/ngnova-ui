import { TestBed } from '@angular/core/testing';

import { UiAlertComponent } from '../../../../alert/src/alert';

describe('UiAlertComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [UiAlertComponent] }).compileComponents();
  });

  it('renders projected content and default status role', () => {
    const fixture = TestBed.createComponent(UiAlertComponent);
    fixture.componentInstance.title = 'Saved';
    fixture.detectChanges();

    const alert = fixture.nativeElement.querySelector('div[role="status"]') as HTMLDivElement;
    expect(alert.textContent).toContain('Saved');
  });

  it('uses alert role for danger alerts', () => {
    const fixture = TestBed.createComponent(UiAlertComponent);
    fixture.componentInstance.variant = 'danger';
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
  });

  it('supports an explicit live-region role override', () => {
    const fixture = TestBed.createComponent(UiAlertComponent);
    fixture.componentInstance.variant = 'danger';
    fixture.componentInstance.ariaRole = 'status';
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="status"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
  });

  it('does not render when closed', () => {
    const fixture = TestBed.createComponent(UiAlertComponent);
    fixture.componentInstance.open = false;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role]')).toBeNull();
  });

  it('dismisses when dismissible close button is pressed', () => {
    const fixture = TestBed.createComponent(UiAlertComponent);
    let dismissed = false;
    let openChange: boolean | null = null;
    fixture.componentInstance.dismissible = true;
    fixture.componentInstance.openChange.subscribe((open) => {
      openChange = open;
    });
    fixture.componentInstance.dismissed.subscribe(() => {
      dismissed = true;
    });
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();

    expect(dismissed).toBe(true);
    expect(openChange).toBe(false);
    expect(fixture.nativeElement.textContent.trim()).toBe('');
  });

  it('renders a decorative SVG dismiss icon with a button-owned label', () => {
    const fixture = TestBed.createComponent(UiAlertComponent);
    fixture.componentInstance.dismissible = true;
    fixture.componentInstance.dismissAriaLabel = 'Close notification';
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const icon = button.querySelector('svg') as SVGElement;

    expect(button.getAttribute('aria-label')).toBe('Close notification');
    expect(button.textContent?.trim()).toBe('');
    expect(icon.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.getAttribute('focusable')).toBe('false');
    expect(icon.querySelector('path')?.getAttribute('d')).toBe('M6 6l12 12M18 6 6 18');
  });

  it.each([
    ['info', 'border-blue-200', 'dark:bg-blue-950'],
    ['success', 'border-emerald-200', 'dark:bg-emerald-950'],
    ['warning', 'border-amber-200', 'dark:bg-amber-950'],
    ['danger', 'border-red-200', 'dark:bg-red-950'],
  ] as const)('renders the %s semantic variant', (variant, borderClass, darkSurfaceClass) => {
    const fixture = TestBed.createComponent(UiAlertComponent);
    fixture.componentInstance.variant = variant;
    fixture.detectChanges();

    const alert = fixture.nativeElement.querySelector('[role]') as HTMLElement;
    expect(alert.classList).toContain(borderClass);
    expect(alert.classList).toContain(darkSurfaceClass);
  });

  it('can reopen after being dismissed when open becomes true again', () => {
    const fixture = TestBed.createComponent(UiAlertComponent);
    fixture.componentInstance.dismissible = true;
    fixture.componentInstance.title = 'Reopenable';
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();

    fixture.componentInstance.open = true;
    fixture.componentInstance.ngOnChanges({
      open: {
        currentValue: true,
        previousValue: false,
        firstChange: false,
        isFirstChange: () => false,
      },
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Reopenable');
  });
});
