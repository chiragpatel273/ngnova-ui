import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type {
  UiButtonAppearance,
  UiButtonIntent,
  UiButtonSize,
  UiButtonType,
  UiButtonVariant,
} from '../../../../button/src/button';
import { UiButtonComponent, UiButtonGroupComponent } from '../../../../button/src/button';

@Component({
  standalone: true,
  imports: [UiButtonComponent],
  template: `
    <ui-button
      [disabled]="disabled"
      [loading]="loading"
      (pressed)="pressedEvents.push($event)"
      (focused)="focusedEvents.push($event)"
      (blurred)="blurredEvents.push($event)"
    >
      Save
    </ui-button>
  `,
})
class HostComponent {
  disabled = false;
  loading = false;
  pressedEvents: MouseEvent[] = [];
  focusedEvents: FocusEvent[] = [];
  blurredEvents: FocusEvent[] = [];
}

@Component({
  standalone: true,
  imports: [UiButtonComponent, UiButtonGroupComponent],
  template: `
    <ui-button-group ariaLabel="Table density">
      <ui-button variant="outline">Compact</ui-button>
      <ui-button variant="outline">Comfortable</ui-button>
      <ui-button variant="outline">Spacious</ui-button>
    </ui-button-group>
  `,
})
class ButtonGroupHostComponent {}

