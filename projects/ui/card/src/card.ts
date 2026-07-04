import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

function uiClassNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export type UiCardVariant = 'outline' | 'elevated';
export type UiCardPadding = 'none' | 'sm' | 'md' | 'lg';

const CARD_CLASSES: Record<UiCardVariant, string> = {
  outline: 'border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950',
  elevated:
    'border border-slate-200 bg-white shadow-md shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/20',
};

const BODY_CLASSES: Record<UiCardPadding, string> = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

@Component({
  selector: 'ui-card',
  standalone: true,
  host: {
    class: 'block',
  },
  template: `
    <section [class]="cardClasses">
      <div class="ui-card-slot border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <ng-content select="[uiCardHeader]" />
      </div>
      <div [class]="bodyClasses">
        <ng-content />
      </div>
      <div class="ui-card-slot border-t border-slate-200 px-5 py-4 dark:border-slate-800">
        <ng-content select="[uiCardFooter]" />
      </div>
    </section>
  `,
  styles: [
    `
      .ui-card-slot:empty {
        display: none;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiCardComponent {
  @Input() variant: UiCardVariant = 'outline';
  @Input() padding: UiCardPadding = 'md';

  protected get cardClasses(): string {
    return uiClassNames(
      'overflow-hidden rounded-lg text-slate-700 dark:text-slate-200',
      CARD_CLASSES[this.variant],
    );
  }

  protected get bodyClasses(): string {
    return uiClassNames(BODY_CLASSES[this.padding]);
  }
}
