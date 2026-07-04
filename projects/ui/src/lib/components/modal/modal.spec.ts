import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { UiModalComponent } from '../../../../modal/src/modal';

@Component({
  standalone: true,
  imports: [UiModalComponent],
  template: `
    <ui-modal [(open)]="open">
      <span uiModalHeader>Confirm</span>
      Body
      <button uiModalFooter type="button">OK</button>
    </ui-modal>
  `,
})
class HostComponent {
  open = true;
}

describe('UiModalComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    document.body.style.overflow = '';
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    document.body.style.overflow = '';
  });

  it('renders projected dialog content', () => {
    expect(fixture.nativeElement.textContent).toContain('Confirm');
    expect(fixture.nativeElement.textContent).toContain('Body');
  });

  it('closes on Escape', () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();

    expect(fixture.componentInstance.open).toBe(false);
  });

  it('generates unique title ids', () => {
    const first = TestBed.createComponent(UiModalComponent).componentInstance;
    const second = TestBed.createComponent(UiModalComponent).componentInstance;

    expect(first.titleId).not.toBe(second.titleId);
  });

  it('supports aria-label for headerless dialogs', () => {
    const modalFixture = TestBed.createComponent(UiModalComponent);
    modalFixture.componentInstance.open = true;
    modalFixture.componentInstance.ariaLabel = 'Quick settings';
    modalFixture.detectChanges();

    const dialog = modalFixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement;

    expect(dialog.getAttribute('aria-label')).toBe('Quick settings');
    expect(dialog.getAttribute('aria-labelledby')).toBeNull();

    modalFixture.destroy();
  });

  it('keeps keyboard focus inside the dialog', () => {
    const dialog = fixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement;
    dialog.focus();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true }));

    const footerButton = fixture.nativeElement.querySelector(
      '[uiModalFooter]',
    ) as HTMLButtonElement;
    expect(document.activeElement).toBe(footerButton);
  });

  it('locks body scroll while open', () => {
    fixture.destroy();
    document.body.style.overflow = '';

    const modalFixture = TestBed.createComponent(UiModalComponent);
    modalFixture.componentRef.setInput('open', true);
    modalFixture.detectChanges();

    expect(document.body.style.overflow).toBe('hidden');

    modalFixture.componentRef.setInput('open', false);
    modalFixture.detectChanges();

    expect(document.body.style.overflow).toBe('');
    modalFixture.destroy();
  });
});
