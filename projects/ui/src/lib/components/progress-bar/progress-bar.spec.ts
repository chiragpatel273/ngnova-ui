import { TestBed } from '@angular/core/testing';

import { UiProgressBarComponent } from '../../../../progress-bar/src/progress-bar';

describe('UiProgressBarComponent', () => {
  it('exposes determinate progress semantics', async () => {
    await TestBed.configureTestingModule({ imports: [UiProgressBarComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UiProgressBarComponent);
    fixture.componentRef.setInput('value', 40);
    fixture.componentRef.setInput('max', 80);
    fixture.detectChanges();

    const progress = fixture.nativeElement.querySelector('[role="progressbar"]') as HTMLElement;
    expect(progress.getAttribute('aria-valuenow')).toBe('40');
    expect(progress.getAttribute('aria-valuemax')).toBe('80');
  });

  it('omits value semantics when indeterminate', async () => {
    await TestBed.configureTestingModule({ imports: [UiProgressBarComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UiProgressBarComponent);
    fixture.componentRef.setInput('indeterminate', true);
    fixture.detectChanges();

    const progress = fixture.nativeElement.querySelector('[role="progressbar"]') as HTMLElement;
    expect(progress.getAttribute('aria-valuenow')).toBeNull();
  });
});
