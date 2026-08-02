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
      'Build production-ready Angular interfaces faster',
    );
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Start in minutes');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Start with what you need',
    );
    expect((fixture.nativeElement as HTMLElement).textContent).not.toContain(
      '40 documented components',
    );
    expect((fixture.nativeElement as HTMLElement).textContent).not.toContain(
      'hero-card.component.ts',
    );
    expect((fixture.nativeElement as HTMLElement).textContent).not.toContain('Trusted by');
    expect((fixture.nativeElement as HTMLElement).textContent).not.toContain('2,500+');

    const homeCompiled = fixture.nativeElement as HTMLElement;
    const homeArticle = homeCompiled.querySelector<HTMLElement>('app-docs-home > article');
    const quickStartCard = homeCompiled.querySelector<HTMLElement>(
      'app-docs-home aside[aria-labelledby="quick-start-heading"]',
    );
    expect(homeArticle?.classList.contains('max-w-[76rem]')).toBe(true);
    expect(quickStartCard?.classList.contains('border-blue-200')).toBe(true);
    expect(quickStartCard?.classList.contains('bg-white')).toBe(true);
    expect(homeCompiled.querySelector('[data-home-showcase]')).toBeNull();
    expect(homeCompiled.textContent).not.toContain(
      'From individual components to a complete product',
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

  it('copies quick-start commands from icon-only controls', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    const writeText = vi.fn().mockResolvedValue(undefined);
    const originalClipboard = navigator.clipboard;

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    try {
      await router.navigateByUrl('/');
      fixture.detectChanges();
      await fixture.whenStable();

      const compiled = fixture.nativeElement as HTMLElement;
      const copyButtons = compiled.querySelectorAll<HTMLButtonElement>(
        'aside button[aria-label^="Copy"]',
      );
      const quickStartCodeBlocks = compiled.querySelectorAll('aside pre');

      expect(copyButtons.length).toBe(2);
      expect(quickStartCodeBlocks.length).toBe(2);
      expect(
        Array.from(quickStartCodeBlocks).every((block) =>
          block.parentElement?.classList.contains('bg-slate-950'),
        ),
      ).toBe(true);
      expect(Array.from(copyButtons, (button) => button.textContent?.trim())).toEqual(['', '']);

      copyButtons[0]?.click();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(writeText).toHaveBeenCalledWith('npm install @ngnova/ui');
      expect(compiled.querySelector('button[aria-label="Install command copied"]')).toBeTruthy();
    } finally {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: originalClipboard,
      });
    }
  });

  it('falls back to selection-based copying when clipboard permission is denied', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    const originalClipboard = navigator.clipboard;
    const originalExecCommand = document.execCommand;
    const execCommand = vi.fn().mockReturnValue(true);

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error('Clipboard access denied')) },
    });
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: execCommand,
    });

    try {
      await router.navigateByUrl('/');
      fixture.detectChanges();
      await fixture.whenStable();

      const compiled = fixture.nativeElement as HTMLElement;
      compiled
        .querySelector<HTMLButtonElement>('button[aria-label="Copy import command"]')
        ?.click();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(execCommand).toHaveBeenCalledWith('copy');
      expect(compiled.querySelector('button[aria-label="Import command copied"]')).toBeTruthy();
    } finally {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: originalClipboard,
      });
      Object.defineProperty(document, 'execCommand', {
        configurable: true,
        value: originalExecCommand,
      });
    }
  });

  it('uses the shared compact page-title typography across documentation routes', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    for (const path of [
      '/',
      '/guide',
      '/components/button',
      '/templates',
      '/apis',
      '/accessibility',
      '/contributing',
    ]) {
      await router.navigateByUrl(path);
      fixture.detectChanges();
      await fixture.whenStable();

      const pageTitle = (fixture.nativeElement as HTMLElement).querySelector('h1');
      expect(pageTitle, `${path} should render a page title`).toBeTruthy();
      expect(pageTitle?.classList.contains('text-2xl'), `${path} should use a 24px title`).toBe(
        true,
      );
      expect(
        pageTitle?.classList.contains('leading-8'),
        `${path} should use a 32px line height`,
      ).toBe(true);
      expect(pageTitle?.classList.contains('text-3xl'), `${path} should not use a 30px title`).toBe(
        false,
      );
    }
  });

  it('publishes an actionable contribution guide', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/contributing');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Contribute to NgNova UI');
    expect(compiled.textContent).toContain('npm.cmd run release:check');
    expect(compiled.textContent).toContain('licensed under the project');
    expect(
      compiled.querySelector<HTMLAnchorElement>(
        'a[href="https://github.com/chiragpatel273/ngnova-ui/security/advisories/new"]',
      ),
    ).toBeTruthy();
  });

  it('links every Guide table-of-contents item to an existing section', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/guide');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const links = Array.from(
      compiled.querySelectorAll<HTMLAnchorElement>('nav[aria-label="On this page"] a'),
    );
    const expectedFragments = [
      'getting-started',
      'installation',
      'accessibility',
      'customization',
      'best-practices',
    ];

    expect(links.map((link) => link.textContent?.trim())).toEqual([
      'Getting Started',
      'Installation',
      'Accessibility',
      'Customization',
      'Best Practices',
    ]);
    expect(links.map((link) => link.hash.slice(1))).toEqual(expectedFragments);
    for (const fragment of expectedFragments) {
      expect(compiled.querySelector(`#${fragment}`)).toBeTruthy();
    }
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
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);

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
      const details = componentDocDetailsBySlug.get(doc.slug);

      expect(docsBySlug.get(doc.slug)).toBe(doc);
      expect(details).toBeTruthy();
      expect(
        details?.examples.length,
        `${doc.name} should teach at least two distinct product scenarios`,
      ).toBeGreaterThanOrEqual(2);
      for (const example of details?.examples ?? []) {
        expect(example.title.toLowerCase()).not.toContain('interactive example');
        expect(example.description.trim().length).toBeGreaterThan(20);
        expect(example.code.trim().length).toBeGreaterThan(20);
      }
      expect(doc.selector).toMatch(/^(ui-|\[ui)/);
    }
  });

  it('gives every component route a meaningful primary live example', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    for (const doc of componentDocs) {
      await router.navigateByUrl(`/components/${doc.slug}`);
      fixture.detectChanges();
      await fixture.whenStable();

      const preview = (fixture.nativeElement as HTMLElement).querySelector(
        'app-docs-preview-canvas',
      );

      expect(preview?.querySelector('h3')?.textContent?.trim()).not.toMatch(/component example/i);
      const title = preview?.querySelector('h3')?.textContent?.trim() ?? '';
      const description = preview?.querySelector('p')?.textContent?.trim() ?? '';

      expect(preview, `${doc.name} should render a live example`).toBeTruthy();
      expect(title, `${doc.name} should use a contextual example title`).not.toMatch(
        /component example|interactive example/i,
      );
      expect(title.length, `${doc.name} should use a descriptive example title`).toBeGreaterThan(3);
      expect(
        description.length,
        `${doc.name} should explain the product scenario shown by its example`,
      ).toBeGreaterThan(20);
      expect(preview?.textContent).not.toContain('interactive example');
    }
  });

  it('renders the additional examples as visible product recipes', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/components/card');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const recipes = compiled.querySelector('#examples');
    const recipeTitles = Array.from(recipes?.querySelectorAll('h3') ?? []).map((heading) =>
      heading.textContent?.trim(),
    );

    expect(recipes?.querySelector('h2')?.textContent?.trim()).toBe('Product recipes');
    expect(recipes?.textContent).toContain('distinct, copyable product scenarios');
    expect(recipeTitles).toEqual(['Settings card', 'Usage summary']);
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
    const groupToggles = componentNavigation?.querySelectorAll<HTMLButtonElement>(
      'button[aria-controls^="docs-group-"]',
    );

    expect(componentNavigation).toBeTruthy();
    expect(groupToggles?.length).toBe(5);
    expect(
      Array.from(groupToggles ?? [], (toggle) => toggle.getAttribute('aria-expanded')),
    ).toEqual(['true', 'true', 'true', 'true', 'true']);
    expect(Array.from(groupToggles ?? [], (toggle) => toggle.textContent?.trim())).toEqual([
      'Actions & status',
      'Forms',
      'Layout & data',
      'Navigation & workflow',
      'Overlays & feedback',
    ]);
    expect(sidebarSlugs).toHaveLength(documentedSlugs.length);
    expect(new Set(sidebarSlugs).size).toBe(documentedSlugs.length);
    expect(new Set(sidebarSlugs)).toEqual(new Set(documentedSlugs));
  });

  it('scrolls to the top whenever a left-sidebar link is clicked', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);

    await router.navigateByUrl('/components/button');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const activeSidebarLink = compiled.querySelector<HTMLAnchorElement>(
      'nav[aria-label="Component documentation"] a[href="/components/button"]',
    );
    const activeGroupToggle = compiled.querySelector<HTMLButtonElement>(
      'button[aria-controls="docs-group-actions-status"]',
    );

    activeSidebarLink?.click();

    expect(activeSidebarLink).toBeTruthy();
    expect(activeGroupToggle?.getAttribute('aria-expanded')).toBe('true');
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'auto' });
  });

  it('renders the admin template as a responsive, component-composed dashboard', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/templates');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const dashboard = compiled.querySelector<HTMLElement>('[data-admin-template]');
    const dashboardHeader = dashboard?.querySelector<HTMLElement>('[data-admin-header]');
    const metrics = dashboard?.querySelectorAll('[data-admin-metric]');
    const mainContent = dashboard?.querySelector<HTMLElement>('main#admin-main-content');
    const skipLink = dashboard?.querySelector<HTMLAnchorElement>('a[href="#admin-main-content"]');
    const mobileOrders = dashboard?.querySelectorAll('[data-admin-mobile-orders] article');

    expect(dashboard).toBeTruthy();
    expect(dashboardHeader).toBeTruthy();
    expect(dashboard?.classList.contains('h-screen')).toBe(true);
    expect(dashboard?.classList.contains('min-h-screen')).toBe(true);
    expect(dashboard?.classList.contains('h-dvh')).toBe(true);
    expect(dashboard?.classList.contains('min-h-dvh')).toBe(true);
    expect(dashboard?.classList.contains('xl:grid-rows-[minmax(0,1fr)]')).toBe(true);
    expect(dashboard?.classList.contains('overflow-hidden')).toBe(true);
    expect(dashboardHeader?.classList.contains('sticky')).toBe(true);
    expect(dashboardHeader?.classList.contains('top-0')).toBe(true);
    expect(mainContent?.classList.contains('overflow-y-auto')).toBe(true);
    expect(mainContent?.getAttribute('aria-labelledby')).toBe('admin-title');
    expect(skipLink?.textContent).toContain('Skip to dashboard content');
    expect(mainContent?.querySelector('h1')?.textContent).toContain('Overview');
    expect(dashboard?.querySelector('[data-admin-page-intro]')?.textContent).toContain(
      'Good morning, Maya',
    );
    expect(dashboardHeader?.querySelector('[data-admin-header-search]')).toBeTruthy();
    expect(dashboardHeader?.querySelector('[data-admin-notifications]')).toBeTruthy();
    expect(metrics?.length).toBe(4);
    expect(dashboard?.textContent).toContain('Revenue overview');
    expect(dashboard?.textContent).toContain('Team capacity');
    expect(dashboard?.textContent).toContain('Recent orders');
    expect(dashboard?.querySelector('canvas[aria-label^="Revenue trend"]')).toBeTruthy();
    expect(dashboard?.querySelector('ui-table')).toBeTruthy();
    expect(mobileOrders?.length).toBe(5);
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

  it('supports advanced admin navigation, sidebar, customer, and theme workflows', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    localStorage.removeItem('ngnova-admin-sidebar');
    localStorage.removeItem('ngnova-admin-theme');

    await router.navigateByUrl('/templates');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const dashboard = compiled.querySelector<HTMLElement>('[data-admin-template]');
    const desktopNavigation = dashboard?.querySelector<HTMLElement>(
      '[data-admin-desktop-navigation]',
    );
    const collapseButton = desktopNavigation?.querySelector<HTMLButtonElement>(
      'button[aria-label="Collapse admin sidebar"]',
    );

    collapseButton?.click();
    fixture.detectChanges();

    expect(collapseButton).toBeTruthy();
    expect(localStorage.getItem('ngnova-admin-sidebar')).toBe('1');
    const expandButton = desktopNavigation?.querySelector<HTMLButtonElement>(
      'button[aria-label="Expand admin sidebar"]',
    );
    expect(expandButton).toBeTruthy();
    expect(dashboard?.style.gridTemplateColumns).toContain('4rem');
    expect(expandButton?.classList.contains('rounded-lg')).toBe(true);
    expect(expandButton?.classList.contains('border-slate-200')).toBe(true);
    expect(desktopNavigation?.querySelector('[data-admin-brand-mark]')).toBeNull();

    const customersButton = Array.from(
      desktopNavigation?.querySelectorAll<HTMLButtonElement>('nav button') ?? [],
    ).find((button) => button.getAttribute('aria-label') === 'Customers');
    customersButton?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(dashboard?.querySelector('#admin-title')?.textContent?.trim()).toBe('Customers');
    expect(dashboard?.textContent).toContain(
      'Search, filter, create, and update customer accounts.',
    );
    expect(dashboard?.textContent).toContain('Olivia Martin');

    const customerSearch = dashboard?.querySelector<HTMLInputElement>(
      'input[aria-label="Search customers"]',
    );
    if (customerSearch) {
      customerSearch.value = 'Stark';
      customerSearch.dispatchEvent(new Event('input', { bubbles: true }));
    }
    fixture.detectChanges();

    expect(dashboard?.textContent).toContain('Sophia Patel');
    expect(dashboard?.textContent).not.toContain('Olivia Martin');

    const viewCustomerButton = Array.from(
      dashboard?.querySelectorAll<HTMLButtonElement>('button') ?? [],
    ).find((button) => button.textContent?.trim() === 'View');
    viewCustomerButton?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const customerEditor = dashboard?.querySelector<HTMLElement>(
      '[role="dialog"][aria-label="Edit customer"]',
    );
    expect(customerEditor).toBeTruthy();
    expect(
      customerEditor?.querySelector<HTMLInputElement>('input[name="customerName"]')?.value,
    ).toBe('Sophia Patel');

    customerEditor
      ?.querySelector<HTMLFormElement>('form')
      ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(dashboard?.querySelector('[role="dialog"][aria-label="Edit customer"]')).toBeNull();
    expect(document.body.textContent).toContain('Customer updated');

    const ordersButton = Array.from(
      desktopNavigation?.querySelectorAll<HTMLButtonElement>('nav button') ?? [],
    ).find((button) => button.getAttribute('aria-label') === 'Orders');
    ordersButton?.click();
    fixture.detectChanges();

    const orderSearch = dashboard?.querySelector<HTMLInputElement>(
      'input[aria-label="Search orders"]',
    );
    if (orderSearch) {
      orderSearch.value = 'Wayne';
      orderSearch.dispatchEvent(new Event('input', { bubbles: true }));
    }
    fixture.detectChanges();

    expect(dashboard?.querySelector('#admin-title')?.textContent?.trim()).toBe('Orders');
    expect(dashboard?.textContent).toContain('Wayne Enterprises');
    expect(dashboard?.textContent).not.toContain('Northwind Traders');

    dashboard?.querySelector<HTMLInputElement>('input[aria-label^="Select row"]')?.click();
    fixture.detectChanges();
    const markShippedButton = Array.from(
      dashboard?.querySelectorAll<HTMLButtonElement>('button') ?? [],
    ).find((button) => button.textContent?.trim() === 'Mark shipped');
    markShippedButton?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(markShippedButton).toBeTruthy();
    expect(dashboard?.textContent).toContain('Shipped');
    expect(document.body.textContent).toContain('Orders updated');

    const themeButton = dashboard?.querySelector<HTMLButtonElement>(
      'button[aria-label="Use dark dashboard theme"]',
    );
    themeButton?.click();
    fixture.detectChanges();

    expect(dashboard?.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('ngnova-admin-theme')).toBe('dark');

    localStorage.removeItem('ngnova-admin-sidebar');
    localStorage.removeItem('ngnova-admin-theme');
  });

  it('provides complete dashboard source files, a ZIP download, and a focused preview route', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/templates');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const openDashboardLink = Array.from(compiled.querySelectorAll<HTMLAnchorElement>('a')).find(
      (link) => link.textContent?.includes('Open dashboard'),
    );
    const downloadLink = Array.from(compiled.querySelectorAll<HTMLAnchorElement>('a')).find(
      (link) => link.textContent?.includes('Download ZIP'),
    );
    const sourceTabs = compiled.querySelectorAll<HTMLButtonElement>(
      '[aria-label="Admin dashboard source files"] [role="tab"]',
    );

    expect(openDashboardLink?.getAttribute('href')).toBe('#/templates/admin-dashboard');
    expect(openDashboardLink?.getAttribute('target')).toBe('_blank');
    expect(openDashboardLink?.getAttribute('rel')).toContain('noopener');
    expect(downloadLink?.getAttribute('href')).toBe(
      'templates/admin-dashboard/ngnova-admin-dashboard.zip',
    );
    expect(downloadLink?.hasAttribute('download')).toBe(true);
    expect(Array.from(sourceTabs, (tab) => tab.textContent?.trim())).toEqual([
      'HTML',
      'TypeScript',
      'CSS',
      'Chart helper',
    ]);

    sourceTabs[1]?.click();
    fixture.detectChanges();
    expect(compiled.querySelector('app-docs-code-block')?.textContent).toContain(
      'admin-dashboard.component.ts',
    );
    expect(compiled.querySelector('app-docs-code-block')?.textContent).toContain(
      'export class AdminDashboardComponent',
    );

    await router.navigateByUrl('/templates/admin-dashboard');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(compiled.querySelector('app-admin-dashboard-preview')).toBeTruthy();
    expect(compiled.querySelector('[data-admin-template]')).toBeTruthy();
    expect(compiled.querySelector('app-docs-layout')).toBeNull();
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

  it('uses the shared accessible Preview and Code pattern for flagship component pages', async () => {
    const router = TestBed.inject(Router);

    for (const { slug, exampleCount } of [
      { slug: 'button', exampleCount: 9 },
      { slug: 'input', exampleCount: 7 },
      { slug: 'table', exampleCount: 6 },
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
