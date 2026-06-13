import { TestBed } from '@angular/core/testing';

import { UiSkeletonComponent } from './skeleton';

describe('UiSkeletonComponent', () => {
  it('marks skeletons as decorative loading placeholders', async () => {
    await TestBed.configureTestingModule({ imports: [UiSkeletonComponent] }).compileComponents();
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
  });
});
