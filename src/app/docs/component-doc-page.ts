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
  ],
  template: `
    @if (doc(); as componentDoc) {
      <article class="mx-auto max-w-7xl">
        <header class="border-b border-slate-200 pb-5 dark:border-slate-800">
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

          <div class="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <ui-badge size="sm">{{ componentDoc.selector }}</ui-badge>
                <ui-badge variant="info" size="sm">{{ componentCategory() }}</ui-badge>
                <ui-badge variant="success" size="sm">Standalone</ui-badge>
                <ui-badge variant="warning" size="sm">{{ componentMaturity() }}</ui-badge>
              </div>
              <h1 class="mt-3 max-w-3xl text-3xl font-semibold text-slate-950 dark:text-slate-50">
                {{ componentDoc.name }}
              </h1>
              <p class="mt-2 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
                {{ componentDoc.summary }}
              </p>
              <dl class="mt-4 flex flex-wrap gap-2 text-sm">
                @for (item of summaryItems(); track item.label) {
                  <div
                    class="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <dt class="text-xs text-slate-500 dark:text-slate-400">{{ item.label }}</dt>
                    <dd class="max-w-44 truncate font-semibold text-slate-950 dark:text-slate-50">
                      {{ item.value }}
                    </dd>
                  </div>
                }
              </dl>
              <div class="mt-4 flex flex-wrap gap-3">
                <a
                  href="#preview"
                  class="inline-flex h-9 items-center rounded-md bg-blue-600 px-3.5 text-sm font-medium text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-blue-500 dark:hover:bg-blue-400"
                >
                  View Preview
                </a>
                <a
                  href="#api"
                  class="inline-flex h-9 items-center rounded-md border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-900 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
                >
                  API Reference
                </a>
              </div>
            </div>

            <div
              class="min-w-0 self-start rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950"
            >
              <div class="flex items-center justify-between gap-3">
                <p class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                  Import
                </p>
                <span class="text-xs text-slate-500 dark:text-slate-400">{{
                  componentDoc.selector
                }}</span>
              </div>
              <code
                class="mt-2 block overflow-x-auto rounded-md bg-slate-950 px-3 py-2 text-xs leading-5 text-slate-100"
              >
                import {{ '{' }} {{ componentDoc.importName }} {{ '}' }} from '&#64;ngnova/ui';
              </code>
              <div class="mt-3 border-t border-slate-200 pt-3 dark:border-slate-800">
                <p class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                  Quality checklist
                </p>
                <ul
                  class="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs leading-5 text-slate-600 dark:text-slate-300"
                >
                  @for (item of qualityItems; track item.label) {
                    <li class="flex items-center justify-between gap-3">
                      <span>{{ item.label }}</span>
                      <span class="font-medium text-slate-950 dark:text-slate-50">
                        {{ item.value }}
                      </span>
                    </li>
                  }
                </ul>
              </div>
              <div
                class="mt-3 grid gap-2 border-t border-slate-200 pt-3 text-xs dark:border-slate-800 sm:grid-cols-2"
              >
                @if (previousDoc(); as previous) {
                  <a
                    [routerLink]="['/components', previous.slug]"
                    class="rounded-md border border-slate-200 px-3 py-2 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-800 dark:text-slate-300 dark:hover:border-blue-900 dark:hover:bg-blue-950/40 dark:hover:text-blue-200"
                  >
                    Previous<br />
                    <span class="font-semibold text-slate-950 dark:text-slate-50">{{
                      previous.name
                    }}</span>
                  </a>
                }
                @if (nextDoc(); as next) {
                  <a
                    [routerLink]="['/components', next.slug]"
                    class="rounded-md border border-slate-200 px-3 py-2 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-800 dark:text-slate-300 dark:hover:border-blue-900 dark:hover:bg-blue-950/40 dark:hover:text-blue-200"
                  >
                    Next<br />
                    <span class="font-semibold text-slate-950 dark:text-slate-50">{{
                      next.name
                    }}</span>
                  </a>
                }
              </div>
            </div>
          </div>
        </header>

        <nav
          class="sticky top-0 z-20 mt-4 overflow-x-auto border-b border-slate-200 bg-slate-50/95 py-2 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95"
          aria-label="Page sections"
        >
          <div class="flex min-w-max items-center gap-1">
            <span class="pr-2 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              On this page
            </span>
            @for (item of sectionNav; track item.href) {
              <a
                [href]="item.href"
                class="rounded-md px-2.5 py-1.5 text-sm text-slate-600 transition hover:bg-white hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-50"
              >
                {{ item.label }}
              </a>
            }
          </div>
        </nav>

        <div class="mt-5 grid min-w-0 gap-5">
          <section class="grid min-w-0 gap-5">
            <section
              id="preview"
              class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950"
            >
              <div class="border-b border-slate-200 px-4 py-3 dark:border-slate-800 sm:px-5">
                <div class="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p class="text-xs font-semibold uppercase text-blue-700 dark:text-blue-300">
                      Live Preview
                    </p>
                    <h3 class="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-50">
                      Production States
                    </h3>
                    <p class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                      Real component examples rendered from the public package API.
                    </p>
                  </div>
                  <ui-badge variant="success" size="sm">Interactive</ui-badge>
                </div>
              </div>

              <div class="p-3 sm:p-4">
                <div
                  class="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
                >
                  <div
                    class="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                  >
                    <span class="font-medium text-slate-700 dark:text-slate-200"
                      >Preview canvas</span
                    >
                    <span>{{ componentDoc.selector }}</span>
                  </div>
                  <div class="min-w-0 p-4">
                    @switch (componentDoc.slug) {
                      @case ('button') {
                        <div class="grid gap-3">
                          <section
                            class="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900"
                          >
                            <div class="flex flex-wrap items-center justify-between gap-3">
                              <div class="min-w-48">
                                <p class="text-sm font-semibold text-slate-950 dark:text-slate-50">
                                  Settings actions
                                </p>
                                <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                  Clear hierarchy for real forms.
                                </p>
                              </div>
                              <div class="flex flex-wrap items-center gap-2">
                                <ui-button variant="outline">Cancel</ui-button>
                                <ui-button variant="secondary">Save draft</ui-button>
                                <ui-button variant="primary">Publish</ui-button>
                              </div>
                            </div>
                          </section>

                          <section class="grid gap-3 lg:grid-cols-2">
                            <div
                              class="rounded-lg border border-slate-200 p-3 dark:border-slate-800"
                            >
                              <div class="flex items-center justify-between gap-3">
                                <p class="text-sm font-semibold text-slate-950 dark:text-slate-50">
                                  States
                                </p>
                                <span class="text-xs text-slate-500 dark:text-slate-400">
                                  loading, disabled, danger
                                </span>
                              </div>
                              <div class="mt-3 flex flex-wrap gap-2">
                                <ui-button loading>Saving</ui-button>
                                <ui-button disabled>Disabled</ui-button>
                                <ui-button variant="danger">Delete</ui-button>
                              </div>
                            </div>
                            <div
                              class="rounded-lg border border-slate-200 p-3 dark:border-slate-800"
                            >
                              <div class="flex items-center justify-between gap-3">
                                <p class="text-sm font-semibold text-slate-950 dark:text-slate-50">
                                  Sizes
                                </p>
                                <span class="text-xs text-slate-500 dark:text-slate-400">
                                  sm, md, lg
                                </span>
                              </div>
                              <div class="mt-3 flex flex-wrap items-center gap-2">
                                <ui-button size="sm">Small</ui-button>
                                <ui-button>Default</ui-button>
                                <ui-button size="lg">Large</ui-button>
                              </div>
                            </div>
                          </section>
                        </div>
                      }
                      @case ('card') {
                        <ui-card>
                          <div uiCardHeader>
                            <h4 class="font-semibold text-slate-950 dark:text-slate-50">
                              Workspace health
                            </h4>
                            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                              Production package checks
                            </p>
                          </div>
                          <p>
                            Library build, tests, and npm pack verification are designed into the
                            workflow.
                          </p>
                          <div uiCardFooter>
                            <ui-badge variant="success" size="sm">Ready</ui-badge>
                          </div>
                        </ui-card>
                      }
                      @case ('input') {
                        <div class="grid max-w-xl gap-4">
                          <ui-input
                            label="Email address"
                            placeholder="you@example.com"
                            helperText="Bound to a reactive FormControl."
                            [formControl]="email"
                          />
                          <ui-input
                            label="Package name"
                            placeholder="@ngnova/ui"
                            errorText="Package scope must match your npm organization."
                          />
                        </div>
                      }
                      @case ('badge') {
                        <div class="flex flex-wrap gap-3">
                          <ui-badge>Default</ui-badge>
                          <ui-badge variant="success">Success</ui-badge>
                          <ui-badge variant="warning">Warning</ui-badge>
                          <ui-badge variant="danger">Danger</ui-badge>
                          <ui-badge variant="info">Info</ui-badge>
                          <ui-badge size="sm">Small</ui-badge>
                        </div>
                      }
                      @case ('tag') {
                        <div class="flex flex-wrap gap-3">
                          <ui-tag icon="+">Angular</ui-tag>
                          <ui-tag variant="success">Published</ui-tag>
                          <ui-tag variant="warning" removable (removed)="tagRemoved.set(true)">
                            Review needed
                          </ui-tag>
                          @if (tagRemoved()) {
                            <ui-badge variant="info">Removed event emitted</ui-badge>
                          }
                        </div>
                      }
                      @case ('avatar') {
                        <div class="flex items-center gap-3">
                          <ui-avatar label="Ada Lovelace" />
                          <ui-avatar label="Grace Hopper" size="lg" />
                          <ui-avatar label="NgNova UI" shape="square" />
                        </div>
                      }
                      @case ('skeleton') {
                        <div class="max-w-md space-y-3">
                          <div class="flex items-center gap-3">
                            <ui-skeleton shape="circle" width="2.5rem" height="2.5rem" />
                            <div class="flex-1 space-y-2">
                              <ui-skeleton shape="text" width="65%" height="0.875rem" />
                              <ui-skeleton shape="text" width="40%" height="0.75rem" />
                            </div>
                          </div>
                          <ui-skeleton height="7rem" />
                        </div>
                      }
                      @case ('progress-bar') {
                        <div class="grid max-w-xl gap-4">
                          <ui-progress-bar [value]="65" label="Build progress" />
                          <ui-progress-bar [value]="90" variant="success" label="Test coverage" />
                          <ui-progress-bar indeterminate label="Publishing package" />
                        </div>
                      }
                      @case ('modal') {
                        <div class="flex flex-col gap-4">
                          <p class="text-slate-600 dark:text-slate-300">
                            Open the dialog to check header, body, footer, backdrop click, and
                            Escape close.
                          </p>
                          <ui-button (pressed)="modalOpen.set(true)">Open modal</ui-button>
                        </div>
                      }
                      @case ('accordion') {
                        <ui-accordion
                          [items]="accordionItems"
                          [active]="accordionActive()"
                          (activeChange)="accordionActive.set($event)"
                        />
                      }
                      @case ('table') {
                        <ui-table
                          [columns]="tableColumns"
                          [rows]="tableRows"
                          selectable
                          (rowSelected)="selectedTableRow.set($event)"
                        />
                        @if (selectedTableRow(); as row) {
                          <p class="mt-3 text-sm text-slate-500 dark:text-slate-400">
                            Selected {{ row['component'] }}
                          </p>
                        }
                      }
                      @case ('toast') {
                        <div class="flex flex-col gap-4">
                          <p class="text-slate-600 dark:text-slate-300">
                            Toast messages are pushed through UiToastService and rendered by
                            ui-toast.
                          </p>
                          <ui-button (pressed)="showToast()">Show toast</ui-button>
                          <ui-toast />
                        </div>
                      }
                      @case ('checkbox') {
                        <div class="grid max-w-xl gap-4">
                          <ui-checkbox
                            label="Email updates"
                            helperText="Bound to a reactive FormControl."
                            [formControl]="newsletter"
                          />
                          <ui-checkbox
                            label="Require approval before publishing"
                            helperText="Useful for release workflows."
                            indeterminate
                          />
                          <ui-checkbox label="Disabled option" disabled />
                        </div>
                      }
                      @case ('select') {
                        <div class="grid max-w-xl gap-4">
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
                          />
                        </div>
                      }
                      @case ('radio') {
                        <div class="grid max-w-xl gap-4">
                          <ui-radio-group
                            label="Contact preference"
                            helperText="Bound to a reactive FormControl."
                            [options]="contactOptions"
                            [formControl]="contactPreference"
                          />
                          <ui-radio-group
                            label="Layout"
                            orientation="horizontal"
                            [options]="layoutOptions"
                            [formControl]="layoutDensity"
                          />
                        </div>
                      }
                      @case ('switch') {
                        <div class="grid max-w-xl gap-4">
                          <ui-switch
                            label="Release notifications"
                            helperText="Bound to a reactive FormControl."
                            [formControl]="notifications"
                          />
                          <ui-switch label="Disabled switch" disabled />
                        </div>
                      }
                      @case ('textarea') {
                        <div class="grid max-w-xl gap-4">
                          <ui-textarea
                            label="Release notes"
                            placeholder="Describe what changed..."
                            helperText="Bound to a reactive FormControl."
                            [formControl]="releaseNotes"
                          />
                          <ui-textarea
                            label="Review notes"
                            errorText="Notes are required before publishing."
                            resize="none"
                            [rows]="3"
                          />
                        </div>
                      }
                      @case ('alert') {
                        <div class="grid gap-4">
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
                        <ui-tabs
                          [tabs]="componentTabs"
                          [active]="activeTab()"
                          (activeChange)="activeTab.set($event)"
                          ariaLabel="Component sections"
                        >
                          @if (activeTab() === 'overview') {
                            <p class="text-slate-600 dark:text-slate-300">
                              Tabs use real tablist semantics and keyboard navigation.
                            </p>
                          } @else if (activeTab() === 'api') {
                            <p class="text-slate-600 dark:text-slate-300">
                              Pair the active value with your own projected panel content.
                            </p>
                          } @else {
                            <p class="text-slate-600 dark:text-slate-300">
                              Disabled tabs stay visible but cannot be selected.
                            </p>
                          }
                        </ui-tabs>
                      }
                      @case ('spinner') {
                        <div class="flex flex-wrap items-center gap-6">
                          <ui-spinner size="sm" label="Loading small preview" />
                          <ui-spinner label="Loading default preview" />
                          <ui-spinner size="lg" label="Loading large preview" />
                          <ui-button loading>Saving</ui-button>
                        </div>
                      }
                    }
                  </div>
                </div>
              </div>
            </section>

            <section
              id="usage"
              class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950"
            >
              <div
                class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800 sm:px-5"
              >
                <div>
                  <p class="text-xs font-semibold uppercase text-blue-700 dark:text-blue-300">
                    Usage
                  </p>
                  <h3 class="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-50">
                    Copy-Paste Starter
                  </h3>
                  <p class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                    Copy this into a standalone Angular component.
                  </p>
                </div>
                <ui-button variant="outline" size="sm" (pressed)="copy(componentDoc.usage)">
                  {{ copied() ? 'Copied' : 'Copy' }}
                </ui-button>
              </div>
              <div class="p-3 sm:p-4">
                <div class="overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
                  <div
                    class="flex items-center justify-between border-b border-slate-800 px-4 py-2 text-xs text-slate-400"
                  >
                    <span class="font-medium text-slate-200"
                      >{{ componentDoc.slug }}.example.html</span
                    >
                    <span>Angular template</span>
                  </div>
                  <pre
                    class="max-h-80 overflow-auto p-4 text-sm leading-6 text-slate-100"
                  ><code>{{ componentDoc.usage }}</code></pre>
                </div>
              </div>
            </section>

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
                      <div
                        class="min-w-0 overflow-hidden rounded-lg border border-slate-800 bg-slate-950"
                      >
                        <div
                          class="flex items-center justify-between border-b border-slate-800 px-4 py-2 text-xs text-slate-400"
                        >
                          <span class="font-medium text-slate-200"
                            >{{ componentDoc.slug }}.example.ts</span
                          >
                          <span>Angular</span>
                        </div>
                        <pre
                          class="max-h-72 overflow-auto p-4 text-sm leading-6 text-slate-100"
                        ><code>{{ example.code }}</code></pre>
                      </div>
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

            <section
              id="api"
              class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
            >
              <div>
                <p class="text-xs font-semibold uppercase text-blue-700 dark:text-blue-300">
                  Reference
                </p>
                <h3 class="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-50">API</h3>
                <p class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                  Inputs and outputs exposed by {{ componentDoc.importName }}.
                </p>
              </div>

              @if (componentDoc.inputs.length) {
                <h4
                  class="mb-3 mt-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                >
                  Inputs
                </h4>
                <div
                  class="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800"
                >
                  <div class="overflow-x-auto">
                    <table class="w-full min-w-[48rem] table-fixed text-left text-sm">
                      <thead
                        class="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                      >
                        <tr>
                          <th class="w-1/5 px-3 py-2.5 font-medium">Name</th>
                          <th class="w-1/4 px-3 py-2.5 font-medium">Type</th>
                          <th class="w-1/6 px-3 py-2.5 font-medium">Default</th>
                          <th class="px-3 py-2.5 font-medium">Description</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
                        @for (input of componentDoc.inputs; track input.name) {
                          <tr>
                            <td class="px-3 py-2.5 align-top">
                              <code
                                class="rounded bg-blue-50 px-1.5 py-0.5 font-mono text-xs text-blue-700 dark:bg-blue-950/70 dark:text-blue-200"
                              >
                                {{ input.name }}
                              </code>
                            </td>
                            <td class="px-3 py-2.5 align-top">
                              <code
                                class="font-mono text-xs leading-5 text-slate-700 dark:text-slate-300"
                              >
                                {{ input.type }}
                              </code>
                            </td>
                            <td class="px-3 py-2.5 align-top">
                              <code
                                class="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                              >
                                {{ input.defaultValue }}
                              </code>
                            </td>
                            <td
                              class="px-3 py-2.5 align-top leading-6 text-slate-600 dark:text-slate-300"
                            >
                              {{ input.description }}
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              } @else {
                <p class="text-sm text-slate-500 dark:text-slate-400">
                  This component uses content projection and has no inputs.
                </p>
              }

              @if (componentDoc.outputs.length) {
                <h4
                  class="mb-3 mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                >
                  Outputs
                </h4>
                <div
                  class="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800"
                >
                  <div class="overflow-x-auto">
                    <table class="w-full min-w-[42rem] table-fixed text-left text-sm">
                      <thead
                        class="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                      >
                        <tr>
                          <th class="w-1/4 px-3 py-2.5 font-medium">Name</th>
                          <th class="w-1/3 px-3 py-2.5 font-medium">Type</th>
                          <th class="px-3 py-2.5 font-medium">Description</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
                        @for (output of componentDoc.outputs; track output.name) {
                          <tr>
                            <td class="px-3 py-2.5 align-top">
                              <code
                                class="rounded bg-blue-50 px-1.5 py-0.5 font-mono text-xs text-blue-700 dark:bg-blue-950/70 dark:text-blue-200"
                              >
                                {{ output.name }}
                              </code>
                            </td>
                            <td class="px-3 py-2.5 align-top">
                              <code
                                class="font-mono text-xs leading-5 text-slate-700 dark:text-slate-300"
                              >
                                {{ output.type }}
                              </code>
                            </td>
                            <td
                              class="px-3 py-2.5 align-top leading-6 text-slate-600 dark:text-slate-300"
                            >
                              {{ output.description }}
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              }
            </section>
          </section>
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

    <ui-modal [open]="modalOpen()" (openChange)="modalOpen.set($event)">
      <span uiModalHeader>Publish checklist</span>
      <div class="space-y-3">
        <p>Build the library, inspect the package, then publish from <code>dist/ui</code>.</p>
        <ul class="list-disc space-y-1 pl-5">
          <li><code>npm run build:lib</code></li>
          <li><code>npm run pack:lib</code></li>
          <li><code>cd dist/ui</code> then <code>npm publish --access public</code></li>
        </ul>
      </div>
      <div uiModalFooter class="flex gap-3">
        <ui-button variant="outline" (pressed)="modalOpen.set(false)">Close</ui-button>
        <ui-button (pressed)="modalOpen.set(false)">Looks good</ui-button>
      </div>
    </ui-modal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentDocPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(UiToastService);
  protected readonly email = new FormControl('developer@example.com');
  protected readonly newsletter = new FormControl(true);
  protected readonly plan = new FormControl('pro');
  protected readonly contactPreference = new FormControl('email');
  protected readonly layoutDensity = new FormControl('comfortable');
  protected readonly notifications = new FormControl(false);
  protected readonly releaseNotes = new FormControl('Added form components.');
  protected readonly modalOpen = signal(false);
  protected readonly copied = signal(false);
  protected readonly activeTab = signal('overview');
  protected readonly tagRemoved = signal(false);
  protected readonly accordionActive = signal<readonly string[]>(['overview']);
  protected readonly selectedTableRow = signal<UiTableRow | null>(null);
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
  ];
  protected readonly tableRows: readonly UiTableRow[] = [
    { component: 'Button', category: 'Foundation', status: 'Ready' },
    { component: 'Select', category: 'Forms', status: 'Ready' },
    { component: 'Table', category: 'Data', status: 'New' },
  ];
  protected readonly sectionNav: readonly SectionNavItem[] = [
    { label: 'Preview', href: '#preview' },
    { label: 'Usage', href: '#usage' },
    { label: 'Guidance', href: '#guide' },
    { label: 'Examples', href: '#examples' },
    { label: 'Accessibility', href: '#accessibility' },
    { label: 'API', href: '#api' },
    { label: 'Testing', href: '#testing' },
  ];
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

  protected async copy(text: string): Promise<void> {
    await navigator.clipboard.writeText(text);
    this.copied.set(true);
    window.setTimeout(() => this.copied.set(false), 1500);
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
