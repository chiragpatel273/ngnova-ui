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
    importName:
      'UiButtonComponent, UiButtonDirective, UiButtonGroupComponent, UiButtonIconDirective, UiButtonIconStartDirective, UiButtonIconEndDirective',
    usage: `<section aria-label="Button variants">
  <div class="flex flex-wrap items-center gap-3">
    <ui-button>Primary Action</ui-button>
    <ui-button variant="secondary">Secondary</ui-button>
    <ui-button variant="outline">Outline</ui-button>
    <ui-button variant="ghost">Ghost</ui-button>
    <ui-button variant="danger">Delete</ui-button>
  </div>
</section>

<section aria-label="Button intent and appearance">
  <ui-button intent="success">Approve</ui-button>
  <ui-button intent="warning" appearance="tonal">Needs review</ui-button>
  <ui-button intent="danger" appearance="outline">Delete</ui-button>
  <ui-button intent="neutral" appearance="text">View details</ui-button>
</section>

<section aria-label="Button sizes">
  <ui-button size="sm">Button</ui-button>
  <ui-button size="md">Button</ui-button>
  <ui-button size="lg">Button</ui-button>
</section>

<section aria-label="Button states">
  <ui-button loading loadingLabel="Saving changes">Saving</ui-button>
  <ui-button disabled>Disabled</ui-button>
</section>

<section aria-label="Button links">
  <a uiButton routerLink="/components/input" variant="outline">Open Input docs</a>
  <a uiButton href="/reports" disabled>Reports unavailable</a>
</section>

<section aria-label="Button icons">
  <ui-button ariaLabel="Create item" iconOnly size="md">
    <ng-icon uiButtonIcon name="heroPlus" />
  </ui-button>
  <ui-button>
    <ng-icon uiButtonIconStart name="heroPlus" />
    Create
    <ng-icon uiButtonIconEnd name="heroArrowRight" />
  </ui-button>
</section>

<section aria-label="Button group">
  <ui-button-group ariaLabel="View density">
    <ui-button variant="outline">Compact</ui-button>
    <ui-button variant="outline">Comfortable</ui-button>
    <ui-button variant="outline">Spacious</ui-button>
  </ui-button-group>
</section>

<section aria-label="Button form submission">
  <form (submit)="saveProfile($event)">
    <ui-button type="submit">Save profile</ui-button>
  </form>
</section>

<section aria-label="Button event handling">
  <ui-button fullWidth (pressed)="recordButtonPress()">Track press</ui-button>
  <p aria-live="polite">Button presses handled: {{ buttonPressCount() }}</p>
</section>`,
    inputs: [
      {
        name: 'variant',
        type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'",
        defaultValue: "'primary'",
        description:
          'Legacy visual emphasis style. Prefer intent and appearance for new combinations; either modern input takes precedence when supplied.',
      },
      {
        name: 'intent',
        type: "'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral' | null",
        defaultValue: 'null',
        description: 'Semantic color intent used with appearance.',
      },
      {
        name: 'appearance',
        type: "'solid' | 'outline' | 'ghost' | 'text' | 'tonal' | null",
        defaultValue: 'null',
        description: 'Visual treatment used with intent.',
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
        name: 'iconOnly',
        type: 'boolean',
        defaultValue: 'false',
        description:
          'Applies square sizing for icon-only buttons and suppresses full-width expansion.',
      },
      {
        name: '[uiButton] iconOnly',
        type: 'boolean',
        defaultValue: 'false',
        description:
          'Applies square icon-button sizing to a native button, anchor, or router link.',
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
      {
        name: 'uiButton',
        type: 'directive',
        defaultValue: 'n/a',
        description:
          'Applies button styling and disabled-anchor handling to native buttons, anchors, and router links.',
      },
      {
        name: '[uiButton] variant',
        type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'",
        defaultValue: "'primary'",
        description: 'Visual style for native buttons, anchors, and router links.',
      },
      {
        name: '[uiButton] size',
        type: "'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        description: 'Height, padding, and text scale for the directive host.',
      },
      {
        name: '[uiButton] disabled',
        type: 'boolean',
        defaultValue: 'false',
        description:
          'Disables native buttons and prevents disabled anchors or router links from activating.',
      },
      {
        name: '[uiButton] fullWidth',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Expands the directive host to the full width of its container.',
      },
      {
        name: 'uiButtonIcon',
        type: 'directive',
        defaultValue: 'n/a',
        description: 'Marks and normalizes the decorative glyph inside an icon-only button.',
      },
      {
        name: 'uiButtonIconStart',
        type: 'directive',
        defaultValue: 'n/a',
        description: 'Marks a decorative leading icon and removes it from the accessibility tree.',
      },
      {
        name: 'uiButtonIconEnd',
        type: 'directive',
        defaultValue: 'n/a',
        description: 'Marks a decorative trailing icon and removes it from the accessibility tree.',
      },
      {
        name: 'ui-button-group ariaLabel',
        type: 'string',
        defaultValue: "''",
        description: 'Accessible label for a grouped set of related buttons.',
      },
      {
        name: 'ui-button-group fullWidth',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Stretches grouped buttons across the available width.',
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
        description:
          'Emits when the native button receives focus. The host also forwards a native focus event.',
      },
      {
        name: 'blurred',
        type: 'OutputEmitterRef<FocusEvent>',
        description:
          'Emits when the native button loses focus. The host also forwards a native blur event.',
      },
    ],
  },
  {
    slug: 'card',
    name: 'Card',
    selector: 'ui-card',
    summary: 'Content container with projected header, body, and footer regions.',
    importName: 'UiCardComponent',
    usage: `<ui-card>
  <div uiCardHeader>
    <h3>Analytics card</h3>
  </div>
  <p>Projected regions keep content structure predictable.</p>
  <div uiCardFooter>
    <ui-button size="sm" variant="outline">Open report</ui-button>
  </div>
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
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "''",
        description: 'Optional accessible name that promotes the neutral card surface to a region.',
      },
    ],
    outputs: [],
  },
  {
    slug: 'form-field',
    name: 'Form Field',
    selector: 'ui-form-field',
    summary:
      'Composable label, message, adornment, and accessibility foundation for projected native or custom controls.',
    importName:
      'UiFormFieldComponent, UiFormFieldControlDirective, UiFormFieldPrefixDirective, UiFormFieldSuffixDirective',
    usage: `<ui-form-field
  label="Workspace"
  helperText="Choose a short, recognizable name."
  required
>
  <span uiFormFieldPrefix aria-hidden="true">@</span>
  <input uiFormFieldControl type="text" autocomplete="organization" />
  <span uiFormFieldSuffix>.team</span>
</ui-form-field>`,
    inputs: [
      {
        name: 'id',
        type: 'string',
        defaultValue: 'generated',
        description: 'Stable base ID used for the control, helper, and error relationships.',
      },
      {
        name: 'label',
        type: 'string',
        defaultValue: "''",
        description: 'Visible or visually hidden accessible control label.',
      },
      {
        name: 'helperText',
        type: 'string',
        defaultValue: "''",
        description: 'Supporting guidance described by the projected control.',
      },
      {
        name: 'errorText',
        type: 'string',
        defaultValue: "''",
        description: 'Polite validation message shown and described when invalid.',
      },
      {
        name: 'appearance',
        type: "'outline' | 'filled'",
        defaultValue: "'outline'",
        description: 'Control frame surface treatment.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        description: 'Control frame height, spacing, and type scale.',
      },
      {
        name: 'invalid',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Applies invalid visuals and aria-invalid to the projected control.',
      },
      {
        name: 'required',
        type: 'boolean',
        defaultValue: 'false',
        description:
          'Shows the required indicator and applies aria-required to the projected control.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description:
          'Applies disabled presentation and aria-disabled; consumers retain native/FormControl ownership.',
      },
      {
        name: 'hideLabel',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Visually hides the label while retaining its native association.',
      },
      {
        name: 'uiFormFieldControl',
        type: 'directive',
        defaultValue: 'required',
        description:
          'Registers the projected native or custom control for label, message, and state relationships.',
      },
      {
        name: 'uiFormFieldPrefix',
        type: 'directive',
        defaultValue: 'optional',
        description: 'Marks leading content outside the editable control value.',
      },
      {
        name: 'uiFormFieldSuffix',
        type: 'directive',
        defaultValue: 'optional',
        description: 'Marks trailing content outside the editable control value.',
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
  label="Work email"
  type="email"
  autocomplete="email"
  labelMode="floating"
  helperText="Floating label, helper text, and Angular forms support."
  clearable
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
        description:
          'Emits when the input receives focus. The host also forwards a native focus event.',
      },
      {
        name: 'blurred',
        type: 'OutputEmitterRef<FocusEvent>',
        description:
          'Emits when the input loses focus. The host also forwards a native blur event.',
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
    usage: `<ui-badge>Default</ui-badge>
<ui-badge variant="success">Stable</ui-badge>
<ui-badge variant="warning">Review</ui-badge>
<ui-badge variant="danger">Blocked</ui-badge>`,
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
    usage: `<ui-tag>Angular</ui-tag>
<ui-tag variant="success">Published</ui-tag>
<ui-tag variant="warning" removable>Needs review</ui-tag>`,
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
        description:
          'Legacy leading icon text; prefer a projected uiTagIcon SVG for crisp rendering.',
      },
      {
        name: 'uiTagIcon',
        type: 'directive',
        defaultValue: 'n/a',
        description: 'Marks and normalizes a projected decorative leading icon.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "''",
        description: 'Accessible label for icon-heavy or visually compact tags.',
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
<ui-avatar label="NgNova UI" shape="square" size="lg" />`,
    inputs: [
      { name: 'src', type: 'string', defaultValue: "''", description: 'Optional image source.' },
      {
        name: 'alt',
        type: 'string',
        defaultValue: "''",
        description: 'Image alternative text and accessible-label fallback.',
      },
      {
        name: 'label',
        type: 'string',
        defaultValue: "''",
        description: 'Accessible label and initials source.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "''",
        description: 'Accessible label override for avatar images or generated initials.',
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
    usage: `<ui-skeleton shape="circle" width="2.75rem" height="2.75rem" />
<ui-skeleton shape="text" width="70%" height="0.875rem" />
<ui-skeleton shape="text" width="45%" height="0.875rem" />
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
      {
        name: 'animated',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Enables the pulse animation, with automatic reduced-motion suppression.',
      },
    ],
    outputs: [],
  },
  {
    slug: 'progress-bar',
    name: 'Progress Bar',
    selector: 'ui-progress-bar',
    summary: 'Accessible determinate or indeterminate progress indicator.',
    importName: 'UiProgressBarComponent',
    usage: `<ui-progress-bar [value]="76" variant="success" label="Build progress" />
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
        name: 'ariaValueText',
        type: 'string',
        defaultValue: "''",
        description: 'Optional localized or human-readable determinate value text.',
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
    usage: `<ui-button (click)="modalOpen.set(true)">Open dialog</ui-button>

<ui-modal
  [open]="modalOpen()"
  (openChange)="modalOpen.set($event)"
  size="lg"
  descriptionId="publish-dialog-description"
  [closeOnBackdrop]="false"
>
  <span uiModalHeader>Publish package</span>
  <p id="publish-dialog-description">
    Build the library, inspect dist/ui, then publish with public access.
  </p>
  <div uiModalFooter>
    <ui-button variant="outline" (click)="modalOpen.set(false)">Cancel</ui-button>
    <ui-button (click)="modalOpen.set(false)">Publish</ui-button>
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
        name: 'closeAriaLabel',
        type: 'string',
        defaultValue: "'Close dialog'",
        description: 'Localized accessible label for the close action.',
      },
      {
        name: 'initialFocus',
        type: 'string',
        defaultValue: "''",
        description: 'Optional CSS selector for the element focused when the dialog opens.',
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
  label="Email subscribers"
  helperText="Reactive form boolean value."
  [formControl]="newsletter"
/>

<ui-checkbox
  label="Select all packages"
  helperText="Mixed child state."
  indeterminate
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
        description:
          'Emits when the native checkbox receives focus. The host also forwards a native focus event.',
      },
      {
        name: 'blurred',
        type: 'OutputEmitterRef<FocusEvent>',
        description:
          'Emits when the native checkbox loses focus. The host also forwards a native blur event.',
      },
    ],
  },
  {
    slug: 'combobox',
    name: 'Combobox',
    selector: 'ui-combobox',
    summary:
      'Filterable or server-driven option selection with active-descendant keyboard navigation and Angular Forms support.',
    importName: 'UiComboboxComponent',
    usage: `<ui-combobox
  label="Framework"
  placeholder="Search frameworks"
  [options]="frameworks"
  [formControl]="framework"
  clearable
/>`,
    inputs: [
      {
        name: 'label',
        type: 'string',
        defaultValue: "''",
        description: 'Visible native label for the text entry control.',
      },
      {
        name: 'placeholder',
        type: 'string',
        defaultValue: "''",
        description: 'Placeholder shown while the query is empty.',
      },
      {
        name: 'helperText',
        type: 'string',
        defaultValue: "''",
        description: 'Supporting text described by the input.',
      },
      {
        name: 'errorText',
        type: 'string',
        defaultValue: "''",
        description: 'Validation message that marks the input invalid.',
      },
      {
        name: 'inputId',
        type: 'string',
        defaultValue: 'generated',
        description: 'Stable input ID used by label, listbox, option, and message relationships.',
      },
      {
        name: 'name',
        type: 'string',
        defaultValue: "''",
        description: 'Native form control name.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "''",
        description: 'Accessible name used when no visible label is supplied.',
      },
      {
        name: 'autocomplete',
        type: 'string',
        defaultValue: "'off'",
        description: 'Native browser autocomplete token for the query input.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        description: 'Input frame height, padding, and type scale.',
      },
      {
        name: 'options',
        type: 'readonly UiComboboxOption[]',
        defaultValue: '[]',
        description: 'Available values with labels, optional descriptions, and disabled state.',
      },
      {
        name: 'open',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Controlled suggestion-panel state with internal interaction fallback.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Disables entry, toggle, clearing, and suggestion interaction.',
      },
      {
        name: 'required',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Shows the required indicator and exposes aria-required.',
      },
      {
        name: 'clearable',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Shows a localized clear action when a query or selection exists.',
      },
      {
        name: 'loading',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Shows loading feedback and exposes aria-busy on the listbox.',
      },
      {
        name: 'filterOptions',
        type: 'boolean',
        defaultValue: 'true',
        description:
          'Filters labels and descriptions locally; disable for parent-owned server results.',
      },
      {
        name: 'openOnFocus',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Opens available suggestions when the input receives focus.',
      },
      {
        name: 'noResultsText',
        type: 'string',
        defaultValue: "'No results found'",
        description: 'Localized empty-result status.',
      },
      {
        name: 'loadingText',
        type: 'string',
        defaultValue: "'Loading suggestions'",
        description: 'Localized loading status.',
      },
      {
        name: 'clearAriaLabel',
        type: 'string',
        defaultValue: "'Clear selection'",
        description: 'Localized accessible name for the clear action.',
      },
      {
        name: 'openAriaLabel',
        type: 'string',
        defaultValue: "'Open suggestions'",
        description: 'Localized accessible name for the closed toggle.',
      },
      {
        name: 'closeAriaLabel',
        type: 'string',
        defaultValue: "'Close suggestions'",
        description: 'Localized accessible name for the open toggle.',
      },
    ],
    outputs: [
      {
        name: 'valueChange',
        type: 'OutputEmitterRef<string>',
        description: 'Emits a committed option value or an empty value when cleared.',
      },
      {
        name: 'queryChange',
        type: 'OutputEmitterRef<string>',
        description: 'Emits visible query text for analytics or server-side suggestion loading.',
      },
      {
        name: 'openChange',
        type: 'OutputEmitterRef<boolean>',
        description: 'Emits interaction-requested panel state.',
      },
      {
        name: 'optionSelected',
        type: 'OutputEmitterRef<UiComboboxSelection>',
        description: 'Emits the selected option and its original source index.',
      },
      {
        name: 'focused',
        type: 'OutputEmitterRef<FocusEvent>',
        description: 'Emits native input focus without colliding with the DOM focus event name.',
      },
      {
        name: 'blurred',
        type: 'OutputEmitterRef<FocusEvent>',
        description: 'Emits native input blur after marking the form control touched.',
      },
    ],
  },
  {
    slug: 'date-picker',
    name: 'Date Picker',
    selector: 'ui-date-picker',
    summary:
      'Localized calendar-grid date selection with ISO Angular Forms values, date constraints, and full keyboard navigation.',
    importName: 'UiDatePickerComponent',
    usage: `<ui-date-picker
  label="Release date"
  [formControl]="releaseDate"
  min="2026-01-01"
  max="2027-12-31"
  clearable
/>`,
    inputs: [
      {
        name: 'label',
        type: 'string',
        defaultValue: "''",
        description: 'Visible native label for the readonly date display input.',
      },
      {
        name: 'placeholder',
        type: 'string',
        defaultValue: "'Select a date'",
        description: 'Text shown while no ISO date is selected.',
      },
      {
        name: 'helperText',
        type: 'string',
        defaultValue: "''",
        description: 'Supporting text described by the trigger input.',
      },
      {
        name: 'errorText',
        type: 'string',
        defaultValue: "''",
        description: 'Validation message that marks the trigger input invalid.',
      },
      {
        name: 'inputId',
        type: 'string',
        defaultValue: 'generated',
        description: 'Stable base ID for label, calendar, and message relationships.',
      },
      {
        name: 'name',
        type: 'string',
        defaultValue: "''",
        description: 'Native form control name.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "''",
        description: 'Accessible trigger name used when no visible label is supplied.',
      },
      {
        name: 'locale',
        type: 'string',
        defaultValue: "'en-US'",
        description: 'Intl locale for selected, month, weekday, and full-date labels.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        description: 'Trigger frame height, spacing, and type scale.',
      },
      {
        name: 'min',
        type: 'string',
        defaultValue: "''",
        description: 'Inclusive minimum ISO date in YYYY-MM-DD format.',
      },
      {
        name: 'max',
        type: 'string',
        defaultValue: "''",
        description: 'Inclusive maximum ISO date in YYYY-MM-DD format.',
      },
      {
        name: 'startAt',
        type: 'string',
        defaultValue: "''",
        description: 'Initial ISO calendar date when no value is selected.',
      },
      {
        name: 'disabledDates',
        type: 'readonly string[]',
        defaultValue: '[]',
        description: 'Specific ISO dates excluded from pointer and keyboard selection.',
      },
      {
        name: 'open',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Controlled calendar state with internal interaction fallback.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Disables trigger, clear, calendar, and date interaction.',
      },
      {
        name: 'required',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Shows the required indicator and exposes aria-required.',
      },
      {
        name: 'clearable',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Shows a localized clear action for selected values.',
      },
      {
        name: 'showOutsideDays',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Shows adjacent-month dates while retaining the stable six-week grid.',
      },
      {
        name: 'closeOnSelect',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Closes and restores trigger focus after date selection.',
      },
      {
        name: 'firstDayOfWeek',
        type: 'number',
        defaultValue: '0',
        description: 'First weekday index from Sunday 0 through Saturday 6.',
      },
      {
        name: 'calendarAriaLabel',
        type: 'string',
        defaultValue: "'Choose date'",
        description: 'Localized accessible name for the non-modal calendar dialog.',
      },
      {
        name: 'openAriaLabel',
        type: 'string',
        defaultValue: "'Open calendar'",
        description: 'Localized accessible name for the closed calendar toggle.',
      },
      {
        name: 'closeAriaLabel',
        type: 'string',
        defaultValue: "'Close calendar'",
        description: 'Localized accessible name for the open calendar toggle.',
      },
      {
        name: 'clearAriaLabel',
        type: 'string',
        defaultValue: "'Clear date'",
        description: 'Localized accessible name for the clear action.',
      },
      {
        name: 'previousMonthAriaLabel',
        type: 'string',
        defaultValue: "'Previous month'",
        description: 'Localized accessible name for previous-month navigation.',
      },
      {
        name: 'nextMonthAriaLabel',
        type: 'string',
        defaultValue: "'Next month'",
        description: 'Localized accessible name for next-month navigation.',
      },
      {
        name: 'todayText',
        type: 'string',
        defaultValue: "'Today'",
        description: 'Localized label for the today shortcut.',
      },
    ],
    outputs: [
      {
        name: 'valueChange',
        type: 'OutputEmitterRef<string>',
        description: 'Emits a selected ISO date or an empty value when cleared.',
      },
      {
        name: 'openChange',
        type: 'OutputEmitterRef<boolean>',
        description: 'Emits interaction-requested calendar state.',
      },
      {
        name: 'dateSelected',
        type: 'OutputEmitterRef<UiDatePickerSelection>',
        description: 'Emits the ISO value and an equivalent UTC-safe Date.',
      },
      {
        name: 'monthChange',
        type: 'OutputEmitterRef<string>',
        description: 'Emits the visible month as its first ISO date.',
      },
      {
        name: 'focused',
        type: 'OutputEmitterRef<FocusEvent>',
        description: 'Emits trigger input focus without colliding with the native event name.',
      },
      {
        name: 'blurred',
        type: 'OutputEmitterRef<FocusEvent>',
        description: 'Emits when focus leaves the complete Date Picker.',
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
  helperText="Native select behavior with NgNova styling."
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
        description:
          'Emits when the native select receives focus. The host also forwards a native focus event.',
      },
      {
        name: 'blurred',
        type: 'OutputEmitterRef<FocusEvent>',
        description:
          'Emits when the native select loses focus. The host also forwards a native blur event.',
      },
    ],
  },
  {
    slug: 'alert',
    name: 'Alert',
    selector: 'ui-alert',
    summary: 'Semantic feedback message with variants and an optional dismiss action.',
    importName: 'UiAlertComponent',
    usage: `<ui-alert variant="success" title="Saved" dismissible>
  Your component settings were updated.
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
        name: 'dismissAriaLabel',
        type: 'string',
        defaultValue: "'Dismiss alert'",
        description: 'Localized accessible name for the dismiss button.',
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
  helperText="Small mutually exclusive choices stay visible."
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
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "''",
        description: 'Accessible group label when no visible legend is provided.',
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
        description:
          'Emits when a radio receives focus. The host also forwards a native focus event.',
      },
      {
        name: 'blurred',
        type: 'OutputEmitterRef<FocusEvent>',
        description: 'Emits when a radio loses focus. The host also forwards a native blur event.',
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
  helperText="Immediate setting state owned by the parent form."
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
        description:
          'Emits when the switch receives focus. The host also forwards a native focus event.',
      },
      {
        name: 'blurred',
        type: 'OutputEmitterRef<FocusEvent>',
        description:
          'Emits when the switch loses focus. The host also forwards a native blur event.',
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
  helperText="Counter, resize, and validation-ready field state."
  [maxLength]="280"
  [rows]="5"
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
        description:
          'Emits when the textarea receives focus. The host also forwards a native focus event.',
      },
      {
        name: 'blurred',
        type: 'OutputEmitterRef<FocusEvent>',
        description:
          'Emits when the textarea loses focus. The host also forwards a native blur event.',
      },
    ],
  },
  {
    slug: 'tabs',
    name: 'Tabs',
    selector: 'ui-tabs',
    summary: 'Keyboard-friendly tablist for switching between related sections.',
    importName: 'UiTabsComponent',
    usage: `<ui-tabs
  [tabs]="componentTabs"
  [active]="activeTab()"
  (activeChange)="activeTab.set($event)"
  ariaLabel="Component documentation tabs preview"
  fullWidth
>
  @if (activeTab() === 'overview') {
    Overview panel content stays associated with the selected tab.
  } @else {
    API panel content can hold reference tables, forms, or related content.
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
        name: 'orientation',
        type: "'horizontal' | 'vertical'",
        defaultValue: "'horizontal'",
        description: 'Tab layout and matching arrow-key navigation axis.',
      },
      {
        name: 'variant',
        type: "'segmented' | 'underline' | 'pills'",
        defaultValue: "'segmented'",
        description: 'Visual treatment for the tablist without changing its interaction model.',
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
  [items]="accordionItems"
  [active]="accordionActive()"
  (activeChange)="accordionActive.set($event)"
/>`,
    inputs: [
      { name: 'id', type: 'string', defaultValue: 'generated', description: 'Base ARIA ID.' },
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
      {
        name: 'headingLevel',
        type: 'number',
        defaultValue: '3',
        description: 'ARIA heading level for every disclosure trigger, clamped from 1 through 6.',
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
    slug: 'file-upload',
    name: 'File Upload',
    selector: 'ui-file-upload',
    summary:
      'Accessible controlled file picker and drop zone with validation, progress, immutable changes, and explicit consumer-owned upload requests.',
    importName: 'UiFileUploadComponent',
    usage: `<ui-file-upload
  [files]="files()"
  (filesChange)="files.set($event)"
  (rejected)="showRejections($event)"
  (uploadRequested)="upload($event.files)"
  [progress]="progress()"
  accept=".png,.jpg,.pdf"
  [maxFiles]="5"
  [maxFileSize]="5000000"
  ariaLabel="Project attachments"
/>`,
    inputs: [
      {
        name: 'files',
        type: 'readonly File[]',
        defaultValue: '[]',
        description: 'Controlled accepted files.',
      },
      {
        name: 'accept',
        type: 'string',
        defaultValue: "''",
        description: 'Comma-separated extensions or MIME rules.',
      },
      {
        name: 'multiple',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Allows more than one controlled file.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Disables picker, drop, removal, clear, and upload actions.',
      },
      {
        name: 'autoUpload',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Requests upload immediately for newly accepted files.',
      },
      {
        name: 'maxFiles',
        type: 'number',
        defaultValue: '0',
        description: 'Maximum file count; zero is unlimited.',
      },
      {
        name: 'maxFileSize',
        type: 'number',
        defaultValue: '0',
        description: 'Maximum bytes per file; zero is unlimited.',
      },
      {
        name: 'maxTotalSize',
        type: 'number',
        defaultValue: '0',
        description: 'Maximum total bytes; zero is unlimited.',
      },
      {
        name: 'progress',
        type: 'Readonly<Record<string, number>>',
        defaultValue: '{}',
        description: 'Progress by stable file key, clamped from 0 through 100.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "'File upload'",
        description: 'Accessible name for the upload section.',
      },
      {
        name: 'chooseLabel',
        type: 'string',
        defaultValue: "'Choose files'",
        description: 'Localized picker action label.',
      },
      {
        name: 'dropLabel',
        type: 'string',
        defaultValue: "'Drop files here'",
        description: 'Localized drop-zone heading.',
      },
      {
        name: 'helperText',
        type: 'string',
        defaultValue: "'or choose files from your device'",
        description: 'Visible format and limit guidance.',
      },
      {
        name: 'clearLabel',
        type: 'string',
        defaultValue: "'Clear'",
        description: 'Localized clear action label.',
      },
      {
        name: 'uploadLabel',
        type: 'string',
        defaultValue: "'Upload'",
        description: 'Localized upload request label.',
      },
      {
        name: 'fileListAriaLabel',
        type: 'string',
        defaultValue: "'Selected files'",
        description: 'Accessible name for accepted files.',
      },
      {
        name: 'removeAriaLabel',
        type: 'string',
        defaultValue: "'Remove'",
        description: 'Accessible-label prefix for removal.',
      },
      {
        name: 'rejectionText',
        type: 'string',
        defaultValue: "'Some files could not be added.'",
        description: 'Localized validation alert.',
      },
    ],
    outputs: [
      {
        name: 'filesChange',
        type: 'OutputEmitterRef<readonly File[]>',
        description: 'Emits a frozen next accepted-file collection.',
      },
      {
        name: 'rejected',
        type: 'OutputEmitterRef<readonly UiFileUploadRejection[]>',
        description: 'Emits frozen files and machine-readable rejection reasons.',
      },
      {
        name: 'uploadRequested',
        type: 'OutputEmitterRef<UiFileUploadRequest>',
        description: 'Requests consumer upload work without hidden network behavior.',
      },
    ],
  },
  {
    slug: 'command-palette',
    name: 'Command Palette',
    selector: 'ui-command-palette',
    summary:
      'Accessible controlled command dialog with grouped filtering, global invocation, complete keyboard navigation, and focus management.',
    importName: 'UiCommandPaletteComponent',
    usage: `<button type="button" (click)="paletteOpen.set(true)">Search commands</button>
<ui-command-palette
  [commands]="commands"
  [open]="paletteOpen()"
  (openChange)="paletteOpen.set($event)"
  [query]="query()"
  (queryChange)="query.set($event)"
  (commandSelected)="run($event.command)"
  ariaLabel="Workspace commands"
/>`,
    inputs: [
      {
        name: 'commands',
        type: 'readonly UiCommand[]',
        defaultValue: '[]',
        description: 'Typed commands with stable values, searchable metadata, groups, and state.',
      },
      {
        name: 'open',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Controlled visibility state.',
      },
      {
        name: 'query',
        type: 'string',
        defaultValue: "''",
        description: 'Controlled filter query.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Prevents global keyboard invocation.',
      },
      {
        name: 'loading',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Announces and presents pending command loading.',
      },
      {
        name: 'shortcutEnabled',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Enables Ctrl/Cmd+K global invocation.',
      },
      {
        name: 'closeOnSelection',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Requests closure after an enabled command is selected.',
      },
      {
        name: 'closeOnBackdrop',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Requests closure after direct backdrop interaction.',
      },
      {
        name: 'closeOnEscape',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Requests closure after Escape while always emitting escapeKeyDown.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "'Command palette'",
        description: 'Accessible name for the modal dialog.',
      },
      {
        name: 'inputAriaLabel',
        type: 'string',
        defaultValue: "'Search commands'",
        description: 'Accessible name for the filter combobox.',
      },
      {
        name: 'resultsAriaLabel',
        type: 'string',
        defaultValue: "'Available commands'",
        description: 'Accessible name for command results.',
      },
      {
        name: 'placeholder',
        type: 'string',
        defaultValue: "'Type a command or search...'",
        description: 'Localized filter placeholder.',
      },
      {
        name: 'emptyText',
        type: 'string',
        defaultValue: "'No commands found.'",
        description: 'Localized empty-result message.',
      },
      {
        name: 'loadingText',
        type: 'string',
        defaultValue: "'Loading commands...'",
        description: 'Localized loading message.',
      },
      {
        name: 'closeLabel',
        type: 'string',
        defaultValue: "'Close command palette'",
        description: 'Accessible label for the close action.',
      },
      {
        name: 'hintText',
        type: 'string',
        defaultValue: "'Use arrow keys to navigate and Enter to select'",
        description: 'Localized keyboard guidance.',
      },
      {
        name: 'shortcutHint',
        type: 'string',
        defaultValue: "'Ctrl or Command + K'",
        description: 'Localized global shortcut hint.',
      },
    ],
    outputs: [
      {
        name: 'openChange',
        type: 'OutputEmitterRef<boolean>',
        description: 'Requests controlled visibility changes.',
      },
      {
        name: 'queryChange',
        type: 'OutputEmitterRef<string>',
        description: 'Requests controlled query changes.',
      },
      {
        name: 'commandSelected',
        type: 'OutputEmitterRef<UiCommandSelection>',
        description: 'Emits the selected command and keyboard or pointer source.',
      },
      {
        name: 'escapeKeyDown',
        type: 'OutputEmitterRef<void>',
        description: 'Emits every handled Escape key before dismissal policy.',
      },
    ],
  },
  {
    slug: 'overlay',
    name: 'Advanced Overlay',
    selector: 'ui-overlay',
    summary:
      'Optional Angular CDK connected-overlay primitive with fallback placement, scroll policy, dismissal control, focus management, and typed lifecycle events.',
    importName: 'UiOverlayComponent, UiOverlayTriggerDirective, UiOverlayContentDirective',
    usage: `<ui-overlay
  [open]="open()"
  (openChange)="open.set($event)"
  [placements]="['bottom', 'top']"
  alignment="start"
  scrollStrategy="reposition"
  initialFocus="first"
  ariaLabel="Release actions"
>
  <button uiOverlayTrigger type="button">Open actions</button>
  <div uiOverlayContent>Connected overlay content</div>
</ui-overlay>`,
    inputs: [
      {
        name: 'open',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Controlled attachment state.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Prevents trigger pointer and keyboard requests.',
      },
      {
        name: 'placements',
        type: 'readonly UiOverlayPlacement[]',
        defaultValue: "['bottom', 'top', 'right', 'left']",
        description: 'Ordered placement candidates for collision fallback.',
      },
      {
        name: 'alignment',
        type: 'UiOverlayAlignment',
        defaultValue: "'start'",
        description: 'Start, center, or end cross-axis alignment.',
      },
      {
        name: 'gap',
        type: 'number',
        defaultValue: '8',
        description: 'Non-negative main-axis distance from the origin in pixels.',
      },
      {
        name: 'crossAxisOffset',
        type: 'number',
        defaultValue: '0',
        description: 'Signed cross-axis adjustment in pixels.',
      },
      {
        name: 'viewportMargin',
        type: 'number',
        defaultValue: '8',
        description: 'Minimum viewport-edge distance in pixels.',
      },
      {
        name: 'scrollStrategy',
        type: 'UiOverlayScrollStrategy',
        defaultValue: "'reposition'",
        description: 'Reposition, close, block, or no-op behavior during page scrolling.',
      },
      {
        name: 'role',
        type: 'UiOverlayRole',
        defaultValue: "'dialog'",
        description: 'Semantic role for projected connected content.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "''",
        description: 'Accessible name for the overlay panel.',
      },
      {
        name: 'panelId',
        type: 'string',
        defaultValue: "'ui-overlay-{id}'",
        description: 'Stable unique panel ID used by trigger relationships.',
      },
      {
        name: 'hasBackdrop',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Adds a CDK backdrop.',
      },
      {
        name: 'backdropClass',
        type: 'string',
        defaultValue: "'cdk-overlay-transparent-backdrop'",
        description: 'Class applied to the optional CDK backdrop.',
      },
      {
        name: 'closeOnOutside',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Requests closure after an outside pointer event.',
      },
      {
        name: 'closeOnBackdrop',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Requests closure after backdrop interaction.',
      },
      {
        name: 'closeOnEscape',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Requests closure after Escape.',
      },
      {
        name: 'matchTriggerWidth',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Matches the overlay pane width to its origin.',
      },
      {
        name: 'flexibleDimensions',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Allows CDK to constrain the panel to viewport dimensions.',
      },
      {
        name: 'growAfterOpen',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Allows the connected panel to grow after attachment.',
      },
      {
        name: 'push',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Pushes the panel on screen when no placement fully fits.',
      },
      {
        name: 'lockPosition',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Prevents placement switching after the first position.',
      },
      {
        name: 'disposeOnNavigation',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Disposes the CDK overlay on browser navigation.',
      },
      {
        name: 'initialFocus',
        type: 'UiOverlayInitialFocus',
        defaultValue: "'none'",
        description: 'Moves focus to none, the panel, or its first focusable descendant.',
      },
      {
        name: 'restoreFocus',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Returns focus to the previously active element after detachment.',
      },
      {
        name: 'uiOverlayTrigger',
        type: 'directive',
        defaultValue: 'required',
        description: 'Marks the projected interactive origin that requests controlled toggling.',
      },
      {
        name: 'uiOverlayContent',
        type: 'directive',
        defaultValue: 'required',
        description: 'Marks projected content portaled into the connected CDK pane.',
      },
    ],
    outputs: [
      {
        name: 'openChange',
        type: 'OutputEmitterRef<boolean>',
        description: 'Requests controlled attachment changes.',
      },
      {
        name: 'opened',
        type: 'OutputEmitterRef<void>',
        description: 'Emits after the CDK overlay attaches.',
      },
      {
        name: 'closed',
        type: 'OutputEmitterRef<void>',
        description: 'Emits after the CDK overlay detaches.',
      },
      {
        name: 'backdropClick',
        type: 'OutputEmitterRef<MouseEvent>',
        description: 'Emits the native backdrop event before dismissal policy.',
      },
      {
        name: 'outsideClick',
        type: 'OutputEmitterRef<MouseEvent>',
        description: 'Emits a click outside both origin and panel.',
      },
      {
        name: 'escapeKeyDown',
        type: 'OutputEmitterRef<void>',
        description: 'Emits Escape before dismissal policy.',
      },
      {
        name: 'positionChange',
        type: 'OutputEmitterRef<UiOverlayPositionChange>',
        description: 'Reports the resolved placement and requested alignment.',
      },
    ],
  },
  {
    slug: 'confirmation',
    name: 'Confirmation Workflows',
    selector: 'ui-confirmation-dialog',
    summary:
      'Queued Promise-based confirmation service and accessible host dialog with typed outcomes, safe focus, exact-text guards, and explicit dismissal policy.',
    importName: 'UiConfirmationDialogComponent, UiConfirmationService',
    usage: `<ui-confirmation-dialog />

// Mount the dialog once near the application shell, then inject the service.
const result = await confirmations.confirm({
  title: 'Delete release?',
  message: 'This action cannot be undone.',
  confirmLabel: 'Delete',
  intent: 'danger',
  requireText: 'DELETE',
});

if (result.confirmed) deleteRelease();`,
    inputs: [
      {
        name: 'confirmLabel',
        type: 'string',
        defaultValue: "'Confirm'",
        description: 'Localized fallback confirm action label.',
      },
      {
        name: 'cancelLabel',
        type: 'string',
        defaultValue: "'Cancel'",
        description: 'Localized fallback cancel action label.',
      },
      {
        name: 'promptLabel',
        type: 'string',
        defaultValue: "'Confirmation text'",
        description: 'Localized fallback exact-text field label.',
      },
      {
        name: 'promptHint',
        type: 'string',
        defaultValue: "'Type exactly:'",
        description: 'Localized exact-text instruction prefix.',
      },
      {
        name: 'queueLabel',
        type: 'string',
        defaultValue: "'more confirmations pending'",
        description: 'Localized suffix for the pending-request count.',
      },
      {
        name: 'restoreFocus',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Returns focus to the element active before the queue opened.',
      },
    ],
    outputs: [
      {
        name: 'responded',
        type: 'OutputEmitterRef<UiConfirmationResult>',
        description: 'Emits user-driven typed outcomes before the service advances its queue.',
      },
      {
        name: 'opened',
        type: 'OutputEmitterRef<UiConfirmationRequest>',
        description: 'Emits each request when it becomes active.',
      },
      {
        name: 'closed',
        type: 'OutputEmitterRef<UiConfirmationRequest>',
        description: 'Emits each request when it leaves the active dialog.',
      },
      {
        name: 'escapeKeyDown',
        type: 'OutputEmitterRef<void>',
        description: 'Emits Escape even when request policy keeps the dialog open.',
      },
      {
        name: 'backdropClick',
        type: 'OutputEmitterRef<MouseEvent>',
        description: 'Emits direct backdrop interaction before request policy.',
      },
    ],
  },
  {
    slug: 'tree-table',
    name: 'Tree Table',
    selector: 'ui-tree-table',
    summary:
      'Accessible controlled treegrid combining expandable hierarchy, sortable columns, selection, keyboard rows, and complete async states.',
    importName: 'UiTreeTableComponent',
    usage: `<ui-tree-table
  [columns]="columns"
  [nodes]="nodes"
  [expanded]="expanded()"
  (expandedChange)="expanded.set($event)"
  [selected]="selected()"
  (selectedChange)="selected.set($event)"
  [sort]="sort()"
  (sortChange)="sort.set($event)"
  caption="Project packages"
/>`,
    inputs: [
      {
        name: 'columns',
        type: 'readonly UiTreeTableColumn[]',
        defaultValue: '[]',
        description: 'Column metadata with key, label, alignment, and sorting.',
      },
      {
        name: 'nodes',
        type: 'readonly UiTreeTableNode[]',
        defaultValue: '[]',
        description:
          'Nested rows with unique values, immutable data, disabled state, and children.',
      },
      {
        name: 'expanded',
        type: 'readonly string[]',
        defaultValue: '[]',
        description: 'Controlled expanded branch values.',
      },
      {
        name: 'selected',
        type: 'string | null',
        defaultValue: 'null',
        description: 'Controlled selected row value.',
      },
      {
        name: 'sort',
        type: 'UiTreeTableSort | null',
        defaultValue: 'null',
        description: 'Controlled column sort indicator.',
      },
      {
        name: 'caption',
        type: 'string',
        defaultValue: "'Tree table'",
        description: 'Accessible name for the treegrid.',
      },
      {
        name: 'loading',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Shows and announces loading.',
      },
      {
        name: 'error',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Shows the alert state after loading.',
      },
      {
        name: 'selectable',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Enables controlled row selection.',
      },
      {
        name: 'loadingText',
        type: 'string',
        defaultValue: "'Loading rows...'",
        description: 'Localized loading message.',
      },
      {
        name: 'errorText',
        type: 'string',
        defaultValue: "'Unable to load rows.'",
        description: 'Localized failure message.',
      },
      {
        name: 'emptyText',
        type: 'string',
        defaultValue: "'No rows found.'",
        description: 'Localized empty message.',
      },
      {
        name: 'expandAriaLabel',
        type: 'string',
        defaultValue: "'Expand row'",
        description: 'Accessible expansion action label.',
      },
      {
        name: 'collapseAriaLabel',
        type: 'string',
        defaultValue: "'Collapse row'",
        description: 'Accessible collapse action label.',
      },
    ],
    outputs: [
      {
        name: 'expandedChange',
        type: 'OutputEmitterRef<readonly string[]>',
        description: 'Emits a frozen next expansion collection.',
      },
      {
        name: 'selectedChange',
        type: 'OutputEmitterRef<string | null>',
        description: 'Emits the requested selected row value.',
      },
      {
        name: 'sortChange',
        type: 'OutputEmitterRef<UiTreeTableSort>',
        description: 'Emits the requested sort key and direction.',
      },
      {
        name: 'nodeActivated',
        type: 'OutputEmitterRef<UiTreeTableNode>',
        description: 'Emits an activated enabled hierarchical row.',
      },
    ],
  },
  {
    slug: 'tree',
    name: 'Tree',
    selector: 'ui-tree',
    summary:
      'Accessible controlled hierarchy with flattened visible nodes, roving focus, complete arrow-key navigation, and typeahead.',
    importName: 'UiTreeComponent',
    usage: `<ui-tree
  [nodes]="navigationNodes"
  [expanded]="expanded()"
  (expandedChange)="expanded.set($event)"
  [selected]="selected()"
  (selectedChange)="selected.set($event)"
  ariaLabel="Project navigation"
/>`,
    inputs: [
      {
        name: 'nodes',
        type: 'readonly UiTreeNode[]',
        defaultValue: '[]',
        description:
          'Nested nodes with unique values, labels, descriptions, disabled state, and children.',
      },
      {
        name: 'expanded',
        type: 'readonly string[]',
        defaultValue: '[]',
        description: 'Controlled values of expanded branch nodes.',
      },
      {
        name: 'selected',
        type: 'string | null',
        defaultValue: 'null',
        description: 'Controlled selected node value.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "'Tree'",
        description: 'Accessible name for the tree.',
      },
      {
        name: 'emptyText',
        type: 'string',
        defaultValue: "'No items.'",
        description: 'Localized status shown when the hierarchy is empty.',
      },
      {
        name: 'selectable',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Enables single-selection semantics and selectedChange.',
      },
      {
        name: 'expandOnActivate',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Toggles branches when activated by click, Enter, or Space.',
      },
    ],
    outputs: [
      {
        name: 'expandedChange',
        type: 'OutputEmitterRef<readonly string[]>',
        description: 'Emits a frozen next expanded-value collection.',
      },
      {
        name: 'selectedChange',
        type: 'OutputEmitterRef<string | null>',
        description: 'Emits the requested single selected value.',
      },
      {
        name: 'nodeActivated',
        type: 'OutputEmitterRef<UiTreeNode>',
        description: 'Emits the activated enabled node for navigation or commands.',
      },
    ],
  },
  {
    slug: 'data-view',
    name: 'Data View',
    selector: 'ui-data-view',
    summary:
      'Typed grid/list presentation with controlled layout switching, stable identity, and deterministic loading, error, and empty states.',
    importName: 'UiDataViewComponent, UiDataViewItemDirective',
    usage: `<ui-data-view
  [items]="products"
  [layout]="layout()"
  (layoutChange)="layout.set($event)"
  [trackBy]="trackProduct"
  showLayoutToggle
  ariaLabel="Product results"
>
  <ng-template uiDataViewItem let-item let-index="index" let-layout="layout">
    <app-product-card [product]="item" [layout]="layout" [position]="index" />
  </ng-template>
</ui-data-view>`,
    inputs: [
      {
        name: 'items',
        type: 'readonly T[]',
        defaultValue: '[]',
        description: 'Ordered records rendered through the item template or safe text fallback.',
      },
      {
        name: 'layout',
        type: "'grid' | 'list'",
        defaultValue: "'grid'",
        description: 'Controlled visual layout.',
      },
      {
        name: 'gap',
        type: "'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        description: 'Tokenized space between records.',
      },
      {
        name: 'showLayoutToggle',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Shows the optional controlled grid/list switch.',
      },
      {
        name: 'loading',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Shows and announces the loading state.',
      },
      {
        name: 'error',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Shows the alert state when loading is inactive.',
      },
      {
        name: 'loadingText',
        type: 'string',
        defaultValue: "'Loading items...'",
        description: 'Localized loading message.',
      },
      {
        name: 'errorText',
        type: 'string',
        defaultValue: "'Unable to load items.'",
        description: 'Localized failure message.',
      },
      {
        name: 'emptyText',
        type: 'string',
        defaultValue: "'No items found.'",
        description: 'Localized empty-result message.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "'Data view'",
        description: 'Accessible name for the view section.',
      },
      {
        name: 'layoutToggleAriaLabel',
        type: 'string',
        defaultValue: "'Choose layout'",
        description: 'Accessible name for the layout switch group.',
      },
      {
        name: 'gridLabel',
        type: 'string',
        defaultValue: "'Grid'",
        description: 'Localized visible grid-layout label.',
      },
      {
        name: 'listLabel',
        type: 'string',
        defaultValue: "'List'",
        description: 'Localized visible list-layout label.',
      },
      {
        name: 'trackBy',
        type: 'UiDataViewTrackBy<T> | null',
        defaultValue: 'null',
        description: 'Optional stable record identity; item identity is the fallback.',
      },
      {
        name: 'uiDataViewItem',
        type: 'directive',
        defaultValue: 'optional',
        description: 'Typed item template with item, index, layout, first, and last context.',
      },
    ],
    outputs: [
      {
        name: 'layoutChange',
        type: 'OutputEmitterRef<UiDataViewLayout>',
        description: 'Emits the requested layout while the parent remains state owner.',
      },
    ],
  },
  {
    slug: 'table',
    name: 'Table',
    selector: 'ui-table',
    summary:
      'Composable responsive data table with typed templates, controlled selection and pagination, sticky regions, and explicit loading, error, and empty states.',
    importName: 'UiTableComponent, UiTableCellDirective, UiTableHeaderDirective',
    usage: `<ui-table
  [columns]="tableColumns"
  [rows]="tableRows"
  caption="Component release status"
  rowKey="id"
  selectionMode="multiple"
  [selectedKeys]="selectedTableKeys()"
  (selectedKeysChange)="selectedTableKeys.set($event)"
  [page]="tablePage()"
  [pageSize]="10"
  [totalItems]="42"
  (pageChange)="loadTablePage($event)"
  stickyHeader
>
  <ng-template uiTableCell="status" let-value>
    <app-status [value]="value" />
  </ng-template>
</ui-table>`,
    inputs: [
      {
        name: 'columns',
        type: 'readonly UiTableColumn[]',
        defaultValue: '[]',
        description:
          'Column definitions with key, header, alignment, sorting, and optional start/end sticky placement.',
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
        name: 'errorText',
        type: 'string',
        defaultValue: "'Unable to load records.'",
        description: 'Message announced when the explicit error state is active.',
      },
      {
        name: 'caption',
        type: 'string',
        defaultValue: "''",
        description: 'Accessible table name rendered as a caption.',
      },
      {
        name: 'captionVisible',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Shows the caption visually instead of using screen-reader-only text.',
      },
      {
        name: 'rowKey',
        type: 'string',
        defaultValue: "''",
        description: 'Row property used as stable rendering identity; index is the fallback.',
      },
      {
        name: 'sort',
        type: 'UiTableSort | null',
        defaultValue: 'null',
        description:
          'Optional controlled sort state; otherwise sort indication is managed internally.',
      },
      {
        name: 'loading',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Shows the loading state.',
      },
      {
        name: 'error',
        type: 'boolean',
        defaultValue: 'false',
        description:
          'Shows the error state after loading; loading takes precedence and empty is the fallback.',
      },
      {
        name: 'selectable',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Makes rows focusable and emits rowSelected on click, Enter, or Space.',
      },
      {
        name: 'selectionMode',
        type: "'none' | 'single' | 'multiple'",
        defaultValue: "'none'",
        description:
          'Enables semantic radio or checkbox selection. A stable rowKey is required for selectable rows.',
      },
      {
        name: 'selectedKeys',
        type: 'readonly UiTableRowKey[] | null',
        defaultValue: 'null',
        description:
          'Optional controlled selected keys. Null enables internal visual state while still emitting immutable changes.',
      },
      {
        name: 'selectionColumnLabel',
        type: 'string',
        defaultValue: "'Row selection'",
        description: 'Screen-reader label for the single-selection column header.',
      },
      {
        name: 'selectAllAriaLabel',
        type: 'string',
        defaultValue: "'Select all rows on this page'",
        description: 'Localized accessible label for the visible-row bulk selection control.',
      },
      {
        name: 'rowSelectionAriaLabel',
        type: 'string',
        defaultValue: "'Select row'",
        description: 'Localized accessible-label prefix for row selection controls.',
      },
      {
        name: 'stickyHeader',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Constrains the table viewport and keeps the header visible while scrolling.',
      },
      {
        name: 'stickySelectionColumn',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Keeps the selection column visible during horizontal scrolling.',
      },
      {
        name: 'page',
        type: 'number',
        defaultValue: '1',
        description: 'Controlled one-based current page.',
      },
      {
        name: 'pageSize',
        type: 'number',
        defaultValue: '0',
        description: 'Items per page; values above zero enable the compact pagination footer.',
      },
      {
        name: 'totalItems',
        type: 'number',
        defaultValue: '0',
        description: 'Total result count used for page boundaries and the visible range summary.',
      },
      {
        name: 'paginationAriaLabel',
        type: 'string',
        defaultValue: "'Table pagination'",
        description: 'Accessible name for the pagination navigation landmark.',
      },
      {
        name: 'previousPageLabel',
        type: 'string',
        defaultValue: "'Previous'",
        description: 'Visible localized label for the previous-page action.',
      },
      {
        name: 'nextPageLabel',
        type: 'string',
        defaultValue: "'Next'",
        description: 'Visible localized label for the next-page action.',
      },
      {
        name: 'previousPageAriaLabel',
        type: 'string',
        defaultValue: "'Previous page'",
        description: 'Localized accessible label for the previous-page action.',
      },
      {
        name: 'nextPageAriaLabel',
        type: 'string',
        defaultValue: "'Next page'",
        description: 'Localized accessible label for the next-page action.',
      },
      {
        name: 'uiTableCell',
        type: 'directive',
        defaultValue: 'optional',
        description:
          'Associates an ng-template with a column key and exposes value, row, column, and rowIndex context.',
      },
      {
        name: 'uiTableHeader',
        type: 'directive',
        defaultValue: 'optional',
        description:
          'Associates an ng-template with a column key and exposes the column definition context.',
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
      {
        name: 'selectedKeysChange',
        type: 'OutputEmitterRef<readonly UiTableRowKey[]>',
        description: 'Emits a frozen next selection after row or visible-page bulk interaction.',
      },
      {
        name: 'pageChange',
        type: 'OutputEmitterRef<number>',
        description: 'Emits a bounded one-based page request; the consumer remains state owner.',
      },
    ],
  },
  {
    slug: 'table-virtual-scroll',
    name: 'Table Virtual Scroll',
    selector: 'ui-table-virtual-scroll',
    summary:
      'Optional Angular CDK-powered fixed-size row virtualization for large datasets with typed templates and bounded DOM rendering.',
    importName: 'UiTableVirtualScrollComponent, UiTableVirtualRowDirective',
    usage: `<ui-table-virtual-scroll
  [rows]="records"
  [itemSize]="52"
  height="24rem"
  ariaLabel="Release records"
  (scrolledIndexChange)="visibleStart.set($event)"
>
  <ng-template uiTableVirtualRow let-row let-index="index">
    <app-record-row [record]="row" [position]="index" />
  </ng-template>
</ui-table-virtual-scroll>`,
    inputs: [
      {
        name: 'rows',
        type: 'readonly T[]',
        defaultValue: '[]',
        description: 'Complete ordered dataset virtualized by the fixed-size CDK strategy.',
      },
      {
        name: 'itemSize',
        type: 'number',
        defaultValue: '48',
        description: 'Fixed row height in pixels, normalized to at least one.',
      },
      {
        name: 'minBufferPx',
        type: 'number',
        defaultValue: '192',
        description: 'Minimum rendered buffer in pixels, never smaller than one row.',
      },
      {
        name: 'maxBufferPx',
        type: 'number',
        defaultValue: '384',
        description: 'Maximum rendered buffer in pixels, never smaller than the minimum.',
      },
      {
        name: 'height',
        type: 'string',
        defaultValue: "'24rem'",
        description: 'CSS block size for the focusable scrolling viewport.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "'Virtualized table rows'",
        description: 'Accessible name for the virtual rowgroup.',
      },
      {
        name: 'loading',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Marks the viewport busy while preserving already rendered rows.',
      },
      {
        name: 'trackBy',
        type: 'UiTableVirtualTrackBy<T> | null',
        defaultValue: 'null',
        description: 'Optional stable identity function; item identity is the fallback.',
      },
      {
        name: 'uiTableVirtualRow',
        type: 'directive',
        defaultValue: 'optional',
        description: 'Typed row template exposing row/$implicit and its absolute dataset index.',
      },
    ],
    outputs: [
      {
        name: 'scrolledIndexChange',
        type: 'OutputEmitterRef<number>',
        description: 'Emits the first visible item index as the viewport scrolls.',
      },
    ],
  },
  {
    slug: 'toast',
    name: 'Toast',
    selector: 'ui-toast',
    summary: 'Application notification viewport powered by UiToastService.',
    importName: 'UiToastComponent, UiToastService',
    usage: `<ui-button (click)="showToast()">Show toast</ui-button>
<ui-toast position="top-right" viewportOffset="1rem" />`,
    inputs: [
      {
        name: 'position',
        type: "'top-right' | 'bottom-right'",
        defaultValue: "'top-right'",
        description: 'Viewport placement.',
      },
      {
        name: 'viewportOffset',
        type: 'string',
        defaultValue: "'var(--ui-toast-offset, 1rem)'",
        description:
          'CSS length used as the minimum viewport inset; device safe-area insets take precedence when larger.',
      },
      {
        name: 'maxMessages',
        type: 'number',
        defaultValue: '5',
        description: 'Maximum number of newest messages rendered in the viewport.',
      },
      {
        name: 'dismissAriaLabel',
        type: 'string',
        defaultValue: "'Dismiss notification'",
        description: 'Localized accessible label for every dismiss action.',
      },
    ],
    outputs: [],
  },
  {
    slug: 'breadcrumb',
    name: 'Breadcrumb',
    selector: 'ui-breadcrumb',
    summary:
      'Accessible hierarchy navigation with controlled collapsing, current-page semantics, and long-label handling.',
    importName: 'UiBreadcrumbComponent',
    usage: `<ui-breadcrumb
  [items]="[
    { label: 'Documentation', href: '/docs' },
    { label: 'Components', href: '/docs/components' },
    { label: 'Breadcrumb' }
  ]"
  ariaLabel="Documentation location"
/>`,
    inputs: [
      {
        name: 'items',
        type: 'readonly UiBreadcrumbItem[]',
        defaultValue: '[]',
        description:
          'Ordered hierarchy items with labels, optional links, and optional current state.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "'Breadcrumb'",
        description: 'Accessible name for the navigation landmark.',
      },
      {
        name: 'maxItems',
        type: 'number',
        defaultValue: '0',
        description:
          'Maximum visible entries before middle items collapse; zero shows the complete hierarchy.',
      },
    ],
    outputs: [
      {
        name: 'itemSelected',
        type: 'OutputEmitterRef<UiBreadcrumbSelection>',
        description: 'Emits the selected linked item, source index, and native mouse event.',
      },
    ],
  },
  {
    slug: 'stepper',
    name: 'Stepper',
    selector: 'ui-stepper',
    summary:
      'Controlled workflow progress with horizontal and vertical layouts, linear navigation, and explicit status communication.',
    importName: 'UiStepperComponent',
    usage: `<ui-stepper
  [steps]="releaseSteps"
  [(active)]="activeStep"
  ariaLabel="Release workflow"
>
  <app-release-step [step]="activeStep" />
</ui-stepper>`,
    inputs: [
      {
        name: 'id',
        type: 'string',
        defaultValue: 'generated',
        description: 'Stable base ID for step and active-panel relationships.',
      },
      {
        name: 'steps',
        type: 'readonly UiStepItem[]',
        defaultValue: '[]',
        description:
          'Ordered workflow steps with value, label, and optional description, completion, error, optional, and disabled metadata.',
      },
      {
        name: 'active',
        type: 'string',
        defaultValue: "''",
        description: 'Controlled value of the current step; falls back to the first enabled step.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "'Progress'",
        description: 'Accessible name for the workflow navigation landmark.',
      },
      {
        name: 'orientation',
        type: "'horizontal' | 'vertical'",
        defaultValue: "'horizontal'",
        description: 'Visual orientation of steps and connectors.',
      },
      {
        name: 'linear',
        type: 'boolean',
        defaultValue: 'false',
        description:
          'Restricts header navigation to prior steps so the application validates forward progress.',
      },
      {
        name: 'interactive',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Allows non-current eligible steps to act as navigation controls.',
      },
    ],
    outputs: [
      {
        name: 'activeChange',
        type: 'OutputEmitterRef<string>',
        description: 'Emits the requested controlled active value.',
      },
      {
        name: 'stepSelected',
        type: 'OutputEmitterRef<UiStepperSelection>',
        description: 'Emits the selected step and its source index.',
      },
    ],
  },
  {
    slug: 'paginator',
    name: 'Paginator',
    selector: 'ui-paginator',
    summary:
      'Controlled collection navigation with compact page ranges, page-size selection, and localization callbacks.',
    importName: 'UiPaginatorComponent',
    usage: `<ui-paginator
  [(page)]="page"
  [(pageSize)]="pageSize"
  [totalItems]="128"
  [pageSizeOptions]="[10, 25, 50]"
/>`,
    inputs: [
      {
        name: 'page',
        type: 'number',
        defaultValue: '1',
        description: 'Controlled one-based current page.',
      },
      {
        name: 'pageSize',
        type: 'number',
        defaultValue: '10',
        description: 'Controlled number of items per page.',
      },
      {
        name: 'totalItems',
        type: 'number',
        defaultValue: '0',
        description: 'Total collection size used for page and range calculations.',
      },
      {
        name: 'pageSizeOptions',
        type: 'readonly number[]',
        defaultValue: '[]',
        description: 'Available page sizes; an empty array hides the selector.',
      },
      {
        name: 'siblingCount',
        type: 'number',
        defaultValue: '1',
        description: 'Visible numbered pages on either side of the current page.',
      },
      {
        name: 'showFirstLast',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Shows first-page and last-page navigation controls.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Disables page and page-size changes.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "'Pagination'",
        description: 'Accessible name for the navigation landmark.',
      },
      {
        name: 'itemsPerPageLabel',
        type: 'string',
        defaultValue: "'Items per page'",
        description: 'Localized visible label for page size.',
      },
      {
        name: 'firstPageAriaLabel',
        type: 'string',
        defaultValue: "'First page'",
        description: 'Localized first-page control name.',
      },
      {
        name: 'previousPageAriaLabel',
        type: 'string',
        defaultValue: "'Previous page'",
        description: 'Localized previous-page control name.',
      },
      {
        name: 'nextPageAriaLabel',
        type: 'string',
        defaultValue: "'Next page'",
        description: 'Localized next-page control name.',
      },
      {
        name: 'lastPageAriaLabel',
        type: 'string',
        defaultValue: "'Last page'",
        description: 'Localized last-page control name.',
      },
      {
        name: 'getPageAriaLabel',
        type: '(page: number) => string',
        defaultValue: 'Page {number}',
        description: 'Creates localized accessible names for numbered buttons.',
      },
      {
        name: 'getRangeLabel',
        type: '(start: number, end: number, total: number) => string',
        defaultValue: '{start}–{end} of {total}',
        description: 'Creates the localized live collection range.',
      },
    ],
    outputs: [
      {
        name: 'pageChange',
        type: 'number',
        description: 'Requests a new controlled one-based page.',
      },
      {
        name: 'pageSizeChange',
        type: 'number',
        description: 'Requests a new controlled page size.',
      },
    ],
  },
  {
    slug: 'chip',
    name: 'Chip',
    selector: 'ui-chip',
    summary:
      'Compact value token with optional selection, removal, variants, sizes, and disabled state.',
    importName: 'UiChipComponent',
    usage: `<ui-chip variant="primary">Angular</ui-chip>
<ui-chip selectable [(selected)]="angularSelected">Angular</ui-chip>
<ui-chip removable removeAriaLabel="Remove TypeScript filter" (removed)="removeFilter()">
  TypeScript
</ui-chip>`,
    inputs: [
      {
        name: 'variant',
        type: "'neutral' | 'primary' | 'success' | 'warning' | 'danger'",
        defaultValue: "'neutral'",
        description: 'Semantic color treatment for the value.',
      },
      {
        name: 'size',
        type: "'sm' | 'md'",
        defaultValue: "'md'",
        description: 'Compact or standard chip height and typography.',
      },
      {
        name: 'selectable',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Renders a native toggle button with aria-pressed.',
      },
      {
        name: 'selected',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Controlled selected state for selectable chips.',
      },
      {
        name: 'removable',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Shows a separately focusable removal action.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Disables both selection and removal controls.',
      },
      {
        name: 'removeAriaLabel',
        type: 'string',
        defaultValue: "'Remove'",
        description: 'Localized accessible name for the removal action.',
      },
    ],
    outputs: [
      {
        name: 'selectedChange',
        type: 'boolean',
        description: 'Requests a controlled selection-state update.',
      },
      {
        name: 'removed',
        type: 'void',
        description: 'Requests removal without mutating the parent-owned collection.',
      },
    ],
  },
  {
    slug: 'divider',
    name: 'Divider',
    selector: 'ui-divider',
    summary: 'Semantic horizontal or vertical separator with labels and consistent inset spacing.',
    importName: 'UiDividerComponent',
    usage: `<ui-divider />
<ui-divider label="Advanced" [decorative]="false" />
<ui-divider orientation="vertical" inset="both" />`,
    inputs: [
      {
        name: 'orientation',
        type: "'horizontal' | 'vertical'",
        defaultValue: "'horizontal'",
        description: 'Visual and semantic separator direction.',
      },
      {
        name: 'inset',
        type: "'none' | 'start' | 'end' | 'both'",
        defaultValue: "'none'",
        description: 'Consistent edge spacing for grouped content.',
      },
      {
        name: 'label',
        type: 'string',
        defaultValue: "''",
        description: 'Optional visible horizontal section label.',
      },
      {
        name: 'decorative',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Uses presentation semantics unless the separation carries meaning.',
      },
    ],
    outputs: [],
  },
  {
    slug: 'menu',
    name: 'Menu / Dropdown Menu',
    selector: 'ui-menu',
    summary:
      'Keyboard-complete action menu with typeahead, disabled items, links, and destructive styling.',
    importName: 'UiMenuComponent, UiMenuTriggerDirective',
    usage: `<ui-menu [items]="actions" ariaLabel="Record actions" (itemSelected)="handleAction($event)">
  <button uiMenuTrigger type="button">Actions</button>
</ui-menu>`,
    inputs: [
      {
        name: 'items',
        type: 'readonly UiMenuItem[]',
        defaultValue: '[]',
        description: 'Ordered actions, links, disabled states, danger states, and separators.',
      },
      {
        name: 'open',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Controlled menu visibility.',
      },
      {
        name: 'align',
        type: "'start' | 'end'",
        defaultValue: "'start'",
        description: 'Aligns the menu edge to the trigger.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "'Actions'",
        description: 'Accessible name describing the action collection.',
      },
      {
        name: 'menuId',
        type: 'string',
        defaultValue: 'generated',
        description: 'Stable ID used by the trigger aria-controls relationship.',
      },
      {
        name: 'closeOnSelect',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Closes and restores trigger focus after selection.',
      },
      {
        name: 'uiMenuTrigger',
        type: 'directive',
        defaultValue: 'required',
        description: 'Marks the projected button that toggles the menu.',
      },
    ],
    outputs: [
      {
        name: 'openChange',
        type: 'boolean',
        description: 'Requests a controlled visibility update.',
      },
      {
        name: 'itemSelected',
        type: 'UiMenuSelection',
        description: 'Emits the selected item and source index.',
      },
      { name: 'opened', type: 'void', description: 'Emits when the menu opens.' },
      { name: 'closed', type: 'void', description: 'Emits when the menu closes.' },
    ],
  },
  {
    slug: 'drawer',
    name: 'Drawer',
    selector: 'ui-drawer',
    summary: 'Modal edge panel for focused navigation, filters, forms, and supporting workflows.',
    importName: 'UiDrawerComponent, UiDrawerHeaderDirective, UiDrawerFooterDirective',
    usage: `<button type="button" (click)="filtersOpen = true">Open filters</button>
<ui-drawer [(open)]="filtersOpen" titleId="filters-title" position="right">
  <span uiDrawerHeader id="filters-title">Filters</span>
  <form><!-- filter fields --></form>
  <button uiDrawerFooter type="button" (click)="filtersOpen = false">Apply</button>
</ui-drawer>`,
    inputs: [
      {
        name: 'open',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Controlled visibility state.',
      },
      {
        name: 'position',
        type: "'left' | 'right' | 'top' | 'bottom'",
        defaultValue: "'right'",
        description: 'Viewport edge from which the panel is presented.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        description: 'Tokenized width for side drawers or height for vertical drawers.',
      },
      {
        name: 'drawerId',
        type: 'string',
        defaultValue: 'generated',
        description: 'Stable ID for the dialog panel.',
      },
      {
        name: 'titleId',
        type: 'string',
        defaultValue: 'generated',
        description: 'ID of the visible projected heading.',
      },
      {
        name: 'descriptionId',
        type: 'string',
        defaultValue: "''",
        description: 'Optional descriptive content ID.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "''",
        description: 'Direct accessible name when no visible title is used.',
      },
      {
        name: 'closeAriaLabel',
        type: 'string',
        defaultValue: "'Close drawer'",
        description: 'Localized label for the close button.',
      },
      {
        name: 'initialFocus',
        type: 'string',
        defaultValue: "''",
        description: 'CSS selector for the first element to focus.',
      },
      {
        name: 'closeOnBackdrop',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Allows backdrop click dismissal.',
      },
      {
        name: 'closeOnEscape',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Allows Escape dismissal.',
      },
      {
        name: 'restoreFocus',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Returns focus to the previously focused control.',
      },
      {
        name: 'uiDrawerHeader',
        type: 'directive',
        defaultValue: 'recommended',
        description: 'Projects the visible drawer heading.',
      },
      {
        name: 'uiDrawerFooter',
        type: 'directive',
        defaultValue: 'optional',
        description: 'Projects footer actions.',
      },
    ],
    outputs: [
      {
        name: 'openChange',
        type: 'boolean',
        description: 'Requests controlled visibility changes.',
      },
      { name: 'opened', type: 'void', description: 'Emits when the drawer opens.' },
      { name: 'closed', type: 'void', description: 'Emits when the drawer closes.' },
      { name: 'backdropClick', type: 'MouseEvent', description: 'Emits for every backdrop click.' },
      {
        name: 'escapeKeyDown',
        type: 'KeyboardEvent',
        description: 'Emits when enabled Escape dismissal occurs.',
      },
    ],
  },
  {
    slug: 'popover',
    name: 'Popover',
    selector: 'ui-popover',
    summary: 'Accessible floating panel for interactive contextual content and actions.',
    importName: 'UiPopoverComponent, UiPopoverTriggerDirective, UiPopoverContentDirective',
    usage: `<ui-popover titleId="account-actions-title" position="bottom">
  <button uiPopoverTrigger type="button">Account</button>
  <div uiPopoverContent>
    <h2 id="account-actions-title">Account actions</h2>
    <button type="button">Sign out</button>
  </div>
</ui-popover>`,
    inputs: [
      {
        name: 'open',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Controlled open state; supports two-way binding with openChange.',
      },
      {
        name: 'position',
        type: "'top' | 'right' | 'bottom' | 'left'",
        defaultValue: "'bottom'",
        description: 'Preferred panel side; collision handling can flip it to the opposite side.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "''",
        description: 'Direct accessible panel label when no visible title labels the dialog.',
      },
      {
        name: 'titleId',
        type: 'string',
        defaultValue: "''",
        description: 'ID of a visible title inside the panel used by aria-labelledby.',
      },
      {
        name: 'panelId',
        type: 'string',
        defaultValue: 'generated',
        description: 'Stable panel ID connected to each trigger through aria-controls.',
      },
      {
        name: 'closeOnOutside',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Closes the panel after a pointer interaction outside the popover.',
      },
      {
        name: 'closeOnEscape',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Closes on Escape and returns focus to the trigger.',
      },
      {
        name: 'uiPopoverTrigger',
        type: 'directive',
        defaultValue: 'required',
        description: 'Marks the projected interactive element that toggles the panel.',
      },
      {
        name: 'uiPopoverContent',
        type: 'directive',
        defaultValue: 'required',
        description: 'Marks the projected interactive content rendered inside the panel.',
      },
    ],
    outputs: [
      {
        name: 'openChange',
        type: 'boolean',
        description: 'Requests a controlled open-state update.',
      },
      { name: 'opened', type: 'void', description: 'Emits once when the panel opens.' },
      { name: 'closed', type: 'void', description: 'Emits once when the panel closes.' },
    ],
  },
  {
    slug: 'tooltip',
    name: 'Tooltip',
    selector: '[uiTooltip]',
    summary: 'Accessible contextual description for hoverable and focusable controls.',
    importName: 'UiTooltipDirective',
    usage: `<button uiTooltip="Refresh dashboard" tooltipPosition="bottom">
  Refresh
</button>`,
    inputs: [
      {
        name: 'uiTooltip',
        type: 'string',
        defaultValue: 'required',
        description: 'Plain-text contextual description shown in the tooltip.',
      },
      {
        name: 'tooltipPosition',
        type: "'top' | 'right' | 'bottom' | 'left'",
        defaultValue: "'top'",
        description:
          'Preferred position; the overlay flips when that side collides with the viewport.',
      },
      {
        name: 'tooltipShowDelay',
        type: 'number',
        defaultValue: '500',
        description: 'Delay in milliseconds before the tooltip appears.',
      },
      {
        name: 'tooltipHideDelay',
        type: 'number',
        defaultValue: '100',
        description: 'Delay in milliseconds before the tooltip disappears.',
      },
      {
        name: 'tooltipDisabled',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Prevents the tooltip from opening.',
      },
      {
        name: 'tooltipId',
        type: 'string',
        defaultValue: 'generated',
        description: 'Stable tooltip ID used in the trigger aria-describedby relationship.',
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
    usage: `<ui-spinner label="Loading invoices" />
<span>Loading invoices...</span>`,
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

export function getComponentImportPath(slug: string): string {
  return `@ngnova/ui/${slug}`;
}

const baseComponentDocDetailsBySlug = new Map<string, ComponentDocDetails>([
  [
    'button',
    {
      overview: [
        'Button is the primary action primitive for commands, form submission, and workflow steps.',
        'It wraps a native button so keyboard activation, disabled behavior, form submission, and focus semantics stay predictable.',
      ],
      whenToUse: [
        'Use intent for semantic color and appearance for visual treatment; variant remains supported for existing simple buttons.',
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
          title: 'Icon action',
          description:
            'Pair a short action label with a decorative icon, or provide an accessible label for an icon-only control.',
          code: `<ui-button (pressed)="createRelease()">
  <ng-icon uiButtonIconStart name="heroPlus" />
  Create release
</ui-button>

<ui-button iconOnly appearance="ghost" ariaLabel="More release actions">
  <ng-icon uiButtonIcon name="heroEllipsisHorizontal" />
</ui-button>`,
        },
        {
          title: 'Testing with the button harness',
          description:
            'Use the testing entry point to locate buttons by text and inspect public behavior without depending on DOM structure.',
          code: `import { UiButtonHarness } from '@ngnova/ui/testing';

const button = await loader.getHarness(UiButtonHarness.with({ text: 'Save' }));

expect(await button.getText()).toBe('Save');
expect(await button.isDisabled()).toBe(false);
expect(await button.isLoading()).toBe(false);
expect(await button.getType()).toBe('button');

await button.click();`,
        },
        {
          title: 'Intent and appearance',
          description:
            'Use intent and appearance for semantic combinations while variant remains supported for existing buttons.',
          code: `<ui-button intent="success">Approve</ui-button>
<ui-button intent="warning" appearance="tonal">Needs review</ui-button>
<ui-button intent="danger" appearance="outline">Delete</ui-button>
<ui-button intent="neutral" appearance="text">View details</ui-button>`,
        },
        {
          title: 'Button group',
          description:
            'Group related actions with a shared accessible label, connected edges, and a complete focus ring around each keyboard-focused button.',
          code: `<ui-button-group ariaLabel="View density">
  <ui-button variant="outline">Compact</ui-button>
  <ui-button variant="outline">Comfortable</ui-button>
  <ui-button variant="outline">Spacious</ui-button>
</ui-button-group>`,
        },
        {
          title: 'Button events',
          description:
            'Use semantic outputs for app handlers while the host still forwards native focus and blur events.',
          code: `<ui-button
  (pressed)="saveChanges($event)"
  (focused)="buttonFocused.set(true)"
  (blurred)="buttonFocused.set(false)"
>
  Save changes
</ui-button>

<p aria-live="polite">
  {{ buttonFocused() ? 'Save action focused' : 'Ready to save' }}
</p>`,
        },
      ],
      accessibility: [
        'UiButtonComponent renders a native button, so Enter and Space activation and disabled semantics remain predictable.',
        'Icon-only buttons must provide ariaLabel; uiButtonIconStart and uiButtonIconEnd mark decorative icons aria-hidden.',
        'The loading state sets aria-busy, includes loadingLabel for screen readers, and disables repeated activation.',
        'Disabled anchors and router links receive aria-disabled="true", leave the tab order, and cannot navigate.',
        'ui-button-group renders role="group" and should include ariaLabel when grouping related controls.',
        'Grouped buttons preserve the standard outer focus-visible ring without clipping it at the group boundary.',
      ],
      keyboard: [
        'Enter and Space activate the native button.',
        'Tab moves focus to enabled buttons.',
      ],
      forms: [
        'Set type="submit" for form submission; the default type is button to avoid accidental submits.',
        'Use the uiButton directive on anchors or router links for navigation instead of nesting ui-button inside a link.',
      ],
      edgeCases: [
        'Disabled and loading buttons do not emit pressed.',
        'When intent or appearance is provided, the modern visual API takes precedence over variant; a missing intent defaults to primary and a missing appearance defaults to solid.',
        'Use fullWidth in narrow mobile layouts.',
        'Use ui-button-group only for closely related actions, not unrelated page actions.',
      ],
      testing: [
        'Import UiButtonHarness from @ngnova/ui/testing and filter with UiButtonHarness.with({ text }).',
        'The harness supports click(), getText(), isDisabled(), isLoading(), and getType().',
        'Assert pressed emits only when enabled and focused or blurred fire around focus changes.',
        'Assert aria-busy appears only during loading, loadingLabel renders screen-reader text, and all variants, sizes, fullWidth, ariaLabel, and type passthrough behavior remain covered.',
        'Assert representative intent and appearance combinations plus all visual class map entries.',
        'Assert icon-only sizing, icon marker directives, and accessible labels.',
        'Assert uiButton directive styling, router-link usage, and disabled-anchor behavior.',
        'Assert grouped buttons render role="group", aria labels, projected buttons, and full-width classes.',
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
        'The card is a neutral container by default; ariaLabel promotes it to a named region only when useful for navigation.',
        'Use semantic headings inside card headers and avoid duplicating the same wording in ariaLabel.',
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
        'Assert empty optional slots, neutral or named-region semantics, every variant, and every padding class.',
        'A component harness is unnecessary because Card has no state or interaction; consumers can locate projected content directly.',
      ],
    },
  ],
  [
    'form-field',
    {
      overview: [
        'Form Field is the shared composition foundation for controls that need NgNova label, message, adornment, sizing, and accessibility behavior without a specialized value API.',
        'The uiFormFieldControl directive registers one projected control and merges generated relationships with existing aria-describedby references.',
      ],
      whenToUse: [
        'Use to style a native input, select, textarea, or application-specific control that is not already covered by a dedicated NgNova component.',
        'Prefer UiInput, UiSelect, and UiTextarea when their value accessors and specialized behavior already fit the workflow.',
      ],
      examples: [
        {
          title: 'Composed native control',
          description:
            'Prefix and suffix slots stay outside the editable value while the label and message target the real input.',
          code: `<ui-form-field
  label="Workspace"
  helperText="Choose a short name."
  [invalid]="workspace.invalid && workspace.touched"
  errorText="Workspace is required."
  required
>
  <span uiFormFieldPrefix aria-hidden="true">@</span>
  <input uiFormFieldControl [formControl]="workspace" />
  <span uiFormFieldSuffix>.team</span>
</ui-form-field>`,
        },
        {
          title: 'Hidden search label',
          description: 'A hidden native label remains available to assistive technology.',
          code: `<ui-form-field label="Search packages" hideLabel appearance="filled">
  <svg uiFormFieldPrefix aria-hidden="true"><!-- search icon --></svg>
  <input uiFormFieldControl type="search" [formControl]="query" />
</ui-form-field>`,
        },
        {
          title: 'Validated currency amount',
          description:
            'Currency adornments stay outside the editable number while touched validation replaces the helper message.',
          code: `<ui-form-field
  label="Monthly budget"
  helperText="Enter the approved operating budget."
  [invalid]="budget.invalid && budget.touched"
  errorText="Enter a budget greater than zero."
  required
>
  <span uiFormFieldPrefix aria-hidden="true">$</span>
  <input
    uiFormFieldControl
    type="number"
    inputmode="decimal"
    min="1"
    step="100"
    [formControl]="budget"
  />
  <span uiFormFieldSuffix>USD</span>
</ui-form-field>`,
        },
        {
          title: 'Deployment environment',
          description:
            'The same label and message foundation can compose a native select when a specialized value component is unnecessary.',
          code: `<ui-form-field
  label="Deployment environment"
  helperText="Production deployments require approval."
  appearance="filled"
>
  <select uiFormFieldControl [formControl]="environment">
    <option value="development">Development</option>
    <option value="staging">Staging</option>
    <option value="production">Production</option>
  </select>
</ui-form-field>`,
        },
      ],
      accessibility: [
        'The native label targets the projected control using a consumer ID when present or a generated stable ID.',
        'Helper and active error IDs merge with pre-existing aria-describedby tokens instead of replacing them.',
        'Required, invalid, and disabled state are reflected through ARIA; consumers must also apply native or Angular Forms state to the real control.',
      ],
      keyboard: [
        'Form Field adds no keyboard model; the projected control retains its native or custom interaction.',
        'Interactive suffix actions need their own accessible name and must not steal the control label.',
      ],
      forms: [
        'Apply formControl, formControlName, or ngModel directly to the element carrying uiFormFieldControl.',
        'Derive invalid and errorText from the parent form without allowing the shell to mutate form-owned state.',
      ],
      edgeCases: [
        'Only one projected uiFormFieldControl is registered; use one Form Field per editable control.',
        'The control directive can safely exist outside a Form Field and leaves consumer attributes unchanged.',
        'When disabled is set on the shell, also disable the native element or FormControl so interaction is actually prevented.',
      ],
      testing: [
        'Use UiFormFieldHarness to locate by label, read or set the projected value, inspect messages, and assert required, invalid, and disabled ARIA state.',
        'Test consumer IDs, generated IDs, pre-existing descriptions, helper-to-error switching, hidden labels, adornments, sizes, appearances, and missing-control rendering.',
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
        'Focus and blur are available as focused and blurred Angular outputs, with native focus and blur events forwarded on the host for HTML-friendly listeners.',
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
        'Assert CVA writeValue does not emit valueChange, typing does emit valueChange, touched state, disabled state, validation message, clear button, prefix/suffix projection, and counter behavior.',
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
        'Supplying ariaLabel without ariaRole promotes the badge to a named group so the label is exposed reliably.',
      ],
      keyboard: ['Badge is non-interactive and should not receive focus.'],
      forms: ['Badge does not integrate with forms.'],
      edgeCases: [
        'Keep badge text short; long content truncates, while Tag or Alert is better for longer copy.',
      ],
      testing: [
        'Assert all semantic variants, sizes, truncation, and optional aria-label/role.',
        'No component harness is included because Badge is a non-interactive display primitive with directly observable DOM.',
      ],
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
        'ariaLabel promotes the tag to a named group for icon-heavy or visually compact content.',
        'Projected uiTagIcon content is normalized and hidden from assistive technology.',
      ],
      keyboard: [
        'Tab reaches removable tag buttons.',
        'Enter or Space activates the remove button.',
      ],
      forms: ['Tag does not manage forms; parent state owns selected filters.'],
      edgeCases: [
        'Long tag content truncates inside the tag.',
        'Do not use icon-only tags without ariaLabel.',
        'Prefer projected currentColor SVG icons over the legacy icon string to avoid platform-dependent glyph rendering.',
      ],
      testing: [
        'Assert removed emits from the remove button and removeLabel is applied.',
        'Use UiTagHarness to locate by visible text, inspect removability, and activate removal.',
      ],
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
      accessibility: [
        'A loaded source renders one native image named by ariaLabel, alt, or label in that priority order.',
        'Initials fallback uses role="img" with the same accessible-name priority; an entirely unnamed fallback is decorative.',
      ],
      keyboard: [
        'Avatar is visual and non-interactive; wrap it in a button or link only when it opens an action.',
      ],
      forms: ['Avatar does not integrate with forms.'],
      edgeCases: [
        'Provide ariaLabel, alt, or label unless the avatar is intentionally decorative.',
        'Image load failures automatically switch to initials; changing src retries the image.',
        'Use label for meaningful fallback initials even when an image is expected.',
      ],
      testing: [
        'Assert initials, accessible naming, image alt text, and error fallback.',
        'No component harness is included because Avatar is non-interactive and its public image/fallback DOM is directly observable.',
      ],
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
        'Pulse animation automatically stops when the user prefers reduced motion.',
      ],
      keyboard: ['Skeleton has no keyboard interaction.'],
      forms: ['Skeleton does not integrate with forms.'],
      edgeCases: [
        'Avoid replacing every tiny detail with a skeleton; preserve major layout blocks only.',
        'Set animated to false when a static placeholder better fits a dense or continuously updating surface.',
      ],
      testing: [
        'Assert aria-hidden, all shapes, width/height bindings, and animation opt-out.',
        'No component harness is included because Skeleton is decorative, non-interactive, and intentionally absent from the accessibility tree.',
      ],
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
      accessibility: [
        'Uses role="progressbar" with a required accessible label.',
        'Determinate mode exposes a normalized range and supports localized ariaValueText.',
        'Indeterminate mode omits aria-valuemin, aria-valuemax, aria-valuenow, and aria-valuetext.',
      ],
      keyboard: ['Progress bars are read-only status indicators and do not receive focus.'],
      forms: ['Progress Bar does not integrate with forms.'],
      edgeCases: [
        'Values are clamped between 0 and max; a non-positive or non-finite max is normalized to 1.',
        'Always provide a meaningful label.',
      ],
      testing: [
        'Assert normalized determinate ARIA values, visual width, and indeterminate omission.',
        'No component harness is included because Progress Bar is a read-only status primitive with no interaction or hidden state.',
      ],
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
    <ui-button variant="outline" (click)="publishOpen = false">Cancel</ui-button>
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
    <ui-button variant="outline" (click)="deleteOpen = false">Keep package</ui-button>
    <ui-button variant="danger" (click)="deletePackage()">Delete</ui-button>
  </div>
</ui-modal>`,
        },
      ],
      accessibility: [
        'Uses role="dialog" and aria-modal="true".',
        'Supports aria-labelledby or ariaLabel and optional aria-describedby.',
        'Moves focus into the dialog, traps Tab navigation, and restores the trigger by default.',
      ],
      keyboard: [
        'Escape closes when closeOnEscape is true.',
        'Tab is trapped inside the dialog while open.',
      ],
      forms: ['Modal can contain forms; parent state owns submit and close behavior.'],
      edgeCases: [
        'Use ariaLabel for headerless dialogs.',
        'Localize closeAriaLabel when the application language is not English.',
        'Nested dialogs share scroll locking and only the topmost dialog handles document keyboard events.',
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
        'Reactive form value and disabled-state updates are synchronized under OnPush change detection.',
      ],
      edgeCases: [
        'Indeterminate is visual and should be controlled by parent selection state.',
        'An explicit disabled input remains authoritative when the connected Angular form is enabled.',
        'Use one checkbox per independent decision; use Radio Group when the choices are mutually exclusive.',
      ],
      testing: ['Assert CVA value, disabled state, indeterminateChange, focus, and blur outputs.'],
    },
  ],
  [
    'combobox',
    {
      overview: [
        'Combobox combines text entry with a single-select listbox, keeping DOM focus on the input while aria-activedescendant identifies the keyboard target.',
        'It supports local label/description filtering or parent-owned server results and integrates with Angular Forms through ControlValueAccessor.',
      ],
      whenToUse: [
        'Use when option sets are large or users benefit from searching before selection.',
        'Use Select for a small stable set where every choice should remain immediately inspectable through native behavior.',
      ],
      examples: [
        {
          title: 'Local filtering',
          description:
            'Typing clears a stale committed value, filters options, and keeps the listbox keyboard reachable.',
          code: `<ui-combobox
  label="Framework"
  placeholder="Search frameworks"
  [options]="frameworks"
  [formControl]="framework"
  clearable
/>`,
        },
        {
          title: 'Server suggestions',
          description: 'Disable local filtering and replace options from a debounced query stream.',
          code: `<ui-combobox
  label="Repository"
  [options]="repositories()"
  [loading]="loading()"
  [filterOptions]="false"
  (queryChange)="searchRepositories($event)"
  [formControl]="repository"
/>`,
        },
      ],
      accessibility: [
        'The text input uses role="combobox", aria-expanded, aria-controls, aria-autocomplete, and aria-activedescendant while options remain in a named listbox.',
        'Disabled options expose both native disabled and aria-disabled state, selected options expose aria-selected, and loading exposes aria-busy.',
        'Visible or aria-only labels, helper/error descriptions, required state, and every utility action are independently localizable.',
      ],
      keyboard: [
        'Arrow Down and Arrow Up open and cycle enabled suggestions; Home and End move to boundaries.',
        'Enter commits the active option, Escape closes and restores committed display text, and Tab closes without trapping focus.',
        'DOM focus remains on the input throughout option navigation.',
      ],
      forms: [
        'The form value is the selected option value; visible query text is separate and available through queryChange.',
        'Typing away from a committed label clears the form value so stale selection does not survive edited text.',
      ],
      edgeCases: [
        'Use unique option values so IDs and tracking remain deterministic.',
        'With filterOptions=false, debounce queryChange and replace options from the parent; loading and empty states stay explicit.',
        'The panel is locally positioned beneath the control; avoid placing it inside overflow-clipped containers.',
      ],
      testing: [
        'Use UiComboboxHarness to query, open/close, read and select suggestions, inspect active state, clear, and assert disabled or message state.',
        'Test filtering, async results, disabled options, keyboard wrapping, Escape, blur/touched, clearing, empty/loading states, localization, and Angular Forms.',
      ],
    },
  ],
  [
    'date-picker',
    {
      overview: [
        'Date Picker exposes a locale-formatted display while Angular Forms reads and writes timezone-stable YYYY-MM-DD values.',
        'Its non-modal calendar dialog uses a fixed six-week grid, bounded navigation, explicit disabled dates, and roving day focus.',
      ],
      whenToUse: [
        'Use when users benefit from calendar context, date constraints, or keyboard exploration.',
        'Use a native date input when browser-native mobile picking and the smallest possible surface are more important than consistent presentation.',
      ],
      examples: [
        {
          title: 'Bounded release date',
          description:
            'The form owns the ISO value while the component localizes all visible labels.',
          code: `<ui-date-picker
  label="Release date"
  [formControl]="releaseDate"
  min="2026-01-01"
  max="2027-12-31"
  [disabledDates]="releaseBlackouts"
  clearable
/>`,
        },
        {
          title: 'Monday-first localized calendar',
          description:
            'Locale and week start are independent so regional product policy stays explicit.',
          code: `<ui-date-picker
  label="Invoice date"
  locale="en-GB"
  [firstDayOfWeek]="1"
  [formControl]="invoiceDate"
/>`,
        },
      ],
      accessibility: [
        'The readonly trigger exposes dialog popup state and stable controls, description, required, and invalid relationships.',
        'The named dialog contains a labelled grid, localized column headers, full-date day names, selected/current states, and native disabled controls.',
        'Only the active day is tabbable; month changes are announced politely and selecting or escaping restores trigger focus.',
      ],
      keyboard: [
        'Arrow keys move by day or week while skipping disabled dates; Home and End move within the active week.',
        'Page Up and Page Down move by month, Shift modifies them to years, and Enter or Space selects.',
        'Escape closes and restores trigger focus; Tab follows the dialog controls without trapping focus.',
      ],
      forms: [
        'ControlValueAccessor reads and writes an ISO date string or the empty string, avoiding implicit timezone conversion.',
        'Use Angular validators for required and business rules, then map validation state to errorText.',
      ],
      edgeCases: [
        'Invalid external values render empty instead of guessing a date format.',
        'Min, max, and disabledDates apply to pointer, keyboard, today, and month navigation paths.',
        'The calendar is locally positioned below the trigger; avoid overflow-clipped ancestors.',
      ],
      testing: [
        'Use UiDatePickerHarness to read display/month state, open/close, enumerate visible dates, navigate months, select or clear, and inspect date/field disabled state.',
        'Test ISO form integration, locale/week start, leap years, month boundaries, min/max, blackouts, all keyboard commands, clearing, today, outside days, focus return, and localization.',
      ],
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
        'Provide ariaLabel when visible label text is omitted; visible labels remain the accessible name when present.',
      ],
      keyboard: ['Uses native select keyboard behavior for the current browser and platform.'],
      forms: [
        'Implements ControlValueAccessor for string values.',
        'Disabled state stays synced with Angular forms and the disabled input.',
        'Reactive form value and disabled-state updates are synchronized under OnPush change detection.',
      ],
      edgeCases: [
        'Use disabled options for unavailable choices.',
        'Use required with placeholder to force a real selection.',
        'Use unique string values for every option because values identify rendering and form state.',
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
        'Defaults to polite status semantics; danger uses the assertive alert role unless ariaRole overrides it.',
        'The icon-only dismiss action has a localizable accessible name and a decorative SVG icon.',
      ],
      keyboard: [
        'The native dismiss button is reachable with Tab and activates with Enter or Space.',
      ],
      forms: ['Use alerts near forms to summarize submission or validation status.'],
      edgeCases: [
        'Use concise title text; long remediation copy belongs in the body.',
        'Use ariaRole deliberately: reserve alert for urgent content that must interrupt current assistive-technology output.',
      ],
      testing: [
        'Assert roles, all variants, openChange, dismissed output, and reopening behavior.',
        'Use UiAlertHarness to locate an alert by title, read its role and visibility, or dismiss it through public behavior.',
      ],
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
        'Provide ariaLabel when the group does not render a visible label/legend.',
      ],
      keyboard: [
        'Arrow keys move between radios in native browser behavior.',
        'Space selects the focused option.',
      ],
      forms: [
        'Implements ControlValueAccessor for string values.',
        'Disabled state can apply to the full group or individual options.',
        'Reactive form value and disabled-state updates are synchronized under OnPush change detection.',
      ],
      edgeCases: [
        'Avoid radio groups with too many options; use Select for long lists.',
        'Use horizontal orientation only when labels are short and wrapping will not harm scanning.',
        'Option values must be unique because they identify selection and rendering state.',
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
      accessibility: [
        'Uses role="switch" on a native checkbox pattern and exposes checked state.',
        'The wrapping label provides the accessible name; provide ariaLabel only when visible label text is omitted.',
        'Helper text is associated with the native switch through aria-describedby.',
      ],
      keyboard: ['Space toggles the switch.', 'Tab moves focus to the switch.'],
      forms: [
        'Implements ControlValueAccessor for boolean values.',
        'setDisabledState disables the underlying control when Angular forms disable it.',
        'Reactive form value and disabled-state updates are synchronized under OnPush change detection.',
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
      accessibility: [
        'Labels use the native textarea id, and helper, error, and counter text are included in aria-describedby.',
        'Invalid states set aria-invalid and announce visible error text with role="alert".',
      ],
      keyboard: [
        'Uses native textarea behavior including multiline typing, Tab focus, and Shift+Tab navigation.',
      ],
      forms: [
        'Implements ControlValueAccessor for string values.',
        'writeValue updates text without emitting valueChange, and blur marks the control touched.',
      ],
      edgeCases: [
        'Use resize="none" only when layout requires fixed height.',
        'Use hideCounter when maxLength is set but a separate product counter is already present.',
        'Dark-mode classes are built into the textarea, label, helper text, error text, and counter styles.',
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
        {
          title: 'Visual variants',
          description:
            'Choose segmented for general navigation, underline for content sections, or pills for compact filters.',
          code: `<ui-tabs variant="segmented" [tabs]="tabs" [(active)]="activeTab">
  Segmented panel
</ui-tabs>

<ui-tabs variant="underline" [tabs]="tabs" [(active)]="activeTab">
  Underline panel
</ui-tabs>

<ui-tabs variant="pills" [tabs]="tabs" [(active)]="activeTab">
  Pills panel
</ui-tabs>`,
        },
      ],
      accessibility: [
        'Uses tablist, tab, and tabpanel roles with generated ARIA relationships.',
        'Exactly one enabled tab participates in the roving tab stop, including when active is empty or invalid.',
      ],
      keyboard: [
        'ArrowLeft and ArrowRight move between enabled horizontal tabs; ArrowUp and ArrowDown do the same for vertical tabs.',
        'Home and End jump to first and last tabs.',
        'Keyboard navigation moves focus and activates the destination tab automatically.',
      ],
      forms: ['Tabs do not integrate with forms directly.'],
      edgeCases: [
        'Disabled tabs are skipped during keyboard navigation.',
        'Tab values must be unique, stable identifiers; keep localized copy in labels.',
        'Long localized tab lists scroll within their own maximum width instead of widening the page.',
        'All variants support horizontal and vertical orientations; underline uses the matching axis indicator.',
        'Do not hide critical errors inside inactive tabs without summary messaging.',
      ],
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
        'Generated instance IDs prevent collisions and headingLevel fits triggers into the surrounding page outline.',
      ],
      keyboard: ['Triggers are native buttons, so Enter and Space toggle the section.'],
      forms: [
        'Accordion does not integrate with forms, but can contain form controls in panel content.',
      ],
      edgeCases: [
        'Disabled items remain visible but cannot be expanded.',
        'Parent state must update active after activeChange.',
        'Item values must be unique and stable because they drive controlled state, rendering, and ARIA IDs.',
      ],
      testing: [
        'Assert activeChange, single vs multiple mode, disabled items, unique IDs, heading levels, ARIA wiring, and harness interaction.',
      ],
    },
  ],
  [
    'file-upload',
    {
      overview: [
        'File Upload validates browser File objects and emits immutable state requests while leaving storage, retries, cancellation, and network policy with the application.',
        'Selection and drag/drop share the same type, size, count, total-size, and duplicate validation pipeline.',
      ],
      whenToUse: [
        'Use for attachments, media, imports, and other workflows where users choose local files.',
        'Use a plain native file input when validation, progress, and managed file lists are unnecessary.',
      ],
      examples: [
        {
          title: 'Validated controlled upload',
          description:
            'The application owns accepted files and performs uploads only after an explicit request.',
          code: `<ui-file-upload
  [files]="files()"
  (filesChange)="files.set($event)"
  (rejected)="showRejections($event)"
  (uploadRequested)="upload($event)"
  [progress]="progressByFile()"
  accept="image/*,.pdf"
  [maxFiles]="5"
  [maxFileSize]="5000000"
  [maxTotalSize]="15000000"
  ariaLabel="Project attachments"
/>`,
        },
      ],
      accessibility: [
        'The visually hidden native input remains labeled; choose, clear, upload, and remove actions are native buttons.',
        'Accepted files use a named list, progress uses progressbar semantics, and validation failures use role alert.',
        'Visible helper text should describe accepted formats and limits before users choose files.',
      ],
      keyboard: [
        'All actions use native Tab, Enter, and Space behavior with visible keyboard focus.',
        'Drag and drop is an enhancement; every workflow remains available through the choose-files button.',
      ],
      forms: [
        'File Upload is controlled application state and intentionally does not serialize File objects through ControlValueAccessor.',
      ],
      edgeCases: [
        'accept is advisory at the browser picker and is validated again before filesChange.',
        'Duplicate identity uses name, size, and lastModified; zero limits mean unlimited.',
        'autoUpload only emits uploadRequested and never starts a network request.',
        'Progress keys use name:size:lastModified and values are clamped from zero through one hundred.',
      ],
      testing: [
        'Assert type/size/count/total/duplicate rejection, immutable controlled changes, auto/manual requests, progress, disabled behavior, localization, and UiFileUploadHarness actions.',
      ],
    },
  ],
  [
    'command-palette',
    {
      overview: [
        'Command Palette is a controlled modal command surface with local filtering across labels, descriptions, and keywords.',
        'It groups results without changing command identity and emits selection intent while application code owns routing, mutation, and async work.',
      ],
      whenToUse: [
        'Use for expert-friendly navigation and actions spanning several application areas.',
        'Use Menu for actions anchored to a specific trigger and Combobox when the selected value belongs to a form.',
      ],
      examples: [
        {
          title: 'Controlled workspace commands',
          description:
            'The trigger, query, result, and business action remain explicit application state.',
          code: `<button type="button" (click)="open.set(true)">
  Search commands
</button>

<ui-command-palette
  [commands]="commands"
  [open]="open()"
  (openChange)="open.set($event)"
  [query]="query()"
  (queryChange)="query.set($event)"
  (commandSelected)="execute($event.command)"
  ariaLabel="Workspace commands"
/>`,
        },
      ],
      accessibility: [
        'The open surface is an aria-modal dialog containing a named combobox and listbox with active-descendant wiring.',
        'Disabled commands remain discoverable but cannot become active or emit selection.',
        'Focus moves to search on open, stays trapped in the dialog, and returns to the previously focused control after controlled closure.',
      ],
      keyboard: [
        'Ctrl+K or Command+K requests opening unless disabled or shortcutEnabled is false.',
        'Arrow Up/Down wraps through enabled results; Home/End moves to the first or last result.',
        'Enter selects the active command, Escape follows dismissal policy, and Tab remains inside the modal.',
      ],
      forms: [
        'Command Palette is an application command surface, not a form value, so it intentionally does not implement ControlValueAccessor.',
      ],
      edgeCases: [
        'Command values must be unique and stable because they drive active identity and DOM IDs.',
        'Controlled consumers must update open and query after their corresponding change events.',
        'The component filters local commands; remote search can supply a filtered commands collection with loading state.',
        'Global shortcut handling ignores Alt-modified input and can be disabled for conflicting application shortcuts.',
      ],
      testing: [
        'Assert global invocation, controlled query updates, grouped filtering, disabled commands, active wrapping, selection source, dismissal policy, focus trap/restore, localization, and UiCommandPaletteHarness behavior.',
      ],
    },
  ],
  [
    'overlay',
    {
      overview: [
        'Advanced Overlay is an optional Angular CDK integration for connected content that needs more placement, scrolling, backdrop, and lifecycle control than Popover.',
        'The origin and content remain declarative while open state and every consequential dismissal stay consumer-controlled.',
      ],
      whenToUse: [
        'Use for custom pickers, inspectors, contextual panels, and application-specific floating surfaces.',
        'Use Tooltip, Menu, Popover, Modal, or Command Palette when one of their stronger semantic contracts already fits.',
      ],
      examples: [
        {
          title: 'Connected release panel',
          description:
            'Ordered placements and repositioning keep the panel visible without embedding CDK behavior in basic components.',
          code: `<ui-overlay
  [open]="open()"
  (openChange)="open.set($event)"
  [placements]="['bottom', 'top']"
  alignment="center"
  [gap]="8"
  scrollStrategy="reposition"
  initialFocus="first"
  ariaLabel="Release actions"
>
  <button uiOverlayTrigger type="button">Open actions</button>
  <div uiOverlayContent>
    <button type="button">Run release check</button>
  </div>
</ui-overlay>`,
        },
      ],
      accessibility: [
        'The trigger receives aria-haspopup, aria-expanded, and aria-controls based on controlled state and the selected panel role.',
        'Consumers must choose a role that matches projected semantics and provide ariaLabel when content has no internal labelling relationship.',
        'Initial focus is opt-in; restoration returns users to the element active when the overlay attached.',
      ],
      keyboard: [
        'Enter, Space, or Arrow Down requests opening from the trigger; native trigger behavior remains available.',
        'Escape always emits escapeKeyDown and follows closeOnEscape policy.',
        'Projected interactive content owns its internal keyboard model; use established Menu or Listbox components for those semantics.',
      ],
      forms: [
        'Overlay is a positioning and lifecycle primitive, not a value accessor; forms inside projected content retain their own controls.',
      ],
      edgeCases: [
        'Placement order is meaningful; an empty list falls back to bottom, top, right, and left.',
        'The CDK close scroll strategy can detach independently and synchronizes controlled open state through openChange.',
        'Backdrop and outside events emit before policy requests closure, allowing analytics or guarded state handling.',
        'Importing this entry point opts into Angular CDK Overlay; basic Popover, Menu, and Tooltip bundles remain unchanged.',
      ],
      testing: [
        'Assert fallback position reporting, scroll strategy choice, controlled trigger state, outside/backdrop/Escape policy, focus entry/restore, navigation disposal, localization, and UiOverlayHarness toggling.',
      ],
    },
  ],
  [
    'confirmation',
    {
      overview: [
        'Confirmation Workflows pair a root-provided queue service with one application-shell dialog so callers receive explicit Promise results instead of coordinating modal flags.',
        'Every result includes confirmed state, a machine-readable reason, and the immutable request; no destructive application work runs inside the component.',
      ],
      whenToUse: [
        'Use when an action needs deliberate acknowledgement before irreversible, expensive, or security-sensitive work.',
        'Do not confirm routine reversible actions; prefer immediate execution with Undo feedback.',
      ],
      examples: [
        {
          title: 'Guarded destructive action',
          description:
            'Exact-text verification and a danger intent add friction only where the risk justifies it.',
          code: `// application-shell.component.html
<ui-confirmation-dialog />

// feature.component.ts
const result = await this.confirmations.confirm({
  title: 'Delete workspace?',
  message: 'All projects and deployment history will be removed.',
  confirmLabel: 'Delete workspace',
  intent: 'danger',
  requireText: 'DELETE',
  requireTextLabel: 'Type DELETE to continue',
});

if (result.confirmed) {
  await this.workspaceApi.delete();
}`,
        },
      ],
      accessibility: [
        'The active request uses alertdialog, aria-modal, unique title/description relationships, scroll lock, and a real Tab focus trap.',
        'Focus defaults to Cancel for unguarded requests and the exact-text field for guarded requests; confirmation is never the initial focus.',
        'Focus returns to the element active before the queue opened after the last request closes.',
      ],
      keyboard: [
        'Tab and Shift+Tab stay within the active alertdialog.',
        'Escape always emits escapeKeyDown and cancels unless closeOnEscape is false for that request.',
        'Buttons and the optional text field retain native Enter, Space, editing, and focus behavior.',
      ],
      forms: [
        'The exact-text field is transient dialog state, not an application form value, and resets for every queued request.',
      ],
      edgeCases: [
        'Mount exactly one UiConfirmationDialogComponent near the application shell; destroying it resolves every pending Promise with reason destroyed.',
        'Concurrent requests are processed FIFO and pendingCount exposes queued work.',
        'Backdrop cancellation is off by default and must be enabled per request; Escape cancellation is on by default.',
        'Callers must await the Promise and perform business work only when confirmed is true.',
      ],
      testing: [
        'Assert FIFO ordering, every result reason, exact-text equality, safe initial focus, trap/restore, scroll cleanup, per-request dismissal policy, destruction cleanup, localization, and UiConfirmationDialogHarness actions.',
      ],
    },
  ],
  [
    'tree-table',
    {
      overview: [
        'Tree Table combines stable Table column contracts with the Tree flattened hierarchy model in an independently importable treegrid.',
        'Expansion, selection, sorting, and data remain controlled so server-backed consumers can coordinate one immutable state source.',
      ],
      whenToUse: [
        'Use for hierarchical records that must also be compared across consistent columns.',
        'Use Tree for navigation-only hierarchies and Table for flat datasets.',
      ],
      examples: [
        {
          title: 'Controlled package treegrid',
          description: 'Hierarchy and sorting requests remain parent-owned.',
          code: `<ui-tree-table
  [columns]="columns"
  [nodes]="packages()"
  [expanded]="expanded()"
  (expandedChange)="expanded.set($event)"
  [selected]="selected()"
  (selectedChange)="selected.set($event)"
  [sort]="sort()"
  (sortChange)="loadSorted($event)"
  caption="Package inventory"
/>`,
        },
      ],
      accessibility: [
        'Uses native table structure enhanced with treegrid, row, columnheader, and gridcell roles.',
        'Hierarchical rows expose aria-level, aria-expanded, aria-selected, and aria-disabled.',
        'Sortable headers use native buttons and aria-sort; expansion controls have localized labels.',
      ],
      keyboard: [
        'Arrow Up/Down, Home, and End move roving row focus.',
        'Arrow Right expands; Arrow Left collapses or returns to the parent row.',
        'Enter and Space activate the focused row; header and expansion buttons retain native behavior.',
      ],
      forms: [
        'Tree Table does not own form state; place row actions in application-managed workflows.',
      ],
      edgeCases: [
        'expanded, selected, and sort are controlled and require parent updates after change events.',
        'Node values must be globally unique; every data key should match a column key.',
        'Loading takes precedence over error and empty, with dynamic valid column spans.',
      ],
      testing: [
        'Assert treegrid semantics, hierarchy metadata, controlled expansion/selection/sort, parent focus, async states, disabled rows, localization, and UiTreeTableHarness behavior.',
      ],
    },
  ],
  [
    'tree',
    {
      overview: [
        'Tree turns nested data into a flattened visible-node model with explicit hierarchy metadata and stable controlled state.',
        'Only one tree item is tabbable; Arrow keys, Home, End, parent/child navigation, activation, and character typeahead follow the standard tree interaction model.',
      ],
      whenToUse: [
        'Use for file explorers, nested navigation, taxonomies, and other parent/child structures.',
        'Use Accordion for independent disclosure content and Menu for short command lists.',
      ],
      examples: [
        {
          title: 'Controlled project tree',
          description: 'Expansion and selection remain parent-owned and immutable.',
          code: `<ui-tree
  [nodes]="projectNodes"
  [expanded]="expanded()"
  (expandedChange)="expanded.set($event)"
  [selected]="selected()"
  (selectedChange)="selected.set($event)"
  (nodeActivated)="openNode($event)"
  ariaLabel="Project files"
/>`,
        },
      ],
      accessibility: [
        'Uses tree/treeitem roles with aria-level, aria-posinset, aria-setsize, aria-expanded, aria-selected, and aria-disabled.',
        'Provide a specific ariaLabel and unique stable node values.',
        'Disabled nodes remain discoverable but cannot expand, select, or activate.',
      ],
      keyboard: [
        'Arrow Down/Up moves visible focus; Home/End moves to the first/last visible node.',
        'Arrow Right expands a closed branch or enters its first child; Arrow Left collapses or returns to the parent.',
        'Enter and Space activate; a printable character moves to the next visible label with that initial.',
      ],
      forms: ['Tree does not integrate with forms; store selected values in application state.'],
      edgeCases: [
        'expanded and selected are controlled; update them after their change events.',
        'Node values must be globally unique and stable across immutable updates.',
        'Collapsed descendants leave the DOM and the accessibility tree.',
      ],
      testing: [
        'Assert hierarchy metadata, controlled expansion/selection, disabled behavior, complete keyboard navigation, typeahead, focus visibility, localization, and UiTreeHarness interaction.',
      ],
    },
  ],
  [
    'data-view',
    {
      overview: [
        'Data View presents the same records as responsive cards or a vertical list without coupling data ownership to rendering.',
        'Typed item context exposes layout and absolute position so one template can adapt while stable tracking preserves DOM identity.',
      ],
      whenToUse: [
        'Use for catalogs, search results, media collections, and records that are easier to scan as cards than strict columns.',
        'Use Table when column alignment and native tabular relationships are essential.',
      ],
      examples: [
        {
          title: 'Controlled catalog layout',
          description:
            'The toggle emits a request and retains its pressed state until parent state updates.',
          code: `<ui-data-view
  [items]="products()"
  [layout]="layout()"
  (layoutChange)="layout.set($event)"
  [trackBy]="trackProduct"
  showLayoutToggle
  ariaLabel="Product results"
>
  <ng-template uiDataViewItem let-product let-layout="layout">
    <app-product-card [product]="product" [compact]="layout === 'list'" />
  </ng-template>
</ui-data-view>`,
        },
        {
          title: 'Async states',
          description: 'State precedence is loading, error, empty, then populated records.',
          code: `<ui-data-view
  [items]="results()"
  [loading]="loading()"
  [error]="requestFailed()"
  loadingText="Loading products..."
  errorText="Products could not be loaded."
  emptyText="No products match these filters."
/>`,
        },
      ],
      accessibility: [
        'The named section contains list/listitem semantics independent of grid or list visual layout.',
        'The optional layout group uses native buttons and aria-pressed; async states use status or alert semantics.',
        'Keep meaningful headings, links, and actions inside the item template.',
      ],
      keyboard: [
        'Layout buttons use native Tab, Enter, and Space behavior with visible keyboard focus.',
        'Interactive content inside each item retains its own native keyboard order.',
      ],
      forms: [
        'Keep form ownership in the parent and key form state by stable record identity when layouts change.',
      ],
      edgeCases: [
        'layout is controlled; update it after layoutChange to update the pressed state and template context.',
        'Use trackBy for immutable refreshes and records that can reorder.',
        'Loading takes precedence over error so stale failure messages are not announced during retry.',
      ],
      testing: [
        'Assert typed context, responsive layout classes, stable tracking, controlled layout requests, async-state precedence, semantics, localization, and UiDataViewHarness behavior.',
      ],
    },
  ],
  [
    'table',
    {
      overview: [
        'Table displays record data with typed composition, controlled sorting, single or multiple selection, sticky regions, compact pagination, and explicit loading, error, and empty states.',
        'UiTableStateController is independently importable from @ngnova/ui/table-state for headless sort, immutable selection, and pagination orchestration.',
      ],
      whenToUse: ['Use for structured datasets where users compare rows and columns.'],
      examples: [
        {
          title: 'Controlled selection and pagination',
          description:
            'Selection, sorting, and page requests are immutable controlled events; parent code owns data and server requests.',
          code: `<ui-table
  [columns]="columns"
  [rows]="components"
  rowKey="id"
  selectionMode="multiple"
  [selectedKeys]="selectedKeys()"
  (selectedKeysChange)="selectedKeys.set($event)"
  [page]="page()"
  [pageSize]="25"
  [totalItems]="totalItems()"
  (pageChange)="loadPage($event)"
  (rowSelected)="openComponent($event)"
  (sortChange)="sortComponents($event)"
/>`,
        },
        {
          title: 'Composed cells and headless state',
          description:
            'Optional templates own rich rendering while a separate state controller coordinates data requests without inflating the basic table entry point.',
          code: `import { createUiTableState } from '@ngnova/ui/table-state';

readonly tableState = createUiTableState({ pageSize: 25 });

<ui-table
  [columns]="columns"
  [rows]="rows"
  [sort]="tableState.sort()"
  (sortChange)="tableState.setSort($event)"
>
  <ng-template uiTableHeader="status" let-column>
    {{ column.header }} signal
  </ng-template>
  <ng-template uiTableCell="status" let-value let-row="row" let-rowIndex="rowIndex">
    <app-status [value]="value" [record]="row" [position]="rowIndex" />
  </ng-template>
</ui-table>`,
        },
        {
          title: 'Loading, error, and empty states',
          description:
            'State precedence is deterministic: loading, then error, then empty, then rows.',
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
/>

<ui-table
  [columns]="columns"
  [rows]="[]"
  error
  errorText="Components could not be loaded. Try again."
/>`,
        },
      ],
      accessibility: [
        'Uses semantic table, thead, tbody, th, and td elements.',
        'Sortable headers use native buttons.',
        'Provide caption for the table accessible name; loading and empty messages use status semantics while failures use role alert.',
        'Single and multiple selection use native radio and checkbox controls with localized names and aria-selected row state.',
        'Pagination is exposed as a named navigation landmark with a live visible-range summary.',
      ],
      keyboard: [
        'Sortable header buttons are reachable by Tab and activated with Enter or Space.',
        'Selectable rows enter the Tab order and emit selection from Enter or Space as well as pointer clicks.',
        'Selection controls and pagination actions retain native checkbox, radio, and button keyboard behavior.',
      ],
      forms: [
        'Table does not integrate with forms directly; place controls inside uiTableCell templates and keep form ownership in the parent.',
      ],
      edgeCases: [
        'Loading and empty states span at least one column and mark the table busy only while loading.',
        'Use rowKey for data that can reorder so DOM identity remains stable.',
        'Rows are not internally reordered; sortChange lets the parent own data while sort controls the indicator.',
        'Template keys that do not match a column are ignored and unmatched columns retain their safe text fallback.',
        'Use UiTableStateController.reconcileSelection when server pages or filters invalidate selected keys.',
        'Rows without a string or numeric rowKey value remain visible but their selection control is disabled.',
        'The compact pagination footer emits bounded requests and never slices rows; server or parent state owns the page data.',
      ],
      testing: [
        'Assert captions, rows, loading/error/empty precedence, controlled and internal selection, bulk selection, bounded pagination, sticky classes, sorting, composed contexts, stable keys, headless snapshots, and harness interaction.',
      ],
    },
  ],
  [
    'table-virtual-scroll',
    {
      overview: [
        'Table Virtual Scroll is the opt-in Angular CDK integration for fixed-height records at scales where rendering every row would be wasteful.',
        'It is isolated from @ngnova/ui/table so CDK scrolling code never inflates the basic semantic Table bundle.',
      ],
      whenToUse: [
        'Use for thousands of uniform-height rows when paging alone does not match the interaction.',
        'Prefer the semantic Table for small datasets, variable-height content, and native column relationships.',
      ],
      examples: [
        {
          title: 'Ten-thousand-row viewport',
          description:
            'Only the visible range and buffers are mounted; the row template receives its absolute dataset index.',
          code: `<ui-table-virtual-scroll
  [rows]="records"
  [itemSize]="52"
  [minBufferPx]="208"
  [maxBufferPx]="416"
  height="28rem"
  ariaLabel="Audit records"
>
  <ng-template uiTableVirtualRow let-row let-index="index">
    <app-audit-row [record]="row" [position]="index + 1" />
  </ng-template>
</ui-table-virtual-scroll>`,
        },
        {
          title: 'Stable identity and imperative navigation',
          description:
            'Provide stable identity for immutable refreshes and use the public viewport methods only for explicit navigation or layout changes.',
          code: `readonly trackRecord = (_index: number, record: AuditRecord) => record.id;
readonly viewport = viewChild.required(UiTableVirtualScrollComponent);

this.viewport().scrollToIndex(5_000, 'smooth');
this.viewport().checkViewportSize();

<ui-table-virtual-scroll [rows]="records()" [trackBy]="trackRecord">
  <ng-template uiTableVirtualRow let-row>{{ row.title }}</ng-template>
</ui-table-virtual-scroll>`,
        },
      ],
      accessibility: [
        'The focusable viewport is a named rowgroup with total aria-rowcount and each mounted item uses row plus its absolute aria-rowindex.',
        'Virtualization removes off-screen rows from the accessibility tree; offer filtering, search, or pagination when users must navigate the entire dataset predictably.',
        'loading sets aria-busy without removing the currently rendered context.',
      ],
      keyboard: [
        'The viewport is keyboard focusable and uses native scrolling keys; interactive controls inside row templates retain their own native keyboard behavior.',
      ],
      forms: [
        'Keep form state outside recycled row views and identify controls by stable record keys rather than rendered position.',
      ],
      edgeCases: [
        'All rows must have the configured fixed itemSize; variable-height rows require a different strategy.',
        'Call checkViewportSize after an initially hidden container becomes visible or changes dimensions.',
        'Use trackBy for immutable refreshes and never treat rendered DOM position as record identity.',
        'The 10,000-row performance test asserts that the DOM remains bounded below the full dataset size.',
      ],
      testing: [
        'Assert total row count semantics, bounded rendered DOM, normalized buffers, typed template compilation, busy state, stable tracking, and explicit scroll navigation.',
      ],
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
          description:
            'Render one viewport near the app root, configure its minimum edge offset, and push messages from features.',
          code: `<ui-toast position="top-right" viewportOffset="1rem" />

private readonly toast = inject(UiToastService);

save(): void {
  this.toast.success('Saved', 'Your changes are ready.');
  this.toast.warning('Session ending', 'Save your work now.', 8000);
}`,
        },
      ],
      accessibility: [
        'Viewport uses aria-live="polite" so new notifications are announced without interrupting users.',
        'Danger messages use alert semantics; other variants use atomic status semantics.',
        'Messages persist until dismissed unless the caller explicitly supplies a positive duration.',
        'Viewport spacing uses the larger of viewportOffset and the active device safe-area inset on each screen edge.',
      ],
      keyboard: ['Dismiss buttons are keyboard reachable.'],
      forms: [
        'Use Toast for non-blocking form success feedback; keep validation errors near fields.',
      ],
      edgeCases: [
        'Clear messages on route changes if stale notifications would confuse users.',
        'Showing the same explicit ID replaces the prior message and resets its dismissal timer.',
        'The viewport renders only the newest maxMessages while the service retains older messages until dismissed or cleared.',
        'Localize dismissAriaLabel when the application language is not English.',
        'Pass viewportOffset as a valid CSS length such as 1rem, 24px, or var(--app-shell-gap).',
      ],
      testing: [
        'Assert service helpers, ID replacement, timed dismissal, dismiss/clear, rendered roles, message cap, placement, offsets, safe-area classes, and harness dismissal.',
      ],
    },
  ],
  [
    'breadcrumb',
    {
      overview: [
        'Breadcrumb communicates the current location within a product hierarchy and provides direct navigation to ancestor levels.',
        'It uses a named navigation landmark, an ordered list, and aria-current on the active location.',
      ],
      whenToUse: [
        'Use in products with two or more stable hierarchy levels where users benefit from moving back to an ancestor.',
        'Do not use as a substitute for browser history or a step-by-step progress indicator.',
      ],
      examples: [
        {
          title: 'Responsive hierarchy',
          description:
            'Keep the first location and nearest ancestors visible while collapsing a long middle hierarchy.',
          code: `<ui-breadcrumb
  [items]="breadcrumbItems"
  [maxItems]="4"
  ariaLabel="Documentation location"
  (itemSelected)="trackNavigation($event)"
/>`,
        },
      ],
      accessibility: [
        'The component renders a named nav landmark containing an ordered list.',
        'Exactly one resolved item receives aria-current="page"; the final item is current when no item explicitly opts in.',
        'Chevron separators and the collapsed ellipsis are decorative and hidden from assistive technology.',
      ],
      keyboard: [
        'Linked ancestors use native anchor behavior and remain reachable in document order.',
        'The current location is text rather than an inactive link, avoiding a misleading keyboard stop.',
      ],
      forms: [
        'Breadcrumb is navigation rather than form state; derive items from the active route or application hierarchy.',
      ],
      edgeCases: [
        'maxItems values below three do not collapse because first, ellipsis, and current entries must remain visible.',
        'Long labels truncate visually while their complete accessible text remains in the document.',
        'Use itemSelected for analytics or client-side routing interception without removing the real href.',
      ],
      testing: [
        'Use UiBreadcrumbHarness to read the hierarchy, identify the current item, detect collapse, and follow linked ancestors.',
        'Test complete, collapsed, explicit-current, long-label, single-item, and empty hierarchies.',
      ],
    },
  ],
  [
    'stepper',
    {
      overview: [
        'Stepper communicates progress through a finite multi-step workflow while the parent owns active step and validation.',
        'Complete, current, error, upcoming, optional, and disabled states remain explicit and independently testable.',
      ],
      whenToUse: [
        'Use for workflows with meaningful ordered stages, such as onboarding, checkout, publishing, or account setup.',
        'Use Tabs for peer content sections and Progress Bar when individual stages do not need labels or navigation.',
      ],
      examples: [
        {
          title: 'Controlled release workflow',
          description:
            'The parent validates the active panel and advances it; the header can provide direct or backward-only navigation.',
          code: `<ui-stepper
  [steps]="releaseSteps"
  [(active)]="activeStep"
  [linear]="true"
  ariaLabel="Release workflow"
>
  <app-release-step [step]="activeStep" />
</ui-stepper>`,
        },
        {
          title: 'Vertical compact workflow',
          description: 'Vertical orientation keeps descriptions readable in narrow layouts.',
          code: `<ui-stepper
  orientation="vertical"
  [steps]="onboardingSteps"
  [(active)]="activeStep"
/>`,
        },
      ],
      accessibility: [
        'A named nav landmark and ordered list communicate the workflow structure without assigning tab semantics.',
        'The active item uses aria-current="step" and labels the projected content region through stable IDs.',
        'Status is exposed through text and structure rather than color alone; selectable steps receive contextual accessible names.',
      ],
      keyboard: [
        'Selectable steps use native buttons and follow normal Tab and activation behavior.',
        'Linear mode removes future steps from the tab sequence while preserving their visible progress information.',
      ],
      forms: [
        'Keep form values and validation in the parent; update active only after the current step passes validation.',
        'Mark invalid completed stages with error and move focus to the first invalid field when users return.',
      ],
      edgeCases: [
        'An empty collection renders projected content without an incorrectly named region.',
        'An invalid or disabled active value resolves to the first enabled step without mutating the input.',
        'Horizontal layouts scroll locally when labels cannot fit; use vertical orientation when descriptions are long.',
      ],
      testing: [
        'Use UiStepperHarness to inspect labels, states, current step, orientation, projected panel, and selectable navigation.',
        'Test controlled selection, linear restrictions, fallback active values, disabled steps, errors, optional steps, both orientations, and empty state.',
      ],
    },
  ],
  [
    'paginator',
    {
      overview: [
        'Paginator navigates a known-size collection with controlled one-based page and page-size state.',
        'It limits numbered controls with deterministic ellipses so large collections remain compact.',
      ],
      whenToUse: [
        'Use for server-side or client-side collections where users need stable pages and range context.',
        'Use infinite scrolling only when item position and return navigation are unimportant.',
      ],
      examples: [
        {
          title: 'Controlled pagination',
          description: 'The parent owns page, page size, fetching, and URL synchronization.',
          code: `<ui-paginator
  [(page)]="page"
  [(pageSize)]="pageSize"
  [totalItems]="total"
  [pageSizeOptions]="[10, 25, 50]"
/>`,
        },
      ],
      accessibility: [
        'The component exposes a named navigation landmark, aria-current on the active page, named icon controls, and a polite live range.',
        'Unavailable navigation and the global disabled state use native disabled controls.',
      ],
      keyboard: [
        'All controls follow native button and select keyboard behavior.',
        'Tab order follows page-size, first, previous, numbered, next, and last controls without custom trapping.',
      ],
      forms: [
        'Paginator is controlled UI state rather than a form value; synchronize page and pageSize with data fetching or router query parameters.',
      ],
      edgeCases: [
        'Page, page size, total count, and sibling count are normalized without mutating consumer inputs.',
        'Empty collections announce the localized zero range and still expose one disabled current page.',
        'Provide getRangeLabel and getPageAriaLabel for full localization rather than parsing display text.',
      ],
      testing: [
        'Use UiPaginatorHarness to inspect current page and range, navigate forward or to a visible page, and select page size.',
        'Test first, middle, last, empty, invalid, disabled, localized, small-page-count, and ellipsis states.',
      ],
    },
  ],
  [
    'chip',
    {
      overview: [
        'Chip represents a compact value such as a filter, category, or selected entity, with optional selection and removal actions.',
        'It differs from Tag by supporting user interaction and controlled selected state.',
      ],
      whenToUse: [
        'Use for applied filters, multi-select values, or compact entities users can toggle or remove.',
        'Use Tag for read-only classification and Button for a standalone action.',
      ],
      examples: [
        {
          title: 'Selectable and removable filters',
          description:
            'Selection and removal remain separate native buttons with distinct semantics.',
          code: `<ui-chip selectable [(selected)]="selected">Angular</ui-chip>
<ui-chip removable removeAriaLabel="Remove TypeScript filter" (removed)="removeFilter()">
  TypeScript
</ui-chip>`,
        },
      ],
      accessibility: [
        'Selectable chips use a native button and aria-pressed; removable chips expose a separate named button.',
        'Use a specific localized removeAriaLabel that includes the value when several removable chips are present.',
        'Disabled state applies to every interactive control in the chip.',
      ],
      keyboard: [
        'Tab reaches selection and removal controls independently.',
        'Enter and Space use native button behavior for toggle and removal.',
      ],
      forms: [
        'Chip uses controlled state rather than ControlValueAccessor; a multi-value form control should own the chip collection.',
      ],
      edgeCases: [
        'Long projected labels truncate within the available width while removal remains visible.',
        'Removal emits an intent only and never mutates a parent-owned array.',
      ],
      testing: [
        'Use UiChipHarness to locate by text, inspect and toggle selection, and activate removal.',
        'Test every variant and size, disabled behavior, long labels, localized removal names, and parent collection updates.',
      ],
    },
  ],
  [
    'divider',
    {
      overview: [
        'Divider creates restrained visual hierarchy between related regions without introducing another container.',
      ],
      whenToUse: [
        'Use between content groups when spacing alone is insufficient; avoid separators after every list item.',
      ],
      examples: [
        {
          title: 'Section divider',
          description: 'A visible label can introduce a meaningful subsection.',
          code: `<ui-divider label="Advanced" [decorative]="false" />`,
        },
      ],
      accessibility: [
        'Decorative dividers are hidden from assistive technology; meaningful dividers expose separator, orientation, and an optional name.',
      ],
      keyboard: ['Divider is not interactive and does not enter the tab order.'],
      forms: [
        'Use sparingly to group related field sections; prefer fieldset and legend when a semantic form group is required.',
      ],
      edgeCases: [
        'Visible labels are supported only for horizontal dividers; vertical dividers stretch to their flex or grid container.',
      ],
      testing: [
        'Assert decorative versus separator semantics, orientation, label, dark border classes, and all inset modes. No harness is needed for this static component.',
      ],
    },
  ],
  [
    'menu',
    {
      overview: [
        'Menu presents a compact list of contextual actions from a projected trigger with the WAI-ARIA menu keyboard model.',
        'Items can be commands or links and can express disabled, destructive, and separated groups.',
      ],
      whenToUse: [
        'Use when several peer actions would clutter the interface or apply to one nearby object.',
        'Use Select for choosing a form value, Popover for arbitrary interactive content, and visible buttons for primary actions.',
      ],
      examples: [
        {
          title: 'Record actions',
          description: 'A named menu groups common and destructive actions.',
          code: `<ui-menu [items]="actions" ariaLabel="Record actions" (itemSelected)="run($event.item)">
  <button uiMenuTrigger type="button">Actions</button>
</ui-menu>`,
        },
      ],
      accessibility: [
        'The trigger receives aria-haspopup="menu", aria-expanded, and aria-controls; the popup uses role="menu" and role="menuitem".',
        'Disabled commands remain discoverable but cannot receive focus or emit selection.',
        'Danger styling supplements the visible item label and never acts as the only meaning.',
      ],
      keyboard: [
        'ArrowDown or ArrowUp opens from the trigger and focuses the first or last enabled item.',
        'Arrow keys wrap, Home and End jump, printable keys perform buffered typeahead, Escape restores trigger focus, and Tab closes without trapping focus.',
      ],
      forms: [
        'Menu represents commands, not form choice state; use Select, Radio, or Combobox for values.',
      ],
      edgeCases: [
        'Outside pointer interaction dismisses the menu and all document listeners and typeahead timers are cleaned up.',
        'Set closeOnSelect=false only for multi-command workflows where keeping the menu open is clearly useful.',
      ],
      testing: [
        'Use UiMenuHarness to open, enumerate, select, and dismiss actions by visible text.',
        'Test disabled items, separators, links, destructive state, focus order, wrap, typeahead, outside dismissal, and controlled state.',
      ],
    },
  ],
  [
    'drawer',
    {
      overview: [
        'Drawer presents a modal workflow from a viewport edge while keeping the originating page visually recognizable.',
        'The same component supports side sheets and bottom or top sheets through one consistent focus and dismissal contract.',
      ],
      whenToUse: [
        'Use for filters, navigation, compact forms, or supporting tasks that need more room than a Popover.',
        'Use Modal for centered confirmation or composition and persistent page layout for primary always-visible content.',
      ],
      examples: [
        {
          title: 'Filter side panel',
          description:
            'A right-edge drawer keeps a focused filter workflow separate from the results page.',
          code: `<ui-drawer [(open)]="filtersOpen" titleId="filters-title" position="right">
  <span uiDrawerHeader id="filters-title">Filters</span>
  <form><!-- controls --></form>
  <button uiDrawerFooter type="button" (click)="filtersOpen = false">Apply</button>
</ui-drawer>`,
        },
      ],
      accessibility: [
        'The panel uses role="dialog" and aria-modal="true" and requires ariaLabel or a visible titleId.',
        'Focus moves inside after opening, remains trapped while open, and returns to the previous control after close.',
        'Background document scrolling is locked until the last open drawer closes.',
      ],
      keyboard: [
        'Tab and Shift+Tab wrap through enabled focusable controls inside the topmost drawer.',
        'Escape closes only the topmost drawer when closeOnEscape is enabled.',
      ],
      forms: [
        'Use a drawer for multi-control filters or supporting edit forms and keep submit/cancel actions in uiDrawerFooter.',
        'Set button types explicitly to avoid unintended surrounding-form submission.',
      ],
      edgeCases: [
        'Widths and heights remain within the viewport and use public drawer size tokens for brand customization.',
        'Invalid initialFocus selectors safely fall back to the first focusable control or panel.',
        'Nested drawers retain scroll locking and only the topmost instance handles keyboard events.',
      ],
      testing: [
        'Use UiDrawerHarness to inspect title, open state, edge position, and close the panel.',
        'Test focus entry and wrap, focus restoration, accessible naming, configured dismissal, scroll cleanup, every edge, and every size.',
      ],
    },
  ],
  [
    'popover',
    {
      overview: [
        'Popover displays a compact, interactive floating panel anchored to a projected trigger.',
        'It uses the browser top layer when the Popover API is available and retains a fixed-position fallback.',
      ],
      whenToUse: [
        'Use for contextual actions, lightweight settings, or supporting content that includes controls.',
        'Use Tooltip for plain non-interactive descriptions and Modal for blocking tasks that require a focus trap.',
      ],
      examples: [
        {
          title: 'Account actions',
          description:
            'A visible heading labels the non-modal dialog while actions remain keyboard reachable.',
          code: `<ui-popover titleId="account-actions-title">
  <button uiPopoverTrigger type="button">Account</button>
  <div uiPopoverContent>
    <h2 id="account-actions-title">Account actions</h2>
    <button type="button">Profile</button>
    <button type="button">Sign out</button>
  </div>
</ui-popover>`,
        },
      ],
      accessibility: [
        'The panel uses role="dialog" and must receive an accessible name through ariaLabel or a visible titleId.',
        'Triggers receive aria-haspopup="dialog", aria-expanded, and aria-controls automatically.',
        'Popover is non-modal: background content remains available and focus is not trapped.',
      ],
      keyboard: [
        'Enter or Space activates a native button trigger; ArrowDown also opens the panel.',
        'Escape closes the panel when enabled and restores focus to the trigger.',
        'Tab follows the normal document order through interactive panel content.',
      ],
      forms: [
        'Use type="button" on triggers and panel actions unless they intentionally submit a surrounding form.',
        'Two-way bind open when application state needs to control dismissal or coordinate multiple overlays.',
      ],
      edgeCases: [
        'The panel flips at viewport edges, clamps along the cross axis, and repositions on resize and scroll.',
        'Outside and Escape dismissal are independently configurable for workflows that need persistence.',
        'All document and viewport listeners are removed after close and on component destruction.',
      ],
      testing: [
        'Use UiPopoverHarness to open or close the panel and inspect trigger state and projected content.',
        'Test accessible naming, controlled state, outside and Escape dismissal, collision fallback, and focus restoration.',
      ],
    },
  ],
  [
    'tooltip',
    {
      overview: [
        'Tooltip adds a short, non-interactive description to a control without replacing its visible or accessible name.',
      ],
      whenToUse: [
        'Use for concise supplemental context on icon buttons, unfamiliar controls, or truncated labels.',
        'Keep essential instructions and validation messages persistently visible instead of hiding them in a tooltip.',
      ],
      examples: [
        {
          title: 'Icon control description',
          description:
            'The same text appears after hover or keyboard focus and Escape dismisses it.',
          code: `<button
  type="button"
  aria-label="Refresh"
  uiTooltip="Refresh dashboard data"
  tooltipPosition="bottom"
>
  <svg aria-hidden="true"><!-- refresh icon --></svg>
</button>`,
        },
      ],
      accessibility: [
        'The overlay uses role="tooltip" and is added to the trigger aria-describedby list without replacing existing descriptions.',
        'Tooltip content is plain text and non-interactive; it supplements rather than replaces the trigger accessible name.',
        'Empty and disabled tooltips do not create an overlay or ARIA relationship.',
      ],
      keyboard: [
        'Focus opens the tooltip after tooltipShowDelay and focus leaving schedules dismissal.',
        'Escape dismisses an open tooltip immediately without moving focus.',
      ],
      forms: [
        'Tooltip does not own form state; attach it to the focusable control that needs context.',
      ],
      edgeCases: [
        'The preferred position flips to its opposite side near viewport edges and clamps along the cross axis.',
        'The body overlay repositions on window resize or scroll and is removed with all listeners on destroy.',
        'Do not place buttons, links, or other interactive content inside tooltip text.',
      ],
      testing: [
        'Use UiTooltipHarness to focus the trigger, read tooltip text from the document overlay, and dismiss with Escape.',
        'Test delay configuration, aria-describedby preservation, collision fallback, disabled behavior, and destroy cleanup.',
      ],
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
        'Non-decorative spinners expose one polite status label; blank labels safely fall back to Loading.',
        'Decorative spinners are hidden from assistive technology.',
        'Rotation stops when the user prefers reduced motion while the status semantics remain available.',
      ],
      keyboard: ['Spinner has no keyboard interaction.'],
      forms: ['Use inside buttons or near forms while submit work is pending.'],
      edgeCases: [
        'Prefer Progress Bar when actual progress is known.',
        'Use decorative inside a labelled loading button to avoid duplicate status announcements.',
      ],
      testing: [
        'Assert named status behavior, label fallback, all sizes, reduced-motion class, and decorative mode.',
        'No component harness is included because Spinner is non-interactive and exposes no state beyond its directly observable status semantics.',
      ],
    },
  ],
]);

