import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { UiCommandPaletteComponent } from '../../../../command-palette/src/command-palette';
import type {
  UiCommand,
  UiCommandSelection,
} from '../../../../command-palette/src/command-palette';

const COMMANDS: readonly UiCommand[] = [
  {
    value: 'new-project',
    label: 'Create project',
    description: 'Start a new workspace',
    keywords: ['add', 'workspace'],
    shortcut: 'N',
    group: 'Projects',
  },
  { value: 'open-settings', label: 'Open settings', group: 'Navigation' },
  { value: 'disabled', label: 'Unavailable command', disabled: true, group: 'Navigation' },
];

@Component({
  standalone: true,
  imports: [UiCommandPaletteComponent],
  template: `
    <button type="button" class="opener">Open</button>
    <ui-command-palette
      [commands]="commands"
      [open]="open"
      (openChange)="open = $event"
      [query]="query"
      (queryChange)="query = $event"
      (commandSelected)="selection = $event"
      (escapeKeyDown)="escapeCount = escapeCount + 1"
      ariaLabel="Workspace commands"
    />
  `,
})
class HostComponent {
  readonly commands = COMMANDS;
  open = true;
  query = '';
  selection: UiCommandSelection | null = null;
  escapeCount = 0;
}

describe('UiCommandPaletteComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('renders an accessible modal combobox with grouped command options', () => {
    const dialog = fixture.debugElement.query(By.css('[role="dialog"]'))
      .nativeElement as HTMLElement;
    const input = fixture.debugElement.query(By.css('[role="combobox"]'))
      .nativeElement as HTMLInputElement;
    const options = fixture.debugElement.queryAll(By.css('[role="option"]'));

    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-label')).toBe('Workspace commands');
    expect(input.getAttribute('aria-controls')).toBeTruthy();
    expect(input.getAttribute('aria-activedescendant')).toContain('new-project');
    expect(options).toHaveLength(3);
    expect(options[2]?.nativeElement.disabled).toBe(true);
  });

  it('filters by keywords through controlled query state', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    input.value = 'workspace';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const options = fixture.debugElement.queryAll(By.css('[role="option"]'));
    expect(host.query).toBe('workspace');
    expect(options).toHaveLength(1);
    expect(options[0]?.nativeElement.textContent).toContain('Create project');
  });

  it('wraps keyboard navigation, skips disabled commands, and selects with Enter', () => {
    const panel = fixture.debugElement.query(By.css('[role="dialog"]'))
      .nativeElement as HTMLElement;
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    expect(host.selection?.command.value).toBe('open-settings');
    expect(host.selection?.source).toBe('keyboard');
    expect(host.open).toBe(false);
  });

  it('emits Escape and restores focus after the controlled palette closes', async () => {
    const opener = fixture.debugElement.query(By.css('.opener')).nativeElement as HTMLButtonElement;
    host.open = false;
    fixture.detectChanges();
    opener.focus();
    host.open = true;
    fixture.detectChanges();
    await fixture.whenStable();

    const panel = fixture.debugElement.query(By.css('[role="dialog"]'))
      .nativeElement as HTMLElement;
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.escapeCount).toBe(1);
    expect(host.open).toBe(false);
    expect(document.activeElement).toBe(opener);
  });

  it('traps forward focus from the close action back to search', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    const closeButton = fixture.debugElement.query(By.css('[role="dialog"] button'))
      .nativeElement as HTMLButtonElement;
    closeButton.focus();
    closeButton.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }),
    );

    expect(document.activeElement).toBe(input);
  });

  it('opens from Ctrl+K and selects a command with a pointer', () => {
    const closeButton = fixture.debugElement.query(By.css('[role="dialog"] button'))
      .nativeElement as HTMLButtonElement;
    closeButton.click();
    fixture.detectChanges();
    const palette = fixture.debugElement.query(By.directive(UiCommandPaletteComponent))
      .componentInstance as UiCommandPaletteComponent;
    expect(palette.open()).toBe(false);
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true, cancelable: true }),
    );
    fixture.detectChanges();
    expect(host.open).toBe(true);

    const options = fixture.debugElement.queryAll(By.css('[role="option"]'));
    (options[1]?.nativeElement as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(host.selection?.command.value).toBe('open-settings');
    expect(host.selection?.source).toBe('pointer');
  });
});
