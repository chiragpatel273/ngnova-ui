import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { UiAccordionComponent } from '../../../accordion/src/accordion';
import type { UiAccordionItem } from '../../../accordion/src/accordion';
import { UiAlertComponent } from '../../../alert/src/alert';
import { UiButtonComponent } from '../../../button/src/button';
import { UiBreadcrumbComponent } from '../../../breadcrumb/src/breadcrumb';
import type { UiBreadcrumbItem } from '../../../breadcrumb/src/breadcrumb';
import { UiCheckboxComponent } from '../../../checkbox/src/checkbox';
import { UiChipComponent } from '../../../chip/src/chip';
import { UiComboboxComponent } from '../../../combobox/src/combobox';
import type { UiComboboxOption } from '../../../combobox/src/combobox';
import { UiCommandPaletteComponent } from '../../../command-palette/src/command-palette';
import type { UiCommand, UiCommandSelection } from '../../../command-palette/src/command-palette';
import {
  UiConfirmationDialogComponent,
  UiConfirmationService,
} from '../../../confirmation/src/confirmation';
import { UiDatePickerComponent } from '../../../date-picker/src/date-picker';
import { UiDataViewComponent } from '../../../data-view/src/data-view';
import {
  UiDrawerComponent,
  UiDrawerFooterDirective,
  UiDrawerHeaderDirective,
} from '../../../drawer/src/drawer';
import {
  UiFormFieldComponent,
  UiFormFieldControlDirective,
  UiFormFieldPrefixDirective,
} from '../../../form-field/src/form-field';
import { UiFileUploadComponent } from '../../../file-upload/src/file-upload';
import { UiInputComponent } from '../../../input/src/input';
import { UiMenuComponent, UiMenuTriggerDirective } from '../../../menu/src/menu';
import type { UiMenuItem, UiMenuSelection } from '../../../menu/src/menu';
import { UiModalComponent } from '../../../modal/src/modal';
import {
  UiOverlayComponent,
  UiOverlayContentDirective,
  UiOverlayTriggerDirective,
} from '../../../overlay/src/overlay';
import {
  UiPopoverComponent,
  UiPopoverContentDirective,
  UiPopoverTriggerDirective,
} from '../../../popover/src/popover';
import { UiPaginatorComponent } from '../../../paginator/src/paginator';
import { UiRadioGroupComponent } from '../../../radio/src/radio';
import type { UiRadioOption } from '../../../radio/src/radio';
import { UiSelectComponent } from '../../../select/src/select';
import type { UiSelectOption } from '../../../select/src/select';
import { UiStepperComponent } from '../../../stepper/src/stepper';
import type { UiStepItem } from '../../../stepper/src/stepper';
import { UiSwitchComponent } from '../../../switch/src/switch';
import { UiTableComponent } from '../../../table/src/table';
import type {
  UiTableColumn,
  UiTableRow,
  UiTableRowKey,
  UiTableSort,
} from '../../../table/src/table';
import { UiTabsComponent } from '../../../tabs/src/tabs';
import type { UiTabItem } from '../../../tabs/src/tabs';
import { UiTagComponent } from '../../../tag/src/tag';
import { UiTextareaComponent } from '../../../textarea/src/textarea';
import { UiToastComponent, UiToastService } from '../../../toast/src/toast';
import { UiTooltipDirective } from '../../../tooltip/src/tooltip';
import { UiTreeComponent } from '../../../tree/src/tree';
import type { UiTreeNode } from '../../../tree/src/tree';
import { UiTreeTableComponent } from '../../../tree-table/src/tree-table';
import type { UiTreeTableColumn, UiTreeTableNode } from '../../../tree-table/src/tree-table';
import {
  UiAccordionHarness,
  UiAlertHarness,
  UiButtonHarness,
  UiBreadcrumbHarness,
  UiCheckboxHarness,
  UiChipHarness,
  UiComboboxHarness,
  UiCommandPaletteHarness,
  UiConfirmationDialogHarness,
  UiDatePickerHarness,
  UiDataViewHarness,
  UiDrawerHarness,
  UiFormFieldHarness,
  UiFileUploadHarness,
  UiInputHarness,
  UiMenuHarness,
  UiModalHarness,
  UiOverlayHarness,
  UiPopoverHarness,
  UiPaginatorHarness,
  UiRadioGroupHarness,
  UiSelectHarness,
  UiStepperHarness,
  UiSwitchHarness,
  UiTableHarness,
  UiTabsHarness,
  UiTagHarness,
  UiTextareaHarness,
  UiToastHarness,
  UiTooltipHarness,
  UiTreeHarness,
  UiTreeTableHarness,
} from '../../../testing/public-api';

