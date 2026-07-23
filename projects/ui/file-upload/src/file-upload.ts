import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
  numberAttribute,
  output,
  signal,
  viewChild,
} from '@angular/core';
import type { ElementRef } from '@angular/core';

export type UiFileUploadRejectionReason =
  | 'file-type'
  | 'file-size'
  | 'file-count'
  | 'total-size'
  | 'duplicate';

export interface UiFileUploadRejection {
  readonly file: File;
  readonly reason: UiFileUploadRejectionReason;
}

export interface UiFileUploadRequest {
  readonly files: readonly File[];
  readonly source: 'selection' | 'drop' | 'manual';
}

function fileKey(file: File): string {
  return `${file.name}:${file.size}:${file.lastModified}`;
}

function matchesAccept(file: File, accept: string): boolean {
  const rules = accept
    .split(',')
    .map((rule) => rule.trim().toLocaleLowerCase())
    .filter(Boolean);
  if (!rules.length) return true;
  const name = file.name.toLocaleLowerCase();
  const type = file.type.toLocaleLowerCase();
  return rules.some((rule) => {
    if (rule.startsWith('.')) return name.endsWith(rule);
    if (rule.endsWith('/*')) return type.startsWith(rule.slice(0, -1));
    return type === rule;
  });
}

@Component({
  selector: 'ui-file-upload',
  standalone: true,
  template: `
    <section
      class="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950"
      [attr.aria-label]="ariaLabel()"
    >
      <input
        #fileInput
        class="sr-only"
        type="file"
        [accept]="accept()"
        [multiple]="multiple()"
        [disabled]="disabled()"
        [attr.aria-label]="chooseLabel()"
        (change)="onInputChange($event)"
      />
      <div
        [class]="dropZoneClasses()"
        [attr.aria-disabled]="disabled() ? 'true' : null"
        (dragenter)="onDragEnter($event)"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
      >
        <svg
          class="mx-auto size-8 fill-none stroke-current text-slate-400"
          viewBox="0 0 24 24"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
        </svg>
        <p class="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
          {{ dropLabel() }}
        </p>
        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ helperText() }}</p>
        <button
          type="button"
          class="mt-4 inline-flex min-h-10 items-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950"
          [disabled]="disabled()"
          (click)="openPicker()"
        >
          {{ chooseLabel() }}
        </button>
      </div>

      @if (files().length) {
        <ul class="mt-4 space-y-2" [attr.aria-label]="fileListAriaLabel()">
          @for (file of files(); track fileKey(file)) {
            <li
              class="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-800"
            >
              <span class="min-w-0 flex-1">
                <span class="block truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                  {{ file.name }}
                </span>
                <span class="text-xs text-slate-500 dark:text-slate-400">
                  {{ formatBytes(file.size) }}
                </span>
                @if (progressFor(file) !== null) {
                  <span
                    class="mt-1 block h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
                    role="progressbar"
                    [attr.aria-label]="file.name"
                    [attr.aria-valuenow]="progressFor(file)"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <span
                      class="block h-full rounded-full bg-blue-600 transition-[width] dark:bg-blue-400"
                      [style.width.%]="progressFor(file)"
                    ></span>
                  </span>
                }
              </span>
              <button
                type="button"
                class="inline-flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-slate-900 dark:hover:text-slate-100 dark:focus-visible:ring-blue-400"
                [disabled]="disabled()"
                [attr.aria-label]="removeAriaLabel() + ' ' + file.name"
                (click)="remove(file)"
              >
                <svg
                  class="size-4 fill-none stroke-current"
                  viewBox="0 0 20 20"
                  stroke-width="1.75"
                  stroke-linecap="round"
                  aria-hidden="true"
                >
                  <path d="m5 5 10 10M15 5 5 15" />
                </svg>
              </button>
            </li>
          }
        </ul>
        <div class="mt-4 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            class="min-h-10 rounded-lg px-4 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-slate-300 dark:hover:bg-slate-900 dark:focus-visible:ring-blue-400"
            [disabled]="disabled()"
            (click)="clear()"
          >
            {{ clearLabel() }}
          </button>
          <button
            type="button"
            class="min-h-10 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950"
            [disabled]="disabled()"
            (click)="requestUpload('manual')"
          >
            {{ uploadLabel() }}
          </button>
        </div>
      }
      @if (rejectionMessage()) {
        <p class="mt-3 text-sm text-red-700 dark:text-red-300" role="alert">
          {{ rejectionMessage() }}
        </p>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiFileUploadComponent {
  readonly files = input<readonly File[]>([]);
  readonly accept = input('');
  readonly multiple = input(true, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly autoUpload = input(false, { transform: booleanAttribute });
  readonly maxFiles = input(0, { transform: numberAttribute });
  readonly maxFileSize = input(0, { transform: numberAttribute });
  readonly maxTotalSize = input(0, { transform: numberAttribute });
  readonly progress = input<Readonly<Record<string, number>>>({});
  readonly ariaLabel = input('File upload');
  readonly chooseLabel = input('Choose files');
  readonly dropLabel = input('Drop files here');
  readonly helperText = input('or choose files from your device');
  readonly clearLabel = input('Clear');
  readonly uploadLabel = input('Upload');
  readonly fileListAriaLabel = input('Selected files');
  readonly removeAriaLabel = input('Remove');
  readonly rejectionText = input('Some files could not be added.');
  readonly filesChange = output<readonly File[]>();
  readonly rejected = output<readonly UiFileUploadRejection[]>();
  readonly uploadRequested = output<UiFileUploadRequest>();

  private readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');
  protected readonly dragging = signal(false);
  protected readonly lastRejections = signal<readonly UiFileUploadRejection[]>([]);
  protected readonly rejectionMessage = computed(() =>
    this.lastRejections().length ? this.rejectionText() : '',
  );
  protected readonly fileKey = fileKey;

  protected openPicker(): void {
    if (!this.disabled()) this.fileInput().nativeElement.click();
  }

  protected onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.addFiles(Array.from(inputElement.files ?? []), 'selection');
    inputElement.value = '';
  }

  protected onDragEnter(event: DragEvent): void {
    event.preventDefault();
    if (!this.disabled()) this.dragging.set(true);
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  protected onDragLeave(event: DragEvent): void {
    if (event.currentTarget === event.target) this.dragging.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
    if (!this.disabled()) this.addFiles(Array.from(event.dataTransfer?.files ?? []), 'drop');
  }

  private addFiles(candidates: readonly File[], source: 'selection' | 'drop'): void {
    const current = this.multiple() ? [...this.files()] : [];
    const accepted: File[] = [];
    const rejections: UiFileUploadRejection[] = [];
    let totalSize = current.reduce((sum, file) => sum + file.size, 0);
    const keys = new Set(current.map(fileKey));
    for (const file of candidates) {
      let reason: UiFileUploadRejectionReason | null = null;
      if (keys.has(fileKey(file))) reason = 'duplicate';
      else if (!matchesAccept(file, this.accept())) reason = 'file-type';
      else if (this.maxFileSize() > 0 && file.size > this.maxFileSize()) reason = 'file-size';
      else if (this.maxFiles() > 0 && current.length + accepted.length >= this.maxFiles())
        reason = 'file-count';
      else if (this.maxTotalSize() > 0 && totalSize + file.size > this.maxTotalSize())
        reason = 'total-size';
      if (reason) {
        rejections.push({ file, reason });
      } else {
        accepted.push(file);
        keys.add(fileKey(file));
        totalSize += file.size;
        if (!this.multiple()) break;
      }
    }
    const next = Object.freeze([...current, ...accepted]);
    this.lastRejections.set(Object.freeze(rejections));
    if (rejections.length) this.rejected.emit(Object.freeze(rejections));
    if (accepted.length) {
      this.filesChange.emit(next);
      if (this.autoUpload()) this.uploadRequested.emit({ files: Object.freeze(accepted), source });
    }
  }

  protected remove(file: File): void {
    this.filesChange.emit(
      Object.freeze(this.files().filter((item) => fileKey(item) !== fileKey(file))),
    );
  }

  protected clear(): void {
    this.filesChange.emit(Object.freeze([]));
  }

  protected requestUpload(source: 'manual'): void {
    if (this.files().length)
      this.uploadRequested.emit({ files: Object.freeze([...this.files()]), source });
  }

  protected progressFor(file: File): number | null {
    const value = this.progress()[fileKey(file)];
    return value == null ? null : Math.min(100, Math.max(0, Math.round(value)));
  }

  protected formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  protected dropZoneClasses(): string {
    const base = 'rounded-xl border-2 border-dashed px-5 py-8 text-center transition-colors';
    if (this.disabled())
      return `${base} cursor-not-allowed border-slate-200 opacity-60 dark:border-slate-800`;
    if (this.dragging())
      return `${base} border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950`;
    return `${base} border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900`;
  }
}
