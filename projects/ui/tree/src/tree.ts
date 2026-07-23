import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import type { ElementRef } from '@angular/core';

export interface UiTreeNode {
  readonly value: string;
  readonly label: string;
  readonly description?: string;
  readonly disabled?: boolean;
  readonly children?: readonly UiTreeNode[];
}

export interface UiTreeVisibleNode {
  readonly node: UiTreeNode;
  readonly level: number;
  readonly parentValue: string | null;
  readonly position: number;
  readonly setSize: number;
}

function flattenTree(
  nodes: readonly UiTreeNode[],
  expanded: ReadonlySet<string>,
  level = 1,
  parentValue: string | null = null,
): UiTreeVisibleNode[] {
  return nodes.flatMap((node, index) => {
    const current: UiTreeVisibleNode = {
      node,
      level,
      parentValue,
      position: index + 1,
      setSize: nodes.length,
    };
    if (!node.children?.length || !expanded.has(node.value)) {
      return [current];
    }
    return [current, ...flattenTree(node.children, expanded, level + 1, node.value)];
  });
}

@Component({
  selector: 'ui-tree',
  standalone: true,
  template: `
    <div
      #treeRoot
      class="rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-950"
      role="tree"
      [attr.aria-label]="ariaLabel()"
    >
      @if (!visibleNodes().length) {
        <p class="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400" role="status">
          {{ emptyText() }}
        </p>
      }
      @for (entry of visibleNodes(); track entry.node.value; let index = $index) {
        <button
          type="button"
          [class]="nodeClasses(entry)"
          role="treeitem"
          [style.padding-left.rem]="0.75 + (entry.level - 1) * 1.25"
          [attr.aria-level]="entry.level"
          [attr.aria-posinset]="entry.position"
          [attr.aria-setsize]="entry.setSize"
          [attr.aria-expanded]="hasChildren(entry) ? isExpanded(entry) : null"
          [attr.aria-selected]="selectable() ? isSelected(entry) : null"
          [attr.aria-disabled]="entry.node.disabled ? 'true' : null"
          [attr.tabindex]="index === activeIndex() ? 0 : -1"
          (click)="activate(entry, index)"
          (focus)="activeIndex.set(index)"
          (keydown)="onKeydown($event, entry, index)"
        >
          <svg
            class="size-4 shrink-0 fill-none stroke-current transition-transform"
            [class.rotate-90]="isExpanded(entry)"
            [class.invisible]="!hasChildren(entry)"
            viewBox="0 0 20 20"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="m8 6 4 4-4 4" />
          </svg>
          <span class="min-w-0 flex-1 text-left">
            <span class="block truncate font-medium">{{ entry.node.label }}</span>
            @if (entry.node.description) {
              <span class="block truncate text-xs text-slate-500 dark:text-slate-400">
                {{ entry.node.description }}
              </span>
            }
          </span>
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTreeComponent {
  readonly nodes = input<readonly UiTreeNode[]>([]);
  readonly expanded = input<readonly string[]>([]);
  readonly selected = input<string | null>(null);
  readonly ariaLabel = input('Tree');
  readonly emptyText = input('No items.');
  readonly selectable = input(true, { transform: booleanAttribute });
  readonly expandOnActivate = input(true, { transform: booleanAttribute });
  readonly expandedChange = output<readonly string[]>();
  readonly selectedChange = output<string | null>();
  readonly nodeActivated = output<UiTreeNode>();

  protected readonly activeIndex = signal(0);
  private readonly treeRoot = viewChild.required<ElementRef<HTMLElement>>('treeRoot');
  protected readonly visibleNodes = computed(() =>
    flattenTree(this.nodes(), new Set(this.expanded())),
  );

  protected hasChildren(entry: UiTreeVisibleNode): boolean {
    return Boolean(entry.node.children?.length);
  }

  protected isExpanded(entry: UiTreeVisibleNode): boolean {
    return this.expanded().includes(entry.node.value);
  }

  protected isSelected(entry: UiTreeVisibleNode): boolean {
    return this.selected() === entry.node.value;
  }

  protected activate(entry: UiTreeVisibleNode, index: number): void {
    if (entry.node.disabled) {
      return;
    }
    this.activeIndex.set(index);
    if (this.expandOnActivate() && this.hasChildren(entry)) {
      this.toggleExpanded(entry);
    }
    if (this.selectable()) {
      this.selectedChange.emit(entry.node.value);
    }
    this.nodeActivated.emit(entry.node);
  }

  protected onKeydown(event: KeyboardEvent, entry: UiTreeVisibleNode, index: number): void {
    const last = this.visibleNodes().length - 1;
    let target: number | null = null;
    switch (event.key) {
      case 'ArrowDown':
        target = Math.min(last, index + 1);
        break;
      case 'ArrowUp':
        target = Math.max(0, index - 1);
        break;
      case 'Home':
        target = 0;
        break;
      case 'End':
        target = last;
        break;
      case 'ArrowRight':
        if (this.hasChildren(entry) && !this.isExpanded(entry)) {
          this.toggleExpanded(entry);
        } else if (this.hasChildren(entry)) {
          target = Math.min(last, index + 1);
        }
        break;
      case 'ArrowLeft':
        if (this.hasChildren(entry) && this.isExpanded(entry)) {
          this.toggleExpanded(entry);
        } else if (entry.parentValue) {
          target = this.visibleNodes().findIndex(
            (candidate) => candidate.node.value === entry.parentValue,
          );
        }
        break;
      case 'Enter':
      case ' ':
        this.activate(entry, index);
        event.preventDefault();
        return;
      default:
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          target = this.typeaheadIndex(event.key, index);
        } else {
          return;
        }
    }
    event.preventDefault();
    if (target !== null && target >= 0) {
      this.focusIndex(target);
    }
  }

  private toggleExpanded(entry: UiTreeVisibleNode): void {
    const values = new Set(this.expanded());
    if (values.has(entry.node.value)) {
      values.delete(entry.node.value);
    } else {
      values.add(entry.node.value);
    }
    this.expandedChange.emit(Object.freeze([...values]));
  }

  private typeaheadIndex(character: string, current: number): number | null {
    const nodes = this.visibleNodes();
    const query = character.toLocaleLowerCase();
    for (let offset = 1; offset <= nodes.length; offset += 1) {
      const index = (current + offset) % nodes.length;
      if (nodes[index]?.node.label.toLocaleLowerCase().startsWith(query)) {
        return index;
      }
    }
    return null;
  }

  private focusIndex(index: number): void {
    this.activeIndex.set(index);
    queueMicrotask(() => {
      const items =
        this.treeRoot().nativeElement.querySelectorAll<HTMLElement>('[role="treeitem"]');
      items[index]?.focus();
    });
  }

  protected nodeClasses(entry: UiTreeVisibleNode): string {
    const base =
      'flex min-h-10 w-full items-center gap-2 rounded-lg pr-3 text-sm text-slate-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-inset dark:text-slate-200 dark:focus-visible:ring-blue-400';
    if (entry.node.disabled) {
      return `${base} cursor-not-allowed opacity-50`;
    }
    if (this.isSelected(entry)) {
      return `${base} bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-200`;
    }
    return `${base} hover:bg-slate-100 dark:hover:bg-slate-900`;
  }
}