describe('UiButtonComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('emits pressed when enabled', () => {
    fixture.nativeElement.querySelector('button').click();

    expect(fixture.componentInstance.pressedEvents.length).toBe(1);
  });

  it('lets native click events bubble for DOM-aligned behavior', () => {
    let bubbled = false;
    fixture.nativeElement.addEventListener('click', () => {
      bubbled = true;
    });

    fixture.nativeElement.querySelector('button').click();

    expect(bubbled).toBe(true);
  });

  it('emits focused and blurred while forwarding native focus events from the host', () => {
    const host = fixture.nativeElement.querySelector('ui-button') as HTMLElement;
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const hostFocusEvents: string[] = [];

    host.addEventListener('focus', () => hostFocusEvents.push('focus'));
    host.addEventListener('blur', () => hostFocusEvents.push('blur'));

    button.dispatchEvent(new FocusEvent('focus'));
    button.dispatchEvent(new FocusEvent('blur'));

    expect(fixture.componentInstance.focusedEvents.length).toBe(1);
    expect(fixture.componentInstance.blurredEvents.length).toBe(1);
    expect(hostFocusEvents).toEqual(['focus', 'blur']);
  });

  it('passes through supported native button types', () => {
    const supportedTypes: UiButtonType[] = ['button', 'submit', 'reset'];

    for (const type of supportedTypes) {
      const buttonFixture = TestBed.createComponent(UiButtonComponent);
      buttonFixture.componentRef.setInput('type', type);
      buttonFixture.detectChanges();

      const button = buttonFixture.nativeElement.querySelector('button') as HTMLButtonElement;

      expect(button.getAttribute('type')).toBe(type);
    }
  });

  it('passes through ariaLabel for accessible icon-only labels', () => {
    const buttonFixture = TestBed.createComponent(UiButtonComponent);
    buttonFixture.componentRef.setInput('ariaLabel', 'Save release notes');
    buttonFixture.detectChanges();

    const button = buttonFixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(button.getAttribute('aria-label')).toBe('Save release notes');
  });

  it('disables activation when disabled or loading', () => {
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    const disabledButton = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    disabledButton.click();

    fixture.componentInstance.disabled = false;
    fixture.componentInstance.loading = true;
    fixture.componentInstance.pressedEvents = [];
    fixture.detectChanges();

    const loadingButton = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    loadingButton.click();

    expect(disabledButton.disabled).toBe(true);
    expect(loadingButton.disabled).toBe(true);
    expect(fixture.componentInstance.pressedEvents).toEqual([]);
  });

  it('renders loading state with aria-busy, disabled state, spinner, and screen-reader text', () => {
    const buttonFixture = TestBed.createComponent(UiButtonComponent);
    buttonFixture.componentRef.setInput('loading', true);
    buttonFixture.componentRef.setInput('loadingLabel', 'Publishing release');
    buttonFixture.detectChanges();

    const button = buttonFixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const spinner = buttonFixture.nativeElement.querySelector(
      '[aria-hidden="true"]',
    ) as HTMLElement;
    const srText = buttonFixture.nativeElement.querySelector('.sr-only') as HTMLElement;

    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(spinner.className).toContain('animate-spin');
    expect(srText.textContent?.trim()).toBe('Publishing release');
  });

  it('only sets aria-busy while loading', () => {
    const buttonFixture = TestBed.createComponent(UiButtonComponent);
    buttonFixture.detectChanges();

    const button = buttonFixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.getAttribute('aria-busy')).toBeNull();

    buttonFixture.componentRef.setInput('loading', true);
    buttonFixture.detectChanges();

    expect(button.getAttribute('aria-busy')).toBe('true');
  });

  it('supports intent and appearance combinations while preserving legacy variants', () => {
    const buttonFixture = TestBed.createComponent(UiButtonComponent);
    buttonFixture.componentRef.setInput('intent', 'success');
    buttonFixture.componentRef.setInput('appearance', 'outline');
    buttonFixture.detectChanges();

    const button = buttonFixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(button.className).toContain('border-emerald-300');
    expect(button.className).toContain('dark:text-emerald-300');

    const legacyFixture = TestBed.createComponent(UiButtonComponent);
    legacyFixture.componentRef.setInput('variant', 'danger');
    legacyFixture.detectChanges();

    const legacyButton = legacyFixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(legacyButton.className).toContain('bg-red-600');
  });

  it('covers all current appearance and intent class map entries', () => {
    const appearances: UiButtonAppearance[] = ['solid', 'outline', 'ghost', 'text', 'tonal'];
    const intents: UiButtonIntent[] = [
      'primary',
      'secondary',
      'success',
      'warning',
      'danger',
      'neutral',
    ];

    for (const appearance of appearances) {
      for (const intent of intents) {
        const buttonFixture = TestBed.createComponent(UiButtonComponent);
        buttonFixture.componentRef.setInput('appearance', appearance);
        buttonFixture.componentRef.setInput('intent', intent);
        buttonFixture.detectChanges();

        const button = buttonFixture.nativeElement.querySelector('button') as HTMLButtonElement;

        expect(button.className).toContain('dark:');
      }
    }
  });

  it('applies every current variant with dark-mode-ready classes', () => {
    const variants: Record<UiButtonVariant, readonly string[]> = {
      primary: ['bg-blue-600', 'dark:bg-blue-500', 'dark:hover:bg-blue-400'],
      secondary: ['bg-slate-100', 'dark:bg-slate-800', 'dark:hover:bg-slate-700'],
      outline: ['border', 'dark:border-slate-700', 'dark:bg-slate-950'],
      ghost: ['bg-transparent', 'dark:text-slate-200', 'dark:hover:bg-slate-800'],
      danger: ['bg-red-600', 'dark:bg-red-500', 'dark:hover:bg-red-400'],
    };

    for (const [variant, expectedClasses] of Object.entries(variants) as [
      UiButtonVariant,
      readonly string[],
    ][]) {
      const buttonFixture = TestBed.createComponent(UiButtonComponent);
      buttonFixture.componentRef.setInput('variant', variant);
      buttonFixture.detectChanges();

      const className = (buttonFixture.nativeElement.querySelector('button') as HTMLButtonElement)
        .className;

      for (const expectedClass of expectedClasses) {
        expect(className).toContain(expectedClass);
      }
    }
  });

  it('applies every current size', () => {
    const sizes: Record<UiButtonSize, readonly string[]> = {
      sm: ['h-8', 'px-3', 'text-sm'],
      md: ['h-10', 'px-4', 'text-sm'],
      lg: ['h-12', 'px-5', 'text-base'],
    };

    for (const [size, expectedClasses] of Object.entries(sizes) as [
      UiButtonSize,
      readonly string[],
    ][]) {
      const buttonFixture = TestBed.createComponent(UiButtonComponent);
      buttonFixture.componentRef.setInput('size', size);
      buttonFixture.detectChanges();

      const className = (buttonFixture.nativeElement.querySelector('button') as HTMLButtonElement)
        .className;

      for (const expectedClass of expectedClasses) {
        expect(className).toContain(expectedClass);
      }
    }
  });

  it('supports full width layout and keeps enabled pointer affordance', () => {
    const buttonFixture = TestBed.createComponent(UiButtonComponent);
    buttonFixture.componentRef.setInput('fullWidth', true);
    buttonFixture.detectChanges();

    const className = (buttonFixture.nativeElement.querySelector('button') as HTMLButtonElement)
      .className;

    expect(className).toContain('w-full');
    expect(className).toContain('cursor-pointer');
  });

  it('groups projected ui-button actions with accessible group semantics', () => {
    const groupFixture = TestBed.createComponent(ButtonGroupHostComponent);
    groupFixture.detectChanges();

    const group = groupFixture.nativeElement.querySelector('[role="group"]') as HTMLElement;
    const buttons = groupFixture.nativeElement.querySelectorAll('ui-button');

    expect(group.getAttribute('aria-label')).toBe('Table density');
    expect(group.className).toContain('inline-flex');
    expect(group.className).toContain('overflow-hidden');
    expect(buttons.length).toBe(3);
  });

  it('supports full-width grouped actions', () => {
    const groupFixture = TestBed.createComponent(UiButtonGroupComponent);
    groupFixture.componentRef.setInput('fullWidth', true);
    groupFixture.detectChanges();

    const group = groupFixture.nativeElement.querySelector('[role="group"]') as HTMLElement;

    expect(group.className).toContain('w-full');
    expect(group.className).toContain('[&_ui-button_button]:w-full');
  });
});
