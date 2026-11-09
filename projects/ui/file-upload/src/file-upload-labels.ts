import { InjectionToken, type Provider, inject } from '@angular/core';

/** Built-in text rendered by `ui-file-upload`. See ADR 0004. */
export interface UiFileUploadLabels {
  /** Accessible name of the file upload region. */
  readonly region: string;
  /** Text of the choose button and accessible name of the file input. */
  readonly choose: string;
  /** Drop zone heading. */
  readonly drop: string;
  /** Drop zone helper text. */
  readonly helper: string;
  /** Text of the clear button. */
  readonly clear: string;
  /** Text of the upload button. */
  readonly upload: string;
  /** Accessible name of the selected files list. */
  readonly fileList: string;
  /** Accessible name prefix of each remove button, followed by the file name. */
  readonly remove: string;
  /** Message shown when some files are rejected. */
  readonly rejected: string;
  /** Formats a file size in bytes for display. */
  readonly fileSize: (bytes: number) => string;
}

const DEFAULT_LABELS: UiFileUploadLabels = {
  region: 'File upload',
  choose: 'Choose files',
  drop: 'Drop files here',
  helper: 'or choose files from your device',
  clear: 'Clear',
  upload: 'Upload',
  fileList: 'Selected files',
  remove: 'Remove',
  rejected: 'Some files could not be added.',
  fileSize: (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  },
};

/**
 * Labels used by `ui-file-upload`. Defaults to English; override with
 * `provideUiFileUploadLabels()`.
 */
export const UI_FILE_UPLOAD_LABELS = new InjectionToken<UiFileUploadLabels>(
  'UI_FILE_UPLOAD_LABELS',
  {
    providedIn: 'root',
    factory: () => DEFAULT_LABELS,
  },
);

/** Overrides `ui-file-upload` built-in text, merging over labels provided by a parent injector. */
export function provideUiFileUploadLabels(labels: Partial<UiFileUploadLabels>): Provider {
  return {
    provide: UI_FILE_UPLOAD_LABELS,
    useFactory: (): UiFileUploadLabels => ({
      ...(inject(UI_FILE_UPLOAD_LABELS, { skipSelf: true, optional: true }) ?? DEFAULT_LABELS),
      ...labels,
    }),
  };
}
