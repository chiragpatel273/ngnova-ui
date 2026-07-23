import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { UiTooltipDirective } from '../../../../tooltip/src/tooltip';

@Component({
  standalone: true,
  imports: [UiTooltipDirective],
  template: `
    <button
      aria-describedby="existing-description"
      [uiTooltip]="message"
      [tooltipPosition]="position"
      [tooltipShowDelay]="0"
      [tooltipHideDelay]="0"
      [tooltipDisabled]="disabled"
    >
      Trigger
    </button>
  `,
})
class HostComponent {
  message = 'Helpful context';
  position: 'top' | 'right' | 'bottom' | 'left' = 'top';
  disabled = false;
}

describe('UiTooltipDirective', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.querySelectorAll('[role="tooltip"]').forEach((tooltip) => tooltip.remove());
  });

  it('shows on hover with tooltip semantics and preserves existing descriptions', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    vi.runAllTimers();

    const tooltip = document.querySelector('[role="tooltip"]') as HTMLElement;
    expect(tooltip.textContent).toBe('Helpful context');
    expect(trigger.getAttribute('aria-describedby')?.split(' ')).toEqual([
      'existing-description',
      tooltip.id,
    ]);

    trigger.dispatchEvent(new MouseEvent('mouseleave'));
    vi.runAllTimers();
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
    expect(trigger.getAttribute('aria-describedby')).toBe('existing-description');
  });

  it('shows on focus and dismisses immediately with Escape', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    trigger.dispatchEvent(new FocusEvent('focus'));
    vi.runAllTimers();
    expect(document.querySelector('[role="tooltip"]')).not.toBeNull();

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
  });

  it('does not show when disabled or empty', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    vi.runAllTimers();
    expect(document.querySelector('[role="tooltip"]')).toBeNull();

    fixture.componentInstance.disabled = false;
    fixture.componentInstance.message = '   ';
    fixture.detectChanges();
    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    vi.runAllTimers();
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
  });

  it('falls back to the opposite side when the requested position collides', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    vi.spyOn(trigger, 'getBoundingClientRect').mockReturnValue({
      x: 100,
      y: 0,
      top: 0,
      right: 140,
      bottom: 32,
      left: 100,
      width: 40,
      height: 32,
      toJSON: () => ({}),
    });
    trigger.dispatchEvent(new FocusEvent('focus'));
    vi.runAllTimers();

    expect((document.querySelector('[role="tooltip"]') as HTMLElement).dataset['position']).toBe(
      'bottom',
    );
  });

  it('cleans up the overlay and description when destroyed', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    trigger.dispatchEvent(new FocusEvent('focus'));
    vi.runAllTimers();
    expect(document.querySelector('[role="tooltip"]')).not.toBeNull();

    fixture.destroy();
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
    expect(trigger.getAttribute('aria-describedby')).toBe('existing-description');
  });
});
