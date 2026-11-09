export type NgAddDarkMode = 'class' | 'media';

export interface NgAddOptions {
  /** The Angular application to configure. Defaults to the current or only application. */
  readonly project?: string;
  /** Import the optional `@ngnova/ui/styles/theme.css` token stylesheet. */
  readonly theme: boolean;
  /** Dark mode strategy. `class` adds the `.dark` custom variant; `media` keeps Tailwind's default. */
  readonly darkMode: NgAddDarkMode;
  /** Install `@angular/cdk` for CDK-backed entry points. */
  readonly cdk: boolean;
  /** Skip installing added dependencies. */
  readonly skipInstall: boolean;
}
