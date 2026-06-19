import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

import type { ComponentDoc } from './docs-data';
import { DocsCodeBlockComponent } from './docs-code-block';

type PreviewDevice = 'desktop' | 'tablet' | 'mobile';

@Component({
  selector: 'app-card-doc-playground',
  standalone: true,
  imports: [DocsCodeBlockComponent],
  template: `
    <article class="mx-auto max-w-[70rem] pb-20">
      <header class="pt-6">
        <p class="text-base text-zinc-900 dark:text-zinc-200">
          Components / <strong>{{ doc().name }} Component</strong>
        </p>
        <h1 class="mt-4 text-4xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-50">
          {{ doc().name }} Component
        </h1>
        <p class="mt-5 max-w-4xl text-xl leading-9 text-red-950/85 dark:text-red-100/80">
          The Card component is a flexible container for grouping content like text, images, and
          data visualizations. Use this playground to customize visual parameters and export the
          resulting Angular template.
        </p>
      </header>

      <section class="mt-12 grid gap-8 lg:grid-cols-[17.5rem_minmax(0,1fr)]">
        <aside
          class="h-max rounded border border-red-200 bg-white p-6 dark:border-red-950 dark:bg-zinc-950"
          aria-label="Card properties"
        >
          <div class="flex items-center gap-3 border-b border-red-200 pb-5 dark:border-red-950">
            <span class="font-mono text-xl text-red-800 dark:text-red-200" aria-hidden="true"
              >::</span
            >
            <h2 class="font-semibold text-zinc-950 dark:text-zinc-50">Properties</h2>
          </div>

          <div class="mt-7">
            <p class="text-sm uppercase tracking-wide text-red-950/80 dark:text-red-100/80">
              Appearance
            </p>
            <div class="mt-5 grid gap-4">
              @for (control of toggleControls; track control.key) {
                <div class="flex items-center justify-between gap-4">
                  <span class="text-base text-zinc-950 dark:text-zinc-100">{{
                    control.label
                  }}</span>
                  <button
                    type="button"
                    role="switch"
                    [attr.aria-checked]="control.value()"
                    [class]="switchClasses(control.value())"
                    (click)="control.toggle()"
                  >
                    <span [class]="thumbClasses(control.value())"></span>
                  </button>
                </div>
              }
            </div>
          </div>

          <div class="mt-8">
            <p class="text-sm uppercase tracking-wide text-red-950/80 dark:text-red-100/80">
              Spacing & Radius
            </p>
            <label class="mt-5 grid gap-3 text-base text-zinc-950 dark:text-zinc-100">
              <span class="flex items-center justify-between">
                Padding
                <strong class="text-sm text-red-800 dark:text-red-200">{{ paddingPx() }}px</strong>
              </span>
              <input
                type="range"
                min="0"
                max="32"
                step="4"
                [value]="paddingPx()"
                (input)="updatePadding($event)"
                class="accent-red-800"
              />
            </label>
            <label class="mt-5 grid gap-3 text-base text-zinc-950 dark:text-zinc-100">
              <span class="flex items-center justify-between">
                Corner Radius
                <strong class="text-sm text-red-800 dark:text-red-200">{{ radiusPx() }}px</strong>
              </span>
              <input
                type="range"
                min="0"
                max="24"
                step="2"
                [value]="radiusPx()"
                (input)="updateRadius($event)"
                class="accent-red-800"
              />
            </label>
          </div>

          <button
            type="button"
            class="mt-8 w-full rounded bg-red-800 px-4 py-4 text-base font-semibold text-white transition hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2 dark:bg-red-700 dark:hover:bg-red-600"
            (click)="resetAll()"
          >
            Reset All
          </button>
        </aside>

        <div class="grid gap-8">
          <section
            class="overflow-hidden rounded border border-red-200 bg-white dark:border-red-950 dark:bg-zinc-950"
            aria-label="Card preview"
          >
            <div
              class="flex items-center justify-between border-b border-red-200 px-6 py-5 dark:border-red-950"
            >
              <h2 class="font-semibold text-zinc-950 dark:text-zinc-50">Preview</h2>
              <div class="flex items-center gap-3" aria-label="Preview device">
                @for (device of devices; track device.value) {
                  <button
                    type="button"
                    [class]="deviceButtonClasses(device.value)"
                    (click)="previewDevice.set(device.value)"
                    [attr.aria-pressed]="previewDevice() === device.value"
                  >
                    {{ device.label }}
                  </button>
                }
              </div>
            </div>

            <div
              class="bg-[radial-gradient(#f1caca_1px,transparent_1px)] bg-[length:18px_18px] p-8 sm:p-12"
            >
              <div [class]="previewShellClasses()">
                <section [class]="previewCardClasses()" [style.border-radius.px]="radiusPx()">
                  @if (mediaHeader()) {
                    <div class="relative overflow-hidden" [style.border-radius.px]="radiusPx()">
                      <img
                        src="/card-system-health.svg"
                        alt="System health analytics bars"
                        class="h-48 w-full object-cover"
                      />
                      <h3 class="absolute bottom-7 left-6 text-2xl font-bold text-white">
                        System Health
                      </h3>
                    </div>
                  }

                  <div class="relative bg-white dark:bg-zinc-950" [style.padding.px]="paddingPx()">
                    @if (accentMarker()) {
                      <span
                        class="absolute bottom-0 left-0 top-0 w-1.5 bg-red-800"
                        aria-hidden="true"
                      ></span>
                    }
                    <div class="flex items-center justify-between gap-4">
                      <span
                        class="bg-zinc-100 px-2 py-1 text-sm text-red-950 dark:bg-zinc-900 dark:text-red-100"
                      >
                        Live Metrics
                      </span>
                      <span class="text-sm font-semibold text-red-800 dark:text-red-200">
                        Active
                      </span>
                    </div>
                    <p class="mt-5 text-base leading-7 text-red-950/90 dark:text-red-100/80">
                      Overall server cluster performance is operating within optimal parameters.
                      Network latency decreased by 12% in the last session.
                    </p>
                    <div class="mt-7 border-t border-red-200 pt-5 dark:border-red-950">
                      <div class="flex gap-3">
                        <button
                          type="button"
                          class="rounded bg-red-800 px-5 py-3 text-sm font-semibold text-white"
                        >
                          Details
                        </button>
                        <button
                          type="button"
                          class="rounded px-5 py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-200"
                        >
                          Analytics
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </section>

          <app-docs-code-block
            [code]="cardCode()"
            filename="component.html"
            language="Angular template"
          />
        </div>
      </section>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardDocPlaygroundComponent {
  readonly doc = input.required<ComponentDoc>();

  protected readonly border = signal(true);
  protected readonly shadow = signal(false);
  protected readonly mediaHeader = signal(true);
  protected readonly accentMarker = signal(true);
  protected readonly paddingPx = signal(16);
  protected readonly radiusPx = signal(4);
  protected readonly previewDevice = signal<PreviewDevice>('desktop');

  protected readonly devices: readonly { readonly label: string; readonly value: PreviewDevice }[] =
    [
      { label: 'Desktop', value: 'desktop' },
      { label: 'Tablet', value: 'tablet' },
      { label: 'Mobile', value: 'mobile' },
    ];

  protected readonly toggleControls = [
    {
      key: 'border',
      label: 'Border',
      value: this.border,
      toggle: (): void => this.border.update((value) => !value),
    },
    {
      key: 'shadow',
      label: 'Shadow',
      value: this.shadow,
      toggle: (): void => this.shadow.update((value) => !value),
    },
    {
      key: 'media',
      label: 'Media Header',
      value: this.mediaHeader,
      toggle: (): void => this.mediaHeader.update((value) => !value),
    },
    {
      key: 'accent',
      label: 'Accent Marker',
      value: this.accentMarker,
      toggle: (): void => this.accentMarker.update((value) => !value),
    },
  ] as const;

  protected readonly cardCode = computed(() => {
    const variant = this.shadow() ? 'elevated' : 'outline';
    const padding = this.paddingToken();
    const media = this.mediaHeader()
      ? `\n  <div uiCardHeader>\n    <img src="/card-system-health.svg" alt="System health analytics bars" />\n  </div>`
      : '';
    const accentClass = this.accentMarker() ? ' class="border-l-4 border-red-800"' : '';

    return `<ui-card variant="${variant}" padding="${padding}"${accentClass}>${media}
  <h3>System Health</h3>
  <p>
    Overall server cluster performance is operating within optimal parameters.
    Network latency decreased by 12% in the last session.
  </p>
  <div uiCardFooter>
    <ui-button size="sm">Details</ui-button>
    <ui-button variant="ghost" size="sm">Analytics</ui-button>
  </div>
</ui-card>`;
  });

  protected previewShellClasses(): string {
    const width: Record<PreviewDevice, string> = {
      desktop: 'max-w-[28rem]',
      tablet: 'max-w-[22rem]',
      mobile: 'max-w-[17rem]',
    };

    return `mx-auto ${width[this.previewDevice()]}`;
  }

  protected previewCardClasses(): string {
    const classes = ['overflow-hidden bg-white dark:bg-zinc-950'];

    if (this.border()) {
      classes.push('border border-red-200 dark:border-red-950');
    }

    if (this.shadow()) {
      classes.push('shadow-xl shadow-zinc-300/70 dark:shadow-black/30');
    }

    return classes.join(' ');
  }

  protected switchClasses(checked: boolean): string {
    return [
      'relative h-6 w-11 rounded-full transition focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2',
      checked ? 'bg-red-800' : 'bg-zinc-200 dark:bg-zinc-800',
    ].join(' ');
  }

  protected thumbClasses(checked: boolean): string {
    return [
      'absolute top-1 size-4 rounded-full bg-white transition',
      checked ? 'left-6' : 'left-1',
    ].join(' ');
  }

  protected deviceButtonClasses(device: PreviewDevice): string {
    const active = this.previewDevice() === device;

    return [
      'rounded border px-3 py-1 text-xs font-semibold transition',
      active
        ? 'border-red-800 bg-red-800 text-white'
        : 'border-transparent text-red-950 hover:border-red-200 dark:text-red-100',
    ].join(' ');
  }

  protected updatePadding(event: Event): void {
    this.paddingPx.set(Number((event.target as HTMLInputElement).value));
  }

  protected updateRadius(event: Event): void {
    this.radiusPx.set(Number((event.target as HTMLInputElement).value));
  }

  protected resetAll(): void {
    this.border.set(true);
    this.shadow.set(false);
    this.mediaHeader.set(true);
    this.accentMarker.set(true);
    this.paddingPx.set(16);
    this.radiusPx.set(4);
    this.previewDevice.set('desktop');
  }

  private paddingToken(): 'none' | 'sm' | 'md' | 'lg' {
    const value = this.paddingPx();

    if (value === 0) {
      return 'none';
    }

    if (value <= 16) {
      return 'sm';
    }

    if (value <= 20) {
      return 'md';
    }

    return 'lg';
  }
}
