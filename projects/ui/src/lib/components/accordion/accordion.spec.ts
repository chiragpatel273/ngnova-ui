import { Component, signal } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type { UiAccordionItem } from './accordion';
import { UiAccordionComponent } from './accordion';

@Component({
  standalone: true,
  imports: [UiAccordionComponent],
  template: `<ui-accordion
    [items]="items"
    [active]="active()"
    (activeChange)="active.set($event)"
  />`,
})
class HostComponent {
  readonly active = signal<readonly string[]>([]);
  readonly items: readonly UiAccordionItem[] = [
    { value: 'overview', title: 'Overview', content: 'Overview content' },
    { value: 'api', title: 'API', content: 'API content' },
  ];
}

describe('UiAccordionComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('emits activeChange when an item is toggled', () => {
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();

    expect(fixture.componentInstance.active()).toEqual(['overview']);
    expect(fixture.nativeElement.textContent).toContain('Overview content');
  });
});
