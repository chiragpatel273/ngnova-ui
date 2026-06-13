import { TestBed } from '@angular/core/testing';

import { UiAvatarComponent } from './avatar';

describe('UiAvatarComponent', () => {
  it('derives initials from the label fallback', async () => {
    await TestBed.configureTestingModule({ imports: [UiAvatarComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UiAvatarComponent);
    fixture.componentRef.setInput('label', 'Ada Lovelace');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent.trim()).toBe('AL');
    expect(fixture.nativeElement.querySelector('[role="img"]').getAttribute('aria-label')).toBe(
      'Ada Lovelace',
    );
  });

  it('renders an image when src is provided', async () => {
    await TestBed.configureTestingModule({ imports: [UiAvatarComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UiAvatarComponent);
    fixture.componentRef.setInput('src', '/avatar.png');
    fixture.componentRef.setInput('alt', 'Profile');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('img').getAttribute('alt')).toBe('Profile');
  });
});
