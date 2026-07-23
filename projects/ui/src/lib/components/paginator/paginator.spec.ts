import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiPaginatorComponent } from '../../../../paginator/src/paginator';

@Component({
  standalone: true,
  imports: [UiPaginatorComponent],
  template: `<ui-paginator
    [(page)]="page"
    [(pageSize)]="pageSize"
    [totalItems]="totalItems"
    [pageSizeOptions]="[10, 25, 50]"
    [siblingCount]="siblingCount"
    [disabled]="disabled"
    [getRangeLabel]="rangeLabel"
  />`,
})
class HostComponent {
  page = 5;
  pageSize = 10;
  totalItems = 200;
  siblingCount = 1;
  disabled = false;
  readonly rangeLabel = (start: number, end: number, total: number): string =>
    `${start} to ${end} from ${total}`;
}

describe('UiPaginatorComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
  });

  it('renders a controlled current page, localized range, and compact ellipses', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const nav = fixture.nativeElement.querySelector('nav') as HTMLElement;
    expect(nav.getAttribute('aria-label')).toBe('Pagination');
    expect(nav.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe('5');
    expect(nav.querySelector('[aria-live]')?.textContent?.trim()).toBe('41 to 50 from 200');
    expect(nav.textContent).toContain('…');
  });

  it('requests pages and updates through two-way controlled state', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    (
      fixture.nativeElement.querySelector('button[aria-label="Next page"]') as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.page).toBe(6);
    expect(fixture.nativeElement.querySelector('[aria-current="page"]').textContent.trim()).toBe(
      '6',
    );
  });

  it('clamps invalid inputs and disables unavailable navigation', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.page = 999;
    fixture.componentInstance.totalItems = 12;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[aria-current="page"]').textContent.trim()).toBe(
      '2',
    );
    expect(
      (fixture.nativeElement.querySelector('button[aria-label="Next page"]') as HTMLButtonElement)
        .disabled,
    ).toBe(true);
  });

  it('emits valid page-size changes', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    select.value = '25';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(fixture.componentInstance.pageSize).toBe(25);
    expect(fixture.nativeElement.querySelector('[aria-live]').textContent.trim()).toBe(
      '101 to 125 from 200',
    );
  });

  it('supports an empty collection and global disabled state', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.totalItems = 0;
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[aria-live]').textContent.trim()).toBe(
      '0 to 0 from 0',
    );
    expect(
      Array.from(fixture.nativeElement.querySelectorAll('button, select')).every(
        (control) => (control as HTMLButtonElement | HTMLSelectElement).disabled,
      ),
    ).toBe(true);
  });
});
