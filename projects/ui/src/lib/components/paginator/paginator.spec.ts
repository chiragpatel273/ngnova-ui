import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { UiPaginatorComponent } from '../../../../paginator/src/paginator';
import { provideUiPaginatorLabels } from '../../../../paginator/src/paginator-labels';

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

describe('UiPaginatorComponent labels', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UiPaginatorComponent],
      providers: [
        provideUiPaginatorLabels({
          navigation: 'Pagination des résultats',
          itemsPerPage: 'Éléments par page',
          firstPage: 'Première page',
          previousPage: 'Page précédente',
          nextPage: 'Page suivante',
          lastPage: 'Dernière page',
          page: (page) => `Aller à la page ${page}`,
          range: (start, end, total) => `${start} à ${end} sur ${total}`,
        }),
      ],
    });
  });

  function render(totalItems: number): ComponentFixture<UiPaginatorComponent> {
    const fixture = TestBed.createComponent(UiPaginatorComponent);
    fixture.componentRef.setInput('totalItems', totalItems);
    fixture.componentRef.setInput('page', 2);
    fixture.componentRef.setInput('pageSizeOptions', [10, 25]);
    fixture.detectChanges();
    return fixture;
  }

  function ariaLabels(element: HTMLElement): (string | null)[] {
    return Array.from(element.querySelectorAll('button')).map((button) =>
      button.getAttribute('aria-label'),
    );
  }

  it('uses provided labels for every built-in string', () => {
    const fixture = render(30);
    const nav = fixture.nativeElement.querySelector('nav') as HTMLElement;

    expect(nav.getAttribute('aria-label')).toBe('Pagination des résultats');
    expect(nav.querySelector('label span')?.textContent?.trim()).toBe('Éléments par page');
    expect(nav.querySelector('[aria-live]')?.textContent?.trim()).toBe('11 à 20 sur 30');
    expect(ariaLabels(nav)).toEqual([
      'Première page',
      'Page précédente',
      'Aller à la page 1',
      'Aller à la page 2',
      'Aller à la page 3',
      'Page suivante',
      'Dernière page',
    ]);
  });

  it('uses the provided range label for an empty collection', () => {
    const fixture = render(0);

    expect(fixture.nativeElement.querySelector('[aria-live]').textContent.trim()).toBe(
      '0 à 0 sur 0',
    );
  });

  it('lets explicit inputs win over provided labels', () => {
    const fixture = TestBed.createComponent(UiPaginatorComponent);
    fixture.componentRef.setInput('totalItems', 30);
    fixture.componentRef.setInput('ariaLabel', 'Results pages');
    fixture.componentRef.setInput('nextPageAriaLabel', 'Forward');
    fixture.componentRef.setInput('getPageAriaLabel', (page: number) => `Go to ${page}`);
    fixture.componentRef.setInput(
      'getRangeLabel',
      (start: number, end: number, total: number) => `${start}-${end}/${total}`,
    );
    fixture.detectChanges();
    const nav = fixture.nativeElement.querySelector('nav') as HTMLElement;

    expect(nav.getAttribute('aria-label')).toBe('Results pages');
    expect(nav.querySelector('[aria-live]')?.textContent?.trim()).toBe('1-10/30');
    expect(nav.querySelector('button[aria-label="Forward"]')).not.toBeNull();
    expect(nav.querySelector('button[aria-label="Go to 1"]')).not.toBeNull();
  });
});
