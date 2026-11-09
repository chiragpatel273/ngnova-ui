import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import {
  type ActivatedRouteSnapshot,
  type Data,
  type ResolveFn,
  type RouterStateSnapshot,
  TitleStrategy,
} from '@angular/router';

export const DOCS_SITE_URL = 'https://chiragpatel273.github.io/ngnova-ui';
const SITE_NAME = 'NgNova UI';
const DEFAULT_TITLE = 'NgNova UI | Accessible Angular 22 component library';
const DEFAULT_DESCRIPTION =
  'Open-source Angular 22 component library: 40 accessible standalone components with focused imports, Tailwind CSS v4 theming, dark mode, Signal Forms support, and test harnesses.';

/** Component page metadata, resolved lazily so the docs data stays out of the initial bundle. */
export interface DocsComponentMeta {
  readonly name: string;
  readonly summary: string;
  readonly importPath: string;
}

export const resolveComponentMeta: ResolveFn<DocsComponentMeta | null> = async (route) => {
  const { docsBySlug, getComponentImportPath } = await import('./docs-data');
  const doc = docsBySlug.get(route.paramMap.get('slug') ?? '');

  return doc
    ? { name: doc.name, summary: doc.summary, importPath: getComponentImportPath(doc.slug) }
    : null;
};

export interface DocsPageMeta {
  readonly title: string;
  readonly description: string;
  readonly canonicalUrl: string;
}

function deepestChild(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
  let current = route;
  while (current.firstChild) {
    current = current.firstChild;
  }
  return current;
}

function canonicalUrlFor(url: string): string {
  const path = url.split(/[?#]/)[0].replace(/\/+$/, '');
  return `${DOCS_SITE_URL}${path}/`;
}

/** Resolves the document title, description, and canonical URL for a docs route. */
export function resolveDocsPageMeta(
  url: string,
  data: Data,
  routeTitle: string | undefined,
): DocsPageMeta {
  const componentMeta = data['componentMeta'] as DocsComponentMeta | null | undefined;
  const canonicalUrl = canonicalUrlFor(url);

  if (componentMeta) {
    return {
      title: `${componentMeta.name} - Angular component | ${SITE_NAME}`,
      description: `${componentMeta.summary} Standalone Angular 22 component imported from ${componentMeta.importPath}, with accessibility notes, API reference, and test harness guidance.`,
      canonicalUrl,
    };
  }

  const description = data['description'];

  return {
    title: routeTitle ? `${routeTitle} | ${SITE_NAME}` : DEFAULT_TITLE,
    description: typeof description === 'string' ? description : DEFAULT_DESCRIPTION,
    canonicalUrl,
  };
}

/**
 * Sets the title, description, canonical link, and social preview tags for every docs
 * route. Runs during prerendering, so each static page ships its own metadata.
 */
@Injectable({ providedIn: 'root' })
export class DocsTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const page = resolveDocsPageMeta(
      snapshot.url,
      deepestChild(snapshot.root).data,
      this.buildTitle(snapshot),
    );

    this.title.setTitle(page.title);
    this.meta.updateTag({ name: 'description', content: page.description });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:title', content: page.title });
    this.meta.updateTag({ property: 'og:description', content: page.description });
    this.meta.updateTag({ property: 'og:url', content: page.canonicalUrl });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:title', content: page.title });
    this.meta.updateTag({ name: 'twitter:description', content: page.description });
    this.updateCanonicalLink(page.canonicalUrl);
  }

  private updateCanonicalLink(url: string): void {
    const head = this.document.head;
    let link = head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      head.appendChild(link);
    }

    link.setAttribute('href', url);
  }
}
