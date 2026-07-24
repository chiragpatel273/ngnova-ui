import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowRight, heroPlus } from '@ng-icons/heroicons/outline';
import { map } from 'rxjs';
import { UiAccordionComponent } from '@ngnova/ui/accordion';
import type { UiAccordionItem } from '@ngnova/ui/accordion';
import { UiAlertComponent } from '@ngnova/ui/alert';
import { UiAvatarComponent } from '@ngnova/ui/avatar';
import { UiBadgeComponent } from '@ngnova/ui/badge';
import { UiBreadcrumbComponent } from '@ngnova/ui/breadcrumb';
import type { UiBreadcrumbItem } from '@ngnova/ui/breadcrumb';
import {
  UiButtonComponent,
  UiButtonDirective,
  UiButtonGroupComponent,
  UiButtonIconEndDirective,
  UiButtonIconStartDirective,
} from '@ngnova/ui/button';
import type { UiButtonAppearance, UiButtonIntent } from '@ngnova/ui/button';
import { UiCardComponent } from '@ngnova/ui/card';
import { UiCheckboxComponent } from '@ngnova/ui/checkbox';
import { UiChipComponent } from '@ngnova/ui/chip';
import { UiComboboxComponent } from '@ngnova/ui/combobox';
import type { UiComboboxOption } from '@ngnova/ui/combobox';
import { UiCommandPaletteComponent } from '@ngnova/ui/command-palette';
import type { UiCommand } from '@ngnova/ui/command-palette';
import { UiConfirmationDialogComponent, UiConfirmationService } from '@ngnova/ui/confirmation';
import { UiDatePickerComponent } from '@ngnova/ui/date-picker';
import { UiDataViewComponent, UiDataViewItemDirective } from '@ngnova/ui/data-view';
import {
  UiDrawerComponent,
  UiDrawerFooterDirective,
  UiDrawerHeaderDirective,
} from '@ngnova/ui/drawer';
import { UiDividerComponent } from '@ngnova/ui/divider';
import { UiFileUploadComponent } from '@ngnova/ui/file-upload';
import {
  UiFormFieldComponent,
  UiFormFieldControlDirective,
  UiFormFieldPrefixDirective,
  UiFormFieldSuffixDirective,
} from '@ngnova/ui/form-field';
import { UiInputComponent } from '@ngnova/ui/input';
import { UiMenuComponent, UiMenuTriggerDirective } from '@ngnova/ui/menu';
import type { UiMenuItem } from '@ngnova/ui/menu';
import { UiModalComponent } from '@ngnova/ui/modal';
import {
  UiOverlayComponent,
  UiOverlayContentDirective,
  UiOverlayTriggerDirective,
} from '@ngnova/ui/overlay';
import { UiPaginatorComponent } from '@ngnova/ui/paginator';
import {
  UiPopoverComponent,
  UiPopoverContentDirective,
  UiPopoverTriggerDirective,
} from '@ngnova/ui/popover';
import { UiProgressBarComponent } from '@ngnova/ui/progress-bar';
import { UiRadioGroupComponent } from '@ngnova/ui/radio';
import type { UiRadioOption } from '@ngnova/ui/radio';
import { UiSelectComponent } from '@ngnova/ui/select';
import type { UiSelectOption } from '@ngnova/ui/select';
import { UiSkeletonComponent } from '@ngnova/ui/skeleton';
import { UiSpinnerComponent } from '@ngnova/ui/spinner';
import { UiStepperComponent } from '@ngnova/ui/stepper';
import type { UiStepItem } from '@ngnova/ui/stepper';
import { UiSwitchComponent } from '@ngnova/ui/switch';
import { UiTabsComponent } from '@ngnova/ui/tabs';
import type { UiTabItem } from '@ngnova/ui/tabs';
import { UiTableCellDirective, UiTableComponent, UiTableHeaderDirective } from '@ngnova/ui/table';
import type { UiTableColumn, UiTableRow, UiTableRowKey } from '@ngnova/ui/table';
import {
  UiTableVirtualRowDirective,
  UiTableVirtualScrollComponent,
} from '@ngnova/ui/table-virtual-scroll';
import { UiTagComponent } from '@ngnova/ui/tag';
import { UiTextareaComponent } from '@ngnova/ui/textarea';
import { UiToastComponent, UiToastService } from '@ngnova/ui/toast';
import { UiTooltipDirective } from '@ngnova/ui/tooltip';
import { UiTreeComponent } from '@ngnova/ui/tree';
import type { UiTreeNode } from '@ngnova/ui/tree';
import { UiTreeTableComponent } from '@ngnova/ui/tree-table';
import type { UiTreeTableColumn, UiTreeTableNode } from '@ngnova/ui/tree-table';

import {
  componentDocDetailsBySlug,
  componentDocs,
  docsBySlug,
  getComponentImportPath,
} from './docs-data';
import type { ComponentDoc, ComponentExample } from './docs-data';
import { CardDocPlaygroundComponent } from './card-doc-playground';
import { DocsApiTableComponent } from './docs-api-table';
import { DocsCodeBlockComponent } from './docs-code-block';
import { DocsPreviewCanvasComponent } from './docs-preview-canvas';

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

interface ButtonUsageExample {
  readonly id:
    | 'variants'
    | 'visual-api'
    | 'sizes'
    | 'states'
    | 'icons'
    | 'links'
    | 'group'
    | 'forms'
    | 'events';
  readonly title: string;
  readonly description: string;
  readonly filename: string;
  readonly code: string;
}

const FORM_SLUGS = [
  'form-field',
  'combobox',
  'date-picker',
  'input',
  'textarea',
  'checkbox',
  'radio',
  'switch',
  'select',
] as const;
const OVERLAY_SLUGS = [
  'modal',
  'toast',
  'tooltip',
  'popover',
  'drawer',
  'menu',
  'command-palette',
  'overlay',
  'confirmation',
] as const;
const DATA_SLUGS = [
  'tabs',
  'accordion',
  'table',
  'table-virtual-scroll',
  'data-view',
  'tree',
  'tree-table',
  'card',
] as const;
const BUTTON_APPEARANCES: readonly UiButtonAppearance[] = [
  'solid',
  'outline',
  'ghost',
  'text',
  'tonal',
];
const BUTTON_INTENTS: readonly UiButtonIntent[] = [
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'neutral',
];

