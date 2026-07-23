import { TestBed } from '@angular/core/testing';

import { UiAvatarComponent } from '../../../../avatar/src/avatar';

describe('UiAvatarComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [UiAvatarComponent] }).compileComponents();
  });

  it('derives initials and a single image semantic from the label fallback', () => {
    const fixture = TestBed.createComponent(UiAvatarComponent);
    fixture.componentRef.setInput('label', 'Ada Lovelace');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent.trim()).toBe('AL');
    expect(fixture.nativeElement.querySelector('[role="img"]').getAttribute('aria-label')).toBe(
      'Ada Lovelace',
    );
  });

  it('renders an image when src is provided', async () => {
    const fixture = TestBed.createComponent(UiAvatarComponent);
    fixture.componentRef.setInput('src', '/avatar.png');
    fixture.componentRef.setInput('alt', 'Profile');
    fixture.detectChanges();

    const wrapper = fixture.nativeElement.querySelector('span') as HTMLSpanElement;
    const image = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(wrapper.getAttribute('role')).toBeNull();
    expect(image.getAttribute('alt')).toBe('Profile');
  });

  it('falls back to initials after an image error and retries when src changes', () => {
    const fixture = TestBed.createComponent(UiAvatarComponent);
    fixture.componentRef.setInput('src', '/missing.png');
    fixture.componentRef.setInput('label', 'Grace Hopper');
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    image.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('img')).toBeNull();
    expect(fixture.nativeElement.textContent.trim()).toBe('GH');
    expect(fixture.nativeElement.querySelector('[role="img"]').getAttribute('aria-label')).toBe(
      'Grace Hopper',
    );

    fixture.componentRef.setInput('src', '/replacement.png');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('img').getAttribute('src')).toContain(
      '/replacement.png',
    );
  });

  it('is decorative when no accessible label is available', () => {
    const fixture = TestBed.createComponent(UiAvatarComponent);
    fixture.detectChanges();

    const wrapper = fixture.nativeElement.querySelector('span') as HTMLSpanElement;
    expect(wrapper.getAttribute('role')).toBeNull();
    expect(wrapper.getAttribute('aria-hidden')).toBe('true');
    expect(wrapper.textContent?.trim()).toBe('?');
  });

  it.each([
    ['sm', 'size-8', 'text-xs'],
    ['md', 'size-10', 'text-sm'],
    ['lg', 'size-12', 'text-base'],
  ] as const)('applies the %s size', (size, dimensionClass, textClass) => {
    const fixture = TestBed.createComponent(UiAvatarComponent);
    fixture.componentRef.setInput('size', size);
    fixture.detectChanges();

    const avatar = fixture.nativeElement.querySelector('span') as HTMLSpanElement;
    expect(avatar.classList).toContain(dimensionClass);
    expect(avatar.classList).toContain(textClass);
  });

  it.each([
    ['circle', 'rounded-full'],
    ['square', 'rounded-md'],
  ] as const)('applies the %s shape', (shape, shapeClass) => {
    const fixture = TestBed.createComponent(UiAvatarComponent);
    fixture.componentRef.setInput('shape', shape);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('span').classList).toContain(shapeClass);
  });
});
