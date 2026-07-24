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

  it('keeps documentation screens behind lazy route boundaries', () => {
    const shell = routes[0];
    const screenRoutes = shell.children?.filter((route) => !route.redirectTo) ?? [];

    expect(shell.component).toBeUndefined();
    expect(shell.loadComponent).toBeTypeOf('function');
    expect(screenRoutes.length).toBeGreaterThan(0);
    for (const route of screenRoutes) {
      expect(route.component).toBeUndefined();
      expect(route.loadComponent).toBeTypeOf('function');
    }
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
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Repository-backed release facts',
    );
    expect((fixture.nativeElement as HTMLElement).textContent).not.toContain('Trusted by');
    expect((fixture.nativeElement as HTMLElement).textContent).not.toContain('2,500+');

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

  it('previews scoped theme tokens without mutating the application theme', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/theming');
    fixture.detectChanges();
    await fixture.whenStable();

    const playground = fixture.nativeElement.querySelector('.ui-theme') as HTMLElement;
    const controls = playground.querySelectorAll<HTMLInputElement>('input[type="color"]');
    const modeButton = Array.from(playground.querySelectorAll<HTMLButtonElement>('button')).find(
      (button) => button.textContent?.includes('Preview dark mode'),
    );

    expect(playground.getAttribute('data-ui-theme')).toBe('light');
    expect(playground.style.getPropertyValue('--ui-color-primary')).toBe('#2563eb');

    controls[0].value = '#7c3aed';
    controls[0].dispatchEvent(new Event('input'));
    modeButton?.click();
    fixture.detectChanges();

    expect(playground.style.getPropertyValue('--ui-color-primary')).toBe('#7c3aed');
    expect(playground.getAttribute('data-ui-theme')).toBe('dark');
    expect(playground.classList).toContain('dark');
  });

  it('opens an accessible mobile navigation drawer and closes it with Escape or navigation', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/components/button');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const trigger = compiled.querySelector<HTMLButtonElement>(
      'button[aria-controls="docs-mobile-navigation"]',
    );

    expect(trigger).toBeTruthy();
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(compiled.querySelector('#docs-mobile-navigation')).toBeNull();

    trigger?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const drawer = compiled.querySelector<HTMLElement>('#docs-mobile-navigation');
    const closeButton = drawer?.querySelector<HTMLButtonElement>(
      'button[aria-label="Close component navigation"]',
    );

    expect(drawer?.getAttribute('role')).toBe('dialog');
    expect(drawer?.getAttribute('aria-modal')).toBe('true');
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
    expect(closeButton).toBeTruthy();
    expect(document.body.style.overflow).toBe('hidden');

    drawer?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(compiled.querySelector('#docs-mobile-navigation')).toBeNull();
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(document.body.style.overflow).toBe('');
    expect(document.activeElement).toBe(trigger);

    trigger?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const inputLink = Array.from(
      compiled.querySelectorAll<HTMLAnchorElement>('#docs-mobile-navigation a'),
    ).find((link) => link.textContent?.trim() === 'Input');
    inputLink?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(router.url).toBe('/components/input');
    expect(compiled.querySelector('#docs-mobile-navigation')).toBeNull();
  });

  it('has route-ready docs and detail content for every component', () => {
    for (const doc of componentDocs) {
      expect(docsBySlug.get(doc.slug)).toBe(doc);
      expect(componentDocDetailsBySlug.has(doc.slug)).toBe(true);
      expect(doc.selector).toMatch(/^(ui-|\[ui)/);
    }
  });

  it('lists every documented component exactly once in the left sidebar', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/components');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const componentNavigation = compiled.querySelector<HTMLElement>(
      'nav[aria-label="Component documentation"]',
    );
    const sidebarSlugs = Array.from(
      componentNavigation?.querySelectorAll<HTMLAnchorElement>('a[href^="/components/"]') ?? [],
      (link) => link.getAttribute('href')?.replace('/components/', '') ?? '',
    );
    const documentedSlugs = componentDocs.map((doc) => doc.slug);

    expect(componentNavigation).toBeTruthy();
    expect(sidebarSlugs).toHaveLength(documentedSlugs.length);
    expect(new Set(sidebarSlugs).size).toBe(documentedSlugs.length);
    expect(new Set(sidebarSlugs)).toEqual(new Set(documentedSlugs));
  });

  it('renders the admin template as a responsive, component-composed dashboard', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/templates');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const dashboard = compiled.querySelector<HTMLElement>('[data-admin-template]');
    const metrics = dashboard?.querySelectorAll('[data-admin-metric]');

    expect(dashboard).toBeTruthy();
    expect(metrics?.length).toBe(4);
    expect(dashboard?.textContent).toContain('Revenue overview');
    expect(dashboard?.textContent).toContain('Team capacity');
    expect(dashboard?.textContent).toContain('Recent orders');
    expect(dashboard?.querySelector('canvas[aria-label^="Revenue trend"]')).toBeTruthy();
    expect(dashboard?.querySelector('ui-table')).toBeTruthy();
    expect(dashboard?.querySelector('ui-input')).toBeTruthy();
    expect(dashboard?.querySelector('ui-progress-bar')).toBeTruthy();

    const mobileNavigationTrigger = dashboard?.querySelector<HTMLButtonElement>(
      'button[aria-label="Open admin navigation"]',
    );
    expect(mobileNavigationTrigger?.getAttribute('aria-expanded')).toBe('false');

    mobileNavigationTrigger?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const mobileNavigation = dashboard?.querySelector<HTMLElement>(
      '[role="dialog"][aria-label="Admin navigation"]',
    );
    expect(mobileNavigation).toBeTruthy();
    expect(mobileNavigationTrigger?.getAttribute('aria-expanded')).toBe('true');

    mobileNavigation?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(dashboard?.querySelector('[role="dialog"][aria-label="Admin navigation"]')).toBeNull();
    expect(mobileNavigationTrigger?.getAttribute('aria-expanded')).toBe('false');
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

  it('uses the shared accessible Preview and Code pattern for button and generic component pages', async () => {
    const router = TestBed.inject(Router);

    for (const { slug, exampleCount } of [
      { slug: 'button', exampleCount: 9 },
      { slug: 'input', exampleCount: 1 },
    ]) {
      const fixture = TestBed.createComponent(App);
      await router.navigateByUrl(`/components/${slug}`);
      fixture.detectChanges();
      await fixture.whenStable();

      const compiled = fixture.nativeElement as HTMLElement;
      const examples = compiled.querySelectorAll('app-docs-preview-canvas');
      expect(examples.length).toBe(exampleCount);

      for (const example of examples) {
        const tabList = example.querySelector<HTMLElement>('[role="tablist"]');
        const tabs = Array.from(tabList?.children ?? []).filter(
          (element): element is HTMLButtonElement => element.getAttribute('role') === 'tab',
        );
        const panel = example.querySelector<HTMLElement>('[role="tabpanel"]');
        expect(tabs.length).toBe(2);
        expect(tabs[0]?.textContent?.trim()).toBe('Preview');
        expect(tabs[0]?.getAttribute('aria-selected')).toBe('true');
        expect(tabs[0]?.getAttribute('aria-controls')).toBe(panel?.id);
        expect(panel?.getAttribute('aria-labelledby')).toBe(tabs[0]?.id);
      }

      fixture.destroy();
    }
  });

  it('switches Preview and Code with keyboard controls and copies the matching snippet', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    const writeText = vi.fn().mockResolvedValue(undefined);
    const originalClipboard = navigator.clipboard;

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    try {
      await router.navigateByUrl('/components/button');
      fixture.detectChanges();
      await fixture.whenStable();

      const compiled = fixture.nativeElement as HTMLElement;
      const example = compiled.querySelector<HTMLElement>('app-docs-preview-canvas');
      const tabList = example?.querySelector<HTMLElement>('[role="tablist"]');
      const initialTabs = tabList?.querySelectorAll<HTMLButtonElement>(':scope > [role="tab"]');

      initialTabs?.[0]?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
      );
      fixture.detectChanges();
      await fixture.whenStable();

      const tabs = example?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
      const codePanel = example?.querySelector<HTMLElement>('[role="tabpanel"]');
      expect(tabs?.[1]?.getAttribute('aria-selected')).toBe('true');
      expect(document.activeElement).toBe(tabs?.[1]);
      expect(codePanel?.getAttribute('aria-labelledby')).toBe(tabs?.[1]?.id);

      const copyButton = example?.querySelector<HTMLButtonElement>('app-docs-code-block ui-button');
      copyButton?.click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(writeText).toHaveBeenCalledWith(
        expect.stringContaining('<ui-button>Primary Action</ui-button>'),
      );
      fixture.detectChanges();
      expect(copyButton?.textContent?.trim()).toBe('Copied');
    } finally {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: originalClipboard,
      });
    }
  });

  it('integrates the Card playground with the standard docs shell and generated code view', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/components/card');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    for (const expectedId of ['setup', 'usage', 'guide', 'api', 'accessibility']) {
      expect(compiled.querySelector(`#${expectedId}`)).toBeTruthy();
    }

    const playground = compiled.querySelector<HTMLElement>('app-card-doc-playground');
    const shadowSwitch = Array.from(
      playground?.querySelectorAll<HTMLButtonElement>('[role="switch"]') ?? [],
    ).find((control) => control.parentElement?.textContent?.includes('Shadow'));
    expect(shadowSwitch?.getAttribute('aria-checked')).toBe('false');

    shadowSwitch?.click();
    fixture.detectChanges();
    expect(shadowSwitch?.getAttribute('aria-checked')).toBe('true');

    const codeTab = Array.from(
      playground?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? [],
    ).find((tab) => tab.textContent?.trim() === 'Code');
    codeTab?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(playground?.querySelector('app-docs-code-block')?.textContent).toContain(
      'variant="elevated"',
    );
  });
});
