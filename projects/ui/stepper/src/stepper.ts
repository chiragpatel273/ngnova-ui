import { booleanAttribute, ChangeDetectionStrategy, Component, Input, output } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

function uiClassNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export interface UiStepItem {
  readonly value: string;
  readonly label: string;
  readonly description?: string;
  readonly optional?: boolean;
  readonly completed?: boolean;
  readonly error?: boolean;
  readonly disabled?: boolean;
}

export interface UiStepperSelection {
  readonly step: UiStepItem;
  readonly index: number;
}

export type UiStepperOrientation = 'horizontal' | 'vertical';
export type UiStepState = 'complete' | 'current' | 'error' | 'upcoming';

let nextStepperId = 0;

@Component({
  selector: 'ui-stepper',
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `
    <nav [attr.aria-label]="ariaLabel">
      <ol [class]="listClasses">
        @for (step of steps; track step.value; let index = $index; let last = $last) {
          <li
            [class]="itemClasses"
            [attr.data-step-state]="state(step, index)"
            [attr.aria-disabled]="step.disabled ? 'true' : null"
          >
            @if (!last) {
              <span
                aria-hidden="true"
                data-step-connector
                [class]="connectorClasses(step, index)"
              ></span>
            }

            @if (canSelect(step, index)) {
              <button
                type="button"
                [class]="contentClasses"
                [attr.aria-label]="stepAriaLabel(step, index)"
                (click)="selectStep(step, index)"
              >
                <ng-container
                  [ngTemplateOutlet]="marker"
                  [ngTemplateOutletContext]="{ step: step, index: index }"
                />
                <ng-container
                  [ngTemplateOutlet]="copy"
                  [ngTemplateOutletContext]="{ step: step, index: index }"
                />
              </button>
            } @else {
              <div
                [id]="stepId(step)"
                [class]="contentClasses"
                [attr.aria-current]="isCurrent(step) ? 'step' : null"
              >
                <ng-container
                  [ngTemplateOutlet]="marker"
                  [ngTemplateOutletContext]="{ step: step, index: index }"
                />
                <ng-container
                  [ngTemplateOutlet]="copy"
                  [ngTemplateOutletContext]="{ step: step, index: index }"
                />
              </div>
            }
          </li>
        }
      </ol>
    </nav>

    <div
      [class]="panelClasses"
      [attr.role]="activeStep ? 'region' : null"
      [attr.aria-labelledby]="activeStep ? stepId(activeStep) : null"
    >
      <ng-content />
    </div>

    <ng-template #marker let-step="step" let-index="index">
      <span [class]="markerClasses(step, index)" aria-hidden="true">
        @if (state(step, index) === 'complete') {
          <svg
            class="size-4 fill-none stroke-current"
            viewBox="0 0 24 24"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m5 12 4 4L19 6" />
          </svg>
        } @else if (state(step, index) === 'error') {
          <span class="text-base font-bold leading-none">!</span>
        } @else {
          {{ index + 1 }}
        }
      </span>
    </ng-template>

    <ng-template #copy let-step="step" let-index="index">
      <span [class]="copyClasses">
        <span data-step-label [class]="labelClasses(step, index)">{{ step.label }}</span>
        @if (step.optional) {
          <span class="text-xs font-normal text-slate-500 dark:text-slate-400">Optional</span>
        }
        @if (step.description) {
          <span class="text-xs font-normal leading-5 text-slate-500 dark:text-slate-400">
            {{ step.description }}
          </span>
        }
      </span>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiStepperComponent {
  @Input() id = `ui-stepper-${++nextStepperId}`;
  @Input() steps: readonly UiStepItem[] = [];
  @Input() active = '';
  @Input() ariaLabel = 'Progress';
  @Input() orientation: UiStepperOrientation = 'horizontal';
  @Input({ transform: booleanAttribute }) linear = false;
  @Input({ transform: booleanAttribute }) interactive = true;

  readonly activeChange = output<string>();
  readonly stepSelected = output<UiStepperSelection>();

  protected get activeStep(): UiStepItem | undefined {
    return (
      this.steps.find((step) => !step.disabled && step.value === this.active) ??
      this.steps.find((step) => !step.disabled)
    );
  }

  protected get listClasses(): string {
    return uiClassNames(
      'm-0 flex min-w-0 list-none p-0',
      this.orientation === 'horizontal' && 'w-full items-start overflow-x-auto pb-1',
      this.orientation === 'vertical' && 'flex-col',
    );
  }

  protected get itemClasses(): string {
    return uiClassNames(
      'relative flex min-w-0',
      this.orientation === 'horizontal' && 'min-w-32 flex-1 justify-center',
      this.orientation === 'vertical' && 'pb-6 last:pb-0',
    );
  }

  protected get contentClasses(): string {
    return uiClassNames(
      'relative z-10 flex min-w-0 border-0 bg-transparent p-0 text-left font-sans outline-none',
      this.orientation === 'horizontal' && 'w-full flex-col items-center gap-2 px-2 text-center',
      this.orientation === 'vertical' && 'items-start gap-3',
      'enabled:cursor-pointer enabled:rounded-lg enabled:hover:text-slate-950 enabled:focus-visible:ring-2 enabled:focus-visible:ring-blue-600 enabled:focus-visible:ring-offset-2 dark:enabled:hover:text-white dark:enabled:focus-visible:ring-blue-400 dark:enabled:focus-visible:ring-offset-slate-950',
    );
  }

  protected get copyClasses(): string {
    return uiClassNames(
      'flex min-w-0 flex-col',
      this.orientation === 'horizontal' && 'max-w-48 items-center',
      this.orientation === 'vertical' && 'pt-1',
    );
  }

  protected get panelClasses(): string {
    return uiClassNames(
      'min-w-0',
      this.orientation === 'horizontal' && 'mt-6',
      this.orientation === 'vertical' && 'mt-4',
    );
  }

  protected state(step: UiStepItem, index: number): UiStepState {
    if (step.error) return 'error';
    if (this.isCurrent(step)) return 'current';
    if (step.completed || (this.activeIndex >= 0 && index < this.activeIndex)) return 'complete';
    return 'upcoming';
  }

  protected markerClasses(step: UiStepItem, index: number): string {
    const state = this.state(step, index);
    return uiClassNames(
      'relative z-10 inline-flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors',
      state === 'complete' &&
        'border-blue-700 bg-blue-700 text-white dark:border-blue-500 dark:bg-blue-500 dark:text-slate-950',
      state === 'current' &&
        'border-blue-700 bg-white text-blue-700 ring-4 ring-blue-100 dark:border-blue-400 dark:bg-slate-950 dark:text-blue-300 dark:ring-blue-950',
      state === 'error' &&
        'border-red-600 bg-red-50 text-red-700 dark:border-red-400 dark:bg-red-950 dark:text-red-300',
      state === 'upcoming' &&
        'border-slate-300 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400',
      step.disabled && 'opacity-50',
    );
  }

  protected labelClasses(step: UiStepItem, index: number): string {
    const state = this.state(step, index);
    return uiClassNames(
      'truncate text-sm font-semibold leading-5',
      state === 'current' && 'text-slate-950 dark:text-white',
      state === 'complete' && 'text-slate-700 dark:text-slate-200',
      state === 'error' && 'text-red-700 dark:text-red-300',
      state === 'upcoming' && 'text-slate-500 dark:text-slate-400',
      step.disabled && 'opacity-50',
    );
  }

  protected connectorClasses(step: UiStepItem, index: number): string {
    const completed = this.state(step, index) === 'complete';
    return uiClassNames(
      'absolute bg-slate-200 dark:bg-slate-800',
      this.orientation === 'horizontal' &&
        'left-[calc(50%+1.25rem)] right-[calc(-50%+1.25rem)] top-4 h-px',
      this.orientation === 'vertical' && 'bottom-0 left-[0.9375rem] top-9 w-px',
      completed && 'bg-blue-700 dark:bg-blue-500',
    );
  }

  protected isCurrent(step: UiStepItem): boolean {
    return this.activeStep?.value === step.value;
  }

  protected canSelect(step: UiStepItem, index: number): boolean {
    if (!this.interactive || step.disabled || this.isCurrent(step)) return false;
    return !this.linear || this.activeIndex < 0 || index < this.activeIndex;
  }

  protected selectStep(step: UiStepItem, index: number): void {
    if (!this.canSelect(step, index)) return;
    this.activeChange.emit(step.value);
    this.stepSelected.emit({ step, index });
  }

  protected stepId(step: UiStepItem): string {
    return `${this.id}-step-${this.toDomId(step.value)}`;
  }

  protected stepAriaLabel(step: UiStepItem, index: number): string {
    const status = this.state(step, index);
    return `${step.label}, step ${index + 1} of ${this.steps.length}, ${status}`;
  }

  private get activeIndex(): number {
    const active = this.activeStep;
    return active ? this.steps.indexOf(active) : -1;
  }

  private toDomId(value: string): string {
    return (
      value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'step'
    );
  }
}
