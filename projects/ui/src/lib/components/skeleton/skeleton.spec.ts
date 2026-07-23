import { TestBed } from '@angular/core/testing';

import { UiSkeletonComponent } from '../../../../skeleton/src/skeleton';

describe('UiSkeletonComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [UiSkeletonComponent] }).compileComponents();
  });

  it('marks skeletons as decorative loading placeholders', () => {
    const fixture = TestBed.createComponent(UiSkeletonComponent);
    fixture.componentRef.setInput('shape', 'circle');
    fixture.componentRef.setInput('width', '2rem');
    fixture.componentRef.setInput('height', '2rem');
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const skeleton = host.querySelector('span') as HTMLSpanElement;
    expect(host.getAttribute('aria-hidden')).toBe('true');
    expect(skeleton.className).toContain('rounded-full');
    expect(skeleton.style.width).toBe('2rem');
    expect(skeleton.style.height).toBe('2rem');
    expect(skeleton.classList).toContain('animate-pulse');
    expect(skeleton.classList).toContain('motion-reduce:animate-none');
  });

  it.each([
    ['text', 'rounded'],
    ['rect', 'rounded-md'],
    ['circle', 'rounded-full'],
  ] as const)('applies the %s shape', (shape, radiusClass) => {
    const fixture = TestBed.createComponent(UiSkeletonComponent);
    fixture.componentRef.setInput('shape', shape);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('span').classList).toContain(radiusClass);
  });

  it('can disable animation while preserving its loading surface', () => {
    const fixture = TestBed.createComponent(UiSkeletonComponent);
    fixture.componentRef.setInput('animated', false);
    fixture.detectChanges();

    const skeleton = fixture.nativeElement.querySelector('span') as HTMLSpanElement;
    expect(skeleton.classList).not.toContain('animate-pulse');
    expect(skeleton.classList).toContain('bg-slate-200');
    expect(skeleton.classList).toContain('dark:bg-slate-800');
  });
});
