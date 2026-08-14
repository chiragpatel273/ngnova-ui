import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { UiCardComponent } from '../../../../card/src/card';

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

    const card = fixture.nativeElement.querySelector('ui-card > div') as HTMLDivElement;
    expect(card.children[0].textContent).toContain('Header');
    expect(card.children[1].textContent).toContain('Body');
    expect(card.children[2].textContent).toContain('Footer');
  });

  it('applies every card variant and padding class', () => {
    const cardFixture = TestBed.createComponent(UiCardComponent);
    cardFixture.detectChanges();
    const card = cardFixture.nativeElement.querySelector(':scope > div') as HTMLDivElement;
    const body = card.children[1] as HTMLDivElement;

    expect(card.className).toContain('border-slate-200');
    expect(body.className).toContain('p-5');

    cardFixture.componentRef.setInput('variant', 'elevated');
    cardFixture.detectChanges();
    expect(card.className).toContain('shadow-md');
    expect(card.className).toContain('dark:shadow-black/30');

    const paddingClasses = [
      ['none', 'p-0'],
      ['sm', 'p-4'],
      ['lg', 'p-6'],
    ] as const;
    for (const [padding, expectedClass] of paddingClasses) {
      cardFixture.componentRef.setInput('padding', padding);
      cardFixture.detectChanges();
      expect(body.className).toContain(expectedClass);
    }
  });

  it('is semantically neutral unless promoted to a named region', () => {
    const cardFixture = TestBed.createComponent(UiCardComponent);
    cardFixture.detectChanges();
    const card = cardFixture.nativeElement.querySelector(':scope > div') as HTMLDivElement;

    expect(card.getAttribute('role')).toBeNull();
    expect(card.getAttribute('aria-label')).toBeNull();

    cardFixture.componentRef.setInput('ariaLabel', 'Billing summary');
    cardFixture.detectChanges();

    expect(card.getAttribute('role')).toBe('region');
    expect(card.getAttribute('aria-label')).toBe('Billing summary');
  });

  it('keeps optional empty slots collapsible and media content clipped', () => {
    const cardFixture = TestBed.createComponent(UiCardComponent);
    cardFixture.detectChanges();
    const card = cardFixture.nativeElement.querySelector(':scope > div') as HTMLDivElement;
    const header = card.children[0] as HTMLDivElement;
    const footer = card.children[2] as HTMLDivElement;

    expect(header.className).toContain('ui-card-slot');
    expect(header.textContent?.trim()).toBe('');
    expect(footer.className).toContain('ui-card-slot');
    expect(footer.textContent?.trim()).toBe('');
    expect(card.className).toContain('overflow-hidden');
    expect(card.className).toContain('dark:bg-slate-900');
    expect(card.className).toContain('dark:border-slate-700');
    expect(cardFixture.nativeElement.className).toContain('block');
  });
});
