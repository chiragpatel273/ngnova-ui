import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import {
  UiAlertComponent,
  UiAccordionComponent,
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
import type { ComponentDoc } from './docs-data';
import { DocsApiTableComponent } from './docs-api-table';
import { DocsCodeBlockComponent } from './docs-code-block';
import { DocsPreviewCanvasComponent } from './docs-preview-canvas';
import { DocsSectionComponent } from './docs-section';

interface SectionNavItem {
  readonly label: string;
  readonly href: string;
}

interface ComponentSummaryItem {
  readonly label: string;
  readonly value: string;
}

interface QualityItem {
  readonly label: string;
  readonly value: string;
}

const FORM_SLUGS = ['input', 'textarea', 'checkbox', 'radio', 'switch', 'select'] as const;
const OVERLAY_SLUGS = ['modal', 'toast'] as const;
const NAVIGATION_DATA_SLUGS = ['tabs', 'accordion', 'table', 'card'] as const;

@Component({
  selector: 'app-component-doc-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    UiBadgeComponent,
    UiAccordionComponent,
    UiAvatarComponent,
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
    UiAlertComponent,
    UiToastComponent,
    DocsApiTableComponent,
    DocsCodeBlockComponent,
    DocsPreviewCanvasComponent,
    DocsSectionComponent,
  ],
  template: `
    @if (doc(); as componentDoc) {
      <article class="mx-auto max-w-[84rem]">
        <header class="pb-6">
          <div class="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <a
              routerLink="/"
              class="font-medium text-blue-700 hover:text-blue-800 dark:text-blue-300"
            >
              Docs
            </a>
            <span aria-hidden="true">/</span>
            <a
              routerLink="/components"
              class="font-medium text-blue-700 hover:text-blue-800 dark:text-blue-300"
            >
              Components
            </a>
            <span aria-hidden="true">/</span>
            <span class="text-slate-900 dark:text-slate-100">{{ componentDoc.name }}</span>
          </div>
          <div class="mt-5 flex flex-wrap items-start justify-between gap-4">
            <div class="max-w-3xl">
              <h1 class="text-4xl font-semibold text-slate-950 dark:text-slate-50">
                {{ componentDoc.name }}
              </h1>
              <p class="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
                {{ componentDoc.summary }}
              </p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <ui-badge size="sm">{{ componentDoc.selector }}</ui-badge>
              <ui-badge variant="info" size="sm">{{ componentCategory() }}</ui-badge>
              <ui-badge variant="warning" size="sm">{{ componentMaturity() }}</ui-badge>
            </div>
          </div>
        </header>

        <nav
          class="sticky top-0 z-20 mt-4 overflow-x-auto rounded-lg border border-slate-200 bg-white/95 px-2 py-2 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 xl:hidden"
          aria-label="Page sections"
        >
          <div class="flex min-w-max items-center gap-1">
            <span class="pr-2 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              On this page
            </span>
            @for (item of sectionNav(); track item.href) {
              <a
                [href]="item.href"
                [class]="sectionLinkClasses(item.href, true)"
                (click)="activeSection.set(item.href)"
              >
                {{ item.label }}
              </a>
            }
          </div>
        </nav>

        <div class="mt-6 grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1fr)_15rem] xl:items-start">
          <div class="grid min-w-0 gap-5">
            <section class="grid min-w-0 gap-6">
              <app-docs-section
                sectionId="preview"
                title="Basic"
                [description]="previewDescription(componentDoc)"
              >
                <app-docs-preview-canvas
                  title="Production states"
                  description="Real component examples rendered from the public package API."
                  status="Interactive"
                >
                  @switch (componentDoc.slug) {
                    @case ('button') {
                      <div class="grid gap-5">
                        <section
                          class="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800"
                        >
                          <div class="flex flex-wrap items-center justify-between gap-5">
                            <div>
                              <p class="text-sm font-semibold text-slate-950 dark:text-slate-50">
                                Release workflow
                              </p>
                              <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                A common page footer with clear action hierarchy and no accidental
                                submit behavior.
                              </p>
                            </div>
                            <div class="flex flex-wrap items-center gap-2">
                              <ui-button variant="outline">Cancel</ui-button>
                              <ui-button variant="secondary">Save draft</ui-button>
                              <ui-button variant="primary">Publish</ui-button>
                            </div>
                          </div>
                        </section>

                        <div class="grid gap-3 lg:grid-cols-3">
                          <section
                            class="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800"
                          >
                            <p
                              class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400"
                            >
                              Loading
                            </p>
                            <div class="mt-3">
                              <ui-button loading loadingLabel="Publishing release">
                                Publishing
                              </ui-button>
                            </div>
                          </section>
                          <section
                            class="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800"
                          >
                            <p
                              class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400"
                            >
                              Sizes
                            </p>
                            <div class="mt-3 flex flex-wrap items-center gap-2">
                              <ui-button size="sm">Toolbar</ui-button>
                              <ui-button>Default</ui-button>
                              <ui-button size="lg">Page action</ui-button>
                            </div>
                          </section>
                          <section
                            class="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800"
                          >
                            <p
                              class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400"
                            >
                              Critical
                            </p>
                            <div class="mt-3 flex flex-wrap items-center gap-2">
                              <ui-button variant="danger">Delete</ui-button>
                              <ui-button variant="ghost" disabled>Unavailable</ui-button>
                            </div>
                          </section>
                        </div>
                      </div>
                    }
                    @case ('card') {
                      <div class="grid gap-3 lg:grid-cols-2">
                        <ui-card>
                          <div uiCardHeader>
                            <div class="flex items-start justify-between gap-3">
                              <div>
                                <h4 class="font-semibold text-slate-950 dark:text-slate-50">
                                  Release readiness
                                </h4>
                                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                  Package checks for a public UI library.
                                </p>
                              </div>
                              <ui-badge variant="success" size="sm">Ready</ui-badge>
                            </div>
                          </div>
                          <div class="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
                            <div class="flex justify-between gap-4">
                              <span>Library tests</span>
                              <strong class="text-slate-950 dark:text-slate-50">69 passed</strong>
                            </div>
                            <div class="flex justify-between gap-4">
                              <span>Package size</span>
                              <strong class="text-slate-950 dark:text-slate-50">52 kB</strong>
                            </div>
                          </div>
                          <div uiCardFooter>
                            <ui-button size="sm">View report</ui-button>
                          </div>
                        </ui-card>
                        <ui-card variant="elevated">
                          <div uiCardHeader>
                            <h4 class="font-semibold text-slate-950 dark:text-slate-50">
                              Component maturity
                            </h4>
                          </div>
                          <p class="text-sm text-slate-600 dark:text-slate-300">
                            Use cards for bounded summaries, review states, and compact dashboards.
                          </p>
                        </ui-card>
                      </div>
                    }
                    @case ('input') {
                      <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
                        <section
                          class="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800"
                        >
                          <div class="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p class="text-sm font-semibold text-slate-950 dark:text-slate-50">
                                Package settings
                              </p>
                              <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Labels, support text, counters, and validation work together.
                              </p>
                            </div>
                            <ui-badge variant="success" size="sm">CVA ready</ui-badge>
                          </div>
                          <div class="mt-4 grid gap-4 md:grid-cols-2">
                            <ui-input
                              label="Email address"
                              placeholder="you@example.com"
                              helperText="Bound to a reactive FormControl."
                              type="email"
                              autocomplete="email"
                              [formControl]="email"
                            />
                            <ui-input
                              label="Package name"
                              placeholder="@ngnova/ui"
                              helperText="Clearable with a character counter."
                              clearable
                              [maxLength]="40"
                              [formControl]="packageName"
                            />
                            <ui-input
                              label="Release name"
                              appearance="filled"
                              helperText="Filled appearance for dense settings forms."
                              [formControl]="releaseName"
                            />
                            <ui-input
                              label="Organization email"
                              placeholder="team@example.com"
                              errorText="Use an organization email address."
                              required
                            />
                          </div>
                        </section>
                        <section
                          class="rounded-lg bg-white p-4 text-sm shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800"
                        >
                          <p class="font-semibold text-slate-950 dark:text-slate-50">Coverage</p>
                          <div class="mt-3 grid gap-3">
                            <div class="rounded-md bg-slate-50 p-3 dark:bg-slate-900">
                              <p class="font-medium text-slate-950 dark:text-slate-50">Forms</p>
                              <p class="mt-1 text-slate-600 dark:text-slate-300">
                                Implements ControlValueAccessor and keeps parent state in control.
                              </p>
                            </div>
                            <div class="rounded-md bg-slate-50 p-3 dark:bg-slate-900">
                              <p class="font-medium text-slate-950 dark:text-slate-50">
                                Accessibility
                              </p>
                              <p class="mt-1 text-slate-600 dark:text-slate-300">
                                Labels, helper text, errors, and counters wire into ARIA.
                              </p>
                            </div>
                          </div>
                        </section>
                      </div>
                    }
                    @case ('badge') {
                      <div class="grid gap-3 sm:grid-cols-3">
                        <section
                          class="rounded-lg border border-slate-200 p-3 dark:border-slate-800"
                        >
                          <p class="text-sm font-semibold text-slate-950 dark:text-slate-50">
                            Release
                          </p>
                          <div class="mt-3 flex flex-wrap gap-2">
                            <ui-badge variant="success" ariaRole="status">Stable</ui-badge>
                            <ui-badge variant="info">v0.1.0</ui-badge>
                          </div>
                        </section>
                        <section
                          class="rounded-lg border border-slate-200 p-3 dark:border-slate-800"
                        >
                          <p class="text-sm font-semibold text-slate-950 dark:text-slate-50">
                            Review
                          </p>
                          <div class="mt-3 flex flex-wrap gap-2">
                            <ui-badge variant="warning">Needs docs</ui-badge>
                            <ui-badge size="sm">Small</ui-badge>
                          </div>
                        </section>
                        <section
                          class="rounded-lg border border-slate-200 p-3 dark:border-slate-800"
                        >
                          <p class="text-sm font-semibold text-slate-950 dark:text-slate-50">
                            Blocking
                          </p>
                          <div class="mt-3 flex flex-wrap gap-2">
                            <ui-badge variant="danger">A11y gap</ui-badge>
                          </div>
                        </section>
                      </div>
                    }
                    @case ('tag') {
                      <div class="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                        <div class="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p class="text-sm font-semibold text-slate-950 dark:text-slate-50">
                              Filtered component search
                            </p>
                            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              Removable tags keep query state visible.
                            </p>
                          </div>
                          @if (tagRemoved()) {
                            <ui-badge variant="info">Removed event emitted</ui-badge>
                          }
                        </div>
                        <div class="mt-3 flex flex-wrap gap-2">
                          <ui-tag icon="+">Angular</ui-tag>
                          <ui-tag variant="success">Published</ui-tag>
                          <ui-tag variant="warning" removable (removed)="tagRemoved.set(true)">
                            Review needed
                          </ui-tag>
                        </div>
                      </div>
                    }
                    @case ('avatar') {
                      <div class="grid gap-3 lg:grid-cols-3">
                        <section
                          class="rounded-lg border border-slate-200 p-3 dark:border-slate-800"
                        >
                          <div class="flex items-center gap-3">
                            <ui-avatar label="Ada Lovelace" />
                            <div>
                              <p class="text-sm font-semibold text-slate-950 dark:text-slate-50">
                                Ada Lovelace
                              </p>
                              <p class="text-xs text-slate-500 dark:text-slate-400">Maintainer</p>
                            </div>
                          </div>
                        </section>
                        <section
                          class="rounded-lg border border-slate-200 p-3 dark:border-slate-800"
                        >
                          <div class="flex items-center gap-3">
                            <ui-avatar label="Grace Hopper" size="lg" />
                            <div>
                              <p class="text-sm font-semibold text-slate-950 dark:text-slate-50">
                                Grace Hopper
                              </p>
                              <p class="text-xs text-slate-500 dark:text-slate-400">Reviewer</p>
                            </div>
                          </div>
                        </section>
                        <section
                          class="rounded-lg border border-slate-200 p-3 dark:border-slate-800"
                        >
                          <div class="flex items-center gap-3">
                            <ui-avatar label="NgNova UI" shape="square" />
                            <div>
                              <p class="text-sm font-semibold text-slate-950 dark:text-slate-50">
                                NgNova UI
                              </p>
                              <p class="text-xs text-slate-500 dark:text-slate-400">Organization</p>
                            </div>
                          </div>
                        </section>
                      </div>
                    }
                    @case ('skeleton') {
                      <div class="grid gap-3 lg:grid-cols-[18rem_minmax(0,1fr)]">
                        <section
                          class="rounded-lg border border-slate-200 p-3 dark:border-slate-800"
                        >
                          <div class="flex items-center gap-3">
                            <ui-skeleton shape="circle" width="2.5rem" height="2.5rem" />
                            <div class="flex-1 space-y-2">
                              <ui-skeleton shape="text" width="70%" height="0.875rem" />
                              <ui-skeleton shape="text" width="45%" height="0.75rem" />
                            </div>
                          </div>
                          <div class="mt-4 space-y-2">
                            <ui-skeleton shape="text" width="95%" height="0.75rem" />
                            <ui-skeleton shape="text" width="80%" height="0.75rem" />
                          </div>
                        </section>
                        <section
                          class="rounded-lg border border-slate-200 p-3 dark:border-slate-800"
                        >
                          <ui-skeleton height="7rem" />
                        </section>
                      </div>
                    }
                    @case ('progress-bar') {
                      <div class="grid gap-3 lg:grid-cols-3">
                        <section
                          class="rounded-lg border border-slate-200 p-3 dark:border-slate-800"
                        >
                          <p class="mb-3 text-sm font-semibold text-slate-950 dark:text-slate-50">
                            Build progress
                          </p>
                          <ui-progress-bar [value]="65" label="Build progress" />
                        </section>
                        <section
                          class="rounded-lg border border-slate-200 p-3 dark:border-slate-800"
                        >
                          <p class="mb-3 text-sm font-semibold text-slate-950 dark:text-slate-50">
                            Test coverage
                          </p>
                          <ui-progress-bar [value]="90" variant="success" label="Test coverage" />
                        </section>
                        <section
                          class="rounded-lg border border-slate-200 p-3 dark:border-slate-800"
                        >
                          <p class="mb-3 text-sm font-semibold text-slate-950 dark:text-slate-50">
                            Publishing
                          </p>
                          <ui-progress-bar indeterminate label="Publishing package" />
                        </section>
                      </div>
                    }
                    @case ('modal') {
                      <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
                        <section
                          class="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800"
                        >
                          <div class="flex flex-wrap items-center justify-between gap-4">
                            <div>
                              <p class="text-sm font-semibold text-slate-950 dark:text-slate-50">
                                Publish confirmation
                              </p>
                              <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                Open the dialog to verify focus management, Escape close, backdrop,
                                and footer projection.
                              </p>
                            </div>
                            <ui-button (pressed)="modalOpen.set(true)">Open modal</ui-button>
                          </div>
                        </section>
                        <section
                          class="rounded-lg bg-white p-4 text-sm shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800"
                        >
                          <p class="font-semibold text-slate-950 dark:text-slate-50">
                            Interaction contract
                          </p>
                          <ul class="mt-3 grid gap-2 text-slate-600 dark:text-slate-300">
                            <li>Focus moves into the dialog.</li>
                            <li>Tab stays inside the overlay.</li>
                            <li>Focus restores after close.</li>
                          </ul>
                        </section>
                      </div>
                    }
                    @case ('table') {
                      <div class="grid gap-4">
                        <div class="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p class="text-sm font-semibold text-slate-950 dark:text-slate-50">
                              Component readiness
                            </p>
                            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              Selectable rows with sortable component column.
                            </p>
                          </div>
                          @if (selectedTableRow(); as row) {
                            <ui-badge variant="info">Selected {{ row['component'] }}</ui-badge>
                          } @else {
                            <ui-badge size="sm">Click a row</ui-badge>
                          }
                        </div>
                        <ui-table
                          [columns]="tableColumns"
                          [rows]="tableRows"
                          selectable
                          (rowSelected)="selectedTableRow.set($event)"
                        />
                      </div>
                    }
                    @case ('accordion') {
                      <div class="grid gap-3 lg:grid-cols-[16rem_minmax(0,1fr)]">
                        <section class="rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
                          <p class="text-sm font-semibold text-slate-950 dark:text-slate-50">
                            Setup checklist
                          </p>
                          <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
                            Accordion keeps dense guidance scannable while preserving native button
                            behavior.
                          </p>
                        </section>
                        <ui-accordion
                          [items]="accordionItems"
                          [active]="accordionActive()"
                          (activeChange)="accordionActive.set($event)"
                        />
                      </div>
                    }
                    @case ('toast') {
                      <div class="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                        <div class="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p class="text-sm font-semibold text-slate-950 dark:text-slate-50">
                              Save feedback
                            </p>
                            <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
                              Toast messages are pushed through UiToastService and rendered by
                              ui-toast.
                            </p>
                          </div>
                          <ui-button (pressed)="showToast()">Show toast</ui-button>
                        </div>
                        <ui-toast />
                      </div>
                    }
                    @case ('checkbox') {
                      <div class="grid gap-4">
                        <section
                          class="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800"
                        >
                          <div class="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p class="text-sm font-semibold text-slate-950 dark:text-slate-50">
                                Release checklist
                              </p>
                              <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Independent boolean choices with helper text and a mixed state.
                              </p>
                            </div>
                            <ui-badge variant="info" size="sm">CVA boolean</ui-badge>
                          </div>
                          <div class="mt-4 grid gap-3 lg:grid-cols-3">
                            <div class="rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
                              <ui-checkbox
                                label="Email subscribers"
                                helperText="Bound to a reactive FormControl."
                                [formControl]="newsletter"
                              />
                            </div>
                            <div class="rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
                              <ui-checkbox
                                label="Review all packages"
                                helperText="Mixed while child packages differ."
                                indeterminate
                              />
                            </div>
                            <div class="rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
                              <ui-checkbox
                                label="Security approval"
                                helperText="Disabled by workflow policy."
                                disabled
                              />
                            </div>
                          </div>
                        </section>
                      </div>
                    }
                    @case ('select') {
                      <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
                        <section
                          class="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800"
                        >
                          <div class="grid gap-4 md:grid-cols-2">
                            <ui-select
                              label="Plan"
                              placeholder="Choose a plan"
                              helperText="Bound to a reactive FormControl."
                              [options]="planOptions"
                              [formControl]="plan"
                            />
                            <ui-select
                              label="Release channel"
                              placeholder="Select channel"
                              errorText="Choose a stable channel before publishing."
                              [options]="channelOptions"
                              required
                            />
                          </div>
                        </section>
                        <section class="rounded-lg bg-slate-50 p-4 text-sm dark:bg-slate-900">
                          <p class="font-semibold text-slate-950 dark:text-slate-50">
                            Native behavior
                          </p>
                          <p class="mt-2 leading-6 text-slate-600 dark:text-slate-300">
                            Use Select when the browser dropdown is the right interaction and the
                            option list is already known.
                          </p>
                        </section>
                      </div>
                    }
                    @case ('radio') {
                      <div class="grid gap-4 lg:grid-cols-2">
                        <section
                          class="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800"
                        >
                          <ui-radio-group
                            label="Contact preference"
                            helperText="All choices are visible for comparison."
                            [options]="contactOptions"
                            [formControl]="contactPreference"
                          />
                        </section>
                        <section
                          class="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800"
                        >
                          <ui-radio-group
                            label="Layout density"
                            helperText="Horizontal option layout."
                            orientation="horizontal"
                            [options]="layoutOptions"
                            [formControl]="layoutDensity"
                          />
                        </section>
                      </div>
                    }
                    @case ('switch') {
                      <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
                        <section
                          class="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800"
                        >
                          <div class="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p class="text-sm font-semibold text-slate-950 dark:text-slate-50">
                                Notification settings
                              </p>
                              <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Immediate independent preferences with native checkbox behavior.
                              </p>
                            </div>
                            <ui-badge variant="success" size="sm">Instant</ui-badge>
                          </div>
                          <div class="mt-4 grid gap-3">
                            <ui-switch
                              label="Release notifications"
                              helperText="Bound to a reactive FormControl."
                              [formControl]="notifications"
                            />
                            <ui-switch label="Disabled switch" disabled />
                          </div>
                        </section>
                        <section class="rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
                          <p class="text-sm font-semibold text-slate-950 dark:text-slate-50">
                            Current value
                          </p>
                          <code
                            class="mt-3 block rounded-md bg-white px-3 py-2 font-mono text-xs text-slate-700 ring-1 ring-slate-200 dark:bg-slate-950 dark:text-slate-200 dark:ring-slate-800"
                          >
                            {{ notifications.value ? 'enabled' : 'disabled' }}
                          </code>
                        </section>
                      </div>
                    }
                    @case ('textarea') {
                      <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
                        <section
                          class="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800"
                        >
                          <ui-textarea
                            label="Release notes"
                            placeholder="Describe what changed..."
                            helperText="Bound to a reactive FormControl with a counter."
                            [maxLength]="280"
                            [rows]="5"
                            [formControl]="releaseNotes"
                          />
                        </section>
                        <section class="rounded-lg bg-slate-50 p-4 text-sm dark:bg-slate-900">
                          <p class="font-semibold text-slate-950 dark:text-slate-50">
                            Writing state
                          </p>
                          <p class="mt-2 leading-6 text-slate-600 dark:text-slate-300">
                            Long-form fields need visible labels, helpful guidance, clear error
                            copy, and predictable resize behavior.
                          </p>
                        </section>
                      </div>
                    }
                    @case ('alert') {
                      <div class="grid gap-3">
                        <ui-alert variant="info" title="Documentation ready">
                          Each component page includes preview, usage, inputs, and outputs.
                        </ui-alert>
                        <ui-alert variant="success" title="Package build passed" dismissible>
                          The npm package can be inspected with a dry-run pack command.
                        </ui-alert>
                        <ui-alert variant="warning" title="Release note needed">
                          Add a changeset for public API changes before publishing.
                        </ui-alert>
                        <ui-alert variant="danger" title="Publish blocked">
                          Never publish from the source project folder.
                        </ui-alert>
                      </div>
                    }
                    @case ('tabs') {
                      <div class="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                        <ui-tabs
                          [tabs]="componentTabs"
                          [active]="activeTab()"
                          (activeChange)="activeTab.set($event)"
                          ariaLabel="Component sections"
                        >
                          @if (activeTab() === 'overview') {
                            <div class="rounded-md bg-slate-50 p-3 dark:bg-slate-900">
                              <p class="font-semibold text-slate-950 dark:text-slate-50">
                                Overview panel
                              </p>
                              <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                Tabs use real tablist semantics and keyboard navigation.
                              </p>
                            </div>
                          } @else if (activeTab() === 'api') {
                            <div class="rounded-md bg-slate-50 p-3 dark:bg-slate-900">
                              <p class="font-semibold text-slate-950 dark:text-slate-50">
                                API panel
                              </p>
                              <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                Pair the active value with your own projected panel content.
                              </p>
                            </div>
                          } @else {
                            <div class="rounded-md bg-slate-50 p-3 dark:bg-slate-900">
                              <p class="text-sm text-slate-600 dark:text-slate-300">
                                Disabled tabs stay visible but cannot be selected.
                              </p>
                            </div>
                          }
                        </ui-tabs>
                      </div>
                    }
                    @case ('spinner') {
                      <div class="grid gap-3 sm:grid-cols-3">
                        <section
                          class="rounded-lg border border-slate-200 p-3 text-center dark:border-slate-800"
                        >
                          <ui-spinner size="sm" label="Loading small preview" />
                          <p class="mt-3 text-xs text-slate-500 dark:text-slate-400">Inline</p>
                        </section>
                        <section
                          class="rounded-lg border border-slate-200 p-3 text-center dark:border-slate-800"
                        >
                          <ui-spinner label="Loading default preview" />
                          <p class="mt-3 text-xs text-slate-500 dark:text-slate-400">Section</p>
                        </section>
                        <section
                          class="rounded-lg border border-slate-200 p-3 text-center dark:border-slate-800"
                        >
                          <ui-button loading>Saving</ui-button>
                          <p class="mt-3 text-xs text-slate-500 dark:text-slate-400">
                            Button feedback
                          </p>
                        </section>
                      </div>
                    }
                  }
                </app-docs-preview-canvas>

                <section id="usage" class="mt-5">
                  <app-docs-code-block
                    [code]="componentDoc.usage"
                    [filename]="componentDoc.slug + '.example.html'"
                    language="Angular template"
                  />
                </section>
              </app-docs-section>

              @if (componentDoc.slug === 'button') {
                <app-docs-section
                  sectionId="variants"
                  title="Variants"
                  description="Use variants to communicate action hierarchy and intent."
                >
                  <div
                    class="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-2"
                  >
                    <div class="rounded-lg bg-white p-4 dark:bg-slate-950">
                      <p class="text-sm font-semibold text-slate-950 dark:text-slate-50">
                        Release actions
                      </p>
                      <div class="mt-3 flex flex-wrap items-center gap-2">
                        <ui-button>Publish</ui-button>
                        <ui-button variant="secondary">Save draft</ui-button>
                        <ui-button variant="outline">Preview</ui-button>
                      </div>
                    </div>
                    <div class="rounded-lg bg-white p-4 dark:bg-slate-950">
                      <p class="text-sm font-semibold text-slate-950 dark:text-slate-50">
                        Secondary paths
                      </p>
                      <div class="mt-3 flex flex-wrap items-center gap-2">
                        <ui-button variant="ghost">More options</ui-button>
                        <ui-button variant="danger">Delete</ui-button>
                      </div>
                    </div>
                  </div>
                  <app-docs-code-block
                    class="mt-5 block"
                    [code]="buttonVariantsExample"
                    filename="button-variants.example.html"
                    language="Angular template"
                  />
                </app-docs-section>

                <app-docs-section
                  sectionId="sizes"
                  title="Sizes"
                  description="Small, medium, and large buttons support dense toolbars and prominent actions."
                >
                  <div
                    class="flex flex-wrap items-end justify-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <ui-button size="sm">Toolbar action</ui-button>
                    <ui-button>Default action</ui-button>
                    <ui-button size="lg">Primary page action</ui-button>
                  </div>
                  <app-docs-code-block
                    class="mt-5 block"
                    [code]="buttonSizesExample"
                    filename="button-sizes.example.html"
                    language="Angular template"
                  />
                </app-docs-section>

                <app-docs-section
                  sectionId="loading"
                  title="Loading"
                  description="Loading buttons keep users informed while an async action is in progress."
                >
                  <div
                    class="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-3"
                  >
                    <div class="rounded-lg bg-white p-4 dark:bg-slate-950">
                      <p class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                        Saving
                      </p>
                      <div class="mt-3">
                        <ui-button loading>Saving</ui-button>
                      </div>
                    </div>
                    <div class="rounded-lg bg-white p-4 dark:bg-slate-950">
                      <p class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                        Publishing
                      </p>
                      <div class="mt-3">
                        <ui-button loading loadingLabel="Publishing changes">Publish</ui-button>
                      </div>
                    </div>
                    <div class="rounded-lg bg-white p-4 dark:bg-slate-950">
                      <p class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                        Unavailable
                      </p>
                      <div class="mt-3">
                        <ui-button disabled>Disabled</ui-button>
                      </div>
                    </div>
                  </div>
                  <app-docs-code-block
                    class="mt-5 block"
                    [code]="buttonLoadingExample"
                    filename="button-loading.example.html"
                    language="Angular template"
                  />
                </app-docs-section>
              }

              @if (componentDoc.slug === 'input') {
                <app-docs-section
                  sectionId="field-states"
                  title="Field States"
                  description="Show filled, clearable, counter, helper, and error states in the same product context."
                >
                  <div
                    class="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-2"
                  >
                    <ui-input
                      label="Package name"
                      helperText="Use your npm scope."
                      clearable
                      [maxLength]="40"
                      [formControl]="packageName"
                    />
                    <ui-input
                      label="Release name"
                      appearance="filled"
                      helperText="Filled appearance works well in dense forms."
                      [formControl]="releaseName"
                    />
                    <ui-input
                      label="Work email"
                      type="email"
                      autocomplete="email"
                      errorText="Use an organization email address."
                      required
                    />
                    <ui-input label="Disabled field" placeholder="Unavailable" disabled />
                  </div>
                  <app-docs-code-block
                    class="mt-5 block"
                    [code]="inputStatesExample"
                    filename="input-states.example.html"
                    language="Angular template"
                  />
                </app-docs-section>

                <app-docs-section
                  sectionId="forms-cva"
                  title="Forms And CVA"
                  description="Input implements ControlValueAccessor, so reactive forms own value, touched, and disabled state."
                >
                  <div
                    class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div class="grid gap-4 md:grid-cols-[minmax(0,1fr)_16rem]">
                      <ui-input
                        label="Email"
                        type="email"
                        autocomplete="email"
                        helperText="Bound to an Angular FormControl."
                        [formControl]="email"
                      />
                      <div class="rounded-lg bg-white p-4 text-sm dark:bg-slate-950">
                        <p class="font-semibold text-slate-950 dark:text-slate-50">Current value</p>
                        <code
                          class="mt-2 block rounded bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                          {{ email.value }}
                        </code>
                      </div>
                    </div>
                  </div>
                  <app-docs-code-block
                    class="mt-5 block"
                    [code]="inputValidationExample"
                    filename="input-validation.example.html"
                    language="Angular template"
                  />
                </app-docs-section>
              }

              @if (componentDoc.slug === 'textarea') {
                <app-docs-section
                  sectionId="writing-states"
                  title="Writing States"
                  description="Use Textarea for long-form content that needs guidance, counters, validation, and predictable resize behavior."
                >
                  <div
                    class="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[minmax(0,1fr)_18rem]"
                  >
                    <ui-textarea
                      label="Release notes"
                      placeholder="Describe what changed..."
                      helperText="Keep release notes concise and user-facing."
                      [maxLength]="280"
                      [rows]="5"
                      [formControl]="releaseNotes"
                    />
                    <div class="rounded-lg bg-white p-4 text-sm dark:bg-slate-950">
                      <p class="font-semibold text-slate-950 dark:text-slate-50">Best fit</p>
                      <p class="mt-2 leading-6 text-slate-600 dark:text-slate-300">
                        Multiline comments, summaries, descriptions, moderation notes, and release
                        copy where users may pause, revise, and review text.
                      </p>
                    </div>
                  </div>
                  <app-docs-code-block
                    class="mt-5 block"
                    [code]="textareaStatesExample"
                    filename="textarea-states.example.html"
                    language="Angular template"
                  />
                </app-docs-section>

                <app-docs-section
                  sectionId="textarea-validation"
                  title="Validation And Resize"
                  description="Textarea supports error text, required state, row count, resize policy, and Angular forms state."
                >
                  <div
                    class="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-2"
                  >
                    <ui-textarea
                      label="Review notes"
                      errorText="Notes are required before publishing."
                      resize="none"
                      required
                      [rows]="4"
                    />
                    <ui-textarea
                      label="Internal summary"
                      appearance="filled"
                      helperText="Filled style is useful in dense editorial tools."
                      [rows]="4"
                      readonly
                    />
                  </div>
                  <app-docs-code-block
                    class="mt-5 block"
                    [code]="textareaValidationExample"
                    filename="textarea-validation.example.html"
                    language="Angular template"
                  />
                </app-docs-section>
              }

              @if (componentDoc.slug === 'checkbox') {
                <app-docs-section
                  sectionId="checkbox-states"
                  title="Boolean States"
                  description="Checkbox covers independent true/false choices, disabled choices, and mixed parent selection."
                >
                  <div
                    class="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-3"
                  >
                    <div class="rounded-lg bg-white p-4 dark:bg-slate-950">
                      <ui-checkbox
                        label="Email subscribers"
                        helperText="Reactive form boolean value."
                        [formControl]="newsletter"
                      />
                    </div>
                    <div class="rounded-lg bg-white p-4 dark:bg-slate-950">
                      <ui-checkbox
                        label="Select all packages"
                        helperText="Mixed while only some packages are selected."
                        indeterminate
                      />
                    </div>
                    <div class="rounded-lg bg-white p-4 dark:bg-slate-950">
                      <ui-checkbox
                        label="Security approval"
                        helperText="Unavailable until audit finishes."
                        disabled
                      />
                    </div>
                  </div>
                  <app-docs-code-block
                    class="mt-5 block"
                    [code]="checkboxStatesExample"
                    filename="checkbox-states.example.html"
                    language="Angular template"
                  />
                </app-docs-section>
              }

              @if (componentDoc.slug === 'select') {
                <app-docs-section
                  sectionId="select-options"
                  title="Options"
                  description="Select renders known options through native option elements, including placeholder and disabled values."
                >
                  <div
                    class="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-2"
                  >
                    <ui-select
                      label="Plan"
                      placeholder="Choose a plan"
                      helperText="Selection is owned by the reactive form."
                      [options]="planOptions"
                      [formControl]="plan"
                    />
                    <ui-select
                      label="Release channel"
                      placeholder="Select channel"
                      helperText="Deprecated is visible but unavailable."
                      [options]="channelOptions"
                    />
                  </div>
                  <app-docs-code-block
                    class="mt-5 block"
                    [code]="selectOptionsExample"
                    filename="select-options.example.html"
                    language="Angular template"
                  />
                </app-docs-section>

                <app-docs-section
                  sectionId="select-validation"
                  title="Validation"
                  description="Use required plus a placeholder when users must make an explicit selection."
                >
                  <div
                    class="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[minmax(0,1fr)_16rem]"
                  >
                    <ui-select
                      label="Release channel"
                      placeholder="Select channel"
                      errorText="Choose a stable channel before publishing."
                      [options]="channelOptions"
                      required
                    />
                    <div class="rounded-lg bg-white p-4 text-sm dark:bg-slate-950">
                      <p class="font-semibold text-slate-950 dark:text-slate-50">Rule of thumb</p>
                      <p class="mt-2 leading-6 text-slate-600 dark:text-slate-300">
                        Use Select for short, known lists. Move to autocomplete or combobox when
                        users need search, async loading, or custom option content.
                      </p>
                    </div>
                  </div>
                  <app-docs-code-block
                    class="mt-5 block"
                    [code]="selectValidationExample"
                    filename="select-validation.example.html"
                    language="Angular template"
                  />
                </app-docs-section>
              }

              @if (componentDoc.slug === 'radio') {
                <app-docs-section
                  sectionId="radio-options"
                  title="Option Groups"
                  description="Radio Group is best when every option should remain visible and users need to compare choices."
                >
                  <div
                    class="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-2"
                  >
                    <ui-radio-group
                      label="Contact preference"
                      helperText="Use helper text to clarify tradeoffs."
                      [options]="contactOptions"
                      [formControl]="contactPreference"
                    />
                    <ui-radio-group
                      label="Layout density"
                      helperText="Horizontal is useful for short peer choices."
                      orientation="horizontal"
                      [options]="layoutOptions"
                      [formControl]="layoutDensity"
                    />
                  </div>
                  <app-docs-code-block
                    class="mt-5 block"
                    [code]="radioOptionsExample"
                    filename="radio-options.example.html"
                    language="Angular template"
                  />
                </app-docs-section>
              }

              @if (componentDoc.slug === 'switch') {
                <app-docs-section
                  sectionId="switch-settings"
                  title="Settings"
                  description="Switches work best for independent preferences that apply immediately and do not require confirmation."
                >
                  <div
                    class="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[minmax(0,1fr)_16rem]"
                  >
                    <div class="rounded-lg bg-white p-4 dark:bg-slate-950">
                      <ui-switch
                        label="Release notifications"
                        helperText="Boolean state stays in the parent form control."
                        [formControl]="notifications"
                      />
                    </div>
                    <div class="rounded-lg bg-white p-4 text-sm dark:bg-slate-950">
                      <p class="font-semibold text-slate-950 dark:text-slate-50">Current state</p>
                      <code
                        class="mt-3 block rounded-md bg-slate-100 px-3 py-2 font-mono text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      >
                        {{ notifications.value ? 'enabled' : 'disabled' }}
                      </code>
                    </div>
                  </div>
                  <app-docs-code-block
                    class="mt-5 block"
                    [code]="switchSettingsExample"
                    filename="switch-settings.example.html"
                    language="Angular template"
                  />
                </app-docs-section>
              }

              @if (componentDoc.slug === 'modal') {
                <app-docs-section
                  sectionId="confirmation"
                  title="Confirmation Workflow"
                  description="Use Modal for focused decisions that need a clear title, description, and footer action set."
                >
                  <div
                    class="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[minmax(0,1fr)_18rem]"
                  >
                    <div class="rounded-lg bg-white p-4 dark:bg-slate-950">
                      <p class="font-semibold text-slate-950 dark:text-slate-50">Publish package</p>
                      <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        Disable backdrop close when the decision is destructive or irreversible.
                        Keep the primary action explicit and preserve focus restore on close.
                      </p>
                      <div class="mt-4 flex flex-wrap gap-2">
                        <ui-button (pressed)="modalOpen.set(true)">Open confirmation</ui-button>
                        <ui-button variant="outline">Preview release</ui-button>
                      </div>
                    </div>
                    <div class="rounded-lg bg-white p-4 text-sm dark:bg-slate-950">
                      <p class="font-semibold text-slate-950 dark:text-slate-50">
                        Quality checklist
                      </p>
                      <ul class="mt-3 grid gap-2 text-slate-600 dark:text-slate-300">
                        <li>Has title and description IDs.</li>
                        <li>Escape/backdrop behavior is intentional.</li>
                        <li>Footer actions follow safe-to-danger order.</li>
                      </ul>
                    </div>
                  </div>
                  <app-docs-code-block
                    class="mt-5 block"
                    [code]="modalConfirmationExample"
                    filename="modal-confirmation.example.html"
                    language="Angular template"
                  />
                </app-docs-section>

                <app-docs-section
                  sectionId="modal-a11y"
                  title="Accessibility Setup"
                  description="Headerless or destructive dialogs need explicit labels and close behavior that matches the risk."
                >
                  <div
                    class="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-3"
                  >
                    <div class="rounded-lg bg-white p-4 dark:bg-slate-950">
                      <p class="text-sm font-semibold text-slate-950 dark:text-slate-50">
                        Labeling
                      </p>
                      <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        Use projected header text or ariaLabel for assistive technology.
                      </p>
                    </div>
                    <div class="rounded-lg bg-white p-4 dark:bg-slate-950">
                      <p class="text-sm font-semibold text-slate-950 dark:text-slate-50">Focus</p>
                      <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        Initial focus enters the dialog and returns to the trigger on close.
                      </p>
                    </div>
                    <div class="rounded-lg bg-white p-4 dark:bg-slate-950">
                      <p class="text-sm font-semibold text-slate-950 dark:text-slate-50">Escape</p>
                      <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        Disable Escape close only when accidental dismissal is dangerous.
                      </p>
                    </div>
                  </div>
                  <app-docs-code-block
                    class="mt-5 block"
                    [code]="modalA11yExample"
                    filename="modal-a11y.example.html"
                    language="Angular template"
                  />
                </app-docs-section>
              }

              @if (componentDoc.slug === 'table') {
                <app-docs-section
                  sectionId="data-states"
                  title="Data States"
                  description="Table should make populated, loading, empty, selectable, and sortable states obvious."
                >
                  <div class="grid gap-4">
                    <ui-table
                      [columns]="tableColumns"
                      [rows]="tableRows"
                      selectable
                      (rowSelected)="selectedTableRow.set($event)"
                    />
                    <div class="grid gap-4 lg:grid-cols-2">
                      <ui-table
                        [columns]="tableColumns"
                        [rows]="[]"
                        emptyText="No components match your filters."
                      />
                      <ui-table
                        [columns]="tableColumns"
                        [rows]="[]"
                        loading
                        loadingText="Loading components..."
                      />
                    </div>
                  </div>
                  <app-docs-code-block
                    class="mt-5 block"
                    [code]="tableStatesExample"
                    filename="table-states.example.html"
                    language="Angular template"
                  />
                </app-docs-section>

                <app-docs-section
                  sectionId="sorting-selection"
                  title="Sorting And Selection"
                  description="Sortable headers emit intent and selectable rows emit the clicked record; parent code owns data changes."
                >
                  <div
                    class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p class="text-sm font-semibold text-slate-950 dark:text-slate-50">
                          Component catalog
                        </p>
                        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Click rows and sortable headers to verify emitted state.
                        </p>
                      </div>
                      @if (selectedTableRow(); as row) {
                        <ui-badge variant="info">Selected {{ row['component'] }}</ui-badge>
                      }
                    </div>
                    <ui-table
                      [columns]="tableColumns"
                      [rows]="tableRows"
                      selectable
                      (rowSelected)="selectedTableRow.set($event)"
                    />
                  </div>
                  <app-docs-code-block
                    class="mt-5 block"
                    [code]="tableSelectableExample"
                    filename="table-selectable.example.html"
                    language="Angular template"
                  />
                </app-docs-section>
              }

              @if (details(); as componentDetails) {
                <div id="guide" class="grid gap-5 lg:grid-cols-2">
                  <section
                    class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div>
                      <p class="text-xs font-semibold uppercase text-blue-700 dark:text-blue-300">
                        Design Guidance
                      </p>
                      <h3 class="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-50">
                        Overview
                      </h3>
                      <p class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                        Purpose, use cases, and component boundaries.
                      </p>
                    </div>
                    <div class="mt-4 grid gap-4">
                      <div class="space-y-2">
                        @for (item of componentDetails.overview; track item) {
                          <p class="text-sm leading-6 text-slate-600 dark:text-slate-300">
                            {{ item }}
                          </p>
                        }
                      </div>
                      <div>
                        <h4 class="text-sm font-semibold text-slate-950 dark:text-slate-50">
                          When To Use
                        </h4>
                        <ul
                          class="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300"
                        >
                          @for (item of componentDetails.whenToUse; track item) {
                            <li>{{ item }}</li>
                          }
                        </ul>
                      </div>
                      <div>
                        <h4 class="text-sm font-semibold text-slate-950 dark:text-slate-50">
                          When Not To Use
                        </h4>
                        <ul
                          class="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300"
                        >
                          @for (item of whenNotToUse(); track item) {
                            <li>{{ item }}</li>
                          }
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section
                    id="accessibility"
                    class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div>
                      <p class="text-xs font-semibold uppercase text-blue-700 dark:text-blue-300">
                        Inclusive UX
                      </p>
                      <h3 class="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-50">
                        Accessibility
                      </h3>
                      <p class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                        Screen reader, keyboard, and semantic behavior.
                      </p>
                    </div>
                    <div class="mt-4 grid gap-4">
                      <div>
                        <h4 class="text-sm font-semibold text-slate-950 dark:text-slate-50">
                          Screen Reader
                        </h4>
                        <ul
                          class="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300"
                        >
                          @for (item of componentDetails.accessibility; track item) {
                            <li>{{ item }}</li>
                          }
                        </ul>
                      </div>
                      <div>
                        <h4 class="text-sm font-semibold text-slate-950 dark:text-slate-50">
                          Keyboard
                        </h4>
                        <ul
                          class="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300"
                        >
                          @for (item of componentDetails.keyboard; track item) {
                            <li>{{ item }}</li>
                          }
                        </ul>
                      </div>
                    </div>
                  </section>
                </div>

                <section
                  id="examples"
                  class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                >
                  <div>
                    <p class="text-xs font-semibold uppercase text-blue-700 dark:text-blue-300">
                      Examples
                    </p>
                    <h3 class="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-50">
                      Production Examples
                    </h3>
                    <p class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                      Realistic snippets that match the public API.
                    </p>
                  </div>
                  <div class="mt-4 grid gap-4">
                    @for (example of componentDetails.examples; track example.title) {
                      <section
                        class="grid gap-4 rounded-lg border border-slate-200 p-3 dark:border-slate-800 lg:grid-cols-[16rem_minmax(0,1fr)]"
                      >
                        <div class="min-w-0">
                          <h4 class="font-semibold text-slate-950 dark:text-slate-50">
                            {{ example.title }}
                          </h4>
                          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {{ example.description }}
                          </p>
                        </div>
                        <app-docs-code-block
                          class="min-w-0"
                          [code]="example.code"
                          [filename]="componentDoc.slug + '.example.ts'"
                          language="Angular"
                        />
                      </section>
                    }
                  </div>
                </section>

                <div class="grid gap-5 lg:grid-cols-3">
                  <section
                    class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div>
                      <h3 class="text-base font-semibold text-slate-950 dark:text-slate-50">
                        Forms And State
                      </h3>
                    </div>
                    <ul
                      class="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300"
                    >
                      @for (item of componentDetails.forms; track item) {
                        <li>{{ item }}</li>
                      }
                    </ul>
                  </section>

                  <section
                    class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div>
                      <h3 class="text-base font-semibold text-slate-950 dark:text-slate-50">
                        Edge Cases
                      </h3>
                    </div>
                    <ul
                      class="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300"
                    >
                      @for (item of componentDetails.edgeCases; track item) {
                        <li>{{ item }}</li>
                      }
                    </ul>
                  </section>

                  <section
                    id="testing"
                    class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div>
                      <h3 class="text-base font-semibold text-slate-950 dark:text-slate-50">
                        Testing Notes
                      </h3>
                    </div>
                    <ul
                      class="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300"
                    >
                      @for (item of componentDetails.testing; track item) {
                        <li>{{ item }}</li>
                      }
                    </ul>
                  </section>
                </div>
              }

              <app-docs-section
                sectionId="api"
                kicker="Reference"
                title="API"
                [description]="'Inputs and outputs exposed by ' + componentDoc.importName + '.'"
              >
                <app-docs-api-table
                  [apiInputs]="componentDoc.inputs"
                  [apiOutputs]="componentDoc.outputs"
                />
              </app-docs-section>
            </section>
          </div>

          <aside class="hidden xl:block">
            <div class="sticky top-6 grid gap-5">
              <nav
                class="border-l border-slate-200 pl-4 dark:border-slate-800"
                aria-label="Page sections"
              >
                <p class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                  On this page
                </p>
                <div class="mt-3 grid gap-1">
                  @for (item of sectionNav(); track item.href) {
                    <a
                      [href]="item.href"
                      [class]="sectionLinkClasses(item.href, false)"
                      (click)="activeSection.set(item.href)"
                    >
                      {{ item.label }}
                    </a>
                  }
                </div>
              </nav>
              <div class="border-l border-slate-200 pl-4 dark:border-slate-800">
                <p class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                  Component
                </p>
                <dl class="mt-3 grid gap-2 text-sm">
                  @for (item of summaryItems(); track item.label) {
                    <div class="flex items-start justify-between gap-3">
                      <dt class="text-slate-500 dark:text-slate-400">{{ item.label }}</dt>
                      <dd
                        class="max-w-32 text-right font-semibold text-slate-900 dark:text-slate-100"
                      >
                        {{ item.value }}
                      </dd>
                    </div>
                  }
                </dl>
              </div>
              <nav class="grid gap-2 border-l border-slate-200 pl-4 dark:border-slate-800">
                @if (previousDoc(); as previous) {
                  <a
                    [routerLink]="['/components', previous.slug]"
                    class="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm transition hover:border-blue-200 hover:bg-blue-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-900 dark:hover:bg-blue-950/40"
                  >
                    <span class="block text-xs text-slate-500 dark:text-slate-400">Previous</span>
                    <span class="font-semibold text-slate-950 dark:text-slate-50">
                      {{ previous.name }}
                    </span>
                  </a>
                }
                @if (nextDoc(); as next) {
                  <a
                    [routerLink]="['/components', next.slug]"
                    class="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm transition hover:border-blue-200 hover:bg-blue-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-900 dark:hover:bg-blue-950/40"
                  >
                    <span class="block text-xs text-slate-500 dark:text-slate-400">Next</span>
                    <span class="font-semibold text-slate-950 dark:text-slate-50">
                      {{ next.name }}
                    </span>
                  </a>
                }
              </nav>
            </div>
          </aside>
        </div>
      </article>
    } @else {
      <div
        class="mx-auto max-w-3xl rounded-lg border border-dashed border-slate-300 bg-white p-8 dark:border-slate-700 dark:bg-slate-950"
      >
        <ui-badge variant="warning" size="sm">404</ui-badge>
        <h1 class="mt-4 text-3xl font-semibold text-slate-950 dark:text-slate-50">
          Component not found
        </h1>
        <p class="mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          This route does not match a documented NgNova UI component. Use the catalog or search the
          component navigation to continue.
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <a
            routerLink="/components"
            class="inline-flex h-10 items-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700"
            >Open component catalog</a
          >
          <a
            routerLink="/components/button"
            class="inline-flex h-10 items-center rounded-md border border-slate-300 px-4 text-sm font-medium text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-900"
            >Go to Button docs</a
          >
        </div>
      </div>
    }

    <ui-modal
      [open]="modalOpen()"
      (openChange)="modalOpen.set($event)"
      size="lg"
      descriptionId="publish-checklist-description"
      [closeOnBackdrop]="false"
    >
      <span uiModalHeader>Publish package</span>
      <div class="space-y-3">
        <p id="publish-checklist-description">
          Build the library, inspect the package, then publish from <code>dist/ui</code>.
        </p>
        <ul class="list-disc space-y-1 pl-5">
          <li><code>npm run build:lib</code></li>
          <li><code>npm run pack:lib</code></li>
          <li><code>cd dist/ui</code> then <code>npm publish --access public</code></li>
        </ul>
      </div>
      <div uiModalFooter class="flex gap-3">
        <ui-button variant="outline" (pressed)="modalOpen.set(false)">Cancel</ui-button>
        <ui-button (pressed)="modalOpen.set(false)">Publish</ui-button>
      </div>
    </ui-modal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentDocPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(UiToastService);
  protected readonly email = new FormControl('developer@example.com');
  protected readonly packageName = new FormControl('@ngnova/ui');
  protected readonly releaseName = new FormControl('Aurora components');
  protected readonly newsletter = new FormControl(true);
  protected readonly plan = new FormControl('pro');
  protected readonly contactPreference = new FormControl('email');
  protected readonly layoutDensity = new FormControl('comfortable');
  protected readonly notifications = new FormControl(false);
  protected readonly releaseNotes = new FormControl('Added form components.');
  protected readonly modalOpen = signal(false);
  protected readonly activeSection = signal('#preview');
  protected readonly activeTab = signal('overview');
  protected readonly tagRemoved = signal(false);
  protected readonly accordionActive = signal<readonly string[]>(['overview']);
  protected readonly selectedTableRow = signal<UiTableRow | null>(null);
  protected readonly buttonVariantsExample = `<div class="flex flex-wrap items-center gap-2">
  <ui-button>Publish</ui-button>
  <ui-button variant="secondary">Save draft</ui-button>
  <ui-button variant="outline">Preview</ui-button>
  <ui-button variant="ghost">More options</ui-button>
  <ui-button variant="danger">Delete</ui-button>
</div>`;
  protected readonly buttonSizesExample = `<div class="flex flex-wrap items-center gap-2">
  <ui-button size="sm">Toolbar action</ui-button>
  <ui-button>Default action</ui-button>
  <ui-button size="lg">Primary page action</ui-button>
</div>`;
  protected readonly buttonLoadingExample = `<ui-button
  [loading]="publishing"
  loadingLabel="Publishing package"
  (pressed)="publish()"
>
  Publish
</ui-button>`;
  protected readonly inputStatesExample = `<ui-input
  label="Package name"
  helperText="Use your npm scope."
  clearable
  [maxLength]="40"
  [formControl]="packageName"
/>`;
  protected readonly inputValidationExample = `<ui-input
  label="Work email"
  type="email"
  autocomplete="email"
  errorText="Use an organization email address."
  required
/>`;
  protected readonly textareaStatesExample = `<ui-textarea
  label="Release notes"
  placeholder="Describe what changed..."
  helperText="Keep release notes concise and user-facing."
  [maxLength]="280"
  [rows]="5"
  [formControl]="releaseNotes"
/>`;
  protected readonly textareaValidationExample = `<ui-textarea
  label="Review notes"
  errorText="Notes are required before publishing."
  resize="none"
  required
  [rows]="4"
/>

<ui-textarea
  label="Internal summary"
  appearance="filled"
  helperText="Filled style is useful in dense editorial tools."
  [rows]="4"
  readonly
/>`;
  protected readonly checkboxStatesExample = `<ui-checkbox
  label="Email subscribers"
  helperText="Reactive form boolean value."
  [formControl]="newsletter"
/>

<ui-checkbox
  label="Select all packages"
  helperText="Mixed while only some packages are selected."
  indeterminate
/>

<ui-checkbox
  label="Security approval"
  helperText="Unavailable until audit finishes."
  disabled
/>`;
  protected readonly selectOptionsExample = `<ui-select
  label="Plan"
  placeholder="Choose a plan"
  helperText="Selection is owned by the reactive form."
  [options]="planOptions"
  [formControl]="plan"
/>`;
  protected readonly selectValidationExample = `<ui-select
  label="Release channel"
  placeholder="Select channel"
  errorText="Choose a stable channel before publishing."
  [options]="channelOptions"
  required
/>`;
  protected readonly radioOptionsExample = `<ui-radio-group
  label="Contact preference"
  helperText="Use helper text to clarify tradeoffs."
  [options]="contactOptions"
  [formControl]="contactPreference"
/>

<ui-radio-group
  label="Layout density"
  helperText="Horizontal is useful for short peer choices."
  orientation="horizontal"
  [options]="layoutOptions"
  [formControl]="layoutDensity"
/>`;
  protected readonly switchSettingsExample = `<ui-switch
  label="Release notifications"
  helperText="Boolean state stays in the parent form control."
  [formControl]="notifications"
/>`;
  protected readonly modalConfirmationExample = `<ui-modal
  [(open)]="publishOpen"
  size="lg"
  descriptionId="publish-description"
  [closeOnBackdrop]="false"
>
  <span uiModalHeader>Publish package</span>
  <p id="publish-description">This publishes @ngnova/ui to npm.</p>
  <div uiModalFooter>
    <ui-button variant="outline" (pressed)="publishOpen = false">Cancel</ui-button>
    <ui-button (pressed)="publish()">Publish</ui-button>
  </div>
</ui-modal>`;
  protected readonly modalA11yExample = `<ui-modal
  [(open)]="removeOpen"
  ariaLabel="Delete package confirmation"
  size="sm"
  [closeOnEscape]="false"
>
  <p>This action cannot be undone.</p>
  <div uiModalFooter>
    <ui-button variant="outline" (pressed)="removeOpen = false">Keep package</ui-button>
    <ui-button variant="danger" (pressed)="deletePackage()">Delete</ui-button>
  </div>
</ui-modal>`;
  protected readonly tableSelectableExample = `<ui-table
  [columns]="columns"
  [rows]="components"
  selectable
  (rowSelected)="openComponent($event)"
  (sortChange)="sortComponents($event)"
/>`;
  protected readonly tableStatesExample = `<ui-table
  [columns]="columns"
  [rows]="[]"
  emptyText="No components match your filters."
/>

<ui-table
  [columns]="columns"
  [rows]="[]"
  loading
  loadingText="Loading components..."
/>`;
  protected readonly planOptions: readonly UiSelectOption[] = [
    { label: 'Starter', value: 'starter' },
    { label: 'Pro', value: 'pro' },
    { label: 'Enterprise', value: 'enterprise' },
  ];
  protected readonly channelOptions: readonly UiSelectOption[] = [
    { label: 'Stable', value: 'stable' },
    { label: 'Next', value: 'next' },
    { label: 'Deprecated', value: 'deprecated', disabled: true },
  ];
  protected readonly contactOptions: readonly UiRadioOption[] = [
    { label: 'Email', value: 'email', helperText: 'Best for async updates.' },
    { label: 'SMS', value: 'sms' },
    { label: 'Phone', value: 'phone', disabled: true },
  ];
  protected readonly layoutOptions: readonly UiRadioOption[] = [
    { label: 'Compact', value: 'compact' },
    { label: 'Comfortable', value: 'comfortable' },
  ];
  protected readonly componentTabs: readonly UiTabItem[] = [
    { label: 'Overview', value: 'overview' },
    { label: 'API', value: 'api' },
    { label: 'Disabled', value: 'disabled', disabled: true },
  ];
  protected readonly accordionItems: readonly UiAccordionItem[] = [
    {
      value: 'overview',
      title: 'Overview',
      content: 'Use accordions for dense, related sections where users need one answer at a time.',
    },
    {
      value: 'accessibility',
      title: 'Accessibility',
      content:
        'Each trigger exposes aria-expanded and aria-controls, and each panel is labelled by its trigger.',
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
    { component: 'Table', category: 'Data', status: 'New', owner: 'Data UX' },
  ];
  protected readonly sectionNav = computed<readonly SectionNavItem[]>(() => {
    const baseNav: SectionNavItem[] = [
      { label: 'Preview', href: '#preview' },
      { label: 'Usage', href: '#usage' },
    ];

    if (this.slug() === 'button') {
      baseNav.push(
        { label: 'Variants', href: '#variants' },
        { label: 'Sizes', href: '#sizes' },
        { label: 'Loading', href: '#loading' },
      );
    }

    if (this.slug() === 'input') {
      baseNav.push(
        { label: 'Field States', href: '#field-states' },
        { label: 'Forms CVA', href: '#forms-cva' },
      );
    }

    if (this.slug() === 'textarea') {
      baseNav.push(
        { label: 'Writing States', href: '#writing-states' },
        { label: 'Validation', href: '#textarea-validation' },
      );
    }

    if (this.slug() === 'checkbox') {
      baseNav.push({ label: 'Boolean States', href: '#checkbox-states' });
    }

    if (this.slug() === 'select') {
      baseNav.push(
        { label: 'Options', href: '#select-options' },
        { label: 'Validation', href: '#select-validation' },
      );
    }

    if (this.slug() === 'radio') {
      baseNav.push({ label: 'Option Groups', href: '#radio-options' });
    }

    if (this.slug() === 'switch') {
      baseNav.push({ label: 'Settings', href: '#switch-settings' });
    }

    if (this.slug() === 'modal') {
      baseNav.push(
        { label: 'Confirmation', href: '#confirmation' },
        { label: 'A11y Setup', href: '#modal-a11y' },
      );
    }

    if (this.slug() === 'table') {
      baseNav.push(
        { label: 'Data States', href: '#data-states' },
        { label: 'Sort & Select', href: '#sorting-selection' },
      );
    }

    return [
      ...baseNav,
      { label: 'Guidance', href: '#guide' },
      { label: 'Examples', href: '#examples' },
      { label: 'Accessibility', href: '#accessibility' },
      { label: 'API', href: '#api' },
      { label: 'Testing', href: '#testing' },
    ];
  });
  protected readonly qualityItems: readonly QualityItem[] = [
    { label: 'Standalone', value: 'Yes' },
    { label: 'OnPush', value: 'Yes' },
    { label: 'Dark mode', value: 'Yes' },
    { label: 'A11y notes', value: 'Yes' },
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
  protected readonly componentMaturity = computed(() => {
    const currentDoc = this.doc();
    const currentDetails = this.details();

    if (!currentDoc || !currentDetails) {
      return 'Draft';
    }

    return 'Documented';
  });
  protected readonly summaryItems = computed<readonly ComponentSummaryItem[]>(() => {
    const currentDoc = this.doc();

    if (!currentDoc) {
      return [];
    }

    return [
      { label: 'Selector', value: currentDoc.selector },
      { label: 'Import', value: currentDoc.importName },
      { label: 'Category', value: this.componentCategory() },
      { label: 'Inputs', value: String(currentDoc.inputs.length) },
      { label: 'Outputs', value: String(currentDoc.outputs.length) },
    ];
  });
  protected readonly whenNotToUse = computed<readonly string[]>(() => {
    const category = this.componentCategory();

    if (category === 'Forms') {
      return [
        'Do not replace native form controls when the browser default fully satisfies the workflow.',
        'Avoid using the component without a visible label, helper text, or validation strategy in complex forms.',
      ];
    }

    if (category === 'Overlays') {
      return [
        'Do not use overlays for information that must remain visible while users complete a task.',
        'Avoid stacking multiple modal or toast interactions without a clear priority model.',
      ];
    }

    if (category === 'Navigation/Data') {
      return [
        'Do not use the pattern when a simple list, heading, or native table would be clearer.',
        'Avoid hiding critical information behind interaction when users need side-by-side comparison.',
      ];
    }

    return [
      'Do not use the component only for decoration when plain semantic HTML communicates the same thing.',
      'Avoid adding variants or states that are not part of a documented product interaction.',
    ];
  });

  protected sectionLinkClasses(href: string, compact: boolean): string {
    const base = compact
      ? 'rounded-md px-2.5 py-1.5 text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
      : 'rounded-md px-2 py-1.5 text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600';
    const active =
      'bg-blue-50 font-semibold text-blue-700 ring-1 ring-blue-100 dark:bg-blue-950/50 dark:text-blue-200 dark:ring-blue-900';
    const inactive =
      'text-slate-500 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-400 dark:hover:bg-blue-950/40 dark:hover:text-blue-200';

    return `${base} ${this.activeSection() === href ? active : inactive}`;
  }

  protected previewDescription(componentDoc: ComponentDoc): string {
    if (componentDoc.slug === 'button') {
      return 'A button is used to trigger an action or event, such as submitting a form, opening a dialog, canceling an operation, or performing a destructive action.';
    }

    return `${componentDoc.name} preview examples use the public ${componentDoc.importName} API in realistic product states.`;
  }

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

    if ((NAVIGATION_DATA_SLUGS as readonly string[]).includes(slug)) {
      return 'Navigation/Data';
    }

    return 'Foundations';
  }
}
