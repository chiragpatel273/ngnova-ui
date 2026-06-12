import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { UiModalComponent } from './modal';

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
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
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
});
