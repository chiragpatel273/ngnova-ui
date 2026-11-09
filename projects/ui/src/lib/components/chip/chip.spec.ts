import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiChipComponent } from '../../../../chip/src/chip';
import { provideUiChipLabels } from '../../../../chip/src/chip-labels';
@Component({
  standalone: true,
  imports: [UiChipComponent],
  template: `<ui-chip
    selectable
    removable
    [(selected)]="selected"
    [disabled]="disabled"
    (removed)="removed = true"
    >Angular</ui-chip
  >`,
})
class HostComponent {
  selected = false;
  disabled = false;
  removed = false;
}
describe('UiChipComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
  });
  it('toggles controlled selection with pressed semantics', () => {
    const f = TestBed.createComponent(HostComponent);
    f.detectChanges();
    const b = f.nativeElement.querySelector('[aria-pressed]') as HTMLButtonElement;
    expect(b.textContent?.trim()).toBe('Angular');
    expect(b.getAttribute('aria-pressed')).toBe('false');
    b.click();
    f.detectChanges();
    expect(f.componentInstance.selected).toBe(true);
    expect(b.getAttribute('aria-pressed')).toBe('true');
  });
  it('emits removal from a separately named button', () => {
    const f = TestBed.createComponent(HostComponent);
    f.detectChanges();
    const b = f.nativeElement.querySelector('[aria-label="Remove"]') as HTMLButtonElement;
    b.click();
    expect(f.componentInstance.removed).toBe(true);
  });
  it('blocks selection and removal while disabled', () => {
    const f = TestBed.createComponent(HostComponent);
    f.componentInstance.disabled = true;
    f.detectChanges();
    const buttons = f.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    buttons.forEach((b) => b.click());
    expect(f.componentInstance.selected).toBe(false);
    expect(f.componentInstance.removed).toBe(false);
    expect(Array.from(buttons).every((b) => b.disabled)).toBe(true);
  });
});

describe('UiChipComponent labels', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UiChipComponent],
      providers: [provideUiChipLabels({ remove: 'Retirer' })],
    });
  });

  it('uses provided labels for the remove button', () => {
    const f = TestBed.createComponent(UiChipComponent);
    f.componentRef.setInput('removable', true);
    f.detectChanges();
    expect(f.nativeElement.querySelector('button').getAttribute('aria-label')).toBe('Retirer');
  });

  it('lets an explicit input win over provided labels', () => {
    const f = TestBed.createComponent(UiChipComponent);
    f.componentRef.setInput('removable', true);
    f.componentRef.setInput('removeAriaLabel', 'Remove filter');
    f.detectChanges();
    expect(f.nativeElement.querySelector('button').getAttribute('aria-label')).toBe(
      'Remove filter',
    );
  });
});
