import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { UiAlertComponent } from '@ngnova/ui/alert';
import { UiBadgeComponent } from '@ngnova/ui/badge';
import { UiButtonComponent } from '@ngnova/ui/button';
import { UiProgressBarComponent } from '@ngnova/ui/progress-bar';

@Component({
  selector: 'app-theme-playground',
  standalone: true,
  imports: [UiAlertComponent, UiBadgeComponent, UiButtonComponent, UiProgressBarComponent],
  template: `
    <section
      class="ui-theme overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-800"
      [attr.data-ui-theme]="mode()"
      [class.dark]="mode() === 'dark'"
      [style.--ui-color-primary]="primary()"
      [style.--ui-color-success]="success()"
    >
      <div
        class="flex flex-col gap-4 border-b border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p class="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
            Live token scope
          </p>
          <h2 class="mt-1 text-xl font-semibold text-slate-950 dark:text-white">
            Theme playground
          </h2>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Change semantic tokens without rebuilding components.
          </p>
        </div>
        <button
          type="button"
          class="h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          (click)="toggleMode()"
        >
          Preview {{ mode() === 'light' ? 'dark' : 'light' }} mode
        </button>
      </div>

      <div class="grid gap-6 bg-slate-50 p-5 dark:bg-slate-900 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <fieldset class="grid content-start gap-4">
          <legend class="text-sm font-semibold text-slate-950 dark:text-white">
            Semantic colors
          </legend>
          <label
            class="grid grid-cols-[1fr_auto] items-center gap-3 text-sm text-slate-700 dark:text-slate-200"
          >
            Primary
            <input
              type="color"
              class="size-10 cursor-pointer rounded border border-slate-300 bg-transparent p-1 dark:border-slate-700"
              [value]="primary()"
              (input)="setColor('primary', $event)"
            />
          </label>
          <label
            class="grid grid-cols-[1fr_auto] items-center gap-3 text-sm text-slate-700 dark:text-slate-200"
          >
            Success
            <input
              type="color"
              class="size-10 cursor-pointer rounded border border-slate-300 bg-transparent p-1 dark:border-slate-700"
              [value]="success()"
              (input)="setColor('success', $event)"
            />
          </label>
          <button
            type="button"
            class="justify-self-start text-sm font-medium text-blue-700 underline-offset-4 hover:underline dark:text-blue-300"
            (click)="reset()"
          >
            Reset defaults
          </button>
        </fieldset>

        <div class="grid content-start gap-5" aria-label="Theme component preview">
          <div class="flex flex-wrap items-center gap-3">
            <ui-button>Primary action</ui-button>
            <ui-button appearance="outline">Outline action</ui-button>
            <ui-badge variant="info">In review</ui-badge>
            <ui-badge variant="success">Healthy</ui-badge>
          </div>
          <ui-progress-bar [value]="68" label="Theme preview progress" />
          <ui-alert variant="success" title="Tokens applied">
            Semantic feedback follows the scoped success color family.
          </ui-alert>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemePlaygroundComponent {
  protected readonly mode = signal<'light' | 'dark'>('light');
  protected readonly primary = signal('#2563eb');
  protected readonly success = signal('#059669');

  protected toggleMode(): void {
    this.mode.update((mode) => (mode === 'light' ? 'dark' : 'light'));
  }

  protected setColor(token: 'primary' | 'success', event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    (token === 'primary' ? this.primary : this.success).set(value);
  }

  protected reset(): void {
    this.primary.set('#2563eb');
    this.success.set('#059669');
  }
}
