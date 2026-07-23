import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { UiTagComponent, UiTagIconDirective } from '../../../../tag/src/tag';

@Component({
  standalone: true,
  imports: [UiTagComponent, UiTagIconDirective],
  template: `
    <ui-tag ariaLabel="Angular technology" removable (removed)="removed = true">
      <svg uiTagIcon viewBox="0 0 24 24"><path d="M4 12h16" /></svg>
      Angular
    </ui-tag>
  `,
})
class HostComponent {
  removed = false;
}

describe('UiTagComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent, UiTagComponent],
    }).compileComponents();
  });

  it('emits removed from the remove button', async () => {
    const fixture: ComponentFixture<HostComponent> = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();

    expect(fixture.componentInstance.removed).toBe(true);
  });

  it('renders a crisp decorative SVG for the labelled remove action', async () => {
    const fixture: ComponentFixture<HostComponent> = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const icon = button.querySelector('svg') as SVGElement;

    expect(button.getAttribute('aria-label')).toBe('Remove tag');
    expect(button.textContent?.trim()).toBe('');
    expect(icon.classList.contains('size-4')).toBe(true);
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.getAttribute('focusable')).toBe('false');
  });

  it('projects a normalized decorative SVG icon and exposes a named group', () => {
    const fixture: ComponentFixture<HostComponent> = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const tag = fixture.nativeElement.querySelector('ui-tag > span') as HTMLSpanElement;
    const icon = tag.querySelector('[uiTagIcon]') as SVGElement;
    expect(tag.getAttribute('role')).toBe('group');
    expect(tag.getAttribute('aria-label')).toBe('Angular technology');
    expect(icon.classList).toContain('size-4');
    expect(icon.getAttribute('aria-hidden')).toBe('true');
  });

  it.each([
    ['default', 'bg-slate-100', 'dark:bg-slate-800'],
    ['success', 'bg-emerald-50', 'dark:bg-emerald-950'],
    ['warning', 'bg-amber-50', 'dark:bg-amber-950'],
    ['danger', 'bg-red-50', 'dark:bg-red-950'],
    ['info', 'bg-blue-50', 'dark:bg-blue-950'],
  ] as const)('applies the %s semantic variant', (variant, lightClass, darkClass) => {
    const fixture = TestBed.createComponent(UiTagComponent);
    fixture.componentRef.setInput('variant', variant);
    fixture.detectChanges();

    const tag = fixture.nativeElement.querySelector('span') as HTMLSpanElement;
    expect(tag.classList).toContain(lightClass);
    expect(tag.classList).toContain(darkClass);
  });

  it.each([
    ['sm', 'px-2', 'text-xs'],
    ['md', 'px-2.5', 'text-sm'],
  ] as const)('applies the %s size', (size, paddingClass, textClass) => {
    const fixture = TestBed.createComponent(UiTagComponent);
    fixture.componentRef.setInput('size', size);
    fixture.detectChanges();

    const tag = fixture.nativeElement.querySelector('span') as HTMLSpanElement;
    expect(tag.classList).toContain(paddingClass);
    expect(tag.classList).toContain(textClass);
  });
});
