import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { UiTagComponent } from '../../../../tag/src/tag';

@Component({
  standalone: true,
  imports: [UiTagComponent],
  template: `<ui-tag removable (removed)="removed = true">Angular</ui-tag>`,
})
class HostComponent {
  removed = false;
}

describe('UiTagComponent', () => {
  it('emits removed from the remove button', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture: ComponentFixture<HostComponent> = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();

    expect(fixture.componentInstance.removed).toBe(true);
  });

  it('applies semantic variant classes', async () => {
    await TestBed.configureTestingModule({ imports: [UiTagComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UiTagComponent);
    fixture.componentRef.setInput('variant', 'success');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('span').className).toContain('emerald');
  });
});
