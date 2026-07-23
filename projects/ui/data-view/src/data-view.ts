import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  Input,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChild,
  inject,
  input,
  output,
} from '@angular/core';

export type UiDataViewLayout = 'grid' | 'list';
export type UiDataViewGap = 'sm' | 'md' | 'lg';
export type UiDataViewTrackBy<T> = (index: number, item: T) => unknown;

export interface UiDataViewItemContext<T = unknown> {
  readonly $implicit: T;
  readonly item: T;
  readonly index: number;
  readonly layout: UiDataViewLayout;
  readonly first: boolean;
  readonly last: boolean;
}

const GAP_CLASSES: Record<UiDataViewGap, string> = {
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
};

@Directive({
  selector: 'ng-template[uiDataViewItem]',
  standalone: true,
})
export class UiDataViewItemDirective<T = unknown> {
  @Input('uiDataViewItem') marker = '';
  readonly template = inject<TemplateRef<UiDataViewItemContext<T>>>(TemplateRef);
}

@Component({
  selector: 'ui-data-view',
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `
    <section [attr.aria-label]="ariaLabel()" [attr.aria-busy]="loading() ? 'true' : null">
      @if (showLayoutToggle()) {
        <div class="mb-4 flex justify-end">
          <div
            class="inline-flex rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-950"
            role="group"
            [attr.aria-label]="layoutToggleAriaLabel()"
          >
            <button
              type="button"
              [class]="layoutButtonClasses('grid')"
              [attr.aria-pressed]="layout() === 'grid'"
              (click)="requestLayout('grid')"
            >
              {{ gridLabel() }}
            </button>
            <button
              type="button"
              [class]="layoutButtonClasses('list')"
              [attr.aria-pressed]="layout() === 'list'"
              (click)="requestLayout('list')"
            >
              {{ listLabel() }}
            </button>
          </div>
        </div>
      }

      @if (loading()) {
        <div
          class="rounded-xl border border-slate-200 bg-slate-50 px-5 py-10 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          role="status"
        >
          {{ loadingText() }}
        </div>
      } @else if (error()) {
        <div
          class="rounded-xl border border-red-200 bg-red-50 px-5 py-10 text-center text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
          role="alert"
        >
          {{ errorText() }}
        </div>
      } @else if (!items().length) {
        <div
          class="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          role="status"
        >
          {{ emptyText() }}
        </div>
      } @else {
        <div [class]="itemsClasses()" role="list">
          @for (item of items(); track trackItem($index, item); let index = $index) {
            <div role="listitem">
              @if (itemTemplate(); as template) {
                <ng-container
                  [ngTemplateOutlet]="template.template"
                  [ngTemplateOutletContext]="itemContext(item, index)"
                />
              } @else {
                <div
                  class="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                >
                  {{ item }}
                </div>
              }
            </div>
          }
        </div>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiDataViewComponent<T = unknown> {
  readonly items = input<readonly T[]>([]);
  readonly layout = input<UiDataViewLayout>('grid');
  readonly gap = input<UiDataViewGap>('md');
  readonly showLayoutToggle = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly error = input(false, { transform: booleanAttribute });
  readonly loadingText = input('Loading items...');
  readonly errorText = input('Unable to load items.');
  readonly emptyText = input('No items found.');
  readonly ariaLabel = input('Data view');
  readonly layoutToggleAriaLabel = input('Choose layout');
  readonly gridLabel = input('Grid');
  readonly listLabel = input('List');
  readonly trackBy = input<UiDataViewTrackBy<T> | null>(null);
  readonly layoutChange = output<UiDataViewLayout>();

  protected readonly itemTemplate = contentChild(UiDataViewItemDirective<T>);
  protected readonly itemsClasses = computed(() => {
    const layoutClasses =
      this.layout() === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'flex flex-col';
    return `${layoutClasses} ${GAP_CLASSES[this.gap()]}`;
  });

  protected trackItem(index: number, item: T): unknown {
    return this.trackBy()?.(index, item) ?? item;
  }

  protected itemContext(item: T, index: number): UiDataViewItemContext<T> {
    return {
      $implicit: item,
      item,
      index,
      layout: this.layout(),
      first: index === 0,
      last: index === this.items().length - 1,
    };
  }

  protected requestLayout(layout: UiDataViewLayout): void {
    if (layout !== this.layout()) {
      this.layoutChange.emit(layout);
    }
  }

  protected layoutButtonClasses(layout: UiDataViewLayout): string {
    const base =
      'inline-flex min-h-9 items-center rounded-lg px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950';
    const state =
      layout === this.layout()
        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950'
        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900';
    return `${base} ${state}`;
  }
}
