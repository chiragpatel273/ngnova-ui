import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface Crumb {
  readonly label: string;
  readonly link?: string;
}

/** Page title block with breadcrumbs and an actions slot (`<div actions>`). */
@Component({
  selector: 'app-page-header',
  imports: [RouterLink],
  template: `
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div class="min-w-0">
        @if (crumbs().length) {
          <nav aria-label="Breadcrumb" class="mb-2">
            <ol
              class="flex flex-wrap items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400"
            >
              @for (crumb of crumbs(); track crumb.label; let last = $last) {
                <li class="flex items-center gap-1.5">
                  @if (crumb.link && !last) {
                    <a
                      [routerLink]="crumb.link"
                      class="rounded hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:hover:text-white"
                      >{{ crumb.label }}</a
                    >
                    <span aria-hidden="true" class="text-slate-300 dark:text-slate-600">/</span>
                  } @else {
                    <span
                      [attr.aria-current]="last ? 'page' : null"
                      class="text-slate-700 dark:text-slate-200"
                      >{{ crumb.label }}</span
                    >
                  }
                </li>
              }
            </ol>
          </nav>
        }
        <h1 class="truncate text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
          {{ title() }}
        </h1>
        @if (description()) {
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">{{ description() }}</p>
        }
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <ng-content select="[actions]" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeader {
  readonly title = input.required<string>();
  readonly description = input('');
  readonly crumbs = input<readonly Crumb[]>([]);
}
