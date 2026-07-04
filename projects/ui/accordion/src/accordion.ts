import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
  output,
} from '@angular/core';

export interface UiAccordionItem {
  readonly value: string;
  readonly title: string;
  readonly content: string;
  readonly disabled?: boolean;
}

@Component({
  selector: 'ui-accordion',
  standalone: true,
  template: `
    <div
      class="divide-y divide-slate-200 overflow-hidden rounded-lg border border-slate-200 dark:divide-slate-800 dark:border-slate-800"
    >
      @for (item of items(); track item.value) {
        <section>
          <h3>
            <button
              type="button"
              [id]="buttonId(item)"
              [disabled]="item.disabled"
              [attr.aria-expanded]="isOpen(item)"
              [attr.aria-controls]="panelId(item)"
              class="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium text-slate-900 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-100 dark:hover:bg-slate-900"
              (click)="toggle(item)"
            >
              <span>{{ item.title }}</span>
              <span aria-hidden="true">{{ isOpen(item) ? '-' : '+' }}</span>
            </button>
          </h3>
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
  readonly id = input('ui-accordion');
  readonly items = input<readonly UiAccordionItem[]>([]);
  readonly active = input<readonly string[]>([]);
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly activeChange = output<readonly string[]>();

  private readonly activeSet = computed(() => new Set(this.active()));

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