const BUTTON_USAGE_EXAMPLES: readonly ButtonUsageExample[] = [
  {
    id: 'variants',
    title: 'Variants',
    description:
      'Use visual weight to separate primary, secondary, quiet, and destructive actions.',
    filename: 'button-variants.example.html',
    code: `<ui-button>Primary Action</ui-button>
<ui-button variant="secondary">Secondary</ui-button>
<ui-button variant="outline">Outline</ui-button>
<ui-button variant="ghost">Ghost</ui-button>
<ui-button variant="danger">Delete</ui-button>`,
  },
  {
    id: 'visual-api',
    title: 'Intent and appearance matrix',
    description:
      'Review every semantic intent across every appearance; either input can also be used independently.',
    filename: 'button-intent-appearance.example.html',
    code: `@for (appearance of buttonAppearances; track appearance) {
  <section
    class="grid gap-2 sm:grid-cols-[5rem_minmax(0,1fr)] sm:items-center"
    [attr.aria-label]="appearance + ' buttons'"
  >
    <h4>{{ appearance }}</h4>
    <div class="flex flex-wrap items-center gap-2">
      @for (intent of buttonIntents; track intent) {
        <ui-button size="sm" [appearance]="appearance" [intent]="intent">
          {{ intent }}
        </ui-button>
      }
    </div>
  </section>
}`,
  },
  {
    id: 'sizes',
    title: 'Sizes',
    description:
      'Match button density to the surrounding surface without changing the component API.',
    filename: 'button-sizes.example.html',
    code: `<ui-button size="sm">Button</ui-button>
<ui-button size="md">Button</ui-button>
<ui-button size="lg">Button</ui-button>`,
  },
  {
    id: 'states',
    title: 'States',
    description: 'Show pending work, disabled actions, and full-width mobile layouts explicitly.',
    filename: 'button-states.example.html',
    code: `<ui-button loading loadingLabel="Saving changes">Saving</ui-button>
<ui-button disabled>Disabled</ui-button>
<ui-button fullWidth>Continue</ui-button>`,
  },
  {
    id: 'icons',
    title: 'Icons',
    description:
      'Mark decorative leading and trailing icons explicitly, and label icon-only actions.',
    filename: 'button-icons.example.html',
    code: `<ui-button>
  <ng-icon uiButtonIconStart name="heroPlus" />
  Create
</ui-button>

<ui-button variant="outline">
  Continue
  <ng-icon uiButtonIconEnd name="heroArrowRight" />
</ui-button>

<ui-button iconOnly ariaLabel="Create item">
  <ng-icon uiButtonIconStart name="heroPlus" />
</ui-button>`,
  },
  {
    id: 'links',
    title: 'Links',
    description:
      'Use uiButton on anchors and router links for navigation, including disabled-link semantics.',
    filename: 'button-links.example.html',
    code: `<a uiButton routerLink="/components/input" variant="outline">Open Input docs</a>
<a uiButton href="/reports" disabled>Reports unavailable</a>`,
  },
  {
    id: 'group',
    title: 'Group',
    description:
      'Group related actions with connected edges, shared semantics, and unclipped keyboard focus.',
    filename: 'button-group.example.html',
    code: `<ui-button-group ariaLabel="View density">
  <ui-button variant="outline">Compact</ui-button>
  <ui-button variant="outline">Comfortable</ui-button>
  <ui-button variant="outline">Spacious</ui-button>
</ui-button-group>`,
  },
  {
    id: 'forms',
    title: 'Form submission',
    description:
      'Set type="submit" deliberately; ui-button defaults to type="button" to prevent accidental submissions.',
    filename: 'button-form.example.html',
    code: `<form (submit)="saveProfile($event)">
  <ui-button type="submit">Save profile</ui-button>
</form>`,
  },
  {
    id: 'events',
    title: 'Semantic events',
    description: 'Use pressed for activation and focused or blurred for focus-aware workflows.',
    filename: 'button-events.example.html',
    code: `<ui-button
  (pressed)="recordButtonPress()"
  (focused)="buttonFocused.set(true)"
  (blurred)="buttonFocused.set(false)"
>
  Track press
</ui-button>

<p aria-live="polite">
  Presses: {{ buttonPressCount() }} · {{ buttonFocused() ? 'Focused' : 'Ready' }}
</p>`,
  },
];

