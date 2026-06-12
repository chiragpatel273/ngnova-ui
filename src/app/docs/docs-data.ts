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
];

export const docsBySlug = new Map(componentDocs.map((doc) => [doc.slug, doc]));
