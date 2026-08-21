import {
  ChangeDetectionStrategy,
  Component,
  provideZonelessChangeDetection,
  signal,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { UiButtonComponent } from '@ngnova/ui/button';
import { UiCardComponent } from '@ngnova/ui/card';
import { UiInputComponent } from '@ngnova/ui/input';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UiButtonComponent, UiCardComponent, UiInputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main
      class="min-h-screen bg-slate-50 px-4 py-12 text-slate-950 transition-colors dark:bg-slate-950 dark:text-slate-50"
      [class.dark]="darkMode()"
    >
      <section class="mx-auto grid max-w-xl gap-6">
        <header class="flex items-start justify-between gap-4">
          <div>
            <p class="text-sm font-semibold text-blue-700 dark:text-blue-300">NgNova UI 1.0</p>
            <h1 class="mt-1 text-3xl font-bold tracking-tight">Your first NgNova screen</h1>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Angular 22, focused imports, Tailwind CSS v4, and no runtime theme provider.
            </p>
          </div>
          <ui-button variant="outline" size="sm" (pressed)="toggleTheme()">
            {{ darkMode() ? 'Light mode' : 'Dark mode' }}
          </ui-button>
        </header>

        <ui-card variant="elevated" ariaLabel="NgNova quick-start form">
          <div uiCardHeader>
            <h2 class="text-lg font-semibold text-slate-950 dark:text-white">Join the preview</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
              This workflow uses the published Button, Card, and Input entry points.
            </p>
          </div>

          <div class="grid gap-4">
            <ui-input
              label="Work email"
              type="email"
              autocomplete="email"
              placeholder="you@example.com"
              helperText="We will only use this address for the product preview."
              clearable
              (valueChange)="updateEmail($event)"
              (submitted)="submit()"
            />

            @if (submitted()) {
              <p
                class="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                role="status"
              >
                Thanks?your NgNova UI setup is working.
              </p>
            }
          </div>

          <div uiCardFooter class="flex justify-end gap-2">
            <ui-button [disabled]="!email().trim()" (pressed)="submit()">Continue</ui-button>
          </div>
        </ui-card>

        <p class="text-center text-xs text-slate-500 dark:text-slate-400">
          Explore all 40 components in the NgNova UI documentation.
        </p>
      </section>
    </main>
  `,
})
class AppComponent {
  protected readonly darkMode = signal(false);
  protected readonly email = signal('');
  protected readonly submitted = signal(false);

  protected toggleTheme(): void {
    this.darkMode.update((enabled) => !enabled);
  }

  protected updateEmail(value: string): void {
    this.email.set(value);
    this.submitted.set(false);
  }

  protected submit(): void {
    if (this.email().trim()) {
      this.submitted.set(true);
    }
  }
}

bootstrapApplication(AppComponent, {
  providers: [provideZonelessChangeDetection()],
}).catch((error: unknown) => console.error(error));
