import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type { UiButtonAppearance, UiButtonIntent } from '../../../../button/src/button';
import { UiButtonComponent } from '../../../../button/src/button';

@Component({
  standalone: true,
  imports: [UiButtonComponent],
  template: `<ui-button [loading]="loading" (click)="clicked = true">Save</ui-button>`,
})
class HostComponent {
  loading = false;
  clicked = false;
}

describe('UiButtonComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('emits click when enabled', () => {
    fixture.nativeElement.querySelector('button').click();

    expect(fixture.componentInstance.clicked).toBe(true);
  });

  it('lets native click events bubble for DOM-aligned behavior', () => {
    let bubbled = false;
    fixture.nativeElement.addEventListener('click', () => {
      bubbled = true;
    });

    fixture.nativeElement.querySelector('button').click();

    expect(bubbled).toBe(true);
  });

  it('disables clicks while loading', () => {
    const buttonFixture = TestBed.createComponent(UiButtonComponent);
    buttonFixture.componentInstance.loading = true;
    let emitted = false;
    buttonFixture.nativeElement.addEventListener('click', () => {
      emitted = true;
    });
    buttonFixture.detectChanges();

    buttonFixture.nativeElement.querySelector('button').click();

    expect(emitted).toBe(false);
  });

  it('supports full width layout', () => {
    const buttonFixture = TestBed.createComponent(UiButtonComponent);
    buttonFixture.componentInstance.fullWidth = true;
    buttonFixture.detectChanges();

    expect(buttonFixture.nativeElement.querySelector('button').className).toContain('w-full');
  });

  it('uses a pointer cursor for enabled buttons', () => {
    const buttonFixture = TestBed.createComponent(UiButtonComponent);
    buttonFixture.detectChanges();

    expect(buttonFixture.nativeElement.querySelector('button').className).toContain(
      'cursor-pointer',
    );
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

  it('only sets aria-busy while loading', () => {
    const buttonFixture = TestBed.createComponent(UiButtonComponent);
    buttonFixture.detectChanges();

    const button = buttonFixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.getAttribute('aria-busy')).toBeNull();

    buttonFixture.componentRef.setInput('loading', true);
    buttonFixture.detectChanges();

    expect(button.getAttribute('aria-busy')).toBe('true');
  });
});
