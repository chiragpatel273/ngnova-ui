import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  disabled,
  email,
  form,
  FormField,
  maxLength,
  minLength,
  required,
  submit,
} from '@angular/forms/signals';
import { UiButtonComponent } from '@ngnova/ui/button';
import { UiCheckboxComponent } from '@ngnova/ui/checkbox';
import { UiComboboxComponent } from '@ngnova/ui/combobox';
import type { UiComboboxOption } from '@ngnova/ui/combobox';
import { UiDatePickerComponent } from '@ngnova/ui/date-picker';
import { UiInputComponent } from '@ngnova/ui/input';
import { UiRadioGroupComponent } from '@ngnova/ui/radio';
import type { UiRadioOption } from '@ngnova/ui/radio';
import { UiSwitchComponent } from '@ngnova/ui/switch';
import { UiTextareaComponent } from '@ngnova/ui/textarea';

import { DocsPreviewCanvasComponent } from './docs-preview-canvas';

interface DeveloperProfile {
  readonly workspaceName: string;
  readonly email: string;
  readonly role: string;
  readonly framework: string;
  readonly releaseCadence: string;
  readonly launchDate: string;
  readonly notes: string;
  readonly acceptTerms: boolean;
  readonly managedUpdates: boolean;
}

type SubmissionStatus = 'idle' | 'invalid' | 'success';

const EMPTY_PROFILE: DeveloperProfile = {
  workspaceName: '',
  email: '',
  role: '',
  framework: '',
  releaseCadence: 'monthly',
  launchDate: '',
  notes: '',
  acceptTerms: false,
  managedUpdates: true,
};

const VALID_PROFILE: DeveloperProfile = {
  workspaceName: 'Nova Commerce',
  email: 'builder@example.com',
  role: 'engineering',
  framework: 'angular',
  releaseCadence: 'weekly',
  launchDate: '2026-09-18',
  notes: 'Building an accessible commerce workspace with NgNova UI.',
  acceptTerms: true,
  managedUpdates: true,
};

const ROLE_OPTIONS: readonly UiComboboxOption[] = [
  { label: 'Engineering', value: 'engineering' },
  { label: 'Product design', value: 'design' },
  { label: 'Product management', value: 'product' },
];

const FRAMEWORK_OPTIONS: readonly UiComboboxOption[] = [
  { label: 'Angular', value: 'angular' },
  { label: 'Analog', value: 'analog' },
  { label: 'Ionic Angular', value: 'ionic-angular' },
];

const CADENCE_OPTIONS: readonly UiRadioOption[] = [
  { label: 'Weekly', value: 'weekly', helperText: 'Frequent product delivery' },
  { label: 'Monthly', value: 'monthly', helperText: 'Balanced release cycle' },
  { label: 'Quarterly', value: 'quarterly', helperText: 'Long planning horizon' },
];

const SIGNAL_FORMS_EXAMPLE = [
  "import { Component, signal } from '@angular/core';",
  "import { disabled, email, form, FormField, required, submit } from '@angular/forms/signals';",
  "import { UiButtonComponent } from '@ngnova/ui/button';",
  "import { UiCheckboxComponent } from '@ngnova/ui/checkbox';",
  "import { UiInputComponent } from '@ngnova/ui/input';",
  "import { UiSwitchComponent } from '@ngnova/ui/switch';",
  '',
  '@Component({',
  '  standalone: true,',
  '  imports: [FormField, UiButtonComponent, UiCheckboxComponent, UiInputComponent, UiSwitchComponent],',
  '  template: `',
  '    <form (submit)="handleSubmit($event)">',
  '      <ui-input label="Name" [formField]="profileForm.name" />',
  '      <ui-input label="Email" type="email" [formField]="profileForm.email" />',
  '      <ui-checkbox label="Accept the terms" [formField]="profileForm.acceptTerms" />',
  '      <ui-switch label="Managed updates" [formField]="profileForm.managedUpdates" />',
  '      <ui-button type="submit" [loading]="profileForm().submitting()">',
  '        Create workspace',
  '      </ui-button>',
  '    </form>',
  '  `,',
  '})',
  'export class ProfileFormComponent {',
  "  readonly model = signal({ name: '', email: '', acceptTerms: false, managedUpdates: true });",
  '  readonly profileForm = form(this.model, (path) => {',
  "    required(path.name, { message: 'Name is required.' });",
  "    required(path.email, { message: 'Email is required.' });",
  "    email(path.email, { message: 'Enter a valid email.' });",
  "    required(path.acceptTerms, { message: 'Accept the terms to continue.' });",
  "    disabled(path.managedUpdates, { when: 'Controlled by the workspace' });",
  '  });',
  '',
  '  async handleSubmit(event: Event): Promise<void> {',
  '    event.preventDefault();',
  '    await submit(this.profileForm, {',
  '      action: async () => {',
  "        console.log('Submitted', this.model());",
  '      },',
  '    });',
  '  }',
  '}',
].join('\n');

