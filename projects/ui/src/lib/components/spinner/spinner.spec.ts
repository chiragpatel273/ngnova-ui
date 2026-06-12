import { TestBed } from '@angular/core/testing';

import { UiSpinnerComponent } from './spinner';

describe('UiSpinnerComponent', () => {
  it('exposes status semantics by default', () => {
    const fixture = TestBed.createComponent(UiSpinnerComponent);
    fixture.componentInstance.label = 'Loading packages';
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('span') as HTMLSpanElement;
    expect(spinner.getAttribute('role')).toBe('status');
    expect(spinner.getAttribute('aria-label')).toBe('Loading packages');
  });

  it('can be decorative', () => {
    const fixture = TestBed.createComponent(UiSpinnerComponent);
    fixture.componentInstance.decorative = true;
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('span') as HTMLSpanElement;
    expect(spinner.getAttribute('role')).toBeNull();
    expect(spinner.getAttribute('aria-hidden')).toBe('true');
  });
});
