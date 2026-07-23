import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  booleanAttribute,
  Component,
  Directive,
  ElementRef,
  inject,
  Input,
  output,
  Renderer2,
  signal,
  ViewChild,
} from '@angular/core';
import type { AfterViewInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';

export type UiPopoverPosition = 'top' | 'right' | 'bottom' | 'left';

let nextPopoverId = 0;

@Component({
  selector: 'ui-popover',
  standalone: true,
  template: `
    <ng-content select="[uiPopoverTrigger]" />
    <div
      #panel
      popover="manual"
      [id]="panelId"
      role="dialog"
      [attr.aria-label]="ariaLabel || null"
      [attr.aria-labelledby]="ariaLabel ? null : titleId || null"
      [hidden]="!isOpen()"
      class="fixed z-[1000] m-0 max-h-[min(24rem,calc(100dvh-1rem))] w-max max-w-[min(22rem,calc(100vw-1rem))] overflow-auto rounded-[var(--ui-surface-radius,0.75rem)] border border-slate-200 bg-white p-4 text-sm text-slate-900 shadow-xl outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
    >
      <ng-content select="[uiPopoverContent]" />
    </div>
  `,
  host: {
    class: 'relative inline-block',
    '(click)': 'handleHostClick($event)',
    '(keydown)': 'handleHostKeydown($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiPopoverComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input({ transform: booleanAttribute }) open = false;
  @Input() position: UiPopoverPosition = 'bottom';
  @Input() ariaLabel = '';
  @Input() titleId = '';
  @Input() panelId = `ui-popover-${++nextPopoverId}`;
  @Input({ transform: booleanAttribute }) closeOnOutside = true;
  @Input({ transform: booleanAttribute }) closeOnEscape = true;
  readonly openChange = output<boolean>();
  readonly opened = output<void>();
  readonly closed = output<void>();

  @ViewChild('panel') private readonly panelRef?: ElementRef<HTMLDivElement>;

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly document = inject(DOCUMENT);
  private readonly renderer = inject(Renderer2);
  private viewReady = false;
  protected readonly isOpen = signal(false);
  private readonly cleanups: (() => void)[] = [];

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.isOpen.set(this.open);
    this.syncOpenState();
    if (this.open) this.opened.emit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.viewReady && (changes['open'] || changes['panelId'] || changes['position'])) {
      const stateChanged = Boolean(changes['open']) && this.isOpen() !== this.open;
      if (changes['open']) this.isOpen.set(this.open);
      this.syncOpenState();
      if (stateChanged) {
        if (this.open) this.opened.emit();
        else this.closed.emit();
      }
    }
  }

  ngOnDestroy(): void {
    this.removeListeners();
    this.hideNativePopover();
  }

  protected handleHostClick(event: MouseEvent): void {
    const target = event.target as Element | null;
    if (target?.closest('[uiPopoverTrigger]')) {
      this.setOpen(!this.isOpen());
    }
  }

  protected handleHostKeydown(event: KeyboardEvent): void {
    const target = event.target as Element | null;
    if (!target?.closest('[uiPopoverTrigger]')) return;
    if (event.key === 'ArrowDown' && !this.isOpen()) {
      event.preventDefault();
      this.setOpen(true);
    }
  }

  private setOpen(open: boolean, restoreFocus = false): void {
    if (this.isOpen() === open) return;
    this.isOpen.set(open);
    this.syncOpenState();
    this.openChange.emit(open);
    if (open) this.opened.emit();
    else {
      this.closed.emit();
      if (restoreFocus) this.trigger()?.focus();
    }
  }

  private syncOpenState(): void {
    const panel = this.panelRef?.nativeElement;
    if (!panel) return;
    this.updateTriggerAttributes();
    if (!this.isOpen()) {
      panel.hidden = true;
      this.removeListeners();
      this.hideNativePopover();
      return;
    }

    panel.hidden = false;
    this.showNativePopover();
    this.positionPanel();
    if (this.cleanups.length === 0) this.installListeners();
  }

  private installListeners(): void {
    this.removeListeners();
    const view = this.document.defaultView;
    if (!view) return;
    this.cleanups.push(
      this.renderer.listen(this.document, 'pointerdown', (event: PointerEvent) => {
        if (
          this.isOpen() &&
          this.closeOnOutside &&
          !this.host.contains(event.target as Node) &&
          !this.panelRef?.nativeElement.contains(event.target as Node)
        ) {
          this.setOpen(false);
        }
      }),
      this.renderer.listen(this.document, 'keydown', (event: KeyboardEvent) => {
        if (this.isOpen() && this.closeOnEscape && event.key === 'Escape') {
          event.preventDefault();
          this.setOpen(false, true);
        }
      }),
      this.renderer.listen(view, 'resize', () => this.positionPanel()),
      this.renderer.listen(view, 'scroll', () => this.positionPanel()),
    );
  }

  private removeListeners(): void {
    for (const cleanup of this.cleanups.splice(0)) cleanup();
  }

  private updateTriggerAttributes(): void {
    for (const trigger of this.host.querySelectorAll<HTMLElement>('[uiPopoverTrigger]')) {
      this.renderer.setAttribute(trigger, 'aria-haspopup', 'dialog');
      this.renderer.setAttribute(trigger, 'aria-expanded', String(this.isOpen()));
      this.renderer.setAttribute(trigger, 'aria-controls', this.panelId);
    }
  }

  private positionPanel(): void {
    const panel = this.panelRef?.nativeElement;
    const trigger = this.trigger();
    const view = this.document.defaultView;
    if (!panel || !trigger || !view || !this.isOpen()) return;

    const anchor = trigger.getBoundingClientRect();
    const floating = panel.getBoundingClientRect();
    const gap = 8;
    const edge = 8;
    let position = this.position;
    if (position === 'top' && anchor.top < floating.height + gap + edge) position = 'bottom';
    if (position === 'bottom' && view.innerHeight - anchor.bottom < floating.height + gap + edge)
      position = 'top';
    if (position === 'left' && anchor.left < floating.width + gap + edge) position = 'right';
    if (position === 'right' && view.innerWidth - anchor.right < floating.width + gap + edge)
      position = 'left';

    const centerX = Math.min(
      Math.max(anchor.left + anchor.width / 2, edge + floating.width / 2),
      view.innerWidth - edge - floating.width / 2,
    );
    const centerY = Math.min(
      Math.max(anchor.top + anchor.height / 2, edge + floating.height / 2),
      view.innerHeight - edge - floating.height / 2,
    );
    const placements: Record<UiPopoverPosition, readonly [number, number, string]> = {
      top: [centerX, anchor.top - gap, 'translate(-50%, -100%)'],
      right: [anchor.right + gap, centerY, 'translate(0, -50%)'],
      bottom: [centerX, anchor.bottom + gap, 'translate(-50%, 0)'],
      left: [anchor.left - gap, centerY, 'translate(-100%, -50%)'],
    };
    const [left, top, transform] = placements[position];
    panel.dataset['position'] = position;
    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;
    panel.style.transform = transform;
  }

  private trigger(): HTMLElement | null {
    return this.host.querySelector<HTMLElement>('[uiPopoverTrigger]');
  }

  private showNativePopover(): void {
    const panel = this.panelRef?.nativeElement;
    if (!panel || typeof panel.showPopover !== 'function') return;
    try {
      if (!panel.matches(':popover-open')) panel.showPopover();
    } catch {
      // The hidden/fixed fallback remains functional in browsers without a usable top layer.
    }
  }

  private hideNativePopover(): void {
    const panel = this.panelRef?.nativeElement;
    if (!panel || typeof panel.hidePopover !== 'function') return;
    try {
      if (panel.matches(':popover-open')) panel.hidePopover();
    } catch {
      // The fallback is already hidden by Angular state.
    }
  }
}

@Directive({ selector: '[uiPopoverTrigger]', standalone: true })
export class UiPopoverTriggerDirective {}

@Directive({ selector: '[uiPopoverContent]', standalone: true })
export class UiPopoverContentDirective {}