const PLAN_OPTIONS: readonly UiSelectOption[] = [
  { label: 'Starter', value: 'starter' },
  { label: 'Pro', value: 'pro' },
];
const FRAMEWORK_OPTIONS: readonly UiComboboxOption[] = [
  { label: 'Angular', value: 'angular' },
  { label: 'Vue', value: 'vue' },
];
const COMMANDS: readonly UiCommand[] = [
  { value: 'new', label: 'Create project', keywords: ['workspace'] },
  { value: 'settings', label: 'Open settings' },
];

const TABS: readonly UiTabItem[] = [
  { label: 'Overview', value: 'overview' },
  { label: 'API', value: 'api' },
];

const RADIO_OPTIONS: readonly UiRadioOption[] = [
  { label: 'Email', value: 'email' },
  { label: 'SMS', value: 'sms' },
];

const ACCORDION_ITEMS: readonly UiAccordionItem[] = [
  { value: 'overview', title: 'Overview', content: 'Overview content' },
  { value: 'api', title: 'API', content: 'API content' },
];

const TABLE_COLUMNS: readonly UiTableColumn[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'status', header: 'Status' },
];

const TABLE_ROWS: readonly UiTableRow[] = [{ id: 1, name: 'NgNova', status: 'Ready' }];
const MENU_ITEMS: readonly UiMenuItem[] = [
  { value: 'edit', label: 'Edit' },
  { value: 'delete', label: 'Delete', danger: true },
];
const BREADCRUMB_ITEMS: readonly UiBreadcrumbItem[] = [
  { label: 'Home', href: '/home' },
  { label: 'Components', href: '/components' },
  { label: 'Breadcrumb' },
];
const STEPPER_ITEMS: readonly UiStepItem[] = [
  { value: 'details', label: 'Details', completed: true },
  { value: 'review', label: 'Review' },
  { value: 'publish', label: 'Publish' },
];
const TREE_NODES: readonly UiTreeNode[] = [
  {
    value: 'components',
    label: 'Components',
    children: [{ value: 'button', label: 'Button' }],
  },
  { value: 'guides', label: 'Guides' },
];
const TREE_TABLE_COLUMNS: readonly UiTreeTableColumn[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'status', header: 'Status' },
];
const TREE_TABLE_NODES: readonly UiTreeTableNode[] = [
  {
    value: 'components',
    data: { name: 'Components', status: 'Ready' },
    children: [{ value: 'button', data: { name: 'Button', status: 'Ready' } }],
  },
];

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    UiAccordionComponent,
    UiAlertComponent,
    UiButtonComponent,
    UiBreadcrumbComponent,
    UiCheckboxComponent,
    UiChipComponent,
    UiComboboxComponent,
    UiCommandPaletteComponent,
    UiConfirmationDialogComponent,
    UiDatePickerComponent,
    UiDataViewComponent,
    UiDrawerComponent,
    UiDrawerFooterDirective,
    UiDrawerHeaderDirective,
    UiFormFieldComponent,
    UiFormFieldControlDirective,
    UiFormFieldPrefixDirective,
    UiFileUploadComponent,
    UiInputComponent,
    UiMenuComponent,
    UiMenuTriggerDirective,
    UiModalComponent,
    UiOverlayComponent,
    UiOverlayContentDirective,
    UiOverlayTriggerDirective,
    UiPopoverComponent,
    UiPopoverContentDirective,
    UiPopoverTriggerDirective,
    UiPaginatorComponent,
    UiRadioGroupComponent,
    UiSelectComponent,
    UiStepperComponent,
    UiSwitchComponent,
    UiTableComponent,
    UiTabsComponent,
    UiTagComponent,
    UiTextareaComponent,
    UiToastComponent,
    UiTooltipDirective,
    UiTreeComponent,
    UiTreeTableComponent,
  ],
  template: `
    <ui-button type="submit" (click)="pressed = true">Save</ui-button>
    <button uiTooltip="Tooltip details" [tooltipShowDelay]="0" [tooltipHideDelay]="0">Help</button>
    <ui-alert title="Connection restored" dismissible [(open)]="alertOpen">Online again.</ui-alert>
    @if (showTag) {
      <ui-tag removable (removed)="showTag = false">Angular</ui-tag>
    }
    <ui-input label="Email" [formControl]="email" />
    <ui-combobox
      label="Framework"
      [options]="frameworkOptions"
      [formControl]="framework"
      clearable
    />
    <ui-date-picker label="Launch date" [formControl]="launchDate" startAt="2026-06-01" clearable />
    <ui-form-field label="Project code" helperText="Short identifier" required>
      <span uiFormFieldPrefix>#</span>
      <input uiFormFieldControl value="ngnova" />
    </ui-form-field>
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
    <ui-popover [(open)]="popoverOpen" titleId="harness-popover-title">
      <button uiPopoverTrigger type="button">Account</button>
      <div uiPopoverContent>
        <h2 id="harness-popover-title">Account actions</h2>
        Sign out
      </div>
    </ui-popover>
    <ui-drawer [(open)]="drawerOpen" titleId="harness-drawer-title" position="left">
      <span uiDrawerHeader>Filters</span>
      Filter controls
      <button uiDrawerFooter type="button">Apply</button>
    </ui-drawer>
    <ui-menu [items]="menuItems" (itemSelected)="menuSelection = $event">
      <button uiMenuTrigger type="button">More actions</button>
    </ui-menu>
    @if (showChip) {
      <ui-chip selectable removable [(selected)]="chipSelected" (removed)="showChip = false">
        TypeScript
      </ui-chip>
    }
    <ui-paginator
      [(page)]="paginatorPage"
      [(pageSize)]="paginatorPageSize"
      [totalItems]="120"
      [pageSizeOptions]="[10, 20]"
    />
    <ui-breadcrumb [items]="breadcrumbItems" ariaLabel="Harness path" />
    <ui-stepper [steps]="stepperItems" [(active)]="activeStep" ariaLabel="Harness progress">
      {{ activeStep }} content
    </ui-stepper>
    <ui-toast />
    <ui-accordion [items]="accordionItems" [(active)]="activeSections" />
    <ui-table
      caption="Components"
      [columns]="tableColumns"
      [rows]="tableRows"
      rowKey="id"
      selectionMode="multiple"
      [selectedKeys]="tableSelectedKeys"
      (selectedKeysChange)="tableSelectedKeys = $event"
      (rowSelected)="selectedRow = $event"
      (sortChange)="tableSort = $event"
    />
    <ui-data-view
      [items]="tableRows"
      [layout]="dataViewLayout"
      (layoutChange)="dataViewLayout = $event"
      showLayoutToggle
      ariaLabel="Harness catalog"
    />
    <ui-tree
      [nodes]="treeNodes"
      [expanded]="treeExpanded"
      (expandedChange)="treeExpanded = $event"
      ariaLabel="Harness tree"
    />
    <ui-tree-table
      [columns]="treeTableColumns"
      [nodes]="treeTableNodes"
      [expanded]="treeTableExpanded"
      (expandedChange)="treeTableExpanded = $event"
      (sortChange)="treeTableSortDirection = $event.direction"
      caption="Harness packages"
    />
    <ui-file-upload
      [files]="uploadFiles"
      (filesChange)="uploadFiles = $event"
      (uploadRequested)="uploadRequested = true"
      ariaLabel="Harness attachments"
    />
    <ui-command-palette
      [commands]="commands"
      [open]="commandPaletteOpen"
      (openChange)="commandPaletteOpen = $event"
      [query]="commandQuery"
      (queryChange)="commandQuery = $event"
      (commandSelected)="commandSelection = $event"
      ariaLabel="Harness commands"
    />
    <ui-overlay
      [open]="overlayOpen"
      (openChange)="overlayOpen = $event"
      ariaLabel="Harness overlay"
    >
      <button uiOverlayTrigger type="button">Release actions</button>
      <div uiOverlayContent>Overlay release content</div>
    </ui-overlay>
    <ui-confirmation-dialog />
  `,
})
class HarnessHostComponent {
  protected readonly planOptions = PLAN_OPTIONS;
  protected readonly frameworkOptions = FRAMEWORK_OPTIONS;
  protected readonly commands = COMMANDS;
  protected readonly tabs = TABS;
  protected readonly radioOptions = RADIO_OPTIONS;
  protected readonly accordionItems = ACCORDION_ITEMS;
  protected readonly tableColumns = TABLE_COLUMNS;
  protected readonly tableRows = TABLE_ROWS;
  protected readonly menuItems = MENU_ITEMS;
  protected readonly breadcrumbItems = BREADCRUMB_ITEMS;
  protected readonly stepperItems = STEPPER_ITEMS;
  protected readonly treeNodes = TREE_NODES;
  protected readonly treeTableColumns = TREE_TABLE_COLUMNS;
  protected readonly treeTableNodes = TREE_TABLE_NODES;
  readonly email = new FormControl('dev@example.com');
  readonly framework = new FormControl('angular');
  readonly launchDate = new FormControl('2026-06-15');
  readonly newsletter = new FormControl(false);
  readonly plan = new FormControl('starter');
  readonly contact = new FormControl('email');
  readonly notifications = new FormControl(false);
  readonly message = new FormControl('Hello');
  activeTab = 'overview';
  open = true;
  popoverOpen = false;
  drawerOpen = true;
  alertOpen = true;
  showTag = true;
  pressed = false;
  activeSections: readonly string[] = [];
  selectedRow: UiTableRow | null = null;
  tableSort: UiTableSort | null = null;
  tableSelectedKeys: readonly UiTableRowKey[] = [];
  dataViewLayout: 'grid' | 'list' = 'grid';
  treeExpanded: readonly string[] = [];
  treeTableExpanded: readonly string[] = [];
  treeTableSortDirection = '';
  uploadFiles: readonly File[] = [new File(['release'], 'release.txt', { lastModified: 1 })];
  uploadRequested = false;
  commandPaletteOpen = true;
  commandQuery = '';
  commandSelection: UiCommandSelection | null = null;
  overlayOpen = false;
  menuSelection: UiMenuSelection | null = null;
  chipSelected = false;
  showChip = true;
  paginatorPage = 2;
  paginatorPageSize = 10;
  activeStep = 'review';
}

