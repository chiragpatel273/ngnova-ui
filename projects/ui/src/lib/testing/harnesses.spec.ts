import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { UiButtonComponent } from '../../../button/src/button';
import { UiCheckboxComponent } from '../../../checkbox/src/checkbox';
import { UiInputComponent } from '../../../input/src/input';
import { UiModalComponent } from '../../../modal/src/modal';
import { UiRadioGroupComponent } from '../../../radio/src/radio';
import type { UiRadioOption } from '../../../radio/src/radio';
import { UiSelectComponent } from '../../../select/src/select';
import type { UiSelectOption } from '../../../select/src/select';
import { UiSwitchComponent } from '../../../switch/src/switch';
import { UiTabsComponent } from '../../../tabs/src/tabs';
import type { UiTabItem } from '../../../tabs/src/tabs';
import { UiTextareaComponent } from '../../../textarea/src/textarea';
import {
  UiButtonHarness,
  UiCheckboxHarness,
  UiInputHarness,
  UiModalHarness,
  UiRadioGroupHarness,
  UiSelectHarness,
  UiSwitchHarness,
  UiTabsHarness,
  UiTextareaHarness,
} from '../../../testing/public-api';

const PLAN_OPTIONS: readonly UiSelectOption[] = [
  { label: 'Starter', value: 'starter' },
  { label: 'Pro', value: 'pro' },
];

const TABS: readonly UiTabItem[] = [
  { label: 'Overview', value: 'overview' },
  { label: 'API', value: 'api' },
];

const RADIO_OPTIONS: readonly UiRadioOption[] = [
  { label: 'Email', value: 'email' },
  { label: 'SMS', value: 'sms' },
];

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    UiButtonComponent,
    UiCheckboxComponent,
    UiInputComponent,
    UiModalComponent,
    UiRadioGroupComponent,
    UiSelectComponent,
    UiSwitchComponent,
    UiTabsComponent,
    UiTextareaComponent,
  ],
  template: `
    <ui-button type="submit" (click)="pressed = true">Save</ui-button>
    <ui-input label="Email" [formControl]="email" />
    <ui-checkbox label="Newsletter" [formControl]="newsletter" />
    <ui-select label="Plan" [options]="planOptions" [formControl]="plan" />
    <ui-radio-group label="Contact" [options]="radioOptions" [formControl]="contact" />
    <ui-switch label="Notifications" [formControl]="notifications" />
    <ui-textarea label="Message" [formControl]="message" />
    <ui-tabs [tabs]="tabs" [(active)]="activeTab">{{ activeTab }} panel</ui-tabs>
    <ui-modal [(open)]="open">
      <span uiModalHeader>Confirm</span>
      Body
    </ui-modal>
  `,
})
class HarnessHostComponent {
  protected readonly planOptions = PLAN_OPTIONS;
  protected readonly tabs = TABS;
  protected readonly radioOptions = RADIO_OPTIONS;
  readonly email = new FormControl('dev@example.com');
  readonly newsletter = new FormControl(false);
  readonly plan = new FormControl('starter');
  readonly contact = new FormControl('email');
  readonly notifications = new FormControl(false);
  readonly message = new FormControl('Hello');
  activeTab = 'overview';
  open = true;
  pressed = false;
}

describe('NgNova UI component harnesses', () => {
  let fixture: ComponentFixture<HarnessHostComponent>;
  let loader: ReturnType<typeof TestbedHarnessEnvironment.loader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HarnessHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HarnessHostComponent);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('drives buttons through UiButtonHarness', async () => {
    const button = await loader.getHarness(UiButtonHarness.with({ text: 'Save' }));

    expect(await button.getType()).toBe('submit');
    expect(await button.isDisabled()).toBe(false);

    await button.click();

    expect(fixture.componentInstance.pressed).toBe(true);
  });

  it('drives text inputs through UiInputHarness', async () => {
    const input = await loader.getHarness(UiInputHarness.with({ label: 'Email' }));

    await input.setValue('team@example.com');

    expect(await input.getValue()).toBe('team@example.com');
    expect(fixture.componentInstance.email.value).toBe('team@example.com');
  });

  it('drives checkboxes through UiCheckboxHarness', async () => {
    const checkbox = await loader.getHarness(UiCheckboxHarness.with({ label: 'Newsletter' }));

    expect(await checkbox.isChecked()).toBe(false);
    await checkbox.toggle();

    expect(await checkbox.isChecked()).toBe(true);
    expect(fixture.componentInstance.newsletter.value).toBe(true);
  });

  it('drives selects through UiSelectHarness', async () => {
    const select = await loader.getHarness(UiSelectHarness.with({ label: 'Plan' }));

    expect(await select.getOptionsText()).toEqual(['Starter', 'Pro']);
    await select.selectByValue('pro');

    expect(await select.getValue()).toBe('pro');
    expect(fixture.componentInstance.plan.value).toBe('pro');
  });

  it('drives radio groups through UiRadioGroupHarness', async () => {
    const radio = await loader.getHarness(UiRadioGroupHarness.with({ label: 'Contact' }));

    expect(await radio.getValue()).toBe('email');
    await radio.selectOption('SMS');

    expect(await radio.getValue()).toBe('sms');
    expect(fixture.componentInstance.contact.value).toBe('sms');
  });

  it('drives switches through UiSwitchHarness', async () => {
    const switchControl = await loader.getHarness(UiSwitchHarness.with({ label: 'Notifications' }));

    expect(await switchControl.isChecked()).toBe(false);
    await switchControl.toggle();

    expect(await switchControl.isChecked()).toBe(true);
    expect(fixture.componentInstance.notifications.value).toBe(true);
  });

  it('drives textareas through UiTextareaHarness', async () => {
    const textarea = await loader.getHarness(UiTextareaHarness.with({ label: 'Message' }));

    await textarea.setValue('Updated message');

    expect(await textarea.getValue()).toBe('Updated message');
    expect(fixture.componentInstance.message.value).toBe('Updated message');
  });

  it('drives tabs through UiTabsHarness', async () => {
    const tabs = await loader.getHarness(UiTabsHarness.with({ selectedLabel: 'Overview' }));

    expect(await tabs.getLabels()).toEqual(['Overview', 'API']);
    await tabs.selectTab('API');

    expect(fixture.componentInstance.activeTab).toBe('api');
    expect(await tabs.getSelectedLabel()).toBe('API');
    expect(await tabs.getPanelText()).toContain('api panel');
  });

  it('drives modals through UiModalHarness', async () => {
    const modal = await loader.getHarness(UiModalHarness.with({ title: 'Confirm' }));

    expect(await modal.isOpen()).toBe(true);
    await modal.close();

    expect(fixture.componentInstance.open).toBe(false);
  });
});
