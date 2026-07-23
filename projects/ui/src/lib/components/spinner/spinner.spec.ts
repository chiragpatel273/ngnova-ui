import { TestBed } from '@angular/core/testing';

import { UiSpinnerComponent } from '../../../../spinner/src/spinner';

describe('UiSpinnerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [UiSpinnerComponent] }).compileComponents();
  });

  it('exposes status semantics by default', () => {
    const fixture = TestBed.createComponent(UiSpinnerComponent);
    fixture.componentRef.setInput('label', 'Loading packages');
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('span') as HTMLSpanElement;
    expect(spinner.getAttribute('role')).toBe('status');
    expect(spinner.getAttribute('aria-label')).toBe('Loading packages');
    expect(spinner.textContent).toBe('');
    expect(spinner.classList).toContain('motion-reduce:animate-none');
  });

  it('falls back to a non-empty status name', () => {
    const fixture = TestBed.createComponent(UiSpinnerComponent);
    fixture.componentRef.setInput('label', '   ');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="status"]').getAttribute('aria-label')).toBe(
      'Loading',
    );
  });

  it('can be decorative', () => {
    const fixture = TestBed.createComponent(UiSpinnerComponent);
    fixture.componentRef.setInput('decorative', true);
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('span') as HTMLSpanElement;
    expect(spinner.getAttribute('role')).toBeNull();
    expect(spinner.getAttribute('aria-label')).toBeNull();
    expect(spinner.getAttribute('aria-hidden')).toBe('true');
  });

  it.each([
    ['sm', 'size-4', 'border-2'],
    ['md', 'size-6', 'border-2'],
    ['lg', 'size-8', 'border-[3px]'],
  ] as const)('applies the %s size', (size, dimensionClass, borderClass) => {
    const fixture = TestBed.createComponent(UiSpinnerComponent);
    fixture.componentRef.setInput('size', size);
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('span') as HTMLSpanElement;
    expect(spinner.classList).toContain(dimensionClass);
    expect(spinner.classList).toContain(borderClass);
  });
});
