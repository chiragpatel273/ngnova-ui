import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
  numberAttribute,
  output,
} from '@angular/core';

export interface UiAccordionItem {
  readonly value: string;
  readonly title: string;
  readonly content: string;
  readonly disabled?: boolean;
}

let nextAccordionId = 0;

@Component({
  selector: 'ui-accordion',
  standalone: true,
  template: `
    <div
      class="divide-y divide-slate-200 overflow-hidden rounded-[var(--ui-surface-radius,0.75rem)] border border-slate-200 dark:divide-slate-800 dark:border-slate-800"
    >
      @for (item of items(); track item.value) {
        <section>
          <div role="heading" [attr.aria-level]="resolvedHeadingLevel()">
            <button
              type="button"
              [id]="buttonId(item)"
              [disabled]="item.disabled"
              [attr.aria-expanded]="isOpen(item)"
              [attr.aria-controls]="panelId(item)"
              class="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium text-slate-900 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-100 dark:hover:bg-slate-900 dark:focus-visible:ring-blue-400"
              (click)="toggle(item)"
            >
              <span>{{ item.title }}</span>
              <svg
                class="size-5 shrink-0 fill-none stroke-current transition-transform duration-200"
                [class.rotate-180]="isOpen(item)"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          </div>
          @if (isOpen(item)) {
            <div
              [id]="panelId(item)"
              role="region"
              [attr.aria-labelledby]="buttonId(item)"
              class="px-4 pb-4 text-sm leading-6 text-slate-600 dark:text-slate-300"
            >
              {{ item.content }}
            </div>
          }
        </section>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiAccordionComponent {
  readonly id = input(`ui-accordion-${++nextAccordionId}`);
  readonly items = input<readonly UiAccordionItem[]>([]);
  readonly active = input<readonly string[]>([]);
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly headingLevel = input(3, { transform: numberAttribute });
  readonly activeChange = output<readonly string[]>();

  private readonly activeSet = computed(() => new Set(this.active()));
  protected readonly resolvedHeadingLevel = computed(() =>
    Math.min(6, Math.max(1, Math.trunc(this.headingLevel()) || 3)),
  );

  protected isOpen(item: UiAccordionItem): boolean {
    return this.activeSet().has(item.value);
  }

  protected buttonId(item: UiAccordionItem): string {
    return `${this.id()}-${this.toDomId(item.value)}-button`;
  }

  protected panelId(item: UiAccordionItem): string {
    return `${this.id()}-${this.toDomId(item.value)}-panel`;
  }

  protected toggle(item: UiAccordionItem): void {
    if (item.disabled) {
      return;
    }

    const current = this.active();
    if (this.isOpen(item)) {
      this.activeChange.emit(current.filter((value) => value !== item.value));
      return;
    }

    this.activeChange.emit(this.multiple() ? [...current, item.value] : [item.value]);
  }

  private toDomId(value: string): string {
    return (
      value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'item'
    );
  }
}
