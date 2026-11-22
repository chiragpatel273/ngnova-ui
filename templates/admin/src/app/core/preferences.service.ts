import { DOCUMENT } from '@angular/common';
import { computed, effect, inject, Injectable, signal } from '@angular/core';

export type ThemePreference = 'light' | 'dark' | 'system';
export type DirectionPreference = 'ltr' | 'rtl';

interface StoredPreferences {
  readonly theme?: ThemePreference;
  readonly direction?: DirectionPreference;
  readonly sidebarCollapsed?: boolean;
}

const STORAGE_KEY = 'northstar-preferences';

/** Theme, text direction, and layout preferences, persisted per browser. */
@Injectable({ providedIn: 'root' })
export class PreferencesService {
  private readonly document = inject(DOCUMENT);
  private readonly stored = this.read();
  private readonly systemDark = signal(this.prefersDark());

  readonly theme = signal<ThemePreference>(this.stored.theme ?? 'system');
  readonly direction = signal<DirectionPreference>(this.stored.direction ?? 'ltr');
  readonly sidebarCollapsed = signal(this.stored.sidebarCollapsed ?? false);
  readonly dark = computed(() =>
    this.theme() === 'system' ? this.systemDark() : this.theme() === 'dark',
  );

  constructor() {
    this.document.defaultView
      ?.matchMedia?.('(prefers-color-scheme: dark)')
      .addEventListener('change', (event) => this.systemDark.set(event.matches));

    effect(() => {
      const root = this.document.documentElement;
      root.classList.toggle('dark', this.dark());
      root.dir = this.direction();
      this.write({
        theme: this.theme(),
        direction: this.direction(),
        sidebarCollapsed: this.sidebarCollapsed(),
      });
    });
  }

  toggleTheme(): void {
    this.theme.set(this.dark() ? 'light' : 'dark');
  }

  toggleDirection(): void {
    this.direction.update((direction) => (direction === 'rtl' ? 'ltr' : 'rtl'));
  }

  private prefersDark(): boolean {
    return this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  }

  // Storage can be unavailable (private windows, blocked cookies); preferences then last for the
  // session only.
  private read(): StoredPreferences {
    try {
      return JSON.parse(this.document.defaultView?.localStorage.getItem(STORAGE_KEY) ?? '{}');
    } catch {
      return {};
    }
  }

  private write(preferences: StoredPreferences): void {
    try {
      this.document.defaultView?.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      // Ignore storage failures.
    }
  }
}
