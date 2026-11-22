import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiButtonDirective } from '@ngnova/ui/button';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink, UiButtonDirective],
  template: `
    <section class="mx-auto flex max-w-md flex-col items-center py-24 text-center">
      <p class="text-sm font-semibold text-blue-600 dark:text-blue-400">404</p>
      <h1 class="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
        Page not found
      </h1>
      <p class="mt-3 text-sm text-slate-600 dark:text-slate-400">
        The page you are looking for does not exist or has moved.
      </p>
      <a uiButton routerLink="/" class="mt-6">Back to overview</a>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPage {}
