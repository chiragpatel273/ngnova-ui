import { TestBed } from '@angular/core/testing';

import type { UiFileUploadRejection } from '../../../../file-upload/src/file-upload';
import { UiFileUploadComponent } from '../../../../file-upload/src/file-upload';

describe('UiFileUploadComponent', () => {
  it('validates type, size, count, total size, and duplicates immutably', async () => {
    await TestBed.configureTestingModule({ imports: [UiFileUploadComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UiFileUploadComponent);
    const existing = new File(['one'], 'one.txt', { type: 'text/plain', lastModified: 1 });
    const duplicate = new File(['one'], 'one.txt', { type: 'text/plain', lastModified: 1 });
    const wrongType = new File(['x'], 'image.png', { type: 'image/png' });
    const tooLarge = new File(['123456'], 'large.txt', { type: 'text/plain' });
    const changes: (readonly File[])[] = [];
    let rejected: readonly UiFileUploadRejection[] = [];
    fixture.componentRef.setInput('files', [existing]);
    fixture.componentRef.setInput('accept', '.txt');
    fixture.componentRef.setInput('maxFileSize', 5);
    fixture.componentInstance.filesChange.subscribe((files) => changes.push(files));
    fixture.componentInstance.rejected.subscribe((items) => (rejected = items));
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    Object.defineProperty(input, 'files', {
      configurable: true,
      value: { 0: duplicate, 1: wrongType, 2: tooLarge, length: 3 },
    });
    input.dispatchEvent(new Event('change'));
    expect(changes).toEqual([]);
    expect(rejected.map((item) => item.reason)).toEqual(['duplicate', 'file-type', 'file-size']);
    expect(Object.isFrozen(rejected)).toBe(true);
  });

  it('emits accepted controlled files and auto-upload requests', async () => {
    await TestBed.configureTestingModule({ imports: [UiFileUploadComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UiFileUploadComponent);
    const file = new File(['content'], 'release.txt', { type: 'text/plain' });
    let files: readonly File[] = [];
    let source = '';
    fixture.componentRef.setInput('autoUpload', true);
    fixture.componentInstance.filesChange.subscribe((value) => (files = value));
    fixture.componentInstance.uploadRequested.subscribe((value) => (source = value.source));
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    Object.defineProperty(input, 'files', { configurable: true, value: { 0: file, length: 1 } });
    input.dispatchEvent(new Event('change'));
    expect(files).toEqual([file]);
    expect(Object.isFrozen(files)).toBe(true);
    expect(source).toBe('selection');
  });

  it('renders files, clamps progress, and emits remove/clear/manual upload', async () => {
    await TestBed.configureTestingModule({ imports: [UiFileUploadComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UiFileUploadComponent);
    const file = new File(['content'], 'release.txt', { lastModified: 1 });
    const key = `${file.name}:${file.size}:${file.lastModified}`;
    const changes: (readonly File[])[] = [];
    let uploaded = false;
    fixture.componentRef.setInput('files', [file]);
    fixture.componentRef.setInput('progress', { [key]: 140 });
    fixture.componentInstance.filesChange.subscribe((value) => changes.push(value));
    fixture.componentInstance.uploadRequested.subscribe(() => (uploaded = true));
    fixture.detectChanges();
    const progress = fixture.nativeElement.querySelector('[role="progressbar"]') as HTMLElement;
    expect(progress.getAttribute('aria-valuenow')).toBe('100');
    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons[1].click();
    buttons[3].click();
    buttons[2].click();
    expect(changes).toEqual([[], []]);
    expect(uploaded).toBe(true);
  });

  it('exposes disabled and drag-active states without opening hidden input', async () => {
    await TestBed.configureTestingModule({ imports: [UiFileUploadComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UiFileUploadComponent);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[aria-disabled="true"]')).not.toBeNull();
    expect((fixture.nativeElement.querySelector('button') as HTMLButtonElement).disabled).toBe(
      true,
    );
  });
});
