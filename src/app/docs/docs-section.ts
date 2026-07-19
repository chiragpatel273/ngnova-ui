import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';

@Component({
  selector: 'app-docs-section',
  standalone: true,
  template: `
    <section
      [attr.id]="sectionId()"
      class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950"
    >
      @if (!hideHeader()) {
        <div class="max-w-3xl">
          @if (kicker()) {
            <p class="text-xs font-semibold uppercase text-blue-800 dark:text-blue-300">
              {{ kicker() }}
            </p>
          }
          <h2 class="text-xl font-semibold text-slate-950 dark:text-slate-50">
            {{ title() }}
          </h2>
          @if (description()) {
            <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {{ description() }}
            </p>
          }
        </div>
      }
      <div [class.mt-5]="!hideHeader()">
        <ng-content />
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsSectionComponent {
  readonly sectionId = input('');
  readonly kicker = input('');
  readonly title = input.required<string>();
  readonly description = input('');
  readonly hideHeader = input(false, { transform: booleanAttribute });
}
