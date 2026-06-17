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

export interface ComponentExample {
  title: string;
  description: string;
  code: string;
}

export interface ComponentDocDetails {
  overview: string[];
  whenToUse: string[];
  examples: ComponentExample[];
  accessibility: string[];
  keyboard: string[];
  forms: string[];
  edgeCases: string[];
  testing: string[];
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
      'Text input with floating labels, semantic intent, password reveal, smart counters, validation, and Angular forms support.',
    importName: 'UiInputComponent',
    usage: `<ui-input
  label="Email"
  type="email"
  autocomplete="email"
  helperText="Use your organization email."
  labelMode="floating"
  intent="success"
  clearable
  [maxLength]="80"
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
        name: 'appearance',
        type: "'outline' | 'filled'",
        defaultValue: "'outline'",
        description: 'Visual field treatment for standard or denser form surfaces.',
      },
      {
        name: 'intent',
        type: "'default' | 'success' | 'warning' | 'danger'",
        defaultValue: "'default'",
        description:
          'Semantic field intent. Angular invalid state automatically takes danger priority.',
      },
      {
        name: 'labelMode',
        type: "'top' | 'floating' | 'hidden'",
        defaultValue: "'top'",
        description:
          'Label placement. Hidden keeps an accessible label while removing visual label text.',
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
        name: 'validationMessages',
        type: 'Record<string, string>',
        defaultValue: '{}',
        description: 'Custom validation messages keyed by Angular validation error name.',
      },
      {
        name: 'clearLabel',
        type: 'string',
        defaultValue: "'Clear input'",
        description: 'Accessible label and fallback text for the clear action.',
      },
      {
        name: 'showPasswordLabel',
        type: 'string',
        defaultValue: "'Show password'",
        description: 'Accessible label and fallback text for revealing a password field.',
      },
      {
        name: 'hidePasswordLabel',
        type: 'string',
        defaultValue: "'Hide password'",
        description: 'Accessible label and fallback text for hiding a revealed password field.',
      },
      {
        name: 'counterMode',
        type: "'characters' | 'words'",
        defaultValue: "'characters'",
        description: 'Counter strategy for character-limited or word-limited fields.',
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
        name: 'counterMax',
        type: 'number | null',
        defaultValue: 'null',
        description:
          'Counter-only limit. Use this for word counts or soft limits without native maxlength.',
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
      {
        name: 'clearable',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Shows a keyboard-reachable clear button when the field has a value.',
      },
      {
        name: 'hideCounter',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Hides the character or word counter when a counter limit is set.',
      },
      {
        name: 'revealable',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Shows a keyboard-accessible password visibility toggle for password inputs.',
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
      {
        name: 'cleared',
        type: 'OutputEmitterRef<void>',
        description: 'Emits when the clear button resets the current value.',
      },
      {
        name: 'submitted',
        type: 'OutputEmitterRef<string>',
        description: 'Emits the current value when Enter is pressed inside the input.',
      },
      {
        name: 'passwordVisibilityChange',
        type: 'OutputEmitterRef<boolean>',
        description: 'Emits after the password reveal state changes.',
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
    slug: 'tag',
    name: 'Tag',
    selector: 'ui-tag',
    summary: 'Compact removable or icon-enhanced label for filters, metadata, and statuses.',
    importName: 'UiTagComponent',
    usage: `<ui-tag icon="+">Angular</ui-tag>
<ui-tag variant="success">Published</ui-tag>
<ui-tag variant="warning" removable (removed)="removeFilter()">Review needed</ui-tag>`,
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
        description: 'Tag padding and text size.',
      },
      {
        name: 'icon',
        type: 'string',
        defaultValue: "''",
        description: 'Optional leading icon text.',
      },
      {
        name: 'removable',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Shows an accessible remove button.',
      },
      {
        name: 'removeLabel',
        type: 'string',
        defaultValue: "'Remove tag'",
        description: 'Accessible label for the remove action.',
      },
    ],
    outputs: [
      {
        name: 'removed',
        type: 'OutputEmitterRef<void>',
        description: 'Emits when the remove button is pressed.',
      },
    ],
  },
  {
    slug: 'avatar',
    name: 'Avatar',
    selector: 'ui-avatar',
    summary: 'User or entity avatar with image, initials fallback, sizes, and shapes.',
    importName: 'UiAvatarComponent',
    usage: `<ui-avatar label="Ada Lovelace" />
<ui-avatar src="/team/ada.png" alt="Ada Lovelace" label="Ada Lovelace" />
<ui-avatar label="NgNova UI" shape="square" size="lg" />`,
    inputs: [
      { name: 'src', type: 'string', defaultValue: "''", description: 'Optional image source.' },
      { name: 'alt', type: 'string', defaultValue: "''", description: 'Image alt text.' },
      {
        name: 'label',
        type: 'string',
        defaultValue: "''",
        description: 'Accessible label and initials source.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        description: 'Avatar dimensions.',
      },
      {
        name: 'shape',
        type: "'circle' | 'square'",
        defaultValue: "'circle'",
        description: 'Avatar border radius.',
      },
    ],
    outputs: [],
  },
  {
    slug: 'skeleton',
    name: 'Skeleton',
    selector: 'ui-skeleton',
    summary: 'Decorative loading placeholder for cards, text, avatars, and table rows.',
    importName: 'UiSkeletonComponent',
    usage: `<ui-skeleton shape="circle" width="2.5rem" height="2.5rem" />
<ui-skeleton shape="text" width="60%" height="0.875rem" />
<ui-skeleton height="8rem" />`,
    inputs: [
      {
        name: 'shape',
        type: "'text' | 'rect' | 'circle'",
        defaultValue: "'rect'",
        description: 'Placeholder shape.',
      },
      { name: 'width', type: 'string', defaultValue: "'100%'", description: 'CSS width value.' },
      { name: 'height', type: 'string', defaultValue: "'1rem'", description: 'CSS height value.' },
    ],
    outputs: [],
  },
  {
    slug: 'progress-bar',
    name: 'Progress Bar',
    selector: 'ui-progress-bar',
    summary: 'Accessible determinate or indeterminate progress indicator.',
    importName: 'UiProgressBarComponent',
    usage: `<ui-progress-bar [value]="65" label="Build progress" />
<ui-progress-bar [value]="90" variant="success" label="Coverage" />
<ui-progress-bar indeterminate label="Publishing package" />`,
    inputs: [
      { name: 'value', type: 'number', defaultValue: '0', description: 'Current progress value.' },
      { name: 'max', type: 'number', defaultValue: '100', description: 'Maximum progress value.' },
      {
        name: 'label',
        type: 'string',
        defaultValue: "'Progress'",
        description: 'Accessible progressbar label.',
      },
      {
        name: 'variant',
        type: "'primary' | 'success' | 'warning' | 'danger'",
        defaultValue: "'primary'",
        description: 'Semantic bar color.',
      },
      {
        name: 'indeterminate',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Removes value semantics when progress is unknown.',
      },
    ],
    outputs: [],
  },
  {
    slug: 'modal',
    name: 'Modal',
    selector: 'ui-modal',
    summary:
      'Dialog overlay with focus management, header/body/footer projection, backdrop policy, and Escape handling.',
    importName: 'UiModalComponent',
    usage: `<ui-button (pressed)="publishOpen = true">Open dialog</ui-button>

<ui-modal
  [(open)]="publishOpen"
  size="lg"
  descriptionId="publish-dialog-description"
  [closeOnBackdrop]="false"
>
  <span uiModalHeader>Publish package</span>
  <p id="publish-dialog-description">This action publishes @ngnova/ui to npm.</p>
  <div uiModalFooter>
    <ui-button variant="outline" (pressed)="publishOpen = false">Cancel</ui-button>
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
        name: 'appearance',
        type: "'outline' | 'filled'",
        defaultValue: "'outline'",
        description: 'Visual field treatment for standard or denser form surfaces.',
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
        name: 'validationMessages',
        type: 'Record<string, string>',
        defaultValue: '{}',
        description: 'Custom validation messages keyed by Angular validation error name.',
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
      {
        name: 'hideCounter',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Hides the character counter when maxLength is set.',
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
    slug: 'accordion',
    name: 'Accordion',
    selector: 'ui-accordion',
    summary: 'Accessible disclosure list for dense related content sections.',
    importName: 'UiAccordionComponent',
    usage: `<ui-accordion
  [items]="items"
  [active]="activeSections"
  (activeChange)="activeSections = $event"
/>`,
    inputs: [
      { name: 'id', type: 'string', defaultValue: "'ui-accordion'", description: 'Base ARIA ID.' },
      {
        name: 'items',
        type: 'readonly UiAccordionItem[]',
        defaultValue: '[]',
        description: 'Disclosure items with value, title, content, and disabled state.',
      },
      {
        name: 'active',
        type: 'readonly string[]',
        defaultValue: '[]',
        description: 'Currently expanded item values.',
      },
      {
        name: 'multiple',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Allows more than one item to be open.',
      },
    ],
    outputs: [
      {
        name: 'activeChange',
        type: 'OutputEmitterRef<readonly string[]>',
        description: 'Emits the next active item values after user interaction.',
      },
    ],
  },
  {
    slug: 'table',
    name: 'Table',
    selector: 'ui-table',
    summary:
      'Responsive data table with columns, loading/empty states, row selection, and sort events.',
    importName: 'UiTableComponent',
    usage: `<ui-table
  [columns]="columns"
  [rows]="components"
  selectable
  emptyText="No components match your filters."
  loadingText="Loading components..."
  (rowSelected)="openComponent($event)"
  (sortChange)="sortComponents($event)"
/>`,
    inputs: [
      {
        name: 'columns',
        type: 'readonly UiTableColumn[]',
        defaultValue: '[]',
        description: 'Column definitions with key, header, alignment, and sortable flag.',
      },
      {
        name: 'rows',
        type: 'readonly UiTableRow[]',
        defaultValue: '[]',
        description: 'Records rendered in the table body.',
      },
      {
        name: 'emptyText',
        type: 'string',
        defaultValue: "'No records found.'",
        description: 'Message shown when no rows are available.',
      },
      {
        name: 'loadingText',
        type: 'string',
        defaultValue: "'Loading records...'",
        description: 'Message shown while loading.',
      },
      {
        name: 'loading',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Shows the loading state.',
      },
      {
        name: 'selectable',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Emits rowSelected when a row is clicked.',
      },
    ],
    outputs: [
      {
        name: 'rowSelected',
        type: 'OutputEmitterRef<UiTableRow>',
        description: 'Emits the clicked row when selectable.',
      },
      {
        name: 'sortChange',
        type: 'OutputEmitterRef<UiTableSort>',
        description: 'Emits the requested sort key and direction.',
      },
    ],
  },
  {
    slug: 'toast',
    name: 'Toast',
    selector: 'ui-toast',
    summary: 'Application notification viewport powered by UiToastService.',
    importName: 'UiToastComponent, UiToastService',
    usage: `import { inject } from '@angular/core';
import { UiToastService } from '@ngnova/ui';

<ui-toast />

private readonly toast = inject(UiToastService);

save(): void {
  this.toast.success('Saved', 'Your settings are ready.');
}`,
    inputs: [
      {
        name: 'position',
        type: "'top-right' | 'bottom-right'",
        defaultValue: "'top-right'",
        description: 'Viewport placement.',
      },
    ],
    outputs: [],
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

export const componentDocDetailsBySlug = new Map<string, ComponentDocDetails>([
  [
    'button',
    {
      overview: [
        'Button is the primary action primitive for commands, form submission, and workflow steps.',
        'It wraps a native button so keyboard activation, disabled behavior, form submission, and focus semantics stay predictable.',
      ],
      whenToUse: [
        'Use primary for the main page action, secondary for safe alternatives, outline for low-emphasis actions, ghost for toolbar actions, and danger for destructive work.',
        'Use loading when an action has started and should not be triggered twice.',
      ],
      examples: [
        {
          title: 'Release footer',
          description: 'A page footer with safe, secondary, and primary actions.',
          code: `<div class="flex flex-wrap justify-end gap-2">
  <ui-button variant="outline" (pressed)="cancel()">Cancel</ui-button>
  <ui-button variant="secondary" (pressed)="saveDraft()">Save draft</ui-button>
  <ui-button [loading]="publishing" loadingLabel="Publishing release" (pressed)="publish()">
    Publish
  </ui-button>
</div>`,
        },
        {
          title: 'Destructive confirmation action',
          description: 'Use danger only for irreversible or high-risk actions.',
          code: `<ui-button
  variant="danger"
  [loading]="deleting"
  loadingLabel="Deleting package"
  (pressed)="deletePackage()"
>
  Delete package
</ui-button>`,
        },
      ],
      accessibility: [
        'Uses a native button element.',
        'The loading state sets aria-busy and disables activation.',
        'Icon-only buttons must provide ariaLabel.',
      ],
      keyboard: [
        'Enter and Space activate the native button.',
        'Tab moves focus to enabled buttons.',
      ],
      forms: [
        'Set type="submit" for form submission; the default type is button to avoid accidental submits.',
      ],
      edgeCases: [
        'Disabled and loading buttons do not emit pressed.',
        'Use fullWidth in narrow mobile layouts.',
      ],
      testing: [
        'Assert pressed emits only when enabled.',
        'Assert aria-busy appears only during loading.',
      ],
    },
  ],
  [
    'card',
    {
      overview: [
        'Card groups related content into a bordered or elevated surface with optional header and footer slots.',
        'It is intentionally simple so consumers can compose their own headings, actions, forms, and media.',
      ],
      whenToUse: [
        'Use cards for repeated dashboard panels, settings sections, pricing options, or preview blocks.',
      ],
      examples: [
        {
          title: 'Settings card',
          description: 'Header and footer slots frame the main content.',
          code: `<ui-card variant="elevated" padding="lg">
  <div uiCardHeader>
    <h3>Billing</h3>
    <p>Manage plan and invoices.</p>
  </div>
  <p>Your Pro plan renews next month.</p>
  <div uiCardFooter>
    <ui-button variant="outline">View invoices</ui-button>
  </div>
</ui-card>`,
        },
      ],
      accessibility: [
        'Uses a section element; provide a heading inside the projected header for named regions.',
      ],
      keyboard: [
        'Card itself has no keyboard interaction. Interactive projected content keeps its own behavior.',
      ],
      forms: ['Cards can wrap forms, but they do not manage form state.'],
      edgeCases: [
        'Empty header and footer slots collapse automatically.',
        'Use padding="none" for custom media layouts.',
      ],
      testing: [
        'Assert projected header, body, and footer content render.',
        'Assert variant and padding classes.',
      ],
    },
  ],
  [
    'input',
    {
      overview: [
        'Input is a production-grade text field for settings forms, search bars, command entry, authentication secrets, package identifiers, and AI prompt summaries.',
        'It combines label strategy, helper text, validation, prefix/suffix projection, semantic intent, password reveal, Enter submission, and character or word counting in one standalone Angular component.',
        'The documentation follows the depth users expect from mature libraries: variants, status, clear, password, search, counters, prefix/suffix, forms, accessibility, keyboard behavior, API, and testing are separated into practical sections.',
      ],
      whenToUse: [
        'Use for short single-line values where native input semantics are correct and assistive text matters.',
        'Use with Angular reactive forms when validation, disabled state, touched state, or accessibility wiring matters.',
        'Use labelMode="floating" for compact enterprise forms and labelMode="hidden" for search or command fields that still need an accessible label.',
        'Use counterMode="words" for prompt, summary, SEO, or editorial fields where word limits matter more than native maxlength.',
        'Use projected prefix and suffix content for stable adornments such as protocol text, file extensions, shortcuts, and units.',
      ],
      examples: [
        {
          title: 'Floating validated field',
          description:
            'Use semantic intent for positive or warning guidance before validation fails.',
          code: `<ui-input
  label="Email"
  type="email"
  autocomplete="email"
  labelMode="floating"
  intent="success"
  helperText="Use your organization email."
  clearable
  [maxLength]="80"
  [formControl]="email"
/>`,
        },
        {
          title: 'Field intelligence',
          description:
            'Password reveal, word counters, clear behavior, and Enter submission are built in.',
          code: `<ui-input
  label="Deploy token"
  type="password"
  labelMode="floating"
  helperText="Reveal is opt-in and emits passwordVisibilityChange."
  revealable
  [formControl]="token"
/>

<ui-input
  label="Prompt summary"
  helperText="Word counts are useful for AI prompts and editorial fields."
  counterMode="words"
  [counterMax]="8"
  clearable
  [formControl]="summary"
  (submitted)="runSearch($event)"
/>`,
        },
        {
          title: 'Projected anatomy',
          description: 'Use prefix and suffix slots without losing helper text or clear behavior.',
          code: `<ui-input
  label="Repository URL"
  type="url"
  helperText="Prefix and suffix are projected; clear remains keyboard reachable."
  clearable
  [formControl]="repositoryUrl"
>
  <span uiInputPrefix>https://</span>
  <span uiInputSuffix>.git</span>
</ui-input>`,
        },
        {
          title: 'Search recipe',
          description:
            'Hidden label keeps the search field accessible while preserving compact UI.',
          code: `<ui-input
  label="Search components"
  labelMode="hidden"
  type="search"
  placeholder="Search components"
  clearable
  [formControl]="componentSearch"
  (submitted)="searchComponents($event)"
>
  <span uiInputSuffix>Ctrl K</span>
</ui-input>`,
        },
        {
          title: 'Validation state',
          description:
            'Error text is announced, reflected with aria-invalid, and overrides intent.',
          code: `<ui-input
  label="Package scope"
  placeholder="@ngnova"
  errorText="Package scope must match your npm organization."
  required
/>`,
        },
      ],
      accessibility: [
        'Visible labels are connected with the native input using for/id.',
        'labelMode="hidden" renders a screen-reader-only label instead of relying on placeholder text.',
        'Helper, error, and counter text are wired through aria-describedby.',
        'Invalid state sets aria-invalid and error text uses role="alert".',
        'Clear and password reveal actions are native buttons with configurable accessible labels.',
        'Projected prefix and suffix content should be decorative or supplemental; the label remains the accessible name.',
      ],
      keyboard: [
        'Tab moves focus to the native input.',
        'Typing updates the value and emits valueChange.',
        'The clear button is reachable by Tab when visible.',
        'Enter emits submitted with the current string value.',
        'Password reveal is keyboard reachable and exposes aria-pressed.',
        'Projected suffix shortcuts must not replace the submitted output or native keyboard behavior.',
      ],
      forms: [
        'Implements ControlValueAccessor.',
        'writeValue updates the view without emitting valueChange.',
        'setDisabledState syncs the disabled state.',
        'submitted is useful for search fields or command fields, while form submit remains owned by the parent form.',
      ],
      edgeCases: [
        'Provide ariaLabel or a visible/hidden label for icon-only or search-only inputs.',
        'Use hideCounter when a maxLength or counterMax exists but the counter would duplicate nearby copy.',
        'Use counterMax for soft limits such as word counts; use maxLength only when the browser should enforce a hard character limit.',
        'Do not use type="number" for values that need leading zeros; use inputMode instead.',
        'Avoid placing interactive controls in projected suffix content until the component exposes a formal action-slot pattern.',
      ],
      testing: [
        'Assert CVA writeValue, valueChange, touched state, disabled state, validation message, clear button, prefix/suffix projection, and counter behavior.',
        'For premium behavior, test floating labels, intent classes, passwordVisibilityChange, word counters, and submitted output.',
        'Docs route tests should verify every Input page anchor resolves and every recipe has a code block.',
      ],
    },
  ],
  [
    'badge',
    {
      overview: ['Badge is a compact status or metadata label for counts, states, and categories.'],
      whenToUse: [
        'Use for short non-interactive labels such as Active, Beta, New, Warning, or count metadata.',
      ],
      examples: [
        {
          title: 'Status badges',
          description: 'Pair semantic variants with domain status text.',
          code: `<ui-badge variant="success" ariaRole="status">Active</ui-badge>
<ui-badge variant="warning">Pending review</ui-badge>`,
        },
      ],
      accessibility: [
        'Use ariaRole="status" only when the badge announces dynamic status changes.',
      ],
      keyboard: ['Badge is non-interactive and should not receive focus.'],
      forms: ['Badge does not integrate with forms.'],
      edgeCases: ['Keep badge text short; prefer Tag or Alert for longer copy.'],
      testing: ['Assert semantic variant classes and optional aria-label/role.'],
    },
  ],
  [
    'tag',
    {
      overview: [
        'Tag represents removable filters, labels, categories, and metadata with optional icon text.',
      ],
      whenToUse: ['Use Tag when the label may be removed or acts like a selected filter chip.'],
      examples: [
        {
          title: 'Filter tag',
          description: 'Emit removed and let the parent update filter state.',
          code: `<ui-tag variant="info" removable removeLabel="Remove Angular filter" (removed)="remove('angular')">
  Angular
</ui-tag>`,
        },
      ],
      accessibility: [
        'The remove control is a native button with a configurable accessible label.',
      ],
      keyboard: [
        'Tab reaches removable tag buttons.',
        'Enter or Space activates the remove button.',
      ],
      forms: ['Tag does not manage forms; parent state owns selected filters.'],
      edgeCases: [
        'Long tag content truncates inside the tag.',
        'Do not use icon-only tags without ariaLabel.',
      ],
      testing: ['Assert removed emits from the remove button.', 'Assert removeLabel is applied.'],
    },
  ],
  [
    'avatar',
    {
      overview: [
        'Avatar displays a person, team, project, or organization using an image or initials fallback.',
      ],
      whenToUse: [
        'Use beside user names, authors, table rows, comments, team lists, and account menus.',
      ],
      examples: [
        {
          title: 'Initials fallback',
          description: 'Initials are derived from the label.',
          code: `<ui-avatar label="Grace Hopper" />
<ui-avatar label="NgNova UI" shape="square" size="lg" />`,
        },
      ],
      accessibility: ['The avatar uses role="img" and derives aria-label from ariaLabel or label.'],
      keyboard: [
        'Avatar is visual and non-interactive; wrap it in a button or link only when it opens an action.',
      ],
      forms: ['Avatar does not integrate with forms.'],
      edgeCases: [
        'Provide alt text when src is set.',
        'Use label for fallback initials even when an image is present.',
      ],
      testing: ['Assert initials fallback and image alt text.'],
    },
  ],
  [
    'skeleton',
    {
      overview: [
        'Skeleton provides decorative loading placeholders that preserve layout while content loads.',
      ],
      whenToUse: [
        'Use when real content shape is known and loading may take long enough to cause visual shift.',
      ],
      examples: [
        {
          title: 'Card placeholder',
          description: 'Combine circle and text placeholders for realistic loading states.',
          code: `<div class="space-y-3">
  <ui-skeleton shape="circle" width="2.5rem" height="2.5rem" />
  <ui-skeleton shape="text" width="70%" height="0.875rem" />
  <ui-skeleton height="8rem" />
</div>`,
        },
      ],
      accessibility: [
        'Skeleton is aria-hidden because another live region or loading label should announce loading.',
      ],
      keyboard: ['Skeleton has no keyboard interaction.'],
      forms: ['Skeleton does not integrate with forms.'],
      edgeCases: [
        'Avoid replacing every tiny detail with a skeleton; preserve major layout blocks only.',
      ],
      testing: ['Assert aria-hidden and width/height style bindings.'],
    },
  ],
  [
    'progress-bar',
    {
      overview: [
        'Progress Bar communicates task completion for uploads, builds, imports, and background jobs.',
      ],
      whenToUse: [
        'Use determinate progress when a value is known; use indeterminate when work has started but the percent is unknown.',
      ],
      examples: [
        {
          title: 'Build progress',
          description: 'Determinate progress exposes aria-valuenow and aria-valuemax.',
          code: `<ui-progress-bar [value]="buildPercent" [max]="100" label="Build progress" />`,
        },
      ],
      accessibility: ['Uses role="progressbar".', 'Indeterminate mode omits value semantics.'],
      keyboard: ['Progress bars are read-only status indicators and do not receive focus.'],
      forms: ['Progress Bar does not integrate with forms.'],
      edgeCases: ['Values are clamped between 0 and max.', 'Always provide a meaningful label.'],
      testing: ['Assert determinate ARIA values and indeterminate omission.'],
    },
  ],
  [
    'modal',
    {
      overview: [
        'Modal presents blocking decisions or focused workflows above the page with backdrop, Escape close, and focus restoration.',
      ],
      whenToUse: [
        'Use for confirmations, focused forms, destructive decisions, or short workflows that must interrupt the current page.',
      ],
      examples: [
        {
          title: 'Publish confirmation',
          description: 'Use two-way open binding, a description ID, and explicit dismissal policy.',
          code: `<ui-modal
  [(open)]="publishOpen"
  size="lg"
  descriptionId="publish-description"
  [closeOnBackdrop]="false"
>
  <span uiModalHeader>Publish package</span>
  <p id="publish-description">This publishes the package to npm.</p>
  <div uiModalFooter>
    <ui-button variant="outline" (pressed)="publishOpen = false">Cancel</ui-button>
    <ui-button (pressed)="publish()">Publish</ui-button>
  </div>
</ui-modal>`,
        },
        {
          title: 'Headerless destructive dialog',
          description: 'Use ariaLabel when no visible header labels the dialog.',
          code: `<ui-modal
  [(open)]="deleteOpen"
  ariaLabel="Delete package confirmation"
  size="sm"
  [closeOnEscape]="false"
>
  <p>This action cannot be undone.</p>
  <div uiModalFooter>
    <ui-button variant="outline" (pressed)="deleteOpen = false">Keep package</ui-button>
    <ui-button variant="danger" (pressed)="deletePackage()">Delete</ui-button>
  </div>
</ui-modal>`,
        },
      ],
      accessibility: [
        'Uses role="dialog" and aria-modal="true".',
        'Supports aria-labelledby or ariaLabel and optional aria-describedby.',
      ],
      keyboard: [
        'Escape closes when closeOnEscape is true.',
        'Tab is trapped inside the dialog while open.',
      ],
      forms: ['Modal can contain forms; parent state owns submit and close behavior.'],
      edgeCases: [
        'Use ariaLabel for headerless dialogs.',
        'Disable backdrop close for destructive confirmations.',
      ],
      testing: ['Assert Escape, backdrop, focus trap, and focus restore behavior.'],
    },
  ],
  [
    'checkbox',
    {
      overview: [
        'Checkbox captures independent boolean choices, supports disabled workflow states, and can show an indeterminate parent-selection state.',
        'The component preserves native checkbox semantics while adding NgNova label, helper text, dark mode, and ControlValueAccessor behavior.',
      ],
      whenToUse: [
        'Use for opt-in settings, agreement flags, independent preferences, and multi-select row controls.',
        'Use indeterminate only for parent controls that represent mixed child selection.',
      ],
      examples: [
        {
          title: 'Release checklist',
          description: 'Combine checked, mixed, and disabled states in one review workflow.',
          code: `<ui-checkbox
  label="Email subscribers"
  helperText="Reactive form boolean value."
  [formControl]="newsletter"
/>

<ui-checkbox
  label="Select all packages"
  helperText="Mixed while only some packages are selected."
  indeterminate
/>

<ui-checkbox
  label="Security approval"
  helperText="Unavailable until audit finishes."
  disabled
/>`,
        },
      ],
      accessibility: [
        'Uses a native checkbox input.',
        'Helper text is associated with the control.',
        'When indeterminate is true, the native input exposes the mixed visual state and clears it after user interaction.',
      ],
      keyboard: ['Space toggles the checkbox.', 'Tab moves focus to the checkbox.'],
      forms: [
        'Implements ControlValueAccessor for boolean values.',
        'writeValue updates checked state without emitting valueChange.',
      ],
      edgeCases: [
        'Indeterminate is visual and should be controlled by parent selection state.',
        'Use one checkbox per independent decision; use Radio Group when the choices are mutually exclusive.',
      ],
      testing: ['Assert CVA value, disabled state, indeterminateChange, focus, and blur outputs.'],
    },
  ],
  [
    'select',
    {
      overview: [
        'Select is a native dropdown field for choosing one value from a known list.',
        'It adds consistent NgNova form styling, labels, helper/error text, size variants, disabled options, and reactive forms support.',
      ],
      whenToUse: [
        'Use for compact single-choice fields where native browser behavior is acceptable.',
        'Use when the option list is known up front and does not need search, icons, or async loading.',
      ],
      examples: [
        {
          title: 'Plan select',
          description: 'Use placeholder for an empty starting state and let the form own value.',
          code: `<ui-select
  label="Plan"
  placeholder="Choose a plan"
  helperText="Selection is owned by the reactive form."
  [options]="planOptions"
  [formControl]="plan"
/>`,
        },
        {
          title: 'Required select',
          description: 'Pair required with a placeholder and clear error text.',
          code: `<ui-select
  label="Release channel"
  placeholder="Select channel"
  errorText="Choose a stable channel before publishing."
  [options]="channelOptions"
  required
/>`,
        },
      ],
      accessibility: [
        'Visible label, helper text, and error text are associated with the native select.',
        'Required and disabled states are applied to the native select element.',
      ],
      keyboard: ['Uses native select keyboard behavior for the current browser and platform.'],
      forms: [
        'Implements ControlValueAccessor for string values.',
        'Disabled state stays synced with Angular forms and the disabled input.',
      ],
      edgeCases: [
        'Use disabled options for unavailable choices.',
        'Use required with placeholder to force a real selection.',
        'Use a future combobox/autocomplete pattern instead of Select for large or searchable lists.',
      ],
      testing: ['Assert option rendering, valueChange, CVA writeValue, and disabled state.'],
    },
  ],
  [
    'alert',
    {
      overview: [
        'Alert communicates persistent feedback such as success, warning, info, or danger messages.',
      ],
      whenToUse: [
        'Use for page-level or section-level messages that should remain visible until resolved or dismissed.',
      ],
      examples: [
        {
          title: 'Dismissible success',
          description: 'Dismiss emits openChange and dismissed.',
          code: `<ui-alert variant="success" title="Saved" dismissible (dismissed)="trackDismiss()">
  Your settings were updated.
</ui-alert>`,
        },
      ],
      accessibility: [
        'Defaults to status or alert semantics based on variant unless ariaRole overrides it.',
      ],
      keyboard: ['Dismiss button is keyboard reachable when dismissible.'],
      forms: ['Use alerts near forms to summarize submission or validation status.'],
      edgeCases: ['Use concise title text; long remediation copy belongs in the body.'],
      testing: ['Assert roles, variants, openChange, and dismissed output.'],
    },
  ],
  [
    'radio',
    {
      overview: [
        'Radio Group captures exactly one choice from a small set of related options.',
        'Options can include helper text and disabled values, and the group supports vertical or horizontal layouts.',
      ],
      whenToUse: [
        'Use when all choices should be visible and the user must compare them.',
        'Use for small mutually exclusive decisions such as contact method, billing interval, density, or environment.',
      ],
      examples: [
        {
          title: 'Preference group',
          description: 'Use helper text for context and keep parent form state in control.',
          code: `<ui-radio-group
  label="Contact preference"
  helperText="Use helper text to clarify tradeoffs."
  [options]="contactOptions"
  [formControl]="contactPreference"
/>

<ui-radio-group
  label="Layout density"
  orientation="horizontal"
  [options]="layoutOptions"
  [formControl]="layoutDensity"
/>`,
        },
      ],
      accessibility: [
        'Uses native radio inputs grouped by name and labelled by visible text.',
        'Helper and error text are associated with the group.',
      ],
      keyboard: [
        'Arrow keys move between radios in native browser behavior.',
        'Space selects the focused option.',
      ],
      forms: [
        'Implements ControlValueAccessor for string values.',
        'Disabled state can apply to the full group or individual options.',
      ],
      edgeCases: [
        'Avoid radio groups with too many options; use Select for long lists.',
        'Use horizontal orientation only when labels are short and wrapping will not harm scanning.',
      ],
      testing: ['Assert selection, disabled options, CVA, and orientation classes.'],
    },
  ],
  [
    'switch',
    {
      overview: [
        'Switch captures an immediate on/off preference using native checkbox behavior and switch semantics.',
        'It is intentionally optimized for settings, not one-time actions.',
      ],
      whenToUse: [
        'Use for settings that can be toggled independently, such as notifications or feature flags.',
        'Use when changing the value can take effect immediately without a confirmation step.',
      ],
      examples: [
        {
          title: 'Notification setting',
          description: 'Boolean state stays in the parent form control.',
          code: `<ui-switch
  label="Release notifications"
  helperText="Boolean state stays in the parent form control."
  [formControl]="notifications"
/>`,
        },
      ],
      accessibility: ['Uses role="switch" on a native checkbox pattern and exposes checked state.'],
      keyboard: ['Space toggles the switch.', 'Tab moves focus to the switch.'],
      forms: [
        'Implements ControlValueAccessor for boolean values.',
        'setDisabledState disables the underlying control when Angular forms disable it.',
      ],
      edgeCases: [
        'Do not use Switch for actions that require confirmation; use Button or Modal instead.',
        'Avoid using Switch for destructive actions or server actions that may fail without feedback.',
      ],
      testing: ['Assert checked state, valueChange, CVA disabled state, focus, and blur outputs.'],
    },
  ],
  [
    'textarea',
    {
      overview: [
        'Textarea captures longer free-form content with label, helper text, errors, counter, and resize controls.',
        'It supports outline and filled appearances, Angular validation messages, row sizing, max length counters, and predictable resize policy.',
      ],
      whenToUse: [
        'Use for comments, notes, descriptions, issue summaries, release notes, and review feedback.',
        'Use when users need more than one line and may revise text before submitting.',
      ],
      examples: [
        {
          title: 'Release notes',
          description: 'Pair maxLength with the built-in counter.',
          code: `<ui-textarea
  label="Release notes"
  placeholder="Describe what changed..."
  helperText="Keep release notes concise and user-facing."
  [maxLength]="280"
  [rows]="5"
  [formControl]="releaseNotes"
/>`,
        },
        {
          title: 'Validation state',
          description: 'Use fixed resize and clear error text for required review notes.',
          code: `<ui-textarea
  label="Review notes"
  errorText="Notes are required before publishing."
  resize="none"
  required
  [rows]="4"
/>`,
        },
      ],
      accessibility: ['Labels and helper/error/counter text are wired to the native textarea.'],
      keyboard: ['Uses native textarea behavior including multiline typing.'],
      forms: [
        'Implements ControlValueAccessor for string values.',
        'writeValue updates text without emitting valueChange, and blur marks the control touched.',
      ],
      edgeCases: [
        'Use resize="none" only when layout requires fixed height.',
        'Provide ariaLabel if no visible label exists.',
        'Hide the counter only when another character-limit affordance is already visible.',
      ],
      testing: ['Assert CVA behavior, counter text, validation messages, and aria-describedby.'],
    },
  ],
  [
    'tabs',
    {
      overview: ['Tabs switch between related panels without leaving the current page context.'],
      whenToUse: ['Use when sections are peers and users frequently move between them.'],
      examples: [
        {
          title: 'Controlled tabs',
          description: 'Parent state owns the active value.',
          code: `<ui-tabs [tabs]="tabs" [active]="activeTab" (activeChange)="activeTab = $event">
  @if (activeTab === 'overview') { Overview }
</ui-tabs>`,
        },
      ],
      accessibility: ['Uses tablist, tab, and tabpanel roles with generated ARIA relationships.'],
      keyboard: [
        'ArrowLeft and ArrowRight move between enabled tabs.',
        'Home and End jump to first and last tabs.',
      ],
      forms: ['Tabs do not integrate with forms directly.'],
      edgeCases: ['Do not hide critical errors inside inactive tabs without summary messaging.'],
      testing: ['Assert keyboard navigation, disabled tabs, activeChange, and ARIA IDs.'],
    },
  ],
  [
    'accordion',
    {
      overview: [
        'Accordion organizes dense content into collapsible sections with controlled active state.',
      ],
      whenToUse: [
        'Use for FAQs, setup steps, or advanced settings where users usually need one section at a time.',
      ],
      examples: [
        {
          title: 'Multiple sections',
          description: 'Enable multiple when sections can stay open together.',
          code: `<ui-accordion
  multiple
  [items]="items"
  [active]="activeSections"
  (activeChange)="activeSections = $event"
/>`,
        },
      ],
      accessibility: [
        'Each trigger exposes aria-expanded and aria-controls.',
        'Each panel is labelled by its trigger.',
      ],
      keyboard: ['Triggers are native buttons, so Enter and Space toggle the section.'],
      forms: [
        'Accordion does not integrate with forms, but can contain form controls in panel content.',
      ],
      edgeCases: [
        'Disabled items remain visible but cannot be expanded.',
        'Parent state must update active after activeChange.',
      ],
      testing: ['Assert activeChange, single vs multiple mode, disabled items, and ARIA wiring.'],
    },
  ],
  [
    'table',
    {
      overview: [
        'Table displays record data with column metadata, loading and empty states, sortable headers, and optional row selection.',
      ],
      whenToUse: ['Use for structured datasets where users compare rows and columns.'],
      examples: [
        {
          title: 'Selectable component catalog',
          description: 'Selection and sorting emit events; parent code owns data changes.',
          code: `<ui-table
  [columns]="columns"
  [rows]="components"
  selectable
  (rowSelected)="openComponent($event)"
  (sortChange)="sortComponents($event)"
/>`,
        },
        {
          title: 'Loading and empty states',
          description: 'Keep state messages specific to the current dataset.',
          code: `<ui-table
  [columns]="columns"
  [rows]="[]"
  emptyText="No components match your filters."
/>

<ui-table
  [columns]="columns"
  [rows]="[]"
  loading
  loadingText="Loading components..."
/>`,
        },
      ],
      accessibility: [
        'Uses semantic table, thead, tbody, th, and td elements.',
        'Sortable headers use native buttons.',
      ],
      keyboard: ['Sortable header buttons are reachable by Tab and activated with Enter or Space.'],
      forms: [
        'Table does not integrate with forms directly. Put form controls inside richer table cells in a future template API.',
      ],
      edgeCases: [
        'Loading and empty states span all columns.',
        'Current rows are not internally sorted; sortChange lets the parent own data order.',
      ],
      testing: ['Assert rows, empty/loading states, rowSelected, and sortChange emissions.'],
    },
  ],
  [
    'toast',
    {
      overview: [
        'Toast shows transient application feedback through UiToastService and a viewport component.',
      ],
      whenToUse: ['Use after background actions such as save, publish, upload, invite, or delete.'],
      examples: [
        {
          title: 'Service usage',
          description: 'Render one viewport near the app root and push messages from features.',
          code: `<ui-toast />

private readonly toast = inject(UiToastService);

save(): void {
  this.toast.success('Saved', 'Your changes are ready.');
}`,
        },
      ],
      accessibility: [
        'Viewport uses aria-live="polite" so new notifications are announced without interrupting users.',
      ],
      keyboard: ['Dismiss buttons are keyboard reachable.'],
      forms: [
        'Use Toast for non-blocking form success feedback; keep validation errors near fields.',
      ],
      edgeCases: ['Clear messages on route changes if stale notifications would confuse users.'],
      testing: ['Assert service show/dismiss/clear and rendered message content.'],
    },
  ],
  [
    'spinner',
    {
      overview: [
        'Spinner communicates indeterminate loading for compact spaces and inline actions.',
      ],
      whenToUse: ['Use when work is ongoing but progress percentage is unknown.'],
      examples: [
        {
          title: 'Accessible loading',
          description: 'Provide a label unless another element already announces loading.',
          code: `<ui-spinner label="Loading invoices" />
<ui-spinner decorative />`,
        },
      ],
      accessibility: [
        'Non-decorative spinners expose a status label.',
        'Decorative spinners are hidden from assistive technology.',
      ],
      keyboard: ['Spinner has no keyboard interaction.'],
      forms: ['Use inside buttons or near forms while submit work is pending.'],
      edgeCases: ['Prefer Progress Bar when actual progress is known.'],
      testing: ['Assert role/status behavior and decorative mode.'],
    },
  ],
]);
