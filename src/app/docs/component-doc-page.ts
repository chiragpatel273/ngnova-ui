import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import {
  UiAccordionComponent,
  UiAlertComponent,
  UiAvatarComponent,
  UiBadgeComponent,
  UiButtonComponent,
  UiCardComponent,
  UiCheckboxComponent,
  UiInputComponent,
  UiModalComponent,
  UiProgressBarComponent,
  UiRadioGroupComponent,
  UiSelectComponent,
  UiSkeletonComponent,
  UiSpinnerComponent,
  UiSwitchComponent,
  UiTabsComponent,
  UiTableComponent,
  UiTagComponent,
  UiTextareaComponent,
  UiToastComponent,
  UiToastService,
} from '@ngnova/ui';
import type {
  UiAccordionItem,
  UiRadioOption,
  UiSelectOption,
  UiTableColumn,
  UiTableRow,
  UiTabItem,
} from '@ngnova/ui';

import { componentDocDetailsBySlug, componentDocs, docsBySlug } from './docs-data';
import type { ComponentDoc, ComponentExample } from './docs-data';
import { DocsApiTableComponent } from './docs-api-table';
import { DocsCodeBlockComponent } from './docs-code-block';

interface ComponentSummaryItem {
  readonly label: string;
  readonly value: string;
}

interface DocStat {
  readonly label: string;
  readonly value: string;
}

interface GuidanceCard {
  readonly title: string;
  readonly body: string;
}

const FORM_SLUGS = ['input', 'textarea', 'checkbox', 'radio', 'switch', 'select'] as const;
const OVERLAY_SLUGS = ['modal', 'toast'] as const;
const DATA_SLUGS = ['tabs', 'accordion', 'table', 'card'] as const;

