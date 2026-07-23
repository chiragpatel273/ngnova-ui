import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
  CdkVirtualScrollViewport,
} from '@angular/cdk/scrolling';
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
  numberAttribute,
  output,
  viewChild,
} from '@angular/core';

export type UiTableVirtualScrollBehavior = 'auto' | 'smooth';
export type UiTableVirtualTrackBy<T> = (index: number, item: T) => unknown;

export interface UiTableVirtualRowContext<T = unknown> {
  readonly $implicit: T;
  readonly row: T;
  readonly index: number;
}

@Directive({
  selector: 'ng-template[uiTableVirtualRow]',
  standalone: true,
})
export class UiTableVirtualRowDirective<T = unknown> {
  @Input('uiTableVirtualRow') marker = '';
  readonly template = inject<TemplateRef<UiTableVirtualRowContext<T>>>(TemplateRef);
}

@Component({
  selector: 'ui-table-virtual-scroll',
  standalone: true,
  imports: [CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport, NgTemplateOutlet],
  template: `
    <cdk-virtual-scroll-viewport
      class="block w-full overflow-auto rounded-[var(--ui-surface-radius,0.75rem)] border border-slate-200 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950"
      role="rowgroup"
      tabindex="0"
      [style.height]="height()"
      [itemSize]="normalizedItemSize()"
      [minBufferPx]="normalizedMinBuffer()"
      [maxBufferPx]="normalizedMaxBuffer()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-rowcount]="rows().length"
      [attr.aria-busy]="loading() ? 'true' : null"
      (scrolledIndexChange)="scrolledIndexChange.emit($event)"
    >
      <div
        *cdkVirtualFor="let row of rows(); trackBy: trackRow; let index = index"
        class="border-b border-slate-200 last:border-b-0 dark:border-slate-800"
        role="row"
        [attr.aria-rowindex]="index + 1"
        [style.height.px]="normalizedItemSize()"
      >
        @if (rowTemplate(); as template) {
          <ng-container
            [ngTemplateOutlet]="template.template"
            [ngTemplateOutletContext]="rowContext(row, index)"
          />
        } @else {
          <div class="flex h-full items-center px-4 text-sm text-slate-700 dark:text-slate-200">
            {{ row }}
          </div>
        }
      </div>
    </cdk-virtual-scroll-viewport>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTableVirtualScrollComponent<T = unknown> {
  readonly rows = input<readonly T[]>([]);
  readonly itemSize = input(48, { transform: numberAttribute });
  readonly minBufferPx = input(192, { transform: numberAttribute });
  readonly maxBufferPx = input(384, { transform: numberAttribute });
  readonly height = input('24rem');
  readonly ariaLabel = input('Virtualized table rows');
  readonly loading = input(false, { transform: booleanAttribute });
  readonly trackBy = input<UiTableVirtualTrackBy<T> | null>(null);
  readonly scrolledIndexChange = output<number>();

  protected readonly rowTemplate = contentChild(UiTableVirtualRowDirective<T>);
  private readonly viewport = viewChild.required(CdkVirtualScrollViewport);
  protected readonly normalizedItemSize = computed(() => Math.max(1, Math.trunc(this.itemSize())));
  protected readonly normalizedMinBuffer = computed(() =>
    Math.max(this.normalizedItemSize(), Math.trunc(this.minBufferPx())),
  );
  protected readonly normalizedMaxBuffer = computed(() =>
    Math.max(this.normalizedMinBuffer(), Math.trunc(this.maxBufferPx())),
  );

  protected readonly trackRow = (index: number, row: T): unknown =>
    this.trackBy()?.(index, row) ?? row;

  protected rowContext(row: T, index: number): UiTableVirtualRowContext<T> {
    return { $implicit: row, row, index };
  }

  scrollToIndex(index: number, behavior: UiTableVirtualScrollBehavior = 'auto'): void {
    const boundedIndex = Math.min(
      Math.max(0, this.rows().length - 1),
      Math.max(0, Math.trunc(index)),
    );
    this.viewport().scrollToIndex(boundedIndex, behavior);
  }

  checkViewportSize(): void {
    this.viewport().checkViewportSize();
  }
}
