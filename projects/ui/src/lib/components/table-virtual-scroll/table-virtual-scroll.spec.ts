import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  UiTableVirtualRowDirective,
  UiTableVirtualScrollComponent,
} from '../../../../table-virtual-scroll/src/table-virtual-scroll';

describe('UiTableVirtualScrollComponent', () => {
  const clientHeightDescriptor = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'clientHeight',
  );

  afterEach(() => {
    if (clientHeightDescriptor) {
      Object.defineProperty(HTMLElement.prototype, 'clientHeight', clientHeightDescriptor);
    } else {
      Reflect.deleteProperty(HTMLElement.prototype, 'clientHeight');
    }
  });

  it('normalizes viewport configuration and exposes large datasets without rendering every row', async () => {
    await TestBed.configureTestingModule({
      imports: [UiTableVirtualScrollComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(UiTableVirtualScrollComponent<number>);
    fixture.componentRef.setInput(
      'rows',
      Array.from({ length: 10_000 }, (_, index) => index),
    );
    fixture.componentRef.setInput('itemSize', 0);
    fixture.componentRef.setInput('minBufferPx', 0);
    fixture.componentRef.setInput('maxBufferPx', 0);
    fixture.detectChanges();

    const viewport = fixture.nativeElement.querySelector(
      'cdk-virtual-scroll-viewport',
    ) as HTMLElement;
    expect(viewport.getAttribute('aria-rowcount')).toBe('10000');
    expect(viewport.getAttribute('aria-label')).toBe('Virtualized table rows');
    expect(fixture.nativeElement.querySelectorAll('[role="row"]').length).toBeLessThan(10_000);
  });

  it('accepts typed row templates with absolute index context', async () => {
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
      configurable: true,
      get: () => 192,
    });

    @Component({
      standalone: true,
      imports: [UiTableVirtualRowDirective, UiTableVirtualScrollComponent],
      template: `
        <ui-table-virtual-scroll [rows]="rows" height="12rem" ariaLabel="Build records">
          <ng-template uiTableVirtualRow let-row let-index="index">
            <span data-row [attr.data-index]="index">{{ row.name }}</span>
          </ng-template>
        </ui-table-virtual-scroll>
      `,
    })
    class HostComponent {
      readonly rows = [{ name: 'NgNova' }];
    }

    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const viewport = fixture.nativeElement.querySelector(
      'cdk-virtual-scroll-viewport',
    ) as HTMLElement;
    expect(viewport.getAttribute('aria-label')).toBe('Build records');
    expect(viewport.getAttribute('aria-rowcount')).toBe('1');
  });

  it('marks the viewport busy without changing row semantics', async () => {
    await TestBed.configureTestingModule({
      imports: [UiTableVirtualScrollComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(UiTableVirtualScrollComponent);
    fixture.componentRef.setInput('rows', ['one']);
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const viewport = fixture.nativeElement.querySelector(
      'cdk-virtual-scroll-viewport',
    ) as HTMLElement;
    expect(viewport.getAttribute('aria-busy')).toBe('true');
    expect(viewport.getAttribute('role')).toBe('rowgroup');
  });
});
