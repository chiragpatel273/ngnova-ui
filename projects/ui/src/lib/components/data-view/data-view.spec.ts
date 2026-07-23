import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { UiDataViewComponent, UiDataViewItemDirective } from '../../../../data-view/src/data-view';

describe('UiDataViewComponent', () => {
  it('renders typed items and layout context with stable list semantics', async () => {
    @Component({
      standalone: true,
      imports: [UiDataViewComponent, UiDataViewItemDirective],
      template: `
        <ui-data-view [items]="items" [layout]="layout()" ariaLabel="Release cards">
          <ng-template uiDataViewItem let-item let-index="index" let-layout="layout">
            <article data-item [attr.data-index]="index" [attr.data-layout]="layout">
              {{ item.name }}
            </article>
          </ng-template>
        </ui-data-view>
      `,
    })
    class HostComponent {
      readonly items = [{ id: 1, name: 'Button' }];
      readonly layout = signal<'grid' | 'list'>('grid');
    }

    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const section = fixture.nativeElement.querySelector('section') as HTMLElement;
    const item = fixture.nativeElement.querySelector('[data-item]') as HTMLElement;
    expect(section.getAttribute('aria-label')).toBe('Release cards');
    expect(fixture.nativeElement.querySelector('[role="listitem"]')).not.toBeNull();
    expect(item.textContent).toContain('Button');
    expect(item.dataset['index']).toBe('0');
    expect(item.dataset['layout']).toBe('grid');
  });

  it('emits controlled layout requests with pressed-state semantics', async () => {
    await TestBed.configureTestingModule({ imports: [UiDataViewComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UiDataViewComponent);
    let requested = '';
    fixture.componentRef.setInput('showLayoutToggle', true);
    fixture.componentRef.setInput('layout', 'grid');
    fixture.componentInstance.layoutChange.subscribe((layout) => (requested = layout));
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
    buttons[1].click();
    fixture.detectChanges();
    expect(requested).toBe('list');
    expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
  });

  it('uses deterministic loading, error, empty, and populated state precedence', async () => {
    await TestBed.configureTestingModule({ imports: [UiDataViewComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UiDataViewComponent);
    fixture.componentRef.setInput('error', true);
    fixture.componentRef.setInput('errorText', 'Request failed');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      'Request failed',
    );

    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="status"]').textContent).toContain(
      'Loading items',
    );
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();

    fixture.componentRef.setInput('loading', false);
    fixture.componentRef.setInput('error', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="status"]').textContent).toContain(
      'No items found',
    );
  });

  it('applies responsive grid/list and gap classes', async () => {
    await TestBed.configureTestingModule({ imports: [UiDataViewComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UiDataViewComponent);
    fixture.componentRef.setInput('items', ['one']);
    fixture.componentRef.setInput('gap', 'lg');
    fixture.detectChanges();
    const list = fixture.nativeElement.querySelector('[role="list"]') as HTMLElement;
    expect(list.className).toContain('lg:grid-cols-3');
    expect(list.className).toContain('gap-6');

    fixture.componentRef.setInput('layout', 'list');
    fixture.detectChanges();
    expect(list.className).toContain('flex-col');
  });
});