@Component({
  selector: 'app-component-doc-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIcon,
    UiAccordionComponent,
    UiAlertComponent,
    UiAvatarComponent,
    UiBadgeComponent,
    UiBreadcrumbComponent,
    UiButtonComponent,
    UiButtonDirective,
    UiButtonGroupComponent,
    UiButtonIconEndDirective,
    UiButtonIconStartDirective,
    UiCardComponent,
    UiCheckboxComponent,
    UiChipComponent,
    UiComboboxComponent,
    UiCommandPaletteComponent,
    UiConfirmationDialogComponent,
    UiDatePickerComponent,
    UiDataViewComponent,
    UiDataViewItemDirective,
    UiDrawerComponent,
    UiDrawerFooterDirective,
    UiDrawerHeaderDirective,
    UiDividerComponent,
    UiFileUploadComponent,
    UiFormFieldComponent,
    UiFormFieldControlDirective,
    UiFormFieldPrefixDirective,
    UiFormFieldSuffixDirective,
    UiInputComponent,
    UiMenuComponent,
    UiMenuTriggerDirective,
    UiModalComponent,
    UiOverlayComponent,
    UiOverlayContentDirective,
    UiOverlayTriggerDirective,
    UiPaginatorComponent,
    UiPopoverComponent,
    UiPopoverContentDirective,
    UiPopoverTriggerDirective,
    UiProgressBarComponent,
    UiRadioGroupComponent,
    UiSelectComponent,
    UiSkeletonComponent,
    UiSpinnerComponent,
    UiStepperComponent,
    UiSwitchComponent,
    UiTabsComponent,
    UiTableCellDirective,
    UiTableComponent,
    UiTableHeaderDirective,
    UiTableVirtualRowDirective,
    UiTableVirtualScrollComponent,
    UiTagComponent,
    UiTextareaComponent,
    UiToastComponent,
    UiTooltipDirective,
    UiTreeComponent,
    UiTreeTableComponent,
    CardDocPlaygroundComponent,
    DocsApiTableComponent,
    DocsCodeBlockComponent,
    DocsPreviewCanvasComponent,
  ],
  providers: [provideIcons({ heroArrowRight, heroPlus })],
  template: `
    @if (doc(); as componentDoc) {
      <article class="mx-auto max-w-[72rem] pb-14">
        <header class="border-b border-blue-200 pb-6 pt-2 dark:border-blue-950/70">
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="rounded bg-blue-100 px-2 py-1 text-xs font-semibold uppercase tracking-normal text-blue-800 dark:bg-blue-950 dark:text-blue-200"
            >
              Component
            </span>
            <span
              class="rounded bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              v0.1.0
            </span>
            <span
              class="rounded bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {{ componentCategory() }}
            </span>
          </div>

          <div class="mt-3 grid gap-5 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-start">
            <div>
              <h1 class="text-2xl font-bold leading-8 text-slate-950 dark:text-slate-50">
                {{ componentDoc.name }}
              </h1>
              <p class="mt-2 max-w-3xl text-sm leading-5 text-slate-700 dark:text-slate-300">
                {{ componentDoc.summary }}
              </p>
              <div class="mt-4 flex flex-wrap gap-1.5">
                @for (stat of qualityStats; track stat.label) {
                  <span
                    class="inline-flex items-center gap-1.5 rounded-full bg-slate-200 px-2.5 py-1 text-xs text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <span class="size-1.5 rounded-full bg-blue-700" aria-hidden="true"></span>
                    {{ stat.value }} {{ stat.label }}
                  </span>
                }
              </div>
            </div>

            <dl
              class="grid gap-0 overflow-hidden rounded border border-blue-200 bg-white text-sm dark:border-blue-950 dark:bg-slate-950"
            >
              @for (item of summaryItems(); track item.label) {
                <div
                  class="border-b border-blue-100 px-3 py-2.5 last:border-b-0 dark:border-blue-950/70"
                >
                  <dt class="text-xs font-medium uppercase text-slate-500 dark:text-slate-500">
                    {{ item.label }}
                  </dt>
                  <dd class="mt-1 truncate font-mono text-xs text-slate-950 dark:text-slate-100">
                    {{ item.value }}
                  </dd>
                </div>
              }
            </dl>
          </div>
        </header>

        <section id="setup" class="border-b border-blue-200 py-6 dark:border-blue-950/70">
          <div
            class="overflow-hidden rounded border border-blue-200 bg-white shadow-sm dark:border-blue-950 dark:bg-slate-950"
          >
            <div class="grid gap-0 lg:grid-cols-[16rem_minmax(0,1fr)]">
              <div
                class="border-b border-blue-100 bg-blue-50/60 p-4 dark:border-blue-950/70 dark:bg-blue-950/20 lg:border-b-0 lg:border-r"
              >
                <p
                  class="text-xs font-semibold uppercase tracking-normal text-blue-800 dark:text-blue-200"
                >
                  Setup
                </p>
                <h2 class="mt-1.5 text-lg font-bold text-slate-950 dark:text-slate-50">
                  Use this component
                </h2>
                <p class="mt-3 text-sm leading-5 text-slate-600 dark:text-slate-300">
                  Import the standalone entry point in the Angular component that renders this UI
                  primitive.
                </p>
                <div class="mt-4 flex flex-wrap gap-2">
                  <span
                    class="rounded-full bg-white px-3 py-1 text-xs font-medium text-blue-800 ring-1 ring-blue-200 dark:bg-slate-950 dark:text-blue-200 dark:ring-blue-900"
                  >
                    Standalone
                  </span>
                  <span
                    class="rounded-full bg-white px-3 py-1 text-xs font-medium text-blue-800 ring-1 ring-blue-200 dark:bg-slate-950 dark:text-blue-200 dark:ring-blue-900"
                  >
                    Tailwind v4
                  </span>
                </div>
              </div>

              <div class="grid content-center p-4 sm:p-5">
                <div
                  class="grid gap-3 rounded border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4"
                >
                  <div class="flex items-center justify-between gap-3">
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-slate-950 dark:text-slate-50">
                        Component import
                      </p>
                    </div>
                    <ui-button variant="secondary" size="sm" (click)="copyImportStatement()">
                      {{ copiedImportStatement() ? 'Copied' : 'Copy' }}
                    </ui-button>
                  </div>
                  <pre
                    class="overflow-x-auto whitespace-pre rounded bg-slate-950 px-4 py-2.5 font-mono text-sm leading-5 text-slate-50"
                  ><code>{{ importStatement() }}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="usage" class="py-7">
          <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 class="text-lg font-bold text-slate-950 dark:text-slate-50">Usage & variants</h2>
              <p class="mt-1.5 max-w-2xl text-sm leading-5 text-slate-600 dark:text-slate-400">
                Live examples use the public
                <code class="font-mono">{{ componentDoc.selector }}</code>
                API, paired with the exact snippet a product team would paste into an Angular app.
              </p>
            </div>
            <a
              href="#api"
              class="rounded border border-blue-300 px-4 py-2 text-sm font-semibold text-blue-800 transition hover:bg-blue-50 dark:border-blue-900 dark:text-blue-200 dark:hover:bg-blue-950/50"
            >
              API Reference
            </a>
          </div>

          @if (componentDoc.slug === 'card') {
            <app-card-doc-playground [doc]="componentDoc" />
          } @else if (componentDoc.slug === 'button') {
            <div class="grid gap-5">
              @for (example of buttonUsageExamples; track example.id) {
                <app-docs-preview-canvas
                  [title]="example.title"
                  [description]="example.description"
                  [code]="example.code"
                  [filename]="example.filename"
                  [visualId]="'button-' + example.id"
                  language="Angular template"
                >
                  <div class="flex w-full min-w-0 items-center justify-center">
                    @switch (example.id) {
                      @case ('variants') {
                        <div class="flex flex-wrap items-center justify-center gap-3">
                          <ui-button>Primary Action</ui-button>
                          <ui-button variant="secondary">Secondary</ui-button>
                          <ui-button variant="outline">Outline</ui-button>
                          <ui-button variant="ghost">Ghost</ui-button>
                          <ui-button variant="danger">Delete</ui-button>
                        </div>
                      }
                      @case ('sizes') {
                        <div class="flex flex-wrap items-end justify-center gap-5">
                          <div class="grid justify-items-center gap-2">
                            <ui-button size="sm">Button</ui-button>
                            <span class="text-xs text-slate-500 dark:text-slate-400"
                              >Small · 32px</span
                            >
                          </div>
                          <div class="grid justify-items-center gap-2">
                            <ui-button size="md">Button</ui-button>
                            <span class="text-xs text-slate-500 dark:text-slate-400"
                              >Medium · 40px</span
                            >
                          </div>
                          <div class="grid justify-items-center gap-2">
                            <ui-button size="lg">Button</ui-button>
                            <span class="text-xs text-slate-500 dark:text-slate-400"
                              >Large · 48px</span
                            >
                          </div>
                        </div>
                      }
                      @case ('visual-api') {
                        <div class="grid w-full gap-4">
                          @for (appearance of buttonAppearances; track appearance) {
                            <section
                              class="grid gap-2 sm:grid-cols-[5rem_minmax(0,1fr)] sm:items-center"
                              [attr.aria-label]="appearance + ' buttons'"
                            >
                              <h4
                                class="font-mono text-xs font-semibold uppercase text-slate-500 dark:text-slate-400"
                              >
                                {{ appearance }}
                              </h4>
                              <div class="flex flex-wrap items-center gap-2">
                                @for (intent of buttonIntents; track intent) {
                                  <ui-button size="sm" [appearance]="appearance" [intent]="intent">
                                    {{ intent }}
                                  </ui-button>
                                }
                              </div>
                            </section>
                          }
                        </div>
                      }
                      @case ('states') {
                        <div class="grid w-full max-w-sm gap-3">
                          <ui-button loading loadingLabel="Saving changes">Saving</ui-button>
                          <ui-button disabled>Disabled</ui-button>
                          <ui-button fullWidth>Continue</ui-button>
                        </div>
                      }
                      @case ('icons') {
                        <div class="flex flex-wrap items-center justify-center gap-3">
                          <ui-button>
                            <ng-icon uiButtonIconStart name="heroPlus" />
                            Create
                          </ui-button>
                          <ui-button variant="outline">
                            Continue
                            <ng-icon uiButtonIconEnd name="heroArrowRight" />
                          </ui-button>
                          <ui-button iconOnly ariaLabel="Create item">
                            <ng-icon uiButtonIconStart name="heroPlus" />
                          </ui-button>
                        </div>
                      }
                      @case ('links') {
                        <div class="flex flex-wrap items-center justify-center gap-3">
                          <a uiButton routerLink="/components/input" variant="outline">
                            Open Input docs
                          </a>
                          <a uiButton href="/reports" disabled>Reports unavailable</a>
                        </div>
                      }
                      @case ('group') {
                        <ui-button-group ariaLabel="View density">
                          <ui-button variant="outline">Compact</ui-button>
                          <ui-button variant="outline">Comfortable</ui-button>
                          <ui-button variant="outline">Spacious</ui-button>
                        </ui-button-group>
                      }
                      @case ('forms') {
                        <div class="grid gap-3 text-center">
                          <form (submit)="recordButtonSubmit($event)">
                            <ui-button type="submit">Save profile</ui-button>
                          </form>
                          <p
                            class="text-sm font-medium text-slate-600 dark:text-slate-400"
                            aria-live="polite"
                          >
                            Form submissions: {{ buttonSubmitCount() }}
                          </p>
                        </div>
                      }
                      @case ('events') {
                        <div class="grid gap-3 text-center">
                          <ui-button
                            (pressed)="recordButtonPress()"
                            (focused)="buttonFocused.set(true)"
                            (blurred)="buttonFocused.set(false)"
                          >
                            Track press
                          </ui-button>
                          <p
                            class="text-sm font-medium text-slate-600 dark:text-slate-400"
                            aria-live="polite"
                          >
                            Presses: {{ buttonPressCount() }} ·
                            {{ buttonFocused() ? 'Focused' : 'Ready' }}
                          </p>
                        </div>
                      }
                    }
                  </div>
                </app-docs-preview-canvas>
              }
            </div>
          } @else {
            <app-docs-preview-canvas
              [title]="componentDoc.name + ' interactive example'"
              [description]="componentDoc.summary"
              [code]="componentDoc.usage"
              [filename]="componentDoc.selector + '.example.html'"
              [visualId]="componentDoc.slug + '-default'"
              language="Angular template"
            >
              <div class="flex w-full min-w-0 items-center justify-center">
                @switch (componentDoc.slug) {
                  @case ('form-field') {
                    <div class="w-full max-w-sm">
                      <ui-form-field
                        label="Workspace"
                        helperText="Choose a short, recognizable name."
                        required
                      >
                        <span uiFormFieldPrefix aria-hidden="true">@</span>
                        <input
                          uiFormFieldControl
                          type="text"
                          value="ngnova"
                          autocomplete="organization"
                        />
                        <span uiFormFieldSuffix class="text-xs">.team</span>
                      </ui-form-field>
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
                  @case ('combobox') {
                    <div class="min-h-72 w-full max-w-sm">
                      <ui-combobox
                        label="Framework"
                        placeholder="Search frameworks"
                        helperText="Type to filter, then use Arrow keys and Enter."
                        [options]="docsComboboxOptions"
                        [formControl]="docsFramework"
                        clearable
                      />
                    </div>
                  }
                  @case ('date-picker') {
                    <div class="min-h-[30rem] w-full max-w-sm">
                      <ui-date-picker
                        label="Release date"
                        helperText="Choose a publication date."
                        [formControl]="docsReleaseDate"
                        min="2026-01-01"
                        max="2027-12-31"
                        clearable
                      />
                    </div>
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
                      <ui-button (click)="modalOpen.set(true)">Open dialog</ui-button>
                      <p class="mt-3 text-sm text-slate-500">
                        Escape, backdrop policy, and focus restore are documented below.
                      </p>
                    </div>
                  }
                  @case ('toast') {
                    <div class="text-center">
                      <ui-button (click)="showToast()">Show toast</ui-button>
                      <ui-toast />
                    </div>
                  }
                  @case ('table') {
                    <div class="w-full overflow-x-auto">
                      <ui-table
                        [columns]="tableColumns"
                        [rows]="tableRows"
                        caption="Component release status"
                        rowKey="id"
                        selectionMode="multiple"
                        [selectedKeys]="selectedTableKeys()"
                        (selectedKeysChange)="selectedTableKeys.set($event)"
                        [page]="1"
                        [pageSize]="3"
                        [totalItems]="8"
                        stickyHeader
                        stickySelectionColumn
                      >
                        <ng-template uiTableHeader="status" let-column>
                          {{ column.header }} signal
                        </ng-template>
                        <ng-template uiTableCell="status" let-value>
                          <span
                            class="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          >
                            {{ value }}
                          </span>
                        </ng-template>
                      </ui-table>
                    </div>
                  }
                  @case ('data-view') {
                    <div class="w-full">
                      <ui-data-view
                        [items]="dataViewItems"
                        [layout]="dataViewLayout()"
                        (layoutChange)="dataViewLayout.set($event)"
                        showLayoutToggle
                        ariaLabel="Component catalog"
                      >
                        <ng-template uiDataViewItem let-item let-layout="layout">
                          <article
                            class="h-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                          >
                            <p class="font-semibold text-slate-900 dark:text-slate-100">
                              {{ item.name }}
                            </p>
                            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                              {{ item.description }} · {{ layout }}
                            </p>
                          </article>
                        </ng-template>
                      </ui-data-view>
                    </div>
                  }
                  @case ('tree') {
                    <div class="w-full max-w-md">
                      <ui-tree
                        [nodes]="treeNodes"
                        [expanded]="treeExpanded()"
                        (expandedChange)="treeExpanded.set($event)"
                        [selected]="treeSelected()"
                        (selectedChange)="treeSelected.set($event)"
                        ariaLabel="Documentation hierarchy"
                      />
                    </div>
                  }
                  @case ('tree-table') {
                    <div class="w-full overflow-x-auto">
                      <ui-tree-table
                        [columns]="treeTableColumns"
                        [nodes]="treeTableNodes"
                        [expanded]="treeTableExpanded()"
                        (expandedChange)="treeTableExpanded.set($event)"
                        [selected]="treeTableSelected()"
                        (selectedChange)="treeTableSelected.set($event)"
                        caption="Component package hierarchy"
                      />
                    </div>
                  }
                  @case ('file-upload') {
                    <div class="w-full max-w-xl">
                      <ui-file-upload
                        [files]="uploadFiles()"
                        (filesChange)="uploadFiles.set($event)"
                        accept=".png,.jpg,.pdf"
                        [maxFiles]="4"
                        [maxFileSize]="5000000"
                        helperText="PNG, JPG, or PDF up to 5 MB"
                        ariaLabel="Release asset upload"
                      />
                    </div>
                  }
                  @case ('command-palette') {
                    <div class="grid w-full max-w-xl gap-3">
                      <button
                        type="button"
                        class="flex min-h-12 w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-4 text-left text-sm font-medium text-slate-700 shadow-sm hover:border-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-600 dark:focus-visible:ring-blue-400"
                        (click)="commandPaletteOpen.set(true)"
                      >
                        <span>Search commands</span>
                        <kbd
                          class="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
                        >
                          Ctrl K
                        </kbd>
                      </button>
                      <p class="text-sm text-slate-500 dark:text-slate-400" aria-live="polite">
                        {{ selectedCommand() || 'Choose a project command.' }}
                      </p>
                      <ui-command-palette
                        [commands]="docsCommands"
                        [open]="commandPaletteOpen()"
                        (openChange)="commandPaletteOpen.set($event)"
                        [query]="commandQuery()"
                        (queryChange)="commandQuery.set($event)"
                        (commandSelected)="selectedCommand.set($event.command.label)"
                        ariaLabel="Documentation commands"
                      />
                    </div>
                  }
                  @case ('overlay') {
                    <div class="flex w-full max-w-xl items-center justify-center py-12">
                      <ui-overlay
                        [open]="advancedOverlayOpen()"
                        (openChange)="advancedOverlayOpen.set($event)"
                        [placements]="['bottom', 'top']"
                        alignment="center"
                        initialFocus="first"
                        ariaLabel="Release actions"
                      >
                        <button
                          uiOverlayTrigger
                          type="button"
                          class="min-h-11 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950"
                        >
                          Open connected overlay
                        </button>
                        <div uiOverlayContent class="grid min-w-64 gap-3">
                          <div>
                            <p class="font-semibold">Release actions</p>
                            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                              Positioned by the optional CDK integration.
                            </p>
                          </div>
                          <button
                            type="button"
                            class="min-h-10 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:bg-blue-500 dark:focus-visible:ring-blue-400"
                            (click)="advancedOverlayOpen.set(false)"
                          >
                            Run release check
                          </button>
                        </div>
                      </ui-overlay>
                    </div>
                  }
                  @case ('confirmation') {
                    <div class="grid w-full max-w-xl place-items-center gap-3 py-12">
                      <button
                        type="button"
                        class="min-h-11 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 dark:bg-red-500 dark:hover:bg-red-400 dark:focus-visible:ring-red-400 dark:focus-visible:ring-offset-slate-950"
                        (click)="requestReleaseDeletion()"
                      >
                        Delete release
                      </button>
                      <p class="text-sm text-slate-500 dark:text-slate-400" aria-live="polite">
                        {{ confirmationStatus() }}
                      </p>
                      <ui-confirmation-dialog />
                    </div>
                  }
                  @case ('table-virtual-scroll') {
                    <div class="w-full">
                      <ui-table-virtual-scroll
                        [rows]="virtualTableRows"
                        [itemSize]="52"
                        height="18rem"
                        ariaLabel="Virtualized release records"
                      >
                        <ng-template uiTableVirtualRow let-row let-index="index">
                          <div
                            class="grid h-full grid-cols-[5rem_1fr_auto] items-center gap-3 px-4 text-sm"
                          >
                            <span class="font-mono text-xs text-slate-500">#{{ index + 1 }}</span>
                            <span class="font-medium text-slate-900 dark:text-slate-100">
                              {{ row.name }}
                            </span>
                            <span class="text-slate-500 dark:text-slate-400">
                              {{ row.status }}
                            </span>
                          </div>
                        </ng-template>
                      </ui-table-virtual-scroll>
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
                            class="rounded bg-white p-4 text-sm text-slate-600 dark:bg-slate-950 dark:text-slate-300"
                          >
                            Overview panel content stays associated with the selected tab.
                          </p>
                        } @else {
                          <p
                            class="rounded bg-white p-4 text-sm text-slate-600 dark:bg-slate-950 dark:text-slate-300"
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
                      <p class="text-sm text-slate-600 dark:text-slate-300">
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
                  @case ('breadcrumb') {
                    <div class="w-full max-w-3xl">
                      <ui-breadcrumb
                        [items]="docsBreadcrumbItems"
                        [maxItems]="4"
                        ariaLabel="Component documentation location"
                      />
                    </div>
                  }
                  @case ('stepper') {
                    <div class="w-full max-w-3xl">
                      <ui-stepper
                        [steps]="docsStepperItems"
                        [active]="docsActiveStep()"
                        (activeChange)="docsActiveStep.set($event)"
                        ariaLabel="Release workflow"
                      >
                        <div
                          class="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                        >
                          Current panel: {{ docsActiveStep() }}
                        </div>
                      </ui-stepper>
                    </div>
                  }
                  @case ('paginator') {
                    <div class="w-full max-w-3xl">
                      <ui-paginator
                        [page]="docsPage()"
                        (pageChange)="docsPage.set($event)"
                        [pageSize]="docsPageSize()"
                        (pageSizeChange)="docsPageSize.set($event)"
                        [totalItems]="128"
                        [pageSizeOptions]="[10, 25, 50]"
                      />
                    </div>
                  }
                  @case ('chip') {
                    <div class="flex max-w-lg flex-wrap items-center justify-center gap-3">
                      <ui-chip variant="primary">Angular</ui-chip>
                      <ui-chip selectable [selected]="true">Selected</ui-chip>
                      <ui-chip removable removeAriaLabel="Remove TypeScript filter"
                        >TypeScript</ui-chip
                      >
                      <ui-chip selectable removable disabled>Disabled</ui-chip>
                    </div>
                  }
                  @case ('divider') {
                    <div class="grid w-full max-w-lg gap-6">
                      <p>Account settings</p>
                      <ui-divider />
                      <p>Notification preferences</p>
                      <ui-divider label="Advanced" [decorative]="false" />
                      <p>Developer settings</p>
                    </div>
                  }
                  @case ('menu') {
                    <div class="min-h-64 w-full max-w-sm text-center">
                      <ui-menu
                        [items]="docsMenuItems"
                        ariaLabel="Component actions"
                        align="end"
                        (itemSelected)="lastMenuAction.set($event.item.label)"
                      >
                        <ui-button uiMenuTrigger variant="outline">More actions</ui-button>
                      </ui-menu>
                      @if (lastMenuAction(); as action) {
                        <p class="mt-3 text-sm text-slate-600 dark:text-slate-300">
                          Selected: {{ action }}
                        </p>
                      }
                    </div>
                  }
                  @case ('drawer') {
                    <div class="grid justify-items-center gap-3">
                      <ui-button (click)="drawerOpen.set(true)">Open filter drawer</ui-button>
                      <span class="text-xs text-slate-500 dark:text-slate-400">
                        Opens a focus-trapped panel from the right edge.
                      </span>
                    </div>
                    <ui-drawer
                      [open]="drawerOpen()"
                      (openChange)="drawerOpen.set($event)"
                      titleId="docs-drawer-title"
                      descriptionId="docs-drawer-description"
                    >
                      <span uiDrawerHeader id="docs-drawer-title">Filter components</span>
                      <p id="docs-drawer-description">Choose which release states to display.</p>
                      <div class="mt-4 grid gap-3">
                        <ui-checkbox label="Ready" />
                        <ui-checkbox label="In progress" />
                      </div>
                      <ui-button uiDrawerFooter variant="outline" (click)="drawerOpen.set(false)">
                        Cancel
                      </ui-button>
                      <ui-button uiDrawerFooter (click)="drawerOpen.set(false)">Apply</ui-button>
                    </ui-drawer>
                  }
                  @case ('popover') {
                    <ui-popover titleId="docs-popover-title" position="bottom">
                      <button
                        uiPopoverTrigger
                        type="button"
                        class="rounded-[var(--ui-control-radius,0.625rem)] bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950"
                      >
                        Open account actions
                      </button>
                      <div uiPopoverContent class="grid min-w-56 gap-3">
                        <div>
                          <h2 id="docs-popover-title" class="font-semibold">Account actions</h2>
                          <p class="mt-1 text-slate-600 dark:text-slate-300">
                            Manage your current session.
                          </p>
                        </div>
                        <button
                          type="button"
                          class="rounded-md border border-slate-300 px-3 py-2 text-left font-medium hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:hover:bg-slate-900"
                        >
                          Sign out
                        </button>
                      </div>
                    </ui-popover>
                  }
                  @case ('tooltip') {
                    <button
                      type="button"
                      class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      uiTooltip="Refresh dashboard data"
                      tooltipPosition="bottom"
                      [tooltipShowDelay]="100"
                    >
                      Hover or focus for details
                    </button>
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
                      <span class="text-sm text-slate-600 dark:text-slate-300"
                        >Loading invoices...</span
                      >
                    </div>
                  }
                  @default {
                    <ui-badge variant="info">Preview ready</ui-badge>
                  }
                }
              </div>
            </app-docs-preview-canvas>
          }
        </section>

        <section
          id="guide"
          class="grid gap-4 border-t border-blue-200 py-7 dark:border-blue-950/70"
        >
          <div>
            <h2 class="text-lg font-bold text-slate-950 dark:text-slate-50">Production guidance</h2>
            <p class="mt-1.5 max-w-2xl text-sm leading-5 text-slate-600 dark:text-slate-400">
              Use these notes to decide when the component belongs in a product workflow and what to
              verify before shipping.
            </p>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            @for (card of guidanceCards(); track card.title) {
              <section
                class="rounded border border-blue-200 bg-white p-4 dark:border-blue-950 dark:bg-slate-950"
              >
                <h3 class="text-base font-bold text-slate-950 dark:text-slate-50">
                  {{ card.title }}
                </h3>
                <p class="mt-1.5 text-sm leading-5 text-slate-700 dark:text-slate-300">
                  {{ card.body }}
                </p>
              </section>
            }
          </div>
        </section>

        @if (examples().length) {
          <section id="examples" class="border-t border-blue-200 py-7 dark:border-blue-950/70">
            <h2 class="text-lg font-bold text-slate-950 dark:text-slate-50">Examples</h2>
            <div class="mt-4 grid gap-4">
              @for (example of examples(); track example.title) {
                <section
                  class="grid gap-3 rounded border border-blue-200 bg-white p-4 dark:border-blue-950 dark:bg-slate-950"
                >
                  <div>
                    <h3 class="text-base font-bold text-slate-950 dark:text-slate-50">
                      {{ example.title }}
                    </h3>
                    <p class="mt-1.5 text-sm leading-5 text-slate-600 dark:text-slate-400">
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

        <section id="api" class="border-t border-blue-200 py-7 dark:border-blue-950/70">
          <div class="mb-4">
            <h2 class="text-lg font-bold text-slate-950 dark:text-slate-50">API Reference</h2>
            <p class="mt-1.5 max-w-2xl text-sm leading-5 text-slate-600 dark:text-slate-400">
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
          class="grid gap-4 border-t border-blue-200 py-7 dark:border-blue-950/70 md:grid-cols-2"
        >
          <div class="rounded bg-blue-100 p-5 dark:bg-blue-950/60">
            <h2 class="text-lg font-bold text-slate-950 dark:text-slate-50">
              Accessibility matters
            </h2>
            <ul class="mt-3 grid gap-2 text-sm leading-5 text-slate-800 dark:text-slate-200">
              @for (item of accessibilityNotes(); track item) {
                <li>{{ item }}</li>
              }
            </ul>
          </div>
          <div
            class="rounded border border-blue-200 bg-slate-200 p-5 dark:border-blue-950 dark:bg-slate-900"
          >
            <h2 class="text-lg font-bold text-slate-950 dark:text-slate-50">Fast to verify</h2>
            <ul class="mt-3 grid gap-2 text-sm leading-5 text-slate-700 dark:text-slate-300">
              @for (item of testingNotes(); track item) {
                <li>{{ item }}</li>
              }
            </ul>
          </div>
        </section>

        <nav
          class="mt-3 grid gap-3 border-t border-blue-200 pt-6 dark:border-blue-950/70 sm:grid-cols-2"
          aria-label="Component pagination"
        >
          @if (previousDoc(); as previous) {
            <a
              [routerLink]="['/components', previous.slug]"
              class="rounded border border-blue-200 bg-white p-4 text-sm transition hover:bg-blue-50 dark:border-blue-950 dark:bg-slate-950 dark:hover:bg-blue-950/30"
            >
              <span class="text-slate-500">Previous</span>
              <strong class="mt-1 block text-base text-blue-800 dark:text-blue-200">{{
                previous.name
              }}</strong>
            </a>
          } @else {
            <span></span>
          }
          @if (nextDoc(); as next) {
            <a
              [routerLink]="['/components', next.slug]"
              class="rounded border border-blue-200 bg-white p-4 text-right text-sm transition hover:bg-blue-50 dark:border-blue-950 dark:bg-slate-950 dark:hover:bg-blue-950/30"
            >
              <span class="text-slate-500">Next</span>
              <strong class="mt-1 block text-base text-blue-800 dark:text-blue-200">{{
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
            <ui-button variant="outline" (click)="modalOpen.set(false)">Cancel</ui-button>
            <ui-button (click)="modalOpen.set(false)">Publish</ui-button>
          </div>
        </ui-modal>
      </article>
    } @else {
      <section class="mx-auto max-w-3xl py-14 text-center">
        <p class="text-sm font-semibold uppercase text-blue-800 dark:text-blue-300">
          Component not found
        </p>
        <h1 class="mt-3 text-2xl font-bold leading-8 text-slate-950 dark:text-slate-50">
          No matching docs page
        </h1>
        <p class="mt-3 text-slate-600 dark:text-slate-400">
          Choose a component from the documentation navigation.
        </p>
        <a
          routerLink="/components/button"
          class="mt-6 inline-block rounded bg-blue-700 px-5 py-3 text-sm font-semibold text-white"
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
  private readonly confirmations = inject(UiConfirmationService);

  protected readonly email = new FormControl('developer@example.com');
  protected readonly releaseNotes = new FormControl('Added form components and docs polish.');
  protected readonly newsletter = new FormControl(true);
  protected readonly contactPreference = new FormControl('email');
  protected readonly notifications = new FormControl(false);
  protected readonly docsFramework = new FormControl('angular');
  protected readonly docsReleaseDate = new FormControl('2026-07-23');
  protected readonly plan = new FormControl('pro');
  protected readonly buttonUsageExamples = BUTTON_USAGE_EXAMPLES;
  protected readonly buttonAppearances = BUTTON_APPEARANCES;
  protected readonly buttonIntents = BUTTON_INTENTS;
  protected readonly buttonPressCount = signal(0);
  protected readonly buttonSubmitCount = signal(0);
  protected readonly buttonFocused = signal(false);
  protected readonly copiedImportStatement = signal(false);
  protected readonly modalOpen = signal(false);
  protected readonly drawerOpen = signal(false);
  protected readonly lastMenuAction = signal('');
  protected readonly docsMenuItems: readonly UiMenuItem[] = [
    { value: 'edit', label: 'Edit component' },
    { value: 'duplicate', label: 'Duplicate' },
    { value: 'archive', label: 'Archive', separatorBefore: true },
    { value: 'delete', label: 'Delete', danger: true },
  ];
  protected readonly docsBreadcrumbItems: readonly UiBreadcrumbItem[] = [
    { label: 'Documentation', href: '/docs' },
    { label: 'Components', href: '/docs/components' },
    { label: 'Navigation', href: '/docs/components' },
    { label: 'Breadcrumb' },
  ];
  protected readonly docsStepperItems: readonly UiStepItem[] = [
    { value: 'details', label: 'Details', description: 'Package metadata', completed: true },
    { value: 'review', label: 'Review', description: 'Quality checks' },
    { value: 'publish', label: 'Publish', description: 'Release to npm' },
  ];
  protected readonly docsActiveStep = signal('review');
  protected readonly docsPage = signal(3);
  protected readonly docsPageSize = signal(10);
  protected readonly activeTab = signal('overview');
  protected readonly accordionActive = signal<readonly string[]>(['overview']);
  protected readonly selectedTableKeys = signal<readonly UiTableRowKey[]>([]);
  protected readonly dataViewLayout = signal<'grid' | 'list'>('grid');
  protected readonly treeExpanded = signal<readonly string[]>(['components']);
  protected readonly treeSelected = signal<string | null>('button');
  protected readonly treeTableExpanded = signal<readonly string[]>(['components']);
  protected readonly treeTableSelected = signal<string | null>('button');
  protected readonly uploadFiles = signal<readonly File[]>([]);
  protected readonly commandPaletteOpen = signal(false);
  protected readonly commandQuery = signal('');
  protected readonly selectedCommand = signal('');
  protected readonly advancedOverlayOpen = signal(false);
  protected readonly confirmationStatus = signal('No destructive action requested.');
  protected readonly docsCommands: readonly UiCommand[] = [
    {
      value: 'new-component',
      label: 'Create component',
      description: 'Scaffold a standalone library entry point',
      keywords: ['add', 'generate'],
      shortcut: 'C',
      group: 'Project',
    },
    {
      value: 'run-release-check',
      label: 'Run release check',
      description: 'Verify tests, builds, package, and consumer',
      keywords: ['test', 'build', 'verify'],
      shortcut: 'R',
      group: 'Quality',
    },
    {
      value: 'open-tokens',
      label: 'Open design tokens',
      description: 'Review theme foundations and semantic modes',
      group: 'Navigation',
    },
    {
      value: 'publish',
      label: 'Publish package',
      description: 'Unavailable until every release check passes',
      group: 'Release',
      disabled: true,
    },
  ];

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

  protected readonly docsComboboxOptions: readonly UiComboboxOption[] = [
    { label: 'Angular', value: 'angular', description: 'Full application framework' },
    { label: 'React', value: 'react', description: 'UI rendering library' },
    { label: 'Vue', value: 'vue', description: 'Progressive framework' },
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
    { key: 'component', header: 'Component', sortable: true, sticky: 'start' },
    { key: 'category', header: 'Category' },
    { key: 'status', header: 'Status' },
    { key: 'owner', header: 'Owner' },
  ];

  protected readonly tableRows: readonly UiTableRow[] = [
    {
      id: 'button',
      component: 'Button',
      category: 'Foundation',
      status: 'Ready',
      owner: 'Design system',
    },
    { id: 'input', component: 'Input', category: 'Forms', status: 'Ready', owner: 'Forms' },
    {
      id: 'modal',
      component: 'Modal',
      category: 'Overlay',
      status: 'A11y review',
      owner: 'Platform',
    },
  ];
  protected readonly virtualTableRows = Array.from({ length: 10_000 }, (_, index) => ({
    id: index + 1,
    name: `Release record ${index + 1}`,
    status: index % 7 === 0 ? 'Review' : 'Ready',
  }));
  protected readonly dataViewItems = [
    { id: 'button', name: 'Button', description: 'Actions and intent' },
    { id: 'input', name: 'Input', description: 'Text entry and validation' },
    { id: 'table', name: 'Table', description: 'Structured enterprise data' },
  ];
  protected readonly treeNodes: readonly UiTreeNode[] = [
    {
      value: 'components',
      label: 'Components',
      description: 'Production UI primitives',
      children: [
        { value: 'button', label: 'Button' },
        { value: 'input', label: 'Input' },
        { value: 'table', label: 'Table' },
      ],
    },
    {
      value: 'foundations',
      label: 'Foundations',
      children: [
        { value: 'color', label: 'Color' },
        { value: 'typography', label: 'Typography' },
      ],
    },
  ];
  protected readonly treeTableColumns: readonly UiTreeTableColumn[] = [
    { key: 'name', header: 'Package', sortable: true },
    { key: 'status', header: 'Status' },
    { key: 'owner', header: 'Owner' },
  ];
  protected readonly treeTableNodes: readonly UiTreeTableNode[] = [
    {
      value: 'components',
      data: { name: 'Components', status: 'Ready', owner: 'Design system' },
      children: [
        {
          value: 'button',
          data: { name: 'Button', status: 'Ready', owner: 'Foundations' },
        },
        {
          value: 'table',
          data: { name: 'Table', status: 'Ready', owner: 'Data' },
        },
      ],
    },
    {
      value: 'utilities',
      data: { name: 'Utilities', status: 'Review', owner: 'Platform' },
    },
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
      { label: 'Package', value: getComponentImportPath(currentDoc.slug) },
    ];
  });
  protected readonly importStatement = computed(() => {
    const currentDoc = this.doc();

    if (!currentDoc) {
      return '';
    }

    return `import { ${currentDoc.importName} } from '${getComponentImportPath(currentDoc.slug)}';`;
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
  protected readonly accessibilityNotes = computed<readonly string[]>(() => {
    const notes = this.details()?.accessibility ?? ['Preserve native semantics whenever possible.'];
    return this.slug() === 'button' ? notes : notes.slice(0, 3);
  });
  protected readonly testingNotes = computed<readonly string[]>(() => {
    const notes = this.details()?.testing ?? [
      'Test public inputs, outputs, keyboard behavior, and state classes.',
    ];
    return this.slug() === 'button' ? notes : notes.slice(0, 3);
  });

  protected showToast(): void {
    this.toast.success('Package saved', 'The toast service is ready for application feedback.');
  }

  protected requestReleaseDeletion(): void {
    void this.confirmations
      .confirm({
        title: 'Delete release 1.0.0?',
        message: 'This removes the release record and cannot be undone.',
        confirmLabel: 'Delete release',
        intent: 'danger',
        requireText: 'DELETE',
        requireTextLabel: 'Type DELETE to continue',
      })
      .then((result) => {
        this.confirmationStatus.set(
          result.confirmed ? 'Release deletion confirmed.' : `Cancelled by ${result.reason}.`,
        );
      });
  }

  protected recordButtonPress(): void {
    this.buttonPressCount.update((count) => count + 1);
  }

  protected recordButtonSubmit(event: Event): void {
    event.preventDefault();
    this.buttonSubmitCount.update((count) => count + 1);
  }

  protected async copyImportStatement(): Promise<void> {
    await navigator.clipboard.writeText(this.importStatement());
    this.copiedImportStatement.set(true);
    window.setTimeout(() => {
      if (this.copiedImportStatement()) {
        this.copiedImportStatement.set(false);
      }
    }, 1500);
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
