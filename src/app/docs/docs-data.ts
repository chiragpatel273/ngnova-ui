export interface ApiInput {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
}

export interface ApiOutput {
  name: string;
  type: string;
  description: string;
}

export interface ComponentDoc {
  slug: string;
  name: string;
  selector: string;
  summary: string;
  importName: string;
  usage: string;
  inputs: ApiInput[];
  outputs: ApiOutput[];
}

export const componentDocs: ComponentDoc[] = [
  {
    slug: 'button',
    name: 'Button',
    selector: 'ui-button',
    summary: 'Action button with variants, sizes, disabled state, and loading feedback.',
    importName: 'UiButtonComponent',
    usage: `<ui-button variant="primary" size="md" (pressed)="save()">Save</ui-button>
<ui-button variant="outline" [loading]="saving" loadingLabel="Saving changes">Saving</ui-button>
<ui-button variant="secondary" fullWidth>Continue</ui-button>`,
    inputs: [
      {
        name: 'variant',
        type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'",
        defaultValue: "'primary'",
        description: 'Visual emphasis style.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        description: 'Button height and text scale.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Disables pointer and keyboard activation.',
      },
      {
        name: 'loading',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Shows a spinner and disables activation.',
      },
      {
        name: 'fullWidth',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Expands the button to the full width of its container.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "''",
        description: 'Accessible label for icon-only or visually ambiguous buttons.',
      },
      {
        name: 'loadingLabel',
        type: 'string',
        defaultValue: "'Loading'",
        description: 'Screen-reader text announced while loading.',
      },
      {
        name: 'type',
        type: "'button' | 'submit' | 'reset'",
        defaultValue: "'button'",
        description: 'Native button type.',
      },
    ],
    outputs: [
      {
        name: 'pressed',
        type: 'OutputEmitterRef<MouseEvent>',
        description: 'Emits when the enabled button is clicked or activated.',
      },
      {
        name: 'focused',
        type: 'OutputEmitterRef<FocusEvent>',
        description: 'Emits when the native button receives focus.',
      },
      {
        name: 'blurred',
        type: 'OutputEmitterRef<FocusEvent>',
        description: 'Emits when the native button loses focus.',
      },
    ],
  },
  {
    slug: 'card',
    name: 'Card',
    selector: 'ui-card',
    summary: 'Content container with projected header, body, and footer regions.',
    importName: 'UiCardComponent',
    usage: `<ui-card variant="elevated" padding="lg">
  <div uiCardHeader>Project status</div>
  The library is ready to build.
  <div uiCardFooter>Updated today</div>
</ui-card>`,
    inputs: [
      {
        name: 'variant',
        type: "'outline' | 'elevated'",
        defaultValue: "'outline'",
        description: 'Card border and shadow treatment.',
      },
      {
        name: 'padding',
        type: "'none' | 'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        description: 'Body padding scale.',
      },
    ],
    outputs: [],
  },
  {
    slug: 'input',
    name: 'Input',
    selector: 'ui-input',
    summary:
      'Text input with label, helper text, error text, disabled state, and Angular forms support.',
    importName: 'UiInputComponent',
    usage: `<ui-input
  label="Email"
  placeholder="you@example.com"
  helperText="Use your work email"
  autocomplete="email"
  required
  [formControl]="email"
/>`,
    inputs: [
      { name: 'label', type: 'string', defaultValue: "''", description: 'Visible field label.' },
      {
        name: 'placeholder',
        type: 'string',
        defaultValue: "''",
        description: 'Native input placeholder.',
      },
      {
        name: 'helperText',
        type: 'string',
        defaultValue: "''",
        description: 'Support text shown below the field.',
      },
      {
        name: 'errorText',
        type: 'string',
        defaultValue: "''",
        description: 'Error text shown below the field and reflected in aria-invalid.',
      },
      {
        name: 'type',
        type: "'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url'",
        defaultValue: "'text'",
        description: 'Native input type.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        description: 'Input height and text scale.',
      },
      {
        name: 'inputId',
        type: 'string',
        defaultValue: 'generated',
        description: 'ID applied to the native input.',
      },
      { name: 'name', type: 'string', defaultValue: "''", description: 'Native input name.' },
      {
        name: 'autocomplete',
        type: 'string',
        defaultValue: "''",
        description: 'Native autocomplete value.',
      },
      {
        name: 'inputMode',
        type: 'string',
        defaultValue: "''",
        description: 'Native inputmode value for mobile keyboards.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "''",
        description: 'Accessible label when no visible label is provided.',
      },
      {
        name: 'maxLength',
        type: 'number | null',
        defaultValue: 'null',
        description: 'Native maxlength constraint.',
      },
      {
        name: 'minLength',
        type: 'number | null',
        defaultValue: 'null',
        description: 'Native minlength constraint.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Disables the native input.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Makes the native input read-only.',
      },
      {
        name: 'required',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Marks the native input as required.',
      },
    ],
    outputs: [
      {
        name: 'valueChange',
        type: 'OutputEmitterRef<string>',
        description: 'Emits the current value on input.',
      },
      {
        name: 'focused',
        type: 'OutputEmitterRef<FocusEvent>',
        description: 'Emits when the input receives focus.',
      },
      {
        name: 'blurred',
        type: 'OutputEmitterRef<FocusEvent>',
        description: 'Emits when the input loses focus.',
      },
    ],
  },
  {
    slug: 'badge',
    name: 'Badge',
    selector: 'ui-badge',
    summary: 'Compact status label for categories, states, and metadata.',
    importName: 'UiBadgeComponent',
    usage: `<ui-badge variant="success" ariaRole="status">Active</ui-badge>
<ui-badge variant="warning" size="sm">Pending</ui-badge>`,
    inputs: [
      {
        name: 'variant',
        type: "'default' | 'success' | 'warning' | 'danger' | 'info'",
        defaultValue: "'default'",
        description: 'Semantic color treatment.',
      },
      {
        name: 'size',
        type: "'sm' | 'md'",
        defaultValue: "'md'",
        description: 'Badge padding and text size.',
      },
      {
        name: 'ariaRole',
        type: 'string',
        defaultValue: "''",
        description: 'Optional ARIA role, such as status.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "''",
        description: 'Accessible label for compact or icon-only badges.',
      },
    ],
    outputs: [],
  },
  {
    slug: 'modal',
    name: 'Modal',
    selector: 'ui-modal',
    summary: 'Dialog overlay with header/body/footer projection, backdrop close, and Escape close.',
    importName: 'UiModalComponent',
    usage: `<ui-button (pressed)="open = true">Open dialog</ui-button>

<ui-modal [(open)]="open" size="lg" descriptionId="publish-dialog-description">
  <span uiModalHeader>Confirm publish</span>
  <p id="publish-dialog-description">This action publishes the package.</p>
  <div uiModalFooter>
    <ui-button variant="outline" (pressed)="open = false">Cancel</ui-button>
    <ui-button (pressed)="publish()">Publish</ui-button>
  </div>
</ui-modal>`,
    inputs: [
      {
        name: 'open',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Controls dialog visibility.',
      },
      {
        name: 'closeOnBackdrop',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Closes when the backdrop is clicked.',
      },
      {
        name: 'closeOnEscape',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Closes when Escape is pressed.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg' | 'xl'",
        defaultValue: "'md'",
        description: 'Maximum dialog width.',
      },
      {
        name: 'titleId',
        type: 'string',
        defaultValue: 'generated',
        description: 'ID used by aria-labelledby.',
      },
      {
        name: 'descriptionId',
        type: 'string',
        defaultValue: "''",
        description: 'Optional ID used by aria-describedby.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "''",
        description: 'Accessible dialog label for headerless dialogs.',
      },
      {
        name: 'restoreFocus',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Restores focus to the previously focused element after close.',
      },
    ],
    outputs: [
      {
        name: 'openChange',
        type: 'OutputEmitterRef<boolean>',
        description: 'Supports two-way open binding.',
      },
      {
        name: 'opened',
        type: 'OutputEmitterRef<void>',
        description: 'Emits when the dialog opens.',
      },
      {
        name: 'closed',
        type: 'OutputEmitterRef<void>',
        description: 'Emits after the dialog closes.',
      },
      {
        name: 'backdropClick',
        type: 'OutputEmitterRef<MouseEvent>',
        description: 'Emits when the backdrop is clicked.',
      },
      {
        name: 'escapeKeyDown',
        type: 'OutputEmitterRef<KeyboardEvent>',
        description: 'Emits when Escape closes the dialog.',
      },
    ],
  },
  {
    slug: 'checkbox',
    name: 'Checkbox',
    selector: 'ui-checkbox',
    summary: 'Accessible checkbox with helper text, disabled state, and Angular forms support.',
    importName: 'UiCheckboxComponent',
    usage: `<ui-checkbox
  label="Email updates"
  helperText="Receive product and release news."
  [formControl]="newsletter"
/>`,
    inputs: [
      { name: 'label', type: 'string', defaultValue: "''", description: 'Visible checkbox label.' },
      {
        name: 'helperText',
        type: 'string',
        defaultValue: "''",
        description: 'Support text shown below the label.',
      },
      {
        name: 'inputId',
        type: 'string',
        defaultValue: 'generated',
        description: 'ID applied to the native checkbox.',
      },
      { name: 'name', type: 'string', defaultValue: "''", description: 'Native input name.' },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "''",
        description: 'Accessible label when no visible label is provided.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Disables the native checkbox.',
      },
      {
        name: 'required',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Marks the native checkbox as required.',
      },
      {
        name: 'indeterminate',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Shows the native mixed visual state until the user changes the value.',
      },
    ],
    outputs: [
      {
        name: 'valueChange',
        type: 'OutputEmitterRef<boolean>',
        description: 'Emits the checked value after user interaction.',
      },
      {
        name: 'indeterminateChange',
        type: 'OutputEmitterRef<boolean>',
        description:
          'Supports two-way binding when the mixed state is cleared by user interaction.',
      },
      {
        name: 'focused',
        type: 'OutputEmitterRef<FocusEvent>',
        description: 'Emits when the native checkbox receives focus.',
      },
      {
        name: 'blurred',
        type: 'OutputEmitterRef<FocusEvent>',
        description: 'Emits when the native checkbox loses focus.',
      },
    ],
  },
  {
    slug: 'select',
    name: 'Select',
    selector: 'ui-select',
    summary: 'Native select field with label, helper/error text, and Angular forms support.',
    importName: 'UiSelectComponent',
    usage: `<ui-select
  label="Plan"
  placeholder="Choose a plan"
  helperText="You can change this later."
  [options]="planOptions"
  [formControl]="plan"
/>`,
    inputs: [
      { name: 'label', type: 'string', defaultValue: "''", description: 'Visible field label.' },
      {
        name: 'placeholder',
        type: 'string',
        defaultValue: "''",
        description: 'Optional empty option label shown first.',
      },
      {
        name: 'helperText',
        type: 'string',
        defaultValue: "''",
        description: 'Support text shown below the field.',
      },
      {
        name: 'errorText',
        type: 'string',
        defaultValue: "''",
        description: 'Error text shown below the field and reflected in aria-invalid.',
      },
      {
        name: 'inputId',
        type: 'string',
        defaultValue: 'generated',
        description: 'ID applied to the native select.',
      },
      { name: 'name', type: 'string', defaultValue: "''", description: 'Native select name.' },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "''",
        description: 'Accessible label when no visible label is provided.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        description: 'Select height and text scale.',
      },
      {
        name: 'options',
        type: 'readonly UiSelectOption[]',
        defaultValue: '[]',
        description: 'Options rendered as native option elements.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Disables the native select.',
      },
      {
        name: 'required',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Marks the native select as required.',
      },
    ],
    outputs: [
      {
        name: 'valueChange',
        type: 'OutputEmitterRef<string>',
        description: 'Emits the selected value after user interaction.',
      },
      {
        name: 'focused',
        type: 'OutputEmitterRef<FocusEvent>',
        description: 'Emits when the native select receives focus.',
      },
      {
        name: 'blurred',
        type: 'OutputEmitterRef<FocusEvent>',
        description: 'Emits when the native select loses focus.',
      },
    ],
  },
  {
    slug: 'alert',
    name: 'Alert',
    selector: 'ui-alert',
    summary: 'Semantic feedback message with variants and an optional dismiss action.',
    importName: 'UiAlertComponent',
    usage: `<ui-alert variant="success" title="Package ready" dismissible>
  The library build finished and can be packed from dist/ui.
</ui-alert>`,
    inputs: [
      {
        name: 'variant',
        type: "'info' | 'success' | 'warning' | 'danger'",
        defaultValue: "'info'",
        description: 'Semantic feedback treatment.',
      },
      { name: 'title', type: 'string', defaultValue: "''", description: 'Optional heading text.' },
      {
        name: 'open',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Controls alert visibility and supports reopening dismissed alerts.',
      },
      {
        name: 'ariaRole',
        type: 'string',
        defaultValue: "''",
        description: 'Overrides the default status/alert role.',
      },
      {
        name: 'dismissible',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Shows a close button and hides the alert when pressed.',
      },
    ],
    outputs: [
      {
        name: 'openChange',
        type: 'OutputEmitterRef<boolean>',
        description: 'Supports two-way open binding for dismissible alerts.',
      },
      {
        name: 'dismissed',
        type: 'OutputEmitterRef<void>',
        description: 'Emits after the dismiss button hides the alert.',
      },
    ],
  },
  {
    slug: 'radio',
    name: 'Radio Group',
    selector: 'ui-radio-group',
    summary:
      'Native radio group with options, helper/error text, orientation, and Angular forms support.',
    importName: 'UiRadioGroupComponent',
    usage: `<ui-radio-group
  label="Contact preference"
  helperText="Choose one option."
  [options]="contactOptions"
  [formControl]="contactPreference"
/>`,
    inputs: [
      { name: 'label', type: 'string', defaultValue: "''", description: 'Visible group label.' },
      {
        name: 'helperText',
        type: 'string',
        defaultValue: "''",
        description: 'Support text shown below the group.',
      },
      {
        name: 'errorText',
        type: 'string',
        defaultValue: "''",
        description: 'Error text shown below the group.',
      },
      {
        name: 'name',
        type: 'string',
        defaultValue: "''",
        description: 'Native radio name. Defaults to the generated group ID.',
      },
      {
        name: 'groupId',
        type: 'string',
        defaultValue: 'generated',
        description: 'Base ID used for group description wiring.',
      },
      {
        name: 'orientation',
        type: "'vertical' | 'horizontal'",
        defaultValue: "'vertical'",
        description: 'Radio option layout direction.',
      },
      {
        name: 'options',
        type: 'readonly UiRadioOption[]',
        defaultValue: '[]',
        description: 'Radio options rendered as native input elements.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Disables the whole radio group.',
      },
      {
        name: 'required',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Marks radio options as required.',
      },
    ],
    outputs: [
      {
        name: 'valueChange',
        type: 'OutputEmitterRef<string>',
        description: 'Emits the selected value after user interaction.',
      },
      {
        name: 'focused',
        type: 'OutputEmitterRef<FocusEvent>',
        description: 'Emits when a radio receives focus.',
      },
      {
        name: 'blurred',
        type: 'OutputEmitterRef<FocusEvent>',
        description: 'Emits when a radio loses focus.',
      },
    ],
  },
  {
    slug: 'switch',
    name: 'Switch',
    selector: 'ui-switch',
    summary: 'Accessible boolean switch with label, helper text, and Angular forms support.',
    importName: 'UiSwitchComponent',
    usage: `<ui-switch
  label="Release notifications"
  helperText="Email me when a release is published."
  [formControl]="notifications"
/>`,
    inputs: [
      { name: 'label', type: 'string', defaultValue: "''", description: 'Visible switch label.' },
      {
        name: 'helperText',
        type: 'string',
        defaultValue: "''",
        description: 'Support text shown below the label.',
      },
      {
        name: 'inputId',
        type: 'string',
        defaultValue: 'generated',
        description: 'ID applied to the native checkbox.',
      },
      { name: 'name', type: 'string', defaultValue: "''", description: 'Native input name.' },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "''",
        description: 'Accessible label when no visible label is provided.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Disables the switch.',
      },
      {
        name: 'required',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Marks the switch as required.',
      },
    ],
    outputs: [
      {
        name: 'valueChange',
        type: 'OutputEmitterRef<boolean>',
        description: 'Emits the checked value after user interaction.',
      },
      {
        name: 'focused',
        type: 'OutputEmitterRef<FocusEvent>',
        description: 'Emits when the switch receives focus.',
      },
      {
        name: 'blurred',
        type: 'OutputEmitterRef<FocusEvent>',
        description: 'Emits when the switch loses focus.',
      },
    ],
  },
  {
    slug: 'textarea',
    name: 'Textarea',
    selector: 'ui-textarea',
    summary:
      'Multi-line text field with label, helper/error text, resize options, and Angular forms support.',
    importName: 'UiTextareaComponent',
    usage: `<ui-textarea
  label="Release notes"
  placeholder="Describe what changed..."
  helperText="Markdown is supported in your app."
  [formControl]="releaseNotes"
/>`,
    inputs: [
      { name: 'label', type: 'string', defaultValue: "''", description: 'Visible field label.' },
      {
        name: 'placeholder',
        type: 'string',
        defaultValue: "''",
        description: 'Native textarea placeholder.',
      },
      {
        name: 'helperText',
        type: 'string',
        defaultValue: "''",
        description: 'Support text shown below the field.',
      },
      {
        name: 'errorText',
        type: 'string',
        defaultValue: "''",
        description: 'Error text shown below the field and reflected in aria-invalid.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        description: 'Textarea padding and text scale.',
      },
      {
        name: 'resize',
        type: "'none' | 'vertical' | 'horizontal' | 'both'",
        defaultValue: "'vertical'",
        description: 'Native resize affordance.',
      },
      {
        name: 'inputId',
        type: 'string',
        defaultValue: 'generated',
        description: 'ID applied to the native textarea.',
      },
      { name: 'name', type: 'string', defaultValue: "''", description: 'Native textarea name.' },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "''",
        description: 'Accessible label when no visible label is provided.',
      },
      {
        name: 'rows',
        type: 'number',
        defaultValue: '4',
        description: 'Native rows attribute.',
      },
      {
        name: 'maxLength',
        type: 'number | null',
        defaultValue: 'null',
        description: 'Native maxlength constraint.',
      },
      {
        name: 'minLength',
        type: 'number | null',
        defaultValue: 'null',
        description: 'Native minlength constraint.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Disables the native textarea.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Makes the native textarea read-only.',
      },
      {
        name: 'required',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Marks the native textarea as required.',
      },
    ],
    outputs: [
      {
        name: 'valueChange',
        type: 'OutputEmitterRef<string>',
        description: 'Emits the current value on input.',
      },
      {
        name: 'focused',
        type: 'OutputEmitterRef<FocusEvent>',
        description: 'Emits when the textarea receives focus.',
      },
      {
        name: 'blurred',
        type: 'OutputEmitterRef<FocusEvent>',
        description: 'Emits when the textarea loses focus.',
      },
    ],
  },
  {
    slug: 'tabs',
    name: 'Tabs',
    selector: 'ui-tabs',
    summary: 'Keyboard-friendly tablist for switching between related sections.',
    importName: 'UiTabsComponent',
    usage: `<ui-tabs [tabs]="tabs" [(active)]="activeTab" ariaLabel="Package docs">
  @if (activeTab === 'overview') {
    Overview content
  } @else {
    API content
  }
</ui-tabs>`,
    inputs: [
      {
        name: 'id',
        type: 'string',
        defaultValue: 'generated',
        description: 'Base ID used for tab and panel ARIA relationships.',
      },
      {
        name: 'tabs',
        type: 'readonly UiTabItem[]',
        defaultValue: '[]',
        description: 'Tab labels, values, and disabled states.',
      },
      {
        name: 'active',
        type: 'string',
        defaultValue: "''",
        description: 'Currently selected tab value.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "'Tabs'",
        description: 'Accessible label for the tablist.',
      },
      {
        name: 'fullWidth',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Stretches tab buttons across the available width.',
      },
    ],
    outputs: [
      {
        name: 'activeChange',
        type: 'OutputEmitterRef<string>',
        description: 'Supports two-way binding for the active tab value.',
      },
    ],
  },
  {
    slug: 'spinner',
    name: 'Spinner',
    selector: 'ui-spinner',
    summary: 'Lightweight loading indicator with accessible status text.',
    importName: 'UiSpinnerComponent',
    usage: `<ui-spinner label="Loading components" />
<ui-spinner size="sm" decorative />`,
    inputs: [
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        description: 'Spinner diameter and border thickness.',
      },
      {
        name: 'label',
        type: 'string',
        defaultValue: "'Loading'",
        description: 'Accessible loading label when the spinner is not decorative.',
      },
      {
        name: 'decorative',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Removes status semantics when another element already announces loading.',
      },
    ],
    outputs: [],
  },
];

export const docsBySlug = new Map(componentDocs.map((doc) => [doc.slug, doc]));
