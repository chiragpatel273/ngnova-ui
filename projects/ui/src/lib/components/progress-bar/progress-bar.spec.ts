import { TestBed } from '@angular/core/testing';

import { UiProgressBarComponent } from '../../../../progress-bar/src/progress-bar';

describe('UiProgressBarComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [UiProgressBarComponent] }).compileComponents();
  });

  it('exposes determinate progress semantics and visual percentage', () => {
    const fixture = TestBed.createComponent(UiProgressBarComponent);
    fixture.componentRef.setInput('value', 40);
    fixture.componentRef.setInput('max', 80);
    fixture.componentRef.setInput('label', 'Upload progress');
    fixture.componentRef.setInput('ariaValueText', '40 of 80 files');
    fixture.detectChanges();

    const progress = fixture.nativeElement.querySelector('[role="progressbar"]') as HTMLElement;
    const bar = progress.firstElementChild as HTMLElement;
    expect(progress.getAttribute('aria-label')).toBe('Upload progress');
    expect(progress.getAttribute('aria-valuemin')).toBe('0');
    expect(progress.getAttribute('aria-valuenow')).toBe('40');
    expect(progress.getAttribute('aria-valuemax')).toBe('80');
    expect(progress.getAttribute('aria-valuetext')).toBe('40 of 80 files');
    expect(bar.style.width).toBe('50%');
  });

  it('normalizes invalid maxima and non-finite values', () => {
    const fixture = TestBed.createComponent(UiProgressBarComponent);
    fixture.componentRef.setInput('value', Number.NaN);
    fixture.componentRef.setInput('max', 0);
    fixture.detectChanges();

    const progress = fixture.nativeElement.querySelector('[role="progressbar"]') as HTMLElement;
    const bar = progress.firstElementChild as HTMLElement;
    expect(progress.getAttribute('aria-valuenow')).toBe('0');
    expect(progress.getAttribute('aria-valuemax')).toBe('1');
    expect(bar.style.width).toBe('0%');

    fixture.componentRef.setInput('value', 4);
    fixture.componentRef.setInput('max', -10);
    fixture.detectChanges();
    expect(progress.getAttribute('aria-valuenow')).toBe('1');
    expect(progress.getAttribute('aria-valuemax')).toBe('1');
    expect(bar.style.width).toBe('100%');
  });

  it('clamps values to the determinate range', () => {
    const fixture = TestBed.createComponent(UiProgressBarComponent);
    fixture.componentRef.setInput('value', -20);
    fixture.componentRef.setInput('max', 200);
    fixture.detectChanges();

    const progress = fixture.nativeElement.querySelector('[role="progressbar"]') as HTMLElement;
    const bar = progress.firstElementChild as HTMLElement;
    expect(progress.getAttribute('aria-valuenow')).toBe('0');
    expect(bar.style.width).toBe('0%');

    fixture.componentRef.setInput('value', 240);
    fixture.detectChanges();
    expect(progress.getAttribute('aria-valuenow')).toBe('200');
    expect(bar.style.width).toBe('100%');
  });

  it('omits all value semantics when indeterminate', () => {
    const fixture = TestBed.createComponent(UiProgressBarComponent);
    fixture.componentRef.setInput('indeterminate', true);
    fixture.componentRef.setInput('ariaValueText', 'Almost done');
    fixture.detectChanges();

    const progress = fixture.nativeElement.querySelector('[role="progressbar"]') as HTMLElement;
    const bar = progress.firstElementChild as HTMLElement;
    expect(progress.getAttribute('aria-valuemin')).toBeNull();
    expect(progress.getAttribute('aria-valuemax')).toBeNull();
    expect(progress.getAttribute('aria-valuenow')).toBeNull();
    expect(progress.getAttribute('aria-valuetext')).toBeNull();
    expect(bar.style.width).toBe('45%');
    expect(bar.classList).toContain('animate-pulse');
  });

  it.each([
    ['primary', 'bg-blue-600', 'dark:bg-blue-500'],
    ['success', 'bg-emerald-600', 'dark:bg-emerald-500'],
    ['warning', 'bg-amber-500', 'dark:bg-amber-400'],
    ['danger', 'bg-red-600', 'dark:bg-red-500'],
  ] as const)('renders the %s semantic variant', (variant, lightClass, darkClass) => {
    const fixture = TestBed.createComponent(UiProgressBarComponent);
    fixture.componentRef.setInput('variant', variant);
    fixture.detectChanges();

    const bar = fixture.nativeElement.querySelector('[role="progressbar"] > div') as HTMLElement;
    expect(bar.classList).toContain(lightClass);
    expect(bar.classList).toContain(darkClass);
  });
});
