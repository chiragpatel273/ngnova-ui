import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { UiBadgeComponent } from '../../../../badge/src/badge';

describe('UiBadgeComponent', () => {
  let fixture: ComponentFixture<UiBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [UiBadgeComponent] }).compileComponents();
    fixture = TestBed.createComponent(UiBadgeComponent);
  });

  it.each([
    ['default', 'bg-slate-100', 'dark:bg-slate-800'],
    ['success', 'bg-emerald-50', 'dark:bg-emerald-950'],
    ['warning', 'bg-amber-50', 'dark:bg-amber-950'],
    ['danger', 'bg-red-50', 'dark:bg-red-950'],
    ['info', 'bg-blue-50', 'dark:bg-blue-950'],
  ] as const)('applies the %s variant', (variant, lightClass, darkClass) => {
    fixture.componentRef.setInput('variant', variant);
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('span') as HTMLSpanElement;
    expect(badge.classList).toContain(lightClass);
    expect(badge.classList).toContain(darkClass);
  });

  it.each([
    ['sm', 'px-2', 'text-xs'],
    ['md', 'px-2.5', 'text-sm'],
  ] as const)('applies the %s size', (size, paddingClass, textClass) => {
    fixture.componentRef.setInput('size', size);
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('span') as HTMLSpanElement;
    expect(badge.classList).toContain(paddingClass);
    expect(badge.classList).toContain(textClass);
  });

  it('passes through role and aria-label', () => {
    fixture.componentRef.setInput('ariaRole', 'status');
    fixture.componentRef.setInput('ariaLabel', 'Success status');
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('span') as HTMLSpanElement;
    expect(badge.getAttribute('role')).toBe('status');
    expect(badge.getAttribute('aria-label')).toBe('Success status');
  });

  it('promotes a named badge to a group when no explicit role is supplied', () => {
    fixture.componentRef.setInput('ariaLabel', 'Three unread notifications');
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('span') as HTMLSpanElement;
    expect(badge.getAttribute('role')).toBe('group');
    expect(badge.getAttribute('aria-label')).toBe('Three unread notifications');
  });

  it('contains long projected content with a truncating inner span', () => {
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('span') as HTMLSpanElement;
    const content = badge.firstElementChild as HTMLSpanElement;
    expect(badge.classList).toContain('max-w-full');
    expect(content.classList).toContain('min-w-0');
    expect(content.classList).toContain('truncate');
  });
});
