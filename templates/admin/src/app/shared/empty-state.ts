import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroInboxStack } from '@ng-icons/heroicons/outline';

/** Centered message for empty lists. Project actions as content. */
@Component({
  selector: 'app-empty-state',
  imports: [NgIcon],
  viewProviders: [provideIcons({ heroInboxStack })],
  template: `
    <div class="flex flex-col items-center px-6 py-14 text-center">
      <span
        class="grid size-12 place-items-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
      >
        <ng-icon [name]="icon()" size="22" aria-hidden="true" />
      </span>
      <h2 class="mt-4 text-sm font-semibold text-slate-900 dark:text-white">{{ title() }}</h2>
      <p class="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">{{ message() }}</p>
      <div class="mt-5 flex gap-2"><ng-content /></div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyState {
  readonly title = input.required<string>();
  readonly message = input('');
  readonly icon = input('heroInboxStack');
}
