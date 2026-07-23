import { CdkConnectedOverlay, CdkOverlayOrigin, Overlay } from '@angular/cdk/overlay';
import type {
  ConnectedOverlayPositionChange,
  ConnectedPosition,
  ScrollStrategy,
} from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  numberAttribute,
  output,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import type { ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type UiOverlayPlacement = 'top' | 'right' | 'bottom' | 'left';
export type UiOverlayAlignment = 'start' | 'center' | 'end';
export type UiOverlayScrollStrategy = 'reposition' | 'close' | 'block' | 'noop';
export type UiOverlayInitialFocus = 'none' | 'panel' | 'first';
export type UiOverlayRole = 'dialog' | 'menu' | 'listbox' | 'region';

export interface UiOverlayPositionChange {
  readonly placement: UiOverlayPlacement;
  readonly alignment: UiOverlayAlignment;
}

let nextOverlayId = 0;

@Component({
  selector: 'ui-overlay',
  standalone: true,
  imports: [CdkConnectedOverlay, CdkOverlayOrigin],
  host: {
    class: 'contents',
    '[attr.data-open]': 'open() ? "true" : "false"',
    '(click)': 'onTriggerClick($event)',
    '(keydown)': 'onTriggerKeydown($event)',
  },
  template: `
    <span #originElement cdkOverlayOrigin #origin="cdkOverlayOrigin" class="contents">
      <ng-content select="[uiOverlayTrigger]" />
    </span>

    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayOpen]="open()"
      [cdkConnectedOverlayPositions]="connectedPositions()"
      [cdkConnectedOverlayHasBackdrop]="hasBackdrop()"
      [cdkConnectedOverlayBackdropClass]="backdropClass()"
      [cdkConnectedOverlayViewportMargin]="viewportMargin()"
      [cdkConnectedOverlayScrollStrategy]="resolvedScrollStrategy()"
      [cdkConnectedOverlayFlexibleDimensions]="flexibleDimensions()"
      [cdkConnectedOverlayGrowAfterOpen]="growAfterOpen()"
      [cdkConnectedOverlayPush]="push()"
      [cdkConnectedOverlayLockPosition]="lockPosition()"
      [cdkConnectedOverlayDisposeOnNavigation]="disposeOnNavigation()"
      [cdkConnectedOverlayMatchWidth]="matchTriggerWidth()"
      (attach)="onAttach()"
      (detach)="onDetach()"
      (backdropClick)="onBackdropClick($event)"
      (overlayOutsideClick)="onOutsideClick($event)"
      (overlayKeydown)="onOverlayKeydown($event)"
      (positionChange)="onPositionChange($event)"
    >
      <section
        #panel
        [id]="panelId()"
        [attr.role]="role()"
        [attr.aria-label]="ariaLabel() || null"
        tabindex="-1"
        class="max-h-[min(28rem,calc(100dvh-1rem))] max-w-[min(32rem,calc(100vw-1rem))] overflow-auto rounded-[var(--ui-surface-radius,0.75rem)] border border-slate-200 bg-white p-4 text-sm text-slate-900 shadow-xl outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus-visible:ring-blue-400"
      >
        <ng-content select="[uiOverlayContent]" />
      </section>
    </ng-template>
  `,
  styles: `
    .cdk-overlay-container,
    .cdk-global-overlay-wrapper {
      pointer-events: none;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .cdk-overlay-container {
      position: fixed;
      z-index: 1000;
    }

    .cdk-overlay-pane {
      position: absolute;
      pointer-events: auto;
      box-sizing: border-box;
      display: flex;
      max-width: 100%;
      max-height: 100%;
    }

    .cdk-overlay-backdrop {
      position: absolute;
      inset: 0;
      z-index: 1000;
      pointer-events: auto;
      -webkit-tap-highlight-color: transparent;
      opacity: 0;
      transition: opacity 200ms cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    .cdk-overlay-backdrop.cdk-overlay-backdrop-showing {
      opacity: 1;
    }

    .cdk-overlay-transparent-backdrop {
      visibility: hidden;
      opacity: 1;
      transition:
        visibility 1ms linear,
        opacity 1ms linear;
    }

    .cdk-overlay-transparent-backdrop.cdk-overlay-backdrop-showing {
      visibility: visible;
      opacity: 0;
    }

    .cdk-overlay-connected-position-bounding-box {
      position: absolute;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      min-width: 1px;
      min-height: 1px;
    }

    .cdk-global-scrollblock {
      position: fixed;
      width: 100%;
      overflow-y: scroll;
    }
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiOverlayComponent {
  readonly open = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly placements = input<readonly UiOverlayPlacement[]>(['bottom', 'top', 'right', 'left']);
  readonly alignment = input<UiOverlayAlignment>('start');
  readonly gap = input(8, { transform: numberAttribute });
  readonly crossAxisOffset = input(0, { transform: numberAttribute });
  readonly viewportMargin = input(8, { transform: numberAttribute });
  readonly scrollStrategy = input<UiOverlayScrollStrategy>('reposition');
  readonly role = input<UiOverlayRole>('dialog');
  readonly ariaLabel = input('');
  readonly panelId = input(`ui-overlay-${++nextOverlayId}`);
  readonly hasBackdrop = input(false, { transform: booleanAttribute });
  readonly backdropClass = input('cdk-overlay-transparent-backdrop');
  readonly closeOnOutside = input(true, { transform: booleanAttribute });
  readonly closeOnBackdrop = input(true, { transform: booleanAttribute });
  readonly closeOnEscape = input(true, { transform: booleanAttribute });
  readonly matchTriggerWidth = input(false, { transform: booleanAttribute });
  readonly flexibleDimensions = input(true, { transform: booleanAttribute });
  readonly growAfterOpen = input(true, { transform: booleanAttribute });
  readonly push = input(true, { transform: booleanAttribute });
  readonly lockPosition = input(false, { transform: booleanAttribute });
  readonly disposeOnNavigation = input(true, { transform: booleanAttribute });
  readonly initialFocus = input<UiOverlayInitialFocus>('none');
  readonly restoreFocus = input(true, { transform: booleanAttribute });

  readonly openChange = output<boolean>();
  readonly opened = output<void>();
  readonly closed = output<void>();
  readonly backdropClick = output<MouseEvent>();
  readonly outsideClick = output<MouseEvent>();
  readonly escapeKeyDown = output<void>();
  readonly positionChange = output<UiOverlayPositionChange>();

  private readonly overlay = inject(Overlay);
  private readonly document = inject(DOCUMENT);
  private readonly originElement = viewChild<ElementRef<HTMLElement>>('originElement');
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private restoreFocusTo: HTMLElement | null = null;

  protected readonly connectedPositions = computed<ConnectedPosition[]>(() => {
    const requested = this.placements().length
      ? this.placements()
      : (['bottom', 'top', 'right', 'left'] as const);
    return requested.map((placement) => this.toConnectedPosition(placement, this.alignment()));
  });

  protected readonly resolvedScrollStrategy = computed<ScrollStrategy>(() => {
    const strategies = this.overlay.scrollStrategies;
    switch (this.scrollStrategy()) {
      case 'close':
        return strategies.close();
      case 'block':
        return strategies.block();
      case 'noop':
        return strategies.noop();
      default:
        return strategies.reposition();
    }
  });

  constructor() {
    effect(() => {
      const origin = this.originElement()?.nativeElement;
      if (!origin) return;
      for (const trigger of origin.querySelectorAll<HTMLElement>('[uiOverlayTrigger]')) {
        trigger.setAttribute('aria-haspopup', this.role() === 'region' ? 'true' : this.role());
        trigger.setAttribute('aria-expanded', String(this.open()));
        trigger.setAttribute('aria-controls', this.panelId());
        if (this.disabled()) trigger.setAttribute('aria-disabled', 'true');
        else trigger.removeAttribute('aria-disabled');
      }
    });
  }

  protected onTriggerClick(event: MouseEvent): void {
    if (this.disabled()) return;
    const target = event.target as Element | null;
    if (target?.closest('[uiOverlayTrigger]')) this.openChange.emit(!this.open());
  }

  protected onTriggerKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;
    const target = event.target as Element | null;
    if (!target?.closest('[uiOverlayTrigger]')) return;
    if ((event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') && !this.open()) {
      event.preventDefault();
      this.openChange.emit(true);
    }
  }

  protected onAttach(): void {
    this.restoreFocusTo =
      this.document.activeElement instanceof HTMLElement ? this.document.activeElement : null;
    this.opened.emit();
    queueMicrotask(() => {
      const panel = this.panel()?.nativeElement;
      if (!panel) return;
      if (this.initialFocus() === 'panel') panel.focus();
      if (this.initialFocus() === 'first') this.firstFocusable(panel)?.focus();
    });
  }

  protected onDetach(): void {
    this.closed.emit();
    if (this.open()) this.openChange.emit(false);
    if (this.restoreFocus()) {
      queueMicrotask(() => {
        if (this.restoreFocusTo?.isConnected) this.restoreFocusTo.focus();
        this.restoreFocusTo = null;
      });
    }
  }

  protected onBackdropClick(event: MouseEvent): void {
    this.backdropClick.emit(event);
    if (this.closeOnBackdrop()) this.openChange.emit(false);
  }

  protected onOutsideClick(event: MouseEvent): void {
    const origin = this.originElement()?.nativeElement;
    if (origin?.contains(event.target as Node)) return;
    this.outsideClick.emit(event);
    if (this.closeOnOutside()) this.openChange.emit(false);
  }

  protected onOverlayKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') return;
    this.escapeKeyDown.emit();
    if (this.closeOnEscape()) this.openChange.emit(false);
    event.preventDefault();
    event.stopPropagation();
  }

  protected onPositionChange(event: ConnectedOverlayPositionChange): void {
    const position = event.connectionPair;
    const placement = this.fromConnectedPosition(position);
    this.positionChange.emit({ placement, alignment: this.alignment() });
  }

  private toConnectedPosition(
    placement: UiOverlayPlacement,
    alignment: UiOverlayAlignment,
  ): ConnectedPosition {
    const horizontal = alignment === 'center' ? 'center' : alignment === 'start' ? 'start' : 'end';
    const vertical = alignment === 'center' ? 'center' : alignment === 'start' ? 'top' : 'bottom';
    const positions: Record<UiOverlayPlacement, ConnectedPosition> = {
      top: {
        originX: horizontal,
        originY: 'top',
        overlayX: horizontal,
        overlayY: 'bottom',
        offsetX: this.crossAxisOffset(),
        offsetY: -Math.abs(this.gap()),
      },
      bottom: {
        originX: horizontal,
        originY: 'bottom',
        overlayX: horizontal,
        overlayY: 'top',
        offsetX: this.crossAxisOffset(),
        offsetY: Math.abs(this.gap()),
      },
      left: {
        originX: 'start',
        originY: vertical,
        overlayX: 'end',
        overlayY: vertical,
        offsetX: -Math.abs(this.gap()),
        offsetY: this.crossAxisOffset(),
      },
      right: {
        originX: 'end',
        originY: vertical,
        overlayX: 'start',
        overlayY: vertical,
        offsetX: Math.abs(this.gap()),
        offsetY: this.crossAxisOffset(),
      },
    };
    return positions[placement];
  }

  private fromConnectedPosition(position: ConnectedPosition): UiOverlayPlacement {
    if (position.originY === 'top' && position.overlayY === 'bottom') return 'top';
    if (position.originY === 'bottom' && position.overlayY === 'top') return 'bottom';
    if (position.originX === 'start' && position.overlayX === 'end') return 'left';
    return 'right';
  }

  private firstFocusable(root: HTMLElement): HTMLElement | null {
    return root.querySelector<HTMLElement>(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
  }
}

@Directive({ selector: '[uiOverlayTrigger]', standalone: true })
export class UiOverlayTriggerDirective {}

@Directive({ selector: '[uiOverlayContent]', standalone: true })
export class UiOverlayContentDirective {}