/**
 * A second, focused recipe for components whose primary recipe already covers basic usage.
 * Keeping these scenarios separate makes the audit intentional: every component page teaches
 * both a common product workflow and a materially different state or composition pattern.
 */
const supplementalComponentExamples: Readonly<Record<string, ComponentExample>> = {
  card: {
    title: 'Usage summary',
    description:
      'Compose a compact billing summary with supporting metadata and a clear next action.',
    code: `<ui-card>
  <h3 uiCardHeader>Current usage</h3>
  <p class="text-3xl font-semibold">18,420 <span class="text-sm">requests</span></p>
  <p class="text-sm text-slate-600">82% of the monthly allowance</p>
  <a uiButton uiCardFooter href="/billing" variant="outline">Review billing</a>
</ui-card>`,
  },
  badge: {
    title: 'Unread count',
    description:
      'Add a concise count to a labelled inbox link without replacing its accessible name.',
    code: `<a href="/inbox" class="inline-flex items-center gap-2">
  <span>Inbox</span>
  <ui-badge variant="info" ariaLabel="12 unread messages">12</ui-badge>
</a>`,
  },
  tag: {
    title: 'Release classification',
    description:
      'Use semantic, non-removable tags to classify a release without implying an action.',
    code: `<div class="flex flex-wrap gap-2" aria-label="Release classification">
  <ui-tag variant="success">Stable</ui-tag>
  <ui-tag variant="info">Angular 22</ui-tag>
  <ui-tag variant="warning">Prerelease docs</ui-tag>
</div>`,
  },
  avatar: {
    title: 'Review team',
    description:
      'Label a compact group of contributors while retaining a useful fallback for each person.',
    code: `<div class="flex -space-x-2" aria-label="Release reviewers">
  <ui-avatar label="Avery Chen" src="/people/avery.jpg" />
  <ui-avatar label="Morgan Lee" />
  <ui-avatar label="Sam Rivera" />
</div>`,
  },
  skeleton: {
    title: 'Results table loading',
    description:
      'Repeat aligned placeholders to preserve table rhythm while report data is loading.',
    code: `<div aria-busy="true" aria-label="Loading release results" class="grid gap-3">
  @for (row of [1, 2, 3]; track row) {
    <div class="grid grid-cols-[2fr_1fr_5rem] gap-4">
      <ui-skeleton />
      <ui-skeleton />
      <ui-skeleton />
    </div>
  }
</div>`,
  },
  'progress-bar': {
    title: 'Storage quota',
    description:
      'Pair progress with visible values so quota consumption remains understandable without color.',
    code: `<section aria-labelledby="storage-heading">
  <div class="flex justify-between">
    <h3 id="storage-heading">Storage</h3>
    <span>7.2 GB of 10 GB</span>
  </div>
  <ui-progress-bar [value]="72" ariaLabel="Storage used" />
</section>`,
  },
  checkbox: {
    title: 'Terms confirmation',
    description:
      'Connect a required agreement to explanatory copy before allowing account creation.',
    code: `<ui-checkbox
  label="I agree to the workspace terms"
  helperText="Required to create a shared workspace."
  [formControl]="termsControl"
/>
<ui-button [disabled]="termsControl.invalid">Create workspace</ui-button>`,
  },
  alert: {
    title: 'Validation summary',
    description:
      'Place a persistent error summary before a form and link users to the fields that need attention.',
    code: `<ui-alert variant="danger" title="Resolve 2 validation errors">
  <ul class="list-disc pl-5">
    <li><a href="#release-name">Enter a release name</a></li>
    <li><a href="#release-date">Choose a release date</a></li>
  </ul>
</ui-alert>`,
  },
  radio: {
    title: 'Billing cadence',
    description:
      'Present mutually exclusive billing choices with concise pricing context in one named group.',
    code: `<ui-radio-group label="Billing cadence" [formControl]="billingCadence">
  <ui-radio value="monthly" label="Monthly" helperText="$24 per month" />
  <ui-radio value="annual" label="Annual" helperText="$240 per year — save $48" />
</ui-radio-group>`,
  },
  switch: {
    title: 'Privacy preference',
    description:
      'Use a switch for an immediately applied setting and explain the consequence beside it.',
    code: `<ui-switch
  label="Show profile to workspace members"
  helperText="Your name, role, and avatar will be visible in member search."
  [formControl]="profileVisibility"
/>`,
  },
  tabs: {
    title: 'Account settings',
    description:
      'Organize related settings views while keeping each tab label short and task-oriented.',
    code: `<ui-tabs [items]="[
  { value: 'profile', label: 'Profile', content: 'Update your public profile.' },
  { value: 'security', label: 'Security', content: 'Manage passwords and sessions.' },
  { value: 'billing', label: 'Billing', content: 'Review invoices and payment methods.' }
]" />`,
  },
  accordion: {
    title: 'Frequently asked questions',
    description: 'Use single expansion when readers should focus on one detailed answer at a time.',
    code: `<ui-accordion
  ariaLabel="Billing questions"
  [items]="billingQuestions"
  [expandedIds]="['trial']"
  (expandedIdsChange)="expandedQuestions.set($event)"
/>`,
  },
  'file-upload': {
    title: 'Profile photo upload',
    description:
      'Constrain a single image upload and communicate the accepted format before selection.',
    code: `<ui-file-upload
  label="Profile photo"
  helperText="PNG or JPEG, up to 2 MB."
  accept="image/png,image/jpeg"
  [multiple]="false"
  [maxFileSize]="2097152"
  (filesChange)="previewPhoto($event)"
/>`,
  },
  'command-palette': {
    title: 'Navigation launcher',
    description:
      'Group destinations by product area and let keyboard users move directly to a selected route.',
    code: `<ui-command-palette
  [open]="paletteOpen()"
  [commands]="navigationCommands"
  placeholder="Go to a page…"
  (selected)="navigateTo($event)"
  (openChange)="paletteOpen.set($event)"
/>`,
  },
  overlay: {
    title: 'Notification inspector',
    description:
      'Anchor a compact, interactive notification list to its trigger without introducing a modal task.',
    code: `<ui-overlay placement="bottom-end">
  <button uiOverlayTrigger uiButton variant="ghost">Notifications</button>
  <section uiOverlayContent aria-label="Recent notifications" class="w-80 p-4">
    <h3>Recent notifications</h3>
    <a href="/releases/42">Release 4.2 is ready to review</a>
  </section>
</ui-overlay>`,
  },
  confirmation: {
    title: 'Leave with unsaved changes',
    description:
      'Request confirmation before navigation while making the safe and destructive outcomes explicit.',
    code: `<ui-button variant="ghost" (pressed)="confirmLeave()">Back to projects</ui-button>

<!-- Component class -->
confirmLeave(): void {
  this.confirmation.confirm({
    title: 'Discard unsaved changes?',
    message: 'Your edits to this release will be lost.',
    confirmText: 'Discard changes',
    cancelText: 'Keep editing',
    variant: 'danger',
  }).then((confirmed) => confirmed && this.navigateBack());
}`,
  },
  'tree-table': {
    title: 'Permission hierarchy',
    description:
      'Show inherited access in a hierarchy while keeping permission values aligned in data columns.',
    code: `<ui-tree-table
  caption="Workspace permissions"
  [columns]="permissionColumns"
  [nodes]="permissionNodes"
  [expandedKeys]="expandedPermissionKeys()"
  (expandedKeysChange)="expandedPermissionKeys.set($event)"
/>`,
  },
  tree: {
    title: 'Workspace navigation',
    description:
      'Use selection and expansion together for a navigable hierarchy whose state remains parent-owned.',
    code: `<ui-tree
  ariaLabel="Workspace navigation"
  [nodes]="workspaceNodes"
  [selectedKey]="selectedWorkspaceKey()"
  [expandedKeys]="expandedWorkspaceKeys()"
  (selectedKeyChange)="openWorkspaceItem($event)"
  (expandedKeysChange)="expandedWorkspaceKeys.set($event)"
/>`,
  },
  toast: {
    title: 'Undo archive',
    description:
      'Confirm a completed background action and offer a short-lived recovery path when appropriate.',
    code: `<ui-button (pressed)="archiveProject()">Archive project</ui-button>

<!-- Component class -->
archiveProject(): void {
  this.projects.archive(this.projectId);
  this.toast.success('Project archived', 'The project moved to your archive.');
}`,
  },
  breadcrumb: {
    title: 'Invoice location',
    description:
      'Truncate a deep hierarchy visually while preserving an explicit current-page destination.',
    code: `<ui-breadcrumb
  ariaLabel="Invoice location"
  [items]="[
    { label: 'Billing', href: '/billing' },
    { label: 'Invoices', href: '/billing/invoices' },
    { label: 'INV-2026-042', current: true }
  ]"
/>`,
  },
  paginator: {
    title: 'Search results',
    description:
      'Reset pagination when filters change and announce the current result range beside the controls.',
    code: `<p aria-live="polite">Showing {{ rangeStart }}–{{ rangeEnd }} of {{ totalResults }}</p>
<ui-paginator
  [page]="page()"
  [pageSize]="25"
  [totalItems]="totalResults"
  ariaLabel="Search result pages"
  (pageChange)="loadPage($event)"
/>`,
  },
  chip: {
    title: 'Team member picker',
    description:
      'Represent selected people as removable chips and return focus to the picker after removal.',
    code: `<div class="flex flex-wrap gap-2" aria-label="Selected reviewers">
  @for (reviewer of reviewers(); track reviewer.id) {
    <ui-chip removable (removed)="removeReviewer(reviewer.id)">
      {{ reviewer.name }}
    </ui-chip>
  }
</div>`,
  },
  divider: {
    title: 'Menu group boundary',
    description:
      'Use an unlabeled divider only where surrounding menu labels already explain the grouping.',
    code: `<nav aria-label="Account">
  <a href="/profile">Profile</a>
  <a href="/preferences">Preferences</a>
  <ui-divider />
  <button type="button" class="text-red-700">Sign out</button>
</nav>`,
  },
  menu: {
    title: 'Account switcher',
    description:
      'Provide a labelled trigger and checked state for switching between recently used workspaces.',
    code: `<ui-menu [items]="workspaceItems" ariaLabel="Switch workspace">
  <button uiMenuTrigger uiButton variant="outline">Acme workspace</button>
</ui-menu>`,
  },
  drawer: {
    title: 'Mobile navigation',
    description:
      'Move application navigation into a modal drawer on small screens and label it by purpose.',
    code: `<ui-button (pressed)="navigationOpen.set(true)">Open navigation</ui-button>
<ui-drawer
  side="left"
  ariaLabel="Application navigation"
  [open]="navigationOpen()"
  (openChange)="navigationOpen.set($event)"
>
  <nav><a href="/dashboard">Dashboard</a><a href="/projects">Projects</a></nav>
</ui-drawer>`,
  },
  popover: {
    title: 'Schedule settings',
    description:
      'Keep lightweight scheduling controls near their trigger without interrupting the surrounding form.',
    code: `<ui-popover placement="bottom-start">
  <button uiPopoverTrigger uiButton variant="outline">Schedule</button>
  <form uiPopoverContent class="grid w-72 gap-3 p-4">
    <ui-date-picker label="Publish date" [formControl]="publishDate" />
    <ui-button type="submit">Apply schedule</ui-button>
  </form>
</ui-popover>`,
  },
  tooltip: {
    title: 'Truncated value',
    description:
      'Reveal a clipped value on hover and focus while leaving the visible table layout compact.',
    code: `<span
  class="block max-w-48 truncate"
  uiTooltip="enterprise-release-2026.07.28"
  tooltipPlacement="top"
  tabindex="0"
>
  enterprise-release-2026.07.28
</span>`,
  },
  spinner: {
    title: 'Loading table region',
    description:
      'Combine a named status with the affected region so users understand which content is pending.',
    code: `<section aria-busy="true" aria-labelledby="invoices-heading" class="grid place-items-center gap-3">
  <h3 id="invoices-heading">Invoices</h3>
  <ui-spinner label="Loading invoices" size="lg" />
</section>`,
  },
};

export const componentDocDetailsBySlug = new Map<string, ComponentDocDetails>(
  [...baseComponentDocDetailsBySlug].map(([slug, details]) => {
    const supplementalExample = supplementalComponentExamples[slug];
    return [
      slug,
      supplementalExample
        ? { ...details, examples: [...details.examples, supplementalExample] }
        : details,
    ];
  }),
);
