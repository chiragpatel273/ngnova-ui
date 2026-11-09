import { DOCS_SITE_URL, resolveDocsPageMeta } from './docs-seo';

describe('resolveDocsPageMeta', () => {
  it('builds component titles, descriptions, and canonical URLs from resolved metadata', () => {
    const page = resolveDocsPageMeta(
      '/components/select?tab=api#keyboard',
      {
        componentMeta: {
          name: 'Select',
          summary: 'Native select field.',
          importPath: '@ngnova/ui/select',
        },
      },
      undefined,
    );

    expect(page.title).toBe('Select - Angular component | NgNova UI');
    expect(page.description).toContain('Native select field.');
    expect(page.description).toContain('@ngnova/ui/select');
    expect(page.canonicalUrl).toBe(`${DOCS_SITE_URL}/components/select/`);
  });

  it('uses route titles and descriptions for guide pages', () => {
    const page = resolveDocsPageMeta(
      '/guide',
      { description: 'Install NgNova UI.' },
      'Getting started',
    );

    expect(page.title).toBe('Getting started | NgNova UI');
    expect(page.description).toBe('Install NgNova UI.');
    expect(page.canonicalUrl).toBe(`${DOCS_SITE_URL}/guide/`);
  });

  it('falls back to site defaults for the home page', () => {
    const page = resolveDocsPageMeta('/', {}, undefined);

    expect(page.title).toBe('NgNova UI | Accessible Angular 22 component library');
    expect(page.description).toContain('Angular 22 component library');
    expect(page.canonicalUrl).toBe(`${DOCS_SITE_URL}/`);
  });
});