@Component({
  selector: 'app-signal-forms-playground',
  standalone: true,
  imports: [
    FormField,
    DocsPreviewCanvasComponent,
    UiButtonComponent,
    UiCheckboxComponent,
    UiComboboxComponent,
    UiDatePickerComponent,
    UiInputComponent,
    UiRadioGroupComponent,
    UiSwitchComponent,
    UiTextareaComponent,
  ],
  template: `
    <app-docs-preview-canvas
      title="Signal Forms workspace setup"
      description="Try an invalid submission, inspect touched and validation state, then load valid data and submit again."
      filename="workspace-form.component.ts"
      language="TypeScript"
      visualId="signal-forms-live"
      [code]="exampleCode"
    >
      <div class="grid w-full max-w-5xl gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <form
          data-testid="signal-form"
          class="grid content-start gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950 sm:p-5"
          novalidate
          (submit)="handleSubmit($event)"
        >
          <div>
            <p
              class="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300"
            >
              Interactive form
            </p>
            <h3 class="mt-1 text-lg font-bold text-slate-950 dark:text-slate-50">
              Create a product workspace
            </h3>
            <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Configure a realistic Angular project, then inspect its live Signal Forms model.
            </p>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <h4 class="text-sm font-semibold text-slate-950 dark:text-slate-50">
                Workspace basics
              </h4>
              <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Identify the project and the person responsible for it.
              </p>
            </div>

            <ui-input
              label="Workspace name"
              placeholder="Nova Commerce"
              autocomplete="organization"
              [validationMessages]="validationMessages"
              [formField]="profileForm.workspaceName"
            />

            <ui-input
              label="Owner email"
              type="email"
              placeholder="owner@example.com"
              autocomplete="email"
              [validationMessages]="validationMessages"
              [formField]="profileForm.email"
            />

            <ui-combobox
              label="Primary role"
              placeholder="Search roles"
              [options]="roleOptions"
              [errorText]="
                profileForm.role().touched() ? (profileForm.role().errors()[0]?.message ?? '') : ''
              "
              [formField]="profileForm.role"
            />

            <ui-combobox
              label="Angular platform"
              placeholder="Search platforms"
              [options]="frameworkOptions"
              [errorText]="
                profileForm.framework().touched()
                  ? (profileForm.framework().errors()[0]?.message ?? '')
                  : ''
              "
              [formField]="profileForm.framework"
            />

            <div class="border-t border-slate-200 pt-4 dark:border-slate-800 sm:col-span-2">
              <h4 class="text-sm font-semibold text-slate-950 dark:text-slate-50">
                Delivery preferences
              </h4>
              <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Capture the intended launch and release rhythm.
              </p>
            </div>

            <ui-date-picker
              label="Target launch date"
              startAt="2026-09-01"
              [errorText]="
                profileForm.launchDate().touched()
                  ? (profileForm.launchDate().errors()[0]?.message ?? '')
                  : ''
              "
              [formField]="profileForm.launchDate"
            />

            <ui-radio-group
              label="Release cadence"
              orientation="horizontal"
              [options]="cadenceOptions"
              [formField]="profileForm.releaseCadence"
            />

            <ui-textarea
              class="sm:col-span-2"
              label="Workspace goals"
              placeholder="What are you planning to build?"
              helperText="Optional, up to 240 characters."
              maxLength="240"
              [validationMessages]="validationMessages"
              [formField]="profileForm.notes"
            />
          </div>

          <div
            class="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60 sm:grid-cols-2"
          >
            <div>
              <ui-checkbox
                label="I accept the project terms"
                helperText="Required before the workspace can be created."
                [formField]="profileForm.acceptTerms"
              />

              @if (profileForm.acceptTerms().touched() && profileForm.acceptTerms().invalid()) {
                <p
                  data-testid="terms-error"
                  class="mt-1 text-sm font-medium text-red-700 dark:text-red-300"
                  role="alert"
                >
                  {{ profileForm.acceptTerms().errors()[0]?.message }}
                </p>
              }
            </div>

            <ui-switch
              label="Workspace-managed security updates"
              helperText="Disabled by the Signal Forms schema."
              [formField]="profileForm.managedUpdates"
            />
          </div>

          <div class="flex flex-wrap gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
            <ui-button
              type="submit"
              [loading]="profileForm().submitting()"
              loadingLabel="Creating workspace"
            >
              Create workspace
            </ui-button>
            <ui-button
              type="button"
              appearance="outline"
              data-testid="fill-valid"
              (pressed)="fillValidExample()"
            >
              Load example workspace
            </ui-button>
          </div>

          <output
            data-testid="submission-message"
            class="min-h-5 text-sm font-medium"
            [class.text-slate-600]="submissionStatus() === 'idle'"
            [class.text-red-700]="submissionStatus() === 'invalid'"
            [class.text-emerald-700]="submissionStatus() === 'success'"
            [class.dark:text-slate-300]="submissionStatus() === 'idle'"
            [class.dark:text-red-300]="submissionStatus() === 'invalid'"
            [class.dark:text-emerald-300]="submissionStatus() === 'success'"
            aria-live="polite"
          >
            {{ submissionMessage() }}
          </output>
        </form>

        <aside class="grid content-start gap-4" aria-label="Live Signal Forms state">
          <section
            class="rounded-lg border border-slate-200 bg-slate-950 p-4 text-slate-100 dark:border-slate-700"
          >
            <h3 class="text-sm font-semibold text-white">Model JSON</h3>
            <pre
              data-testid="model-json"
              class="mt-3 overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-5 text-emerald-300"
              >{{ modelJson() }}</pre
            >
          </section>

          <section
            class="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950"
          >
            <h3 class="text-sm font-semibold text-slate-950 dark:text-slate-50">Field state</h3>
            <dl class="mt-3 grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-xs">
              @for (item of stateItems(); track item.label) {
                <dt class="text-slate-600 dark:text-slate-300">{{ item.label }}</dt>
                <dd
                  class="font-mono font-semibold"
                  [class.text-emerald-700]="item.value"
                  [class.text-slate-500]="!item.value"
                  [class.dark:text-emerald-300]="item.value"
                  [class.dark:text-slate-400]="!item.value"
                >
                  {{ item.value }}
                </dd>
              }
            </dl>
          </section>

          @if (lastSubmission(); as submitted) {
            <section
              class="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30"
            >
              <h3 class="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                Submitted snapshot
              </h3>
              <pre
                data-testid="submitted-json"
                class="mt-3 overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-5 text-emerald-800 dark:text-emerald-200"
                >{{ submittedJson() }}</pre
              >
            </section>
          }
        </aside>
      </div>
    </app-docs-preview-canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalFormsPlaygroundComponent {
  protected readonly exampleCode = SIGNAL_FORMS_EXAMPLE;
  protected readonly validationMessages: Readonly<Record<string, string>> = {
    required: 'This field is required.',
    email: 'Enter a valid email address.',
    minlength: 'Use at least 3 characters.',
    maxlength: 'Keep this value within the allowed length.',
  };
  protected readonly roleOptions = ROLE_OPTIONS;
  protected readonly frameworkOptions = FRAMEWORK_OPTIONS;
  protected readonly cadenceOptions = CADENCE_OPTIONS;
  protected readonly profileModel = signal<DeveloperProfile>({ ...EMPTY_PROFILE });
  protected readonly submissionStatus = signal<SubmissionStatus>('idle');
  protected readonly lastSubmission = signal<DeveloperProfile | null>(null);
  protected readonly profileForm = form(this.profileModel, (path) => {
    required(path.workspaceName, { message: 'Workspace name is required.' });
    minLength(path.workspaceName, 3, { message: 'Use at least 3 characters.' });
    required(path.email, { message: 'Owner email is required.' });
    email(path.email, { message: 'Enter a valid email address.' });
    required(path.role, { message: 'Choose a primary role.' });
    required(path.framework, { message: 'Choose an Angular platform.' });
    required(path.launchDate, { message: 'Choose a target launch date.' });
    maxLength(path.notes, 240, { message: 'Keep workspace goals within 240 characters.' });
    required(path.acceptTerms, { message: 'Accept the terms to continue.' });
    disabled(path.managedUpdates, { when: 'Controlled by the workspace' });
  });
  protected readonly modelJson = computed(() => JSON.stringify(this.profileModel(), null, 2));
  protected readonly submittedJson = computed(() => JSON.stringify(this.lastSubmission(), null, 2));
  protected readonly stateItems = computed(() => [
    { label: 'Form valid', value: this.profileForm().valid() },
    { label: 'Form touched', value: this.profileForm().touched() },
    { label: 'Workspace touched', value: this.profileForm.workspaceName().touched() },
    { label: 'Email touched', value: this.profileForm.email().touched() },
    { label: 'Terms touched', value: this.profileForm.acceptTerms().touched() },
    { label: 'Managed field disabled', value: this.profileForm.managedUpdates().disabled() },
    { label: 'Submitting', value: this.profileForm().submitting() },
  ]);
  protected readonly submissionMessage = computed(() => {
    if (this.profileForm().submitting()) {
      return 'Submitting the valid signal model…';
    }

    if (this.submissionStatus() === 'invalid') {
      return 'Submission blocked. Review the touched fields above.';
    }

    if (this.submissionStatus() === 'success') {
      return 'Workspace submitted successfully.';
    }

    return 'No submission attempted yet.';
  });

  protected fillValidExample(): void {
    this.profileModel.set({ ...VALID_PROFILE });
    this.submissionStatus.set('idle');
    this.lastSubmission.set(null);
  }

  protected async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.submissionStatus.set('idle');

    const successful = await submit(this.profileForm, {
      onInvalid: () => this.submissionStatus.set('invalid'),
      action: async () => {
        await new Promise((resolve) => setTimeout(resolve, 600));
        this.lastSubmission.set({ ...this.profileModel() });
        return undefined;
      },
    });

    if (successful) {
      this.submissionStatus.set('success');
    }
  }
}
