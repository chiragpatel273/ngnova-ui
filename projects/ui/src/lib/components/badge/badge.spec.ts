import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { UiBadgeComponent } from '../../../../badge/src/badge';

describe('UiBadgeComponent', () => {
  let fixture: ComponentFixture<UiBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [UiBadgeComponent] }).compileComponents();
    fixture = TestBed.createComponent(UiBadgeComponent);
    fixture.componentInstance.variant = 'success';
    fixture.detectChanges();
  });

  it('applies variant classes', () => {
    expect(fixture.nativeElement.querySelector('span').className).toContain('emerald');
  });

  it('passes through role and aria-label', () => {
    fixture.componentRef.setInput('ariaRole', 'status');
    fixture.componentRef.setInput('ariaLabel', 'Success status');
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('span') as HTMLSpanElement;
    expect(badge.getAttribute('role')).toBe('status');
    expect(badge.getAttribute('aria-label')).toBe('Success status');
  });
});
