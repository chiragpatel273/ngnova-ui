import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import type { ElementRef } from '@angular/core';

export interface UiCommand {
  readonly value: string;
  readonly label: string;
  readonly description?: string;
  readonly keywords?: readonly string[];
  readonly shortcut?: string;
  readonly group?: string;
  readonly disabled?: boolean;
}

export interface UiCommandSelection {
  readonly command: UiCommand;
  readonly source: 'keyboard' | 'pointer';
}

interface UiCommandGroup {
  readonly label: string;
  readonly commands: readonly UiCommand[];
}

let nextCommandPaletteId = 0;

@Component({
  selector: 'ui-command-palette',
  standalone: true,
  host: { '(document:keydown)': 'onDocumentKeydown($event)' },
  template: `
    @if (open()) {
      <div
        class="fixed inset-0 z-50 grid place-items-start bg-slate-950/50 px-4 pt-[12vh] backdrop-blur-[2px]"
        role="presentation"
        (mousedown)="onBackdropMouseDown($event)"
      >
        <section
          #panel
          class="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20 dark:border-slate-800 dark:bg-slate-950"
          role="dialog"
          aria-modal="true"
          [attr.aria-label]="ariaLabel()"
          (keydown)="onPanelKeydown($event)"
        >
          <div class="flex items-center gap-3 border-b border-slate-200 px-4 dark:border-slate-800">
            <svg
              class="size-5 shrink-0 fill-none stroke-current text-slate-400"
              viewBox="0 0 24 24"
              stroke-width="1.8"
              stroke-linecap="round"
              aria-hidden="true"
              focusable="false"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" />
            </svg>
            <input
              #searchInput
              class="min-h-14 min-w-0 flex-1 bg-transparent text-base text-slate-950 outline-none placeholder:text-slate-400 dark:text-slate-50"
              type="text"
              autocomplete="off"
              role="combobox"
              aria-autocomplete="list"
              aria-controls="{{ listboxId }}"
              [attr.aria-label]="inputAriaLabel()"
              [attr.aria-expanded]="true"
              [attr.aria-activedescendant]="activeDescendant()"
              [placeholder]="placeholder()"
              [value]="query()"
              (input)="onQueryInput($event)"
            />
            <button
              type="button"
              class="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-slate-900 dark:hover:text-slate-100 dark:focus-visible:ring-blue-400"
              [attr.aria-label]="closeLabel()"
              (click)="requestClose()"
            >
              <svg
                class="size-4 fill-none stroke-current"
                viewBox="0 0 20 20"
                stroke-width="1.75"
                stroke-linecap="round"
                aria-hidden="true"
              >
                <path d="m5 5 10 10M15 5 5 15" />
              </svg>
            </button>
          </div>

          <div class="max-h-[min(24rem,60vh)] overflow-y-auto p-2">
            @if (groupedCommands().length) {
              <div
                [id]="listboxId"
                role="listbox"
                [attr.aria-label]="resultsAriaLabel()"
                [attr.aria-busy]="loading() ? 'true' : null"
              >
                @for (group of groupedCommands(); track group.label) {
                  <section [attr.aria-label]="group.label || null">
                    @if (group.label) {
                      <h2
                        class="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                      >
                        {{ group.label }}
                      </h2>
                    }
                    @for (command of group.commands; track command.value) {
                      <button
                        type="button"
                        role="option"
                        tabindex="-1"
                        [id]="optionId(command)"
                        [disabled]="command.disabled"
                        [attr.aria-selected]="isActive(command) ? 'true' : 'false'"
                        [class]="commandClasses(command)"
                        (mouseenter)="setActive(command)"
                        (click)="select(command, 'pointer')"
                      >
                        <span class="min-w-0 flex-1 text-left">
                          <span class="block truncate text-sm font-semibold">
                            {{ command.label }}
                          </span>
                          @if (command.description) {
                            <span
                              class="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400"
                            >
                              {{ command.description }}
                            </span>
                          }
                        </span>
                        @if (command.shortcut) {
                          <kbd
                            class="ml-3 shrink-0 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-[0.6875rem] font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
                          >
                            {{ command.shortcut }}
                          </kbd>
                        }
                      </button>
                    }
                  </section>
                }
              </div>
            } @else {
              <p
                class="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400"
                role="status"
              >
                {{ loading() ? loadingText() : emptyText() }}
              </p>
            }
          </div>

          <footer
            class="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-400"
          >
            <span>{{ hintText() }}</span>
            @if (shortcutEnabled()) {
              <span>{{ shortcutHint() }}</span>
            }
          </footer>
        </section>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiCommandPaletteComponent {
  readonly commands = input<readonly UiCommand[]>([]);
  readonly open = input(false, { transform: booleanAttribute });
  readonly query = input('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly shortcutEnabled = input(true, { transform: booleanAttribute });
  readonly closeOnSelection = input(true, { transform: booleanAttribute });
  readonly closeOnBackdrop = input(true, { transform: booleanAttribute });
  readonly closeOnEscape = input(true, { transform: booleanAttribute });
  readonly ariaLabel = input('Command palette');
  readonly inputAriaLabel = input('Search commands');
  readonly resultsAriaLabel = input('Available commands');
  readonly placeholder = input('Type a command or search...');
  readonly emptyText = input('No commands found.');
  readonly loadingText = input('Loading commands...');
  readonly closeLabel = input('Close command palette');
  readonly hintText = input('Use arrow keys to navigate and Enter to select');
  readonly shortcutHint = input('Ctrl or Command + K');

  readonly openChange = output<boolean>();
  readonly queryChange = output<string>();
  readonly commandSelected = output<UiCommandSelection>();
  readonly escapeKeyDown = output<void>();

  private readonly document = inject(DOCUMENT);
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private readonly activeValue = signal<string | null>(null);
  private restoreFocusTo: HTMLElement | null = null;
  private wasOpen = false;
  private readonly instanceId = ++nextCommandPaletteId;
  protected readonly listboxId = `ui-command-palette-listbox-${this.instanceId}`;

  protected readonly filteredCommands = computed(() => {
    const normalizedQuery = this.query().trim().toLocaleLowerCase();
    if (!normalizedQuery) return this.commands();
    return this.commands().filter((command) =>
      [command.label, command.description ?? '', ...(command.keywords ?? [])]
        .join(' ')
        .toLocaleLowerCase()
        .includes(normalizedQuery),
    );
  });

  protected readonly enabledCommands = computed(() =>
    this.filteredCommands().filter((command) => !command.disabled),
  );

  protected readonly groupedCommands = computed<readonly UiCommandGroup[]>(() => {
    const groups = new Map<string, UiCommand[]>();
    for (const command of this.filteredCommands()) {
      const label = command.group ?? '';
      const existing = groups.get(label);
      if (existing) existing.push(command);
      else groups.set(label, [command]);
    }
    return Array.from(groups, ([label, commands]) => ({ label, commands }));
  });

  protected readonly activeCommand = computed(() => {
    const enabled = this.enabledCommands();
    return enabled.find((command) => command.value === this.activeValue()) ?? enabled[0] ?? null;
  });

  protected readonly activeDescendant = computed(() => {
    const command = this.activeCommand();
    return command ? this.optionId(command) : null;
  });

  constructor() {
    effect(() => {
      const isOpen = this.open();
      this.filteredCommands();
      if (isOpen && !this.wasOpen) {
        this.restoreFocusTo =
          this.document.activeElement instanceof HTMLElement ? this.document.activeElement : null;
        this.activeValue.set(this.enabledCommands()[0]?.value ?? null);
        queueMicrotask(() => this.searchInput()?.nativeElement.focus());
      } else if (isOpen) {
        const enabled = this.enabledCommands();
        if (!enabled.some((command) => command.value === this.activeValue()))
          this.activeValue.set(enabled[0]?.value ?? null);
      } else if (this.wasOpen) {
        queueMicrotask(() => {
          if (this.restoreFocusTo?.isConnected) this.restoreFocusTo.focus();
          this.restoreFocusTo = null;
        });
      }
      this.wasOpen = isOpen;
    });
  }

  protected onDocumentKeydown(event: KeyboardEvent): void {
    if (
      !this.open() &&
      !this.disabled() &&
      this.shortcutEnabled() &&
      event.key.toLocaleLowerCase() === 'k' &&
      (event.ctrlKey || event.metaKey) &&
      !event.altKey
    ) {
      event.preventDefault();
      this.openChange.emit(true);
    }
  }

  protected onQueryInput(event: Event): void {
    this.queryChange.emit((event.target as HTMLInputElement).value);
  }

  protected onPanelKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.escapeKeyDown.emit();
      if (this.closeOnEscape()) this.requestClose();
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const commands = this.enabledCommands();
      if (!commands.length) return;
      const currentIndex = commands.findIndex(
        (command) => command.value === this.activeCommand()?.value,
      );
      const delta = event.key === 'ArrowDown' ? 1 : -1;
      const nextIndex = (currentIndex + delta + commands.length) % commands.length;
      this.activeValue.set(commands[nextIndex]?.value ?? null);
      event.preventDefault();
      return;
    }
    if (event.key === 'Home' || event.key === 'End') {
      const commands = this.enabledCommands();
      this.activeValue.set((event.key === 'Home' ? commands[0] : commands.at(-1))?.value ?? null);
      event.preventDefault();
      return;
    }
    if (event.key === 'Enter') {
      const command = this.activeCommand();
      if (command) this.select(command, 'keyboard');
      event.preventDefault();
      return;
    }
    if (event.key === 'Tab') this.trapFocus(event);
  }

  protected setActive(command: UiCommand): void {
    if (!command.disabled) this.activeValue.set(command.value);
  }

  protected isActive(command: UiCommand): boolean {
    return this.activeCommand()?.value === command.value;
  }

  protected select(command: UiCommand, source: 'keyboard' | 'pointer'): void {
    if (command.disabled) return;
    this.commandSelected.emit({ command, source });
    if (this.closeOnSelection()) this.requestClose();
  }

  protected requestClose(): void {
    this.openChange.emit(false);
  }

  protected onBackdropMouseDown(event: MouseEvent): void {
    if (event.currentTarget === event.target && this.closeOnBackdrop()) this.requestClose();
  }

  protected optionId(command: UiCommand): string {
    return `ui-command-palette-${this.instanceId}-${this.sanitizeId(command.value)}`;
  }

  protected commandClasses(command: UiCommand): string {
    const base =
      'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left outline-none transition-colors';
    if (command.disabled)
      return `${base} cursor-not-allowed text-slate-400 opacity-60 dark:text-slate-600`;
    if (this.activeCommand()?.value === command.value)
      return `${base} bg-blue-50 text-blue-950 dark:bg-blue-950/70 dark:text-blue-100`;
    return `${base} text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900`;
  }

  private trapFocus(event: KeyboardEvent): void {
    const root = this.panel()?.nativeElement;
    if (!root) return;
    const focusable = Array.from(
      root.querySelectorAll<HTMLElement>(
        'input, button:not([disabled]):not([tabindex="-1"]), [tabindex="0"]',
      ),
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable.at(-1);
    const current = this.document.activeElement;
    if (event.shiftKey && current === first) {
      last?.focus();
      event.preventDefault();
    } else if (!event.shiftKey && current === last) {
      first?.focus();
      event.preventDefault();
    }
  }

  private sanitizeId(value: string): string {
    return value.replace(/[^a-zA-Z0-9_-]/g, '-');
  }
}
