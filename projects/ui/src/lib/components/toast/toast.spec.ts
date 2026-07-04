import { TestBed } from '@angular/core/testing';

import { UiToastComponent, UiToastService } from '../../../../toast/src/toast';

describe('UiToastComponent', () => {
  it('renders and dismisses service messages', async () => {
    await TestBed.configureTestingModule({ imports: [UiToastComponent] }).compileComponents();
    const service = TestBed.inject(UiToastService);
    service.clear();
    service.success('Saved', 'Changes are ready.');

    const fixture = TestBed.createComponent(UiToastComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Saved');

    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Saved');
  });
});
