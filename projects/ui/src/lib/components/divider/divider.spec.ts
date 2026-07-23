import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiDividerComponent } from '../../../../divider/src/divider';

@Component({
  standalone: true,
  imports: [UiDividerComponent],
  template: `<ui-divider
    [orientation]="orientation"
    [inset]="inset"
    [decorative]="decorative"
    [label]="label"
  />`,
})
class HostComponent {
  orientation: 'horizontal' | 'vertical' = 'horizontal';
  inset: 'none' | 'start' | 'end' | 'both' = 'none';
  decorative = true;
  label = '';
}

describe('UiDividerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
  });
  it('is decorative by default', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const divider = fixture.nativeElement.querySelector('div') as HTMLElement;
    expect(divider.getAttribute('role')).toBe('presentation');
    expect(divider.getAttribute('aria-hidden')).toBe('true');
  });
  it('exposes named separator semantics when meaningful', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.decorative = false;
    fixture.componentInstance.label = 'Billing';
    fixture.detectChanges();
    const divider = fixture.nativeElement.querySelector('div') as HTMLElement;
    expect(divider.getAttribute('role')).toBe('separator');
    expect(divider.getAttribute('aria-orientation')).toBe('horizontal');
    expect(divider.getAttribute('aria-label')).toBe('Billing');
    expect(divider.textContent).toContain('Billing');
  });
  it('supports vertical orientation and every inset mode', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.orientation = 'vertical';
    fixture.componentInstance.inset = 'both';
    fixture.componentInstance.decorative = false;
    fixture.detectChanges();
    const divider = fixture.nativeElement.querySelector('div') as HTMLElement;
    expect(divider.className).toContain('border-l');
    expect(divider.className).toContain('my-2');
    expect(divider.getAttribute('aria-orientation')).toBe('vertical');
  });
});
