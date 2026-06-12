import { TestBed } from '@angular/core/testing';

import { UiAlertComponent } from './alert';

describe('UiAlertComponent', () => {
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
