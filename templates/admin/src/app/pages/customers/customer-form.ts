import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { email, form, FormField, required, submit } from '@angular/forms/signals';
import { UiButtonComponent } from '@ngnova/ui/button';
import { UiInputComponent } from '@ngnova/ui/input';
import { UiModalComponent } from '@ngnova/ui/modal';
import { UiSelectComponent } from '@ngnova/ui/select';
import type { UiSelectOption } from '@ngnova/ui/select';
import { UiTextareaComponent } from '@ngnova/ui/textarea';

import type { Customer, CustomerDraft } from '../../core/models';
import { fieldError } from '../../shared/form-errors';

const EMPTY_DRAFT: CustomerDraft = {
  name: '',
  email: '',
  company: '',
  plan: 'Starter',
  status: 'Trial',
  city: '',
  country: '',
  notes: '',
};

export const PLAN_OPTIONS: readonly UiSelectOption[] = ['Free', 'Starter', 'Pro', 'Enterprise'].map(
  (plan) => ({ label: plan, value: plan }),
);
export const STATUS_OPTIONS: readonly UiSelectOption[] = ['Active', 'Trial', 'Churned'].map(
  (status) => ({ label: status, value: status }),
);

/** Add or edit a customer in a modal. Built with Angular Signal Forms. */
@Component({
  selector: 'app-customer-form',
  imports: [
    FormField,
    UiButtonComponent,
    UiInputComponent,
    UiModalComponent,
    UiSelectComponent,
    UiTextareaComponent,
  ],
  template: `
    <ui-modal size="lg" [open]="open()" (openChange)="openChange.emit($event)">
      <span uiModalHeader>{{ customer() ? 'Edit customer' : 'Add customer' }}</span>
      <form class="grid gap-4 sm:grid-cols-2" novalidate (submit)="save($event)">
        <ui-input
          label="Full name"
          autocomplete="name"
          [errorText]="error(customerForm.name())"
          [formField]="customerForm.name"
        />
        <ui-input
          label="Email"
          type="email"
          autocomplete="email"
          [errorText]="error(customerForm.email())"
          [formField]="customerForm.email"
        />
        <ui-input
          class="sm:col-span-2"
          label="Company"
          autocomplete="organization"
          [errorText]="error(customerForm.company())"
          [formField]="customerForm.company"
        />
        <ui-select label="Plan" [options]="planOptions" [formField]="customerForm.plan" />
        <ui-select label="Status" [options]="statusOptions" [formField]="customerForm.status" />
        <ui-input label="City" autocomplete="address-level2" [formField]="customerForm.city" />
        <ui-input label="Country" autocomplete="country-name" [formField]="customerForm.country" />
        <ui-textarea
          class="sm:col-span-2"
          label="Notes"
          [rows]="3"
          [maxLength]="280"
          helperText="Visible to your team only."
          [formField]="customerForm.notes"
        />
      </form>
      <ng-container uiModalFooter>
        <ui-button variant="ghost" (pressed)="openChange.emit(false)">Cancel</ui-button>
        <ui-button [loading]="saving()" loadingLabel="Saving customer" (pressed)="save()">
          {{ customer() ? 'Save changes' : 'Add customer' }}
        </ui-button>
      </ng-container>
    </ui-modal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerForm {
  readonly open = input(false);
  /** The customer to edit, or null to add a new one. */
  readonly customer = input<Customer | null>(null);
  /** Persists the draft; the modal closes when it resolves. */
  readonly saveAction = input.required<(draft: CustomerDraft) => Promise<void>>();
  readonly openChange = output<boolean>();

  protected readonly planOptions = PLAN_OPTIONS;
  protected readonly statusOptions = STATUS_OPTIONS;
  protected readonly saving = signal(false);
  protected readonly error = fieldError;

  private readonly model = signal<CustomerDraft>(EMPTY_DRAFT);
  protected readonly customerForm = form(this.model, (path) => {
    required(path.name, { message: 'Enter the customer’s name.' });
    required(path.email, { message: 'Enter an email address.' });
    email(path.email, { message: 'Enter a valid email address.' });
    required(path.company, { message: 'Enter a company name.' });
  });

  constructor() {
    // Reset the form each time the modal opens.
    effect(() => {
      if (!this.open()) return;
      const customer = this.customer();
      this.model.set(
        customer
          ? {
              name: customer.name,
              email: customer.email,
              company: customer.company,
              plan: customer.plan,
              status: customer.status,
              city: customer.city,
              country: customer.country,
              notes: customer.notes,
            }
          : EMPTY_DRAFT,
      );
      this.customerForm().reset();
    });
  }

  protected async save(event?: Event): Promise<void> {
    event?.preventDefault();
    await submit(this.customerForm, async () => {
      this.saving.set(true);
      try {
        await this.saveAction()(this.model());
        this.openChange.emit(false);
      } finally {
        this.saving.set(false);
      }
      return undefined;
    });
  }
}
