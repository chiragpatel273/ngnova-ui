import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { UiCardComponent } from './card';

@Component({
  standalone: true,
  imports: [UiCardComponent],
  template: `
    <ui-card>
      <div uiCardHeader>Header</div>
      Body
      <div uiCardFooter>Footer</div>
    </ui-card>
  `,
})
class HostComponent {}

describe('UiCardComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('projects header, body, and footer content', () => {
    expect(fixture.nativeElement.textContent).toContain('Header');
    expect(fixture.nativeElement.textContent).toContain('Body');
    expect(fixture.nativeElement.textContent).toContain('Footer');
  });

  it('applies card variant and padding classes', () => {
    const cardFixture = TestBed.createComponent(UiCardComponent);
    cardFixture.componentInstance.variant = 'elevated';
    cardFixture.componentInstance.padding = 'lg';
    cardFixture.detectChanges();

    expect(cardFixture.nativeElement.querySelector('section').className).toContain('shadow-md');
    expect(cardFixture.nativeElement.querySelectorAll('div')[1].className).toContain('p-6');
  });
});
