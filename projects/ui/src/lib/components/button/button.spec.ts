import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { UiButtonComponent } from './button';

@Component({
  standalone: true,
  imports: [UiButtonComponent],
  template: `<ui-button [loading]="loading" (pressed)="clicked = true">Save</ui-button>`,
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

  it('emits pressed when enabled', () => {
    fixture.nativeElement.querySelector('button').click();

    expect(fixture.componentInstance.clicked).toBe(true);
  });

  it('disables clicks while loading', () => {
    const buttonFixture = TestBed.createComponent(UiButtonComponent);
    buttonFixture.componentInstance.loading = true;
    let emitted = false;
    buttonFixture.componentInstance.pressed.subscribe(() => {
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
});