@Component({
  selector: 'app-component-doc-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    UiAccordionComponent,
    UiAlertComponent,
    UiAvatarComponent,
    UiBadgeComponent,
    UiButtonComponent,
    UiCardComponent,
    UiCheckboxComponent,
    UiInputComponent,
    UiModalComponent,
    UiProgressBarComponent,
    UiRadioGroupComponent,
    UiSelectComponent,
    UiSkeletonComponent,
    UiSpinnerComponent,
    UiSwitchComponent,
    UiTabsComponent,
    UiTableComponent,
    UiTagComponent,
    UiTextareaComponent,
    UiToastComponent,
    DocsApiTableComponent,
    DocsCodeBlockComponent,
  ],
  template: `
    @if (doc(); as componentDoc) {
      <article class="mx-auto max-w-[64rem] pb-20">
        <header class="border-b border-red-200 pb-8 pt-4 dark:border-red-950/70">
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="rounded bg-red-100 px-2 py-1 text-xs font-semibold uppercase tracking-normal text-red-800 dark:bg-red-950 dark:text-red-200"
            >
              Component
            </span>
            <span
              class="rounded bg-zinc-200 px-2 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              v0.1.0
            </span>
            <span
              class="rounded bg-zinc-200 px-2 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              {{ componentCategory() }}
            </span>
          </div>

          <div class="mt-3 grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-end">
            <div>
              <h1 class="text-5xl font-bold leading-tight text-zinc-950 dark:text-zinc-50">
                {{ componentDoc.name }}
              </h1>
              <p class="mt-4 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
                {{ componentDoc.summary }}
              </p>
            </div>

            <dl
              class="grid grid-cols-2 gap-0 overflow-hidden rounded border border-red-200 bg-white text-sm dark:border-red-950 dark:bg-zinc-950"
            >
              @for (item of summaryItems(); track item.label) {
                <div
                  class="border-b border-r border-red-100 p-3 last:border-r-0 dark:border-red-950/70"
                >
                  <dt class="text-xs font-medium uppercase text-zinc-500 dark:text-zinc-500">
                    {{ item.label }}
                  </dt>
                  <dd class="mt-1 truncate font-mono text-xs text-zinc-950 dark:text-zinc-100">
                    {{ item.value }}
                  </dd>
                </div>
              }
            </dl>
          </div>

          <div class="mt-6 flex flex-wrap gap-2">
            @for (stat of qualityStats; track stat.label) {
              <span
                class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-3 py-1.5 text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
              >
                <span class="size-1.5 rounded-full bg-red-700" aria-hidden="true"></span>
                {{ stat.value }} {{ stat.label }}
              </span>
            }
          </div>
        </header>

        <section id="usage" class="py-10">
          <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 class="text-3xl font-bold text-zinc-950 dark:text-zinc-50">Usage & variants</h2>
              <p class="mt-2 max-w-2xl leading-7 text-zinc-600 dark:text-zinc-400">
                Live examples use the public
                <code class="font-mono">{{ componentDoc.selector }}</code>
                API, paired with the exact snippet a product team would paste into an Angular app.
              </p>
            </div>
            <a
              href="#api"
              class="rounded border border-red-300 px-4 py-2 text-sm font-semibold text-red-800 transition hover:bg-red-50 dark:border-red-900 dark:text-red-200 dark:hover:bg-red-950/50"
            >
              API Reference
            </a>
          </div>

          <div
            class="grid overflow-hidden rounded border border-red-200 bg-white shadow-sm dark:border-red-950 dark:bg-zinc-950 lg:grid-cols-[minmax(0,1fr)_24rem]"
          >
            <div class="min-h-64 p-6 sm:p-8">
              <div
                class="flex min-h-52 items-center justify-center rounded bg-zinc-50 p-6 dark:bg-zinc-900"
              >
                @switch (componentDoc.slug) {
                  @case ('button') {
                    <div class="flex flex-wrap items-center justify-center gap-3">
                      <ui-button>Primary Action</ui-button>
                      <ui-button variant="secondary">Secondary</ui-button>
                      <ui-button variant="outline">Outline</ui-button>
                      <ui-button variant="ghost">Ghost</ui-button>
                    </div>
                  }
                  @case ('input') {
                    <div class="w-full max-w-sm">
                      <ui-input
                        label="Work email"
                        type="email"
                        autocomplete="email"
                        labelMode="floating"
                        helperText="Floating label, helper text, and Angular forms support."
                        clearable
                        [formControl]="email"
                      />
                    </div>
                  }
                  @case ('textarea') {
                    <div class="w-full max-w-md">
                      <ui-textarea
                        label="Release notes"
                        helperText="Counter, resize, and validation-ready field state."
                        [maxLength]="280"
                        [rows]="5"
                        [formControl]="releaseNotes"
                      />
                    </div>
                  }
                  @case ('checkbox') {
                    <div class="grid gap-4">
                      <ui-checkbox
                        label="Email subscribers"
                        helperText="Reactive form boolean value."
                        [formControl]="newsletter"
                      />
                      <ui-checkbox
                        label="Select all packages"
                        helperText="Mixed child state."
                        indeterminate
                      />
                    </div>
                  }
                  @case ('radio') {
                    <div class="w-full max-w-md">
                      <ui-radio-group
                        label="Contact preference"
                        helperText="Small mutually exclusive choices stay visible."
                        [options]="contactOptions"
                        [formControl]="contactPreference"
                      />
                    </div>
                  }
                  @case ('switch') {
                    <ui-switch
                      label="Release notifications"
                      helperText="Immediate setting state owned by the parent form."
                      [formControl]="notifications"
                    />
                  }
                  @case ('select') {
                    <div class="w-full max-w-sm">
                      <ui-select
                        label="Plan"
                        placeholder="Choose a plan"
                        helperText="Native select behavior with NgNova styling."
                        [options]="planOptions"
                        [formControl]="plan"
                      />
                    </div>
                  }
                  @case ('modal') {
                    <div class="text-center">
                      <ui-button (pressed)="modalOpen.set(true)">Open dialog</ui-button>
                      <p class="mt-3 text-sm text-zinc-500">
                        Escape, backdrop policy, and focus restore are documented below.
                      </p>
                    </div>
                  }
                  @case ('toast') {
                    <div class="text-center">
                      <ui-button (pressed)="showToast()">Show toast</ui-button>
                      <ui-toast />
                    </div>
                  }
                  @case ('table') {
                    <div class="w-full overflow-x-auto">
                      <ui-table
                        [columns]="tableColumns"
                        [rows]="tableRows"
                        selectable
                        (rowSelected)="selectedTableRow.set($event)"
                      />
                    </div>
                  }
                  @case ('tabs') {
                    <div class="w-full max-w-md">
                      <ui-tabs
                        [tabs]="componentTabs"
                        [active]="activeTab()"
                        (activeChange)="activeTab.set($event)"
                        ariaLabel="Component documentation tabs preview"
                        fullWidth
                      >
                        @if (activeTab() === 'overview') {
                          <p
                            class="rounded bg-white p-4 text-sm text-zinc-600 dark:bg-zinc-950 dark:text-zinc-300"
                          >
                            Overview panel content stays associated with the selected tab.
                          </p>
                        } @else {
                          <p
                            class="rounded bg-white p-4 text-sm text-zinc-600 dark:bg-zinc-950 dark:text-zinc-300"
                          >
                            API panel content can hold reference tables, forms, or related content.
                          </p>
                        }
                      </ui-tabs>
                    </div>
                  }
                  @case ('accordion') {
                    <div class="w-full max-w-md">
                      <ui-accordion
                        [items]="accordionItems"
                        [active]="accordionActive()"
                        (activeChange)="accordionActive.set($event)"
                      />
                    </div>
                  }
                  @case ('card') {
                    <ui-card>
                      <div uiCardHeader>
                        <h3 class="font-semibold">Analytics card</h3>
                      </div>
                      <p class="text-sm text-zinc-600 dark:text-zinc-300">
                        Projected regions keep content structure predictable.
                      </p>
                      <div uiCardFooter>
                        <ui-button size="sm" variant="outline">Open report</ui-button>
                      </div>
                    </ui-card>
                  }
                  @case ('badge') {
                    <div class="flex flex-wrap items-center justify-center gap-2">
                      <ui-badge>Default</ui-badge>
                      <ui-badge variant="success">Stable</ui-badge>
                      <ui-badge variant="warning">Review</ui-badge>
                      <ui-badge variant="danger">Blocked</ui-badge>
                    </div>
                  }
                  @case ('tag') {
                    <div class="flex flex-wrap items-center justify-center gap-2">
                      <ui-tag>Angular</ui-tag>
                      <ui-tag variant="success">Published</ui-tag>
                      <ui-tag variant="warning" removable>Needs review</ui-tag>
                    </div>
                  }
                  @case ('avatar') {
                    <div class="flex items-center justify-center gap-3">
                      <ui-avatar label="Ada Lovelace" />
                      <ui-avatar label="NgNova UI" shape="square" size="lg" />
                    </div>
                  }
                  @case ('alert') {
                    <div class="w-full max-w-lg">
                      <ui-alert variant="success" title="Saved" dismissible>
                        Your component settings were updated.
                      </ui-alert>
                    </div>
                  }
                  @case ('progress-bar') {
                    <div class="grid w-full max-w-md gap-4">
                      <ui-progress-bar [value]="76" variant="success" label="Build progress" />
                      <ui-progress-bar indeterminate label="Publishing package" />
                    </div>
                  }
                  @case ('skeleton') {
                    <div class="grid w-full max-w-md gap-4">
                      <div class="flex items-center gap-3">
                        <ui-skeleton shape="circle" width="2.75rem" height="2.75rem" />
                        <div class="grid flex-1 gap-2">
                          <ui-skeleton shape="text" width="70%" height="0.875rem" />
                          <ui-skeleton shape="text" width="45%" height="0.875rem" />
                        </div>
                      </div>
                      <ui-skeleton height="8rem" />
                    </div>
                  }
                  @case ('spinner') {
                    <div class="flex items-center justify-center gap-4">
                      <ui-spinner label="Loading invoices" />
                      <span class="text-sm text-zinc-600 dark:text-zinc-300"
                        >Loading invoices...</span
                      >
                    </div>
                  }
                  @default {
                    <ui-badge variant="info">Preview ready</ui-badge>
                  }
                }
              </div>
            </div>

            <app-docs-code-block
              class="block min-w-0 border-t border-red-200 dark:border-red-950 lg:border-l lg:border-t-0"
              [code]="componentDoc.usage"
              [filename]="componentDoc.selector + '.example.html'"
              language="Angular template"
            />
          </div>
        </section>

        <section id="guide" class="grid gap-5 border-t border-red-200 py-10 dark:border-red-950/70">
          <div>
            <h2 class="text-3xl font-bold text-zinc-950 dark:text-zinc-50">Production guidance</h2>
            <p class="mt-2 max-w-2xl leading-7 text-zinc-600 dark:text-zinc-400">
              Use these notes to decide when the component belongs in a product workflow and what to
              verify before shipping.
            </p>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            @for (card of guidanceCards(); track card.title) {
              <section
                class="rounded border border-red-200 bg-white p-5 dark:border-red-950 dark:bg-zinc-950"
              >
                <h3 class="text-xl font-bold text-zinc-950 dark:text-zinc-50">{{ card.title }}</h3>
                <p class="mt-2 leading-7 text-zinc-700 dark:text-zinc-300">{{ card.body }}</p>
              </section>
            }
          </div>
        </section>

        @if (examples().length) {
          <section id="examples" class="border-t border-red-200 py-10 dark:border-red-950/70">
            <h2 class="text-3xl font-bold text-zinc-950 dark:text-zinc-50">Examples</h2>
            <div class="mt-6 grid gap-5">
              @for (example of examples(); track example.title) {
                <section
                  class="grid gap-4 rounded border border-red-200 bg-white p-5 dark:border-red-950 dark:bg-zinc-950"
                >
                  <div>
                    <h3 class="text-xl font-bold text-zinc-950 dark:text-zinc-50">
                      {{ example.title }}
                    </h3>
                    <p class="mt-2 leading-7 text-zinc-600 dark:text-zinc-400">
                      {{ example.description }}
                    </p>
                  </div>
                  <app-docs-code-block
                    [code]="example.code"
                    [filename]="componentDoc.selector + '-recipe.example.html'"
                    language="Angular template"
                  />
                </section>
              }
            </div>
          </section>
        }

        <section id="api" class="border-t border-red-200 py-10 dark:border-red-950/70">
          <div class="mb-6">
            <h2 class="text-3xl font-bold text-zinc-950 dark:text-zinc-50">API Reference</h2>
            <p class="mt-2 max-w-2xl leading-7 text-zinc-600 dark:text-zinc-400">
              Inputs and outputs are semver-sensitive public API. Keep examples aligned with this
              table.
            </p>
          </div>
          <app-docs-api-table
            [apiInputs]="componentDoc.inputs"
            [apiOutputs]="componentDoc.outputs"
          />
        </section>

        <section
          id="accessibility"
          class="grid gap-5 border-t border-red-200 py-10 dark:border-red-950/70 md:grid-cols-2"
        >
          <div class="rounded bg-red-100 p-6 dark:bg-red-950/60">
            <h2 class="text-2xl font-bold text-zinc-950 dark:text-zinc-50">
              Accessibility matters
            </h2>
            <ul class="mt-4 grid gap-2 leading-7 text-zinc-800 dark:text-zinc-200">
              @for (item of accessibilityNotes(); track item) {
                <li>{{ item }}</li>
              }
            </ul>
          </div>
          <div
            class="rounded border border-red-200 bg-zinc-200 p-6 dark:border-red-950 dark:bg-zinc-900"
          >
            <h2 class="text-2xl font-bold text-zinc-950 dark:text-zinc-50">Fast to verify</h2>
            <ul class="mt-4 grid gap-2 leading-7 text-zinc-700 dark:text-zinc-300">
              @for (item of testingNotes(); track item) {
                <li>{{ item }}</li>
              }
            </ul>
          </div>
        </section>

        <nav
          class="mt-4 grid gap-4 border-t border-red-200 pt-8 dark:border-red-950/70 sm:grid-cols-2"
          aria-label="Component pagination"
        >
          @if (previousDoc(); as previous) {
            <a
              [routerLink]="['/components', previous.slug]"
              class="rounded border border-red-200 bg-white p-4 text-sm transition hover:bg-red-50 dark:border-red-950 dark:bg-zinc-950 dark:hover:bg-red-950/30"
            >
              <span class="text-zinc-500">Previous</span>
              <strong class="mt-1 block text-lg text-red-800 dark:text-red-200">{{
                previous.name
              }}</strong>
            </a>
          } @else {
            <span></span>
          }
          @if (nextDoc(); as next) {
            <a
              [routerLink]="['/components', next.slug]"
              class="rounded border border-red-200 bg-white p-4 text-right text-sm transition hover:bg-red-50 dark:border-red-950 dark:bg-zinc-950 dark:hover:bg-red-950/30"
            >
              <span class="text-zinc-500">Next</span>
              <strong class="mt-1 block text-lg text-red-800 dark:text-red-200">{{
                next.name
              }}</strong>
            </a>
          }
        </nav>

        <ui-modal
          [open]="modalOpen()"
          (openChange)="modalOpen.set($event)"
          size="lg"
          descriptionId="publish-dialog-description"
          [closeOnBackdrop]="false"
        >
          <span uiModalHeader>Publish package</span>
          <p id="publish-dialog-description">
            Build the library, inspect <code>dist/ui</code>, then publish with public access.
          </p>
          <div uiModalFooter class="flex gap-3">
            <ui-button variant="outline" (pressed)="modalOpen.set(false)">Cancel</ui-button>
            <ui-button (pressed)="modalOpen.set(false)">Publish</ui-button>
          </div>
        </ui-modal>
      </article>
    } @else {
      <section class="mx-auto max-w-3xl py-20 text-center">
        <p class="text-sm font-semibold uppercase text-red-800 dark:text-red-300">
          Component not found
        </p>
        <h1 class="mt-3 text-4xl font-bold text-zinc-950 dark:text-zinc-50">
          No matching docs page
        </h1>
        <p class="mt-3 text-zinc-600 dark:text-zinc-400">
          Choose a component from the documentation navigation.
        </p>
        <a
          routerLink="/components/button"
          class="mt-6 inline-block rounded bg-red-700 px-5 py-3 text-sm font-semibold text-white"
        >
          Open Button docs
        </a>
      </section>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentDocPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(UiToastService);

  protected readonly email = new FormControl('developer@example.com');
  protected readonly releaseNotes = new FormControl('Added form components and docs polish.');
  protected readonly newsletter = new FormControl(true);
  protected readonly contactPreference = new FormControl('email');
  protected readonly notifications = new FormControl(false);
  protected readonly plan = new FormControl('pro');
  protected readonly modalOpen = signal(false);
  protected readonly activeTab = signal('overview');
  protected readonly accordionActive = signal<readonly string[]>(['overview']);
  protected readonly selectedTableRow = signal<UiTableRow | null>(null);

  protected readonly qualityStats: readonly DocStat[] = [
    { label: 'Stable', value: 'API' },
    { label: 'WCAG notes', value: '2.1' },
    { label: 'Dark mode', value: 'Ready' },
  ];

  protected readonly planOptions: readonly UiSelectOption[] = [
    { label: 'Starter', value: 'starter' },
    { label: 'Pro', value: 'pro' },
    { label: 'Enterprise', value: 'enterprise' },
  ];

  protected readonly contactOptions: readonly UiRadioOption[] = [
    { label: 'Email', value: 'email', helperText: 'Best for async updates.' },
    { label: 'SMS', value: 'sms' },
    { label: 'Phone', value: 'phone', disabled: true },
  ];

  protected readonly accordionItems: readonly UiAccordionItem[] = [
    {
      value: 'overview',
      title: 'Overview',
      content: 'Use accordions for dense related sections where users need one answer at a time.',
    },
    {
      value: 'accessibility',
      title: 'Accessibility',
      content: 'Triggers expose expansion state and panels are labelled by their trigger.',
    },
  ];

  protected readonly tableColumns: readonly UiTableColumn[] = [
    { key: 'component', header: 'Component', sortable: true },
    { key: 'category', header: 'Category' },
    { key: 'status', header: 'Status' },
    { key: 'owner', header: 'Owner' },
  ];

  protected readonly tableRows: readonly UiTableRow[] = [
    { component: 'Button', category: 'Foundation', status: 'Ready', owner: 'Design system' },
    { component: 'Input', category: 'Forms', status: 'Ready', owner: 'Forms' },
    { component: 'Modal', category: 'Overlay', status: 'A11y review', owner: 'Platform' },
  ];

  protected readonly componentTabs: readonly UiTabItem[] = [
    { label: 'Overview', value: 'overview' },
    { label: 'API', value: 'api' },
  ];

  private readonly slug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('slug') ?? '')),
    {
      initialValue: this.route.snapshot.paramMap.get('slug') ?? '',
    },
  );

  protected readonly doc = computed(() => docsBySlug.get(this.slug()));
  protected readonly details = computed(() => componentDocDetailsBySlug.get(this.slug()));
  private readonly currentIndex = computed(() =>
    componentDocs.findIndex((componentDoc) => componentDoc.slug === this.slug()),
  );
  protected readonly previousDoc = computed<ComponentDoc | null>(() => {
    const index = this.currentIndex();
    return index > 0 ? componentDocs[index - 1] : null;
  });
  protected readonly nextDoc = computed<ComponentDoc | null>(() => {
    const index = this.currentIndex();
    return index >= 0 && index < componentDocs.length - 1 ? componentDocs[index + 1] : null;
  });
  protected readonly componentCategory = computed(() => this.categoryFor(this.slug()));
  protected readonly summaryItems = computed<readonly ComponentSummaryItem[]>(() => {
    const currentDoc = this.doc();

    if (!currentDoc) {
      return [];
    }

    return [
      { label: 'Selector', value: currentDoc.selector },
      { label: 'Import', value: currentDoc.importName },
      { label: 'Inputs', value: String(currentDoc.inputs.length) },
      { label: 'Outputs', value: String(currentDoc.outputs.length) },
    ];
  });
  protected readonly guidanceCards = computed<readonly GuidanceCard[]>(() => {
    const detail = this.details();
    const use =
      detail?.whenToUse[0] ??
      'Use this component when the workflow benefits from a documented, typed NgNova UI primitive.';
    const edge =
      detail?.edgeCases[0] ??
      'Keep the component aligned with native semantics and product intent.';

    return [
      { title: 'When to use', body: use },
      { title: 'Watch for', body: edge },
    ];
  });
  protected readonly examples = computed<readonly ComponentExample[]>(
    () => this.details()?.examples.slice(0, 2) ?? [],
  );
  protected readonly accessibilityNotes = computed<readonly string[]>(
    () =>
      this.details()?.accessibility.slice(0, 3) ?? ['Preserve native semantics whenever possible.'],
  );
  protected readonly testingNotes = computed<readonly string[]>(
    () =>
      this.details()?.testing.slice(0, 3) ?? [
        'Test public inputs, outputs, keyboard behavior, and state classes.',
      ],
  );

  protected showToast(): void {
    this.toast.success('Package saved', 'The toast service is ready for application feedback.');
  }

  private categoryFor(slug: string): string {
    if ((FORM_SLUGS as readonly string[]).includes(slug)) {
      return 'Forms';
    }

    if ((OVERLAY_SLUGS as readonly string[]).includes(slug)) {
      return 'Overlays';
    }

    if ((DATA_SLUGS as readonly string[]).includes(slug)) {
      return 'Navigation/Data';
    }

    return 'Foundations';
  }
}
