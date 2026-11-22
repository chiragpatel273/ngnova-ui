import { DOCUMENT, isPlatformBrowser, LocationStrategy } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID } from '@angular/core';
import { Meta } from '@angular/platform-browser';

/**
 * The admin dashboard used to live at /templates/admin-dashboard inside the docs app. It is now
 * the standalone Northstar template at /templates/admin/, so old links forward there, including
 * in the prerendered HTML.
 */
@Component({
  selector: 'app-admin-template-redirect',
  standalone: true,
  template: `
    <main class="mx-auto max-w-md px-6 py-24 text-center">
      <p class="text-sm text-slate-600 dark:text-slate-300">
        The admin dashboard template has moved.
        <a class="font-semibold text-blue-700 underline dark:text-blue-300" [href]="target"
          >Open Northstar Admin</a
        >
      </p>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTemplateRedirectComponent {
  protected readonly target = `${inject(LocationStrategy).getBaseHref().replace(/\/?$/, '/')}templates/admin/`;

  constructor() {
    const meta = inject(Meta);
    meta.updateTag({ name: 'robots', content: 'noindex' });
    meta.updateTag({ 'http-equiv': 'refresh', content: `0; url=${this.target}` });
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      inject(DOCUMENT).defaultView?.location.replace(this.target);
    }
  }
}