describe('NgNova UI component harnesses', () => {
  let fixture: ComponentFixture<HarnessHostComponent>;
  let loader: ReturnType<typeof TestbedHarnessEnvironment.loader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HarnessHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HarnessHostComponent);
    const toast = TestBed.inject(UiToastService);
    toast.clear();
    toast.success('Saved', 'Changes are ready.');
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

  it('drives autocomplete selection through UiComboboxHarness', async () => {
    const combobox = await loader.getHarness(UiComboboxHarness.with({ label: 'Framework' }));

    expect(await combobox.getQuery()).toBe('Angular');
    await combobox.setQuery('vu');
    expect(await combobox.getOptionsText()).toEqual(['Vue']);
    await combobox.selectOption('Vue');
    expect(fixture.componentInstance.framework.value).toBe('vue');
    expect(await combobox.isOpen()).toBe(false);
  });

  it('drives calendar selection through UiDatePickerHarness', async () => {
    const datePicker = await loader.getHarness(UiDatePickerHarness.with({ label: 'Launch date' }));

    expect(await datePicker.getDisplayValue()).toBe('Jun 15, 2026');
    expect(await datePicker.getMonthLabel()).toBe('June 2026');
    await datePicker.selectDate('2026-06-20');
    expect(fixture.componentInstance.launchDate.value).toBe('2026-06-20');
    expect(await datePicker.isOpen()).toBe(false);
  });

  it('drives composed controls through UiFormFieldHarness', async () => {
    const field = await loader.getHarness(UiFormFieldHarness.with({ label: 'Project code' }));

    expect(await field.getValue()).toBe('ngnova');
    expect(await field.getMessageText()).toBe('Short identifier');
    expect(await field.isRequired()).toBe(true);
    await field.setValue('nova');
    expect(await field.getValue()).toBe('nova');
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

  it('drives interactive floating panels through UiPopoverHarness', async () => {
    const popover = await loader.getHarness(UiPopoverHarness.with({ triggerText: 'Account' }));

    expect(await popover.isOpen()).toBe(false);
    await popover.open();
    expect(await popover.isOpen()).toBe(true);
    expect(await popover.getPanelText()).toContain('Sign out');
    expect(fixture.componentInstance.popoverOpen).toBe(true);

    await popover.close();
    expect(await popover.isOpen()).toBe(false);
    expect(fixture.componentInstance.popoverOpen).toBe(false);
  });

  it('reads and closes side panels through UiDrawerHarness', async () => {
    const drawer = await loader.getHarness(UiDrawerHarness.with({ title: 'Filters' }));

    expect(await drawer.isOpen()).toBe(true);
    expect(await drawer.getPosition()).toBe('left');
    await drawer.close();
    expect(await drawer.isOpen()).toBe(false);
    expect(fixture.componentInstance.drawerOpen).toBe(false);
  });

  it('reads and selects actions through UiMenuHarness', async () => {
    const menu = await loader.getHarness(UiMenuHarness.with({ triggerText: 'More actions' }));
    await menu.open();
    expect(await menu.getItemTexts()).toEqual(['Edit', 'Delete']);
    await menu.selectItem('Edit');
    expect(fixture.componentInstance.menuSelection?.item.value).toBe('edit');
    expect(await menu.isOpen()).toBe(false);
  });

  it('selects and removes values through UiChipHarness', async () => {
    const chip = await loader.getHarness(UiChipHarness.with({ text: 'TypeScript' }));

    expect(await chip.isSelected()).toBe(false);
    await chip.toggle();
    expect(await chip.isSelected()).toBe(true);
    expect(fixture.componentInstance.chipSelected).toBe(true);

    await chip.remove();
    expect(fixture.componentInstance.showChip).toBe(false);
  });

  it('navigates collections through UiPaginatorHarness', async () => {
    const paginator = await loader.getHarness(UiPaginatorHarness.with({ ariaLabel: 'Pagination' }));

    expect(await paginator.getCurrentPage()).toBe(2);
    expect(await paginator.getRangeText()).toContain('11–20 of 120');
    await paginator.next();
    expect(fixture.componentInstance.paginatorPage).toBe(3);
    await paginator.setPageSize(20);
    expect(fixture.componentInstance.paginatorPageSize).toBe(20);
  });

  it('reads navigation hierarchy through UiBreadcrumbHarness', async () => {
    const breadcrumb = await loader.getHarness(
      UiBreadcrumbHarness.with({ ariaLabel: 'Harness path' }),
    );

    expect(await breadcrumb.getLabelsText()).toEqual(['Home', 'Components', 'Breadcrumb']);
    expect(await breadcrumb.getCurrentLabel()).toBe('Breadcrumb');
    expect(await breadcrumb.isCollapsed()).toBe(false);
  });

  it('reads and navigates progress through UiStepperHarness', async () => {
    const stepper = await loader.getHarness(
      UiStepperHarness.with({ ariaLabel: 'Harness progress', currentLabel: 'Review' }),
    );

    expect(await stepper.getLabels()).toEqual(['Details', 'Review', 'Publish']);
    expect(await stepper.getStates()).toEqual(['complete', 'current', 'upcoming']);
    expect(await stepper.getPanelText()).toContain('review content');
    await stepper.selectStep('Details');
    expect(fixture.componentInstance.activeStep).toBe('details');
  });

  it('reads and dismisses notifications through UiToastHarness', async () => {
    const toast = await loader.getHarness(UiToastHarness.with({ message: 'Saved' }));

    expect(await toast.getCount()).toBe(1);
    expect(await toast.getTitles()).toEqual(['Saved']);

    await toast.dismiss('Saved');

    expect(await toast.getCount()).toBe(0);
  });

  it('reads and dismisses feedback through UiAlertHarness', async () => {
    const alert = await loader.getHarness(UiAlertHarness.with({ title: 'Connection restored' }));

    expect(await alert.isOpen()).toBe(true);
    expect(await alert.getRole()).toBe('status');
    await alert.dismiss();

    expect(await alert.isOpen()).toBe(false);
    expect(fixture.componentInstance.alertOpen).toBe(false);
  });

  it('reads and removes labels through UiTagHarness', async () => {
    const tag = await loader.getHarness(UiTagHarness.with({ text: 'Angular' }));

    expect(await tag.getText()).toBe('Angular');
    expect(await tag.isRemovable()).toBe(true);
    await tag.remove();

    expect(fixture.componentInstance.showTag).toBe(false);
  });

  it('reads and dismisses descriptions through UiTooltipHarness', async () => {
    const tooltip = await loader.getHarness(UiTooltipHarness.with({ triggerText: 'Help' }));

    await tooltip.show();
    expect(await tooltip.getTooltipText()).toBe('Tooltip details');
    await tooltip.hide();
    expect(await tooltip.getTooltipText()).toBeNull();
  });

  it('reads and toggles disclosures through UiAccordionHarness', async () => {
    const accordion = await loader.getHarness(UiAccordionHarness.with({ title: 'Overview' }));

    expect(await accordion.getTitles()).toEqual(['Overview', 'API']);
    expect(await accordion.isExpanded('Overview')).toBe(false);

    await accordion.toggle('Overview');

    expect(await accordion.isExpanded('Overview')).toBe(true);
    expect(fixture.componentInstance.activeSections).toEqual(['overview']);
  });

  it('reads, sorts, and selects data through UiTableHarness', async () => {
    const table = await loader.getHarness(UiTableHarness.with({ caption: 'Components' }));

    expect(await table.getHeadersText()).toEqual(['', 'Name', 'Status']);
    expect((await table.getRowsText())[0]).toContain('NgNova');

    await table.sortBy('Name');
    await table.toggleRowSelection(0);

    expect(fixture.componentInstance.tableSort).toEqual({ key: 'name', direction: 'asc' });
    expect(fixture.componentInstance.tableSelectedKeys).toEqual([1]);
    expect(await table.getSelectedRowIndexes()).toEqual([0]);
  });

  it('inspects records and controls layout through UiDataViewHarness', async () => {
    const dataView = await loader.getHarness(
      UiDataViewHarness.with({ ariaLabel: 'Harness catalog' }),
    );

    expect(await dataView.getItemCount()).toBe(1);
    await dataView.setLayout('list');
    expect(fixture.componentInstance.dataViewLayout).toBe('list');
  });

  it('inspects and activates branches through UiTreeHarness', async () => {
    const tree = await loader.getHarness(UiTreeHarness.with({ ariaLabel: 'Harness tree' }));

    expect(await tree.getVisibleLabels()).toEqual(['Components', 'Guides']);
    expect(await tree.isExpanded('Components')).toBe(false);
    await tree.activate('Components');
    expect(fixture.componentInstance.treeExpanded).toEqual(['components']);
  });

  it('reads, expands, and sorts through UiTreeTableHarness', async () => {
    const treeTable = await loader.getHarness(
      UiTreeTableHarness.with({ caption: 'Harness packages' }),
    );
    expect(await treeTable.getHeadersText()).toEqual(['Name', 'Status']);
    expect(await treeTable.getVisibleRowsText()).toEqual(['Components Ready']);
    await treeTable.activateRow(0);
    await treeTable.sortBy('Name');
    expect(fixture.componentInstance.treeTableSortDirection).toBe('asc');
  });

  it('inspects and controls files through UiFileUploadHarness', async () => {
    const upload = await loader.getHarness(
      UiFileUploadHarness.with({ ariaLabel: 'Harness attachments' }),
    );
    expect((await upload.getFileNames())[0]).toContain('release.txt');
    await upload.upload();
    expect(fixture.componentInstance.uploadRequested).toBe(true);
    await upload.removeFile(0);
    expect(fixture.componentInstance.uploadFiles).toEqual([]);
  });

  it('searches and selects commands through UiCommandPaletteHarness', async () => {
    const palette = await loader.getHarness(
      UiCommandPaletteHarness.with({ ariaLabel: 'Harness commands' }),
    );
    expect(await palette.isOpen()).toBe(true);
    await palette.search('workspace');
    expect(await palette.getCommandTexts()).toEqual(['Create project']);
    await palette.selectCommand(0);
    expect(fixture.componentInstance.commandSelection?.command.value).toBe('new');
    expect(fixture.componentInstance.commandPaletteOpen).toBe(false);
  });

  it('opens and closes connected content through UiOverlayHarness', async () => {
    const overlay = await loader.getHarness(UiOverlayHarness.with({ open: false }));
    expect(await overlay.getTriggerText()).toBe('Release actions');
    await overlay.open();
    expect(fixture.componentInstance.overlayOpen).toBe(true);
    expect(await overlay.isOpen()).toBe(true);
    await overlay.close();
    expect(fixture.componentInstance.overlayOpen).toBe(false);
  });

  it('resolves guarded workflows through UiConfirmationDialogHarness', async () => {
    const confirmations = TestBed.inject(UiConfirmationService);
    const resultPromise = confirmations.confirm({
      title: 'Delete harness release?',
      message: 'This cannot be undone.',
      requireText: 'DELETE',
      intent: 'danger',
    });
    fixture.detectChanges();
    const dialog = await loader.getHarness(
      UiConfirmationDialogHarness.with({ title: 'Delete harness release?' }),
    );
    expect(await dialog.isOpen()).toBe(true);
    expect(await dialog.isConfirmDisabled()).toBe(true);
    await dialog.setConfirmationText('DELETE');
    expect(await dialog.isConfirmDisabled()).toBe(false);
    await dialog.confirm();
    expect((await resultPromise).reason).toBe('confirm');
  });
});
