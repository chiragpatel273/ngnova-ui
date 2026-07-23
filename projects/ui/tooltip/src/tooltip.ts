import {
  booleanAttribute,
  Directive,
  ElementRef,
  effect,
  inject,
  input,
  numberAttribute,
  Renderer2,
} from '@angular/core';
import type { OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type UiTooltipPosition = 'top' | 'right' | 'bottom' | 'left';

let nextTooltipId = 0;

@Directive({
  selector: '[uiTooltip]',
  standalone: true,
  host: {
    '(mouseenter)': 'scheduleShow()',
    '(mouseleave)': 'scheduleHide()',
    '(focus)': 'scheduleShow()',
    '(blur)': 'scheduleHide()',
    '(keydown)': 'handleKeydown($event)',
  },
})
export class UiTooltipDirective implements OnDestroy {
  readonly uiTooltip = input.required<string>();
  readonly tooltipPosition = input<UiTooltipPosition>('top');
  readonly tooltipShowDelay = input(500, { transform: numberAttribute });
  readonly tooltipHideDelay = input(100, { transform: numberAttribute });
  readonly tooltipDisabled = input(false, { transform: booleanAttribute });
  readonly tooltipId = input(`ui-tooltip-${++nextTooltipId}`);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly document = inject(DOCUMENT);
  private readonly renderer = inject(Renderer2);
  private tooltipElement: HTMLDivElement | null = null;
  private showTimer: ReturnType<typeof setTimeout> | null = null;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly cleanupListeners: (() => void)[] = [];
  private readonly synchronizeTooltip = effect(() => {
    const text = this.uiTooltip().trim();
    const disabled = this.tooltipDisabled();
    if (!this.tooltipElement) {
      return;
    }
    if (disabled || !text) {
      this.hide();
    } else {
      this.tooltipElement.textContent = text;
      this.positionTooltip();
    }
  });

  protected scheduleShow(): void {
    this.clearTimer('hide');
    if (this.tooltipDisabled() || !this.uiTooltip().trim() || this.tooltipElement) {
      return;
    }

    this.clearTimer('show');
    const delay = Math.max(0, this.tooltipShowDelay());
    if (delay === 0) {
      this.show();
    } else {
      this.showTimer = setTimeout(() => this.show(), delay);
    }
  }

  protected scheduleHide(): void {
    this.clearTimer('show');
    if (!this.tooltipElement) {
      return;
    }

    this.clearTimer('hide');
    const delay = Math.max(0, this.tooltipHideDelay());
    if (delay === 0) {
      this.hide();
    } else {
      this.hideTimer = setTimeout(() => this.hide(), delay);
    }
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.tooltipElement) {
      event.stopPropagation();
      this.hide();
    }
  }

  ngOnDestroy(): void {
    this.clearTimer('show');
    this.clearTimer('hide');
    this.hide();
  }

  private show(): void {
    this.showTimer = null;
    const view = this.document.defaultView;
    if (!view || this.tooltipDisabled() || !this.uiTooltip().trim() || this.tooltipElement) {
      return;
    }

    const tooltip = this.document.createElement('div');
    tooltip.id = this.tooltipId();
    tooltip.setAttribute('role', 'tooltip');
    tooltip.className =
      'pointer-events-auto fixed z-[1000] max-w-xs rounded-[var(--ui-radius-sm,0.375rem)] bg-slate-950 px-2.5 py-1.5 text-xs leading-5 text-white shadow-md motion-reduce:transition-none dark:bg-slate-100 dark:text-slate-950';
    tooltip.textContent = this.uiTooltip().trim();
    tooltip.style.visibility = 'hidden';
    this.renderer.appendChild(this.document.body, tooltip);
    this.tooltipElement = tooltip;
    this.addDescription(tooltip.id);
    this.positionTooltip();
    tooltip.style.visibility = 'visible';

    this.cleanupListeners.push(
      this.renderer.listen(view, 'resize', () => this.positionTooltip()),
      this.renderer.listen(view, 'scroll', () => this.positionTooltip()),
      this.renderer.listen(tooltip, 'mouseenter', () => this.clearTimer('hide')),
      this.renderer.listen(tooltip, 'mouseleave', () => this.scheduleHide()),
    );
  }

  private hide(): void {
    this.clearTimer('hide');
    for (const cleanup of this.cleanupListeners.splice(0)) {
      cleanup();
    }

    if (!this.tooltipElement) {
      return;
    }

    this.removeDescription(this.tooltipElement.id);
    this.renderer.removeChild(this.document.body, this.tooltipElement);
    this.tooltipElement = null;
  }

  private positionTooltip(): void {
    const tooltip = this.tooltipElement;
    const view = this.document.defaultView;
    if (!tooltip || !view) {
      return;
    }

    const trigger = this.host.getBoundingClientRect();
    const floating = tooltip.getBoundingClientRect();
    const gap = 8;
    const edge = 8;
    let position = this.tooltipPosition();

    if (position === 'top' && trigger.top < floating.height + gap + edge) position = 'bottom';
    if (position === 'bottom' && view.innerHeight - trigger.bottom < floating.height + gap + edge)
      position = 'top';
    if (position === 'left' && trigger.left < floating.width + gap + edge) position = 'right';
    if (position === 'right' && view.innerWidth - trigger.right < floating.width + gap + edge)
      position = 'left';

    const centerX = Math.min(
      Math.max(trigger.left + trigger.width / 2, edge + floating.width / 2),
      view.innerWidth - edge - floating.width / 2,
    );
    const centerY = Math.min(
      Math.max(trigger.top + trigger.height / 2, edge + floating.height / 2),
      view.innerHeight - edge - floating.height / 2,
    );

    const placements: Record<UiTooltipPosition, readonly [number, number, string]> = {
      top: [centerX, trigger.top - gap, 'translate(-50%, -100%)'],
      right: [trigger.right + gap, centerY, 'translate(0, -50%)'],
      bottom: [centerX, trigger.bottom + gap, 'translate(-50%, 0)'],
      left: [trigger.left - gap, centerY, 'translate(-100%, -50%)'],
    };
    const [left, top, transform] = placements[position];
    tooltip.dataset['position'] = position;
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.style.transform = transform;
  }

  private addDescription(id: string): void {
    const values = new Set(
      (this.host.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean),
    );
    values.add(id);
    this.renderer.setAttribute(this.host, 'aria-describedby', [...values].join(' '));
  }

  private removeDescription(id: string): void {
    const values = (this.host.getAttribute('aria-describedby') ?? '')
      .split(/\s+/)
      .filter((value) => value && value !== id);
    if (values.length > 0) {
      this.renderer.setAttribute(this.host, 'aria-describedby', values.join(' '));
    } else {
      this.renderer.removeAttribute(this.host, 'aria-describedby');
    }
  }

  private clearTimer(timer: 'show' | 'hide'): void {
    const handle = timer === 'show' ? this.showTimer : this.hideTimer;
    if (handle) {
      clearTimeout(handle);
    }
    if (timer === 'show') this.showTimer = null;
    else this.hideTimer = null;
  }
}
