import { readFileSync } from 'node:fs';

/** One component entry from the generated NgNova UI reference (scripts/generate-llms.mjs --json). */
export interface ComponentReference {
  readonly slug: string;
  readonly name: string;
  readonly selector: string;
  readonly summary: string;
  readonly importPath: string;
  readonly exports: readonly string[];
  readonly inputs: readonly string[];
  readonly outputs: readonly string[];
  readonly harnesses: readonly string[];
  readonly docsUrl: string;
  readonly markdown: string;
}

export interface NgNovaReference {
  readonly schemaVersion: 1;
  readonly packageName: string;
  readonly packageVersion: string;
  readonly angularRange: string;
  readonly siteUrl: string;
  readonly rules: string;
  readonly setup: string;
  readonly themeTokens: readonly string[];
  readonly components: readonly ComponentReference[];
}

export interface SearchResult {
  readonly component: ComponentReference;
  readonly score: number;
}

export function loadReference(url: URL): NgNovaReference {
  const reference = JSON.parse(readFileSync(url, 'utf8')) as NgNovaReference;

  if (reference.schemaVersion !== 1 || !Array.isArray(reference.components)) {
    throw new Error(`Unsupported NgNova UI reference data at ${url.pathname}.`);
  }

  return reference;
}

/** Normalizes "Date Picker", "ui-date-picker", "UiDatePickerComponent", or "@ngnova/ui/date-picker". */
function normalize(value: string): string {
  return value
    .trim()
    .replace(/^@ngnova\/ui\//i, '')
    .replace(/^<|\/?>$/g, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/^ui-?/, '')
    .replace(/-?(component|directive|harness)$/, '')
    .replace(/[\s_]+/g, '-');
}

export function findComponent(
  reference: NgNovaReference,
  query: string,
): ComponentReference | undefined {
  const target = normalize(query);

  return reference.components.find(
    (component) =>
      component.slug === target ||
      normalize(component.name) === target ||
      normalize(component.selector) === target ||
      component.exports.some((name) => normalize(name) === target),
  );
}

/** True when two words match or share a stem, so "pagination" finds "Paginator". */
function related(word: string, term: string): boolean {
  if (word.includes(term) || term.includes(word)) {
    return true;
  }

  let shared = 0;
  while (shared < word.length && word[shared] === term[shared]) {
    shared++;
  }
  return shared >= 6;
}

export function searchComponents(
  reference: NgNovaReference,
  query: string,
  limit: number,
): SearchResult[] {
  const terms = query
    .toLowerCase()
    .split(/[^a-z0-9-]+/)
    .filter((term) => term.length > 1);

  if (terms.length === 0) {
    return [];
  }

  return reference.components
    .map((component) => {
      const nameWords = [...component.name.toLowerCase().split(/\s+/), component.slug];
      const summary = component.summary.toLowerCase();
      const api = [...component.inputs, ...component.outputs].join(' ').toLowerCase();
      const body = component.markdown.toLowerCase();
      const score = terms.reduce(
        (total, term) =>
          total +
          (nameWords.some((word) => related(word, term)) ? 10 : 0) +
          (summary.includes(term) ? 4 : 0) +
          (api.includes(term) ? 2 : 0) +
          (body.includes(term) ? 1 : 0),
        0,
      );
      return { component, score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.component.name.localeCompare(b.component.name))
    .slice(0, limit);
}
