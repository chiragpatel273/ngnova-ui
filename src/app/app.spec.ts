import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';

import { App } from './app';
import { routes } from './app.routes';
import { componentDocDetailsBySlug, componentDocs, docsBySlug } from './docs/docs-data';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render routed docs content', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/');
    fixture.detectChanges();
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Build faster with NgNova UI Docs',
    );

    await router.navigateByUrl('/components/button');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('NgNova UI');
    expect(compiled.textContent).toContain('Button');

    await router.navigateByUrl('/accessibility');
    fixture.detectChanges();
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Accessible Angular Components',
    );
  });

  it('toggles the docs theme from the header control', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const layout = compiled.querySelector('app-docs-layout');
    const toggle = compiled.querySelector<HTMLButtonElement>(
      'button[aria-label="Switch to dark mode"]',
    );

    expect(layout?.classList.contains('dark')).toBe(false);
    expect(toggle).toBeTruthy();
    expect(toggle?.textContent?.trim()).toBe('Dark mode');

    toggle?.click();
    fixture.detectChanges();

    const lightToggle = compiled.querySelector<HTMLButtonElement>(
      'button[aria-label="Switch to light mode"]',
    );
    expect(layout?.classList.contains('dark')).toBe(true);
    expect(lightToggle?.getAttribute('aria-pressed')).toBe('true');
    expect(lightToggle?.textContent?.trim()).toBe('Light mode');
  });

  it('has route-ready docs and detail content for every component', () => {
    for (const doc of componentDocs) {
      expect(docsBySlug.get(doc.slug)).toBe(doc);
      expect(componentDocDetailsBySlug.has(doc.slug)).toBe(true);
      expect(doc.selector).toMatch(/^ui-/);
    }
  });

  it('renders flagship component docs with unique section IDs, valid section links, and code blocks', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    for (const slug of [
      'button',
      'input',
      'textarea',
      'checkbox',
      'select',
      'radio',
      'switch',
      'modal',
      'table',
    ]) {
      await router.navigateByUrl(`/components/${slug}`);
      fixture.detectChanges();
      await fixture.whenStable();

      const compiled = fixture.nativeElement as HTMLElement;
      const sectionIds = Array.from(compiled.querySelectorAll<HTMLElement>('[id]')).map(
        (element) => element.id,
      );
      expect(new Set(sectionIds).size).toBe(sectionIds.length);

      for (const expectedId of ['setup', 'usage', 'guide', 'api', 'accessibility']) {
        expect(compiled.querySelector(`#${expectedId}`)).toBeTruthy();
      }

      expect(compiled.querySelectorAll('app-docs-code-block figure').length).toBeGreaterThan(0);
    }
  });
});
