import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { email, form, FormField, minLength, required, submit } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroSparkles } from '@ng-icons/heroicons/outline';
import { heroStarSolid } from '@ng-icons/heroicons/solid';
import { UiAvatarComponent } from '@ngnova/ui/avatar';
import { UiButtonComponent } from '@ngnova/ui/button';
import { UiCheckboxComponent } from '@ngnova/ui/checkbox';
import { UiDividerComponent } from '@ngnova/ui/divider';
import { UiInputComponent } from '@ngnova/ui/input';
import { UiToastComponent, UiToastService } from '@ngnova/ui/toast';

import { APP_NAME } from '../../core/title-strategy';
import { fieldError } from '../../shared/form-errors';

/**
 * Sign-in screen outside the app shell. It only validates the form and navigates; connect it to
 * your auth provider and add a route guard to protect the shell.
 */
@Component({
  selector: 'app-sign-in-page',
  imports: [
    FormField,
    NgIcon,
    RouterLink,
    UiAvatarComponent,
    UiButtonComponent,
    UiCheckboxComponent,
    UiDividerComponent,
    UiInputComponent,
    UiToastComponent,
  ],
  viewProviders: [provideIcons({ heroSparkles, heroStarSolid })],
  template: `
    <div class="grid min-h-dvh lg:grid-cols-2">
      <main class="flex flex-col px-6 py-10 sm:px-12">
        <a
          routerLink="/"
          class="flex w-fit items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <span
            class="grid size-8 place-items-center rounded-lg bg-blue-600 text-white shadow-sm"
            aria-hidden="true"
          >
            <ng-icon name="heroSparkles" size="18" />
          </span>
          <span class="text-base font-semibold tracking-tight text-slate-950 dark:text-white">{{
            appName
          }}</span>
        </a>

        <div class="mx-auto my-auto w-full max-w-sm py-12">
          <h1 class="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Welcome back
          </h1>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Sign in to your {{ appName }} workspace.
          </p>

          <form class="mt-8 grid gap-5" novalidate (submit)="signIn($event)">
            <ui-input
              label="Email"
              type="email"
              autocomplete="email"
              [errorText]="error(signInForm.email())"
              [formField]="signInForm.email"
            />
            <ui-input
              label="Password"
              type="password"
              autocomplete="current-password"
              revealable
              helperText="Demo: any password with 8 or more characters."
              [errorText]="error(signInForm.password())"
              [formField]="signInForm.password"
            />
            <div class="flex items-center justify-between gap-3">
              <ui-checkbox label="Remember me" [formField]="signInForm.remember" />
              <button
                type="button"
                class="rounded text-sm font-medium text-blue-600 hover:underline focus-visible:outline-2 focus-visible:outline-blue-600 dark:text-blue-400"
                (click)="notConnected('Password reset')"
              >
                Forgot password?
              </button>
            </div>
            <ui-button type="submit" fullWidth [loading]="signingIn()" loadingLabel="Signing in">
              Sign in
            </ui-button>
          </form>

          <div class="my-6 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <ui-divider class="flex-1" />
            or continue with
            <ui-divider class="flex-1" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <ui-button
              class="w-full"
              variant="outline"
              fullWidth
              (pressed)="notConnected('Google sign-in')"
            >
              Google
            </ui-button>
            <ui-button
              class="w-full"
              variant="outline"
              fullWidth
              (pressed)="notConnected('GitHub sign-in')"
            >
              GitHub
            </ui-button>
          </div>

          <p class="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            New to {{ appName }}?
            <button
              type="button"
              class="rounded font-medium text-blue-600 hover:underline focus-visible:outline-2 focus-visible:outline-blue-600 dark:text-blue-400"
              (click)="notConnected('Sign-up')"
            >
              Start a free trial
            </button>
          </p>
        </div>

        <p class="text-xs text-slate-500 dark:text-slate-400">
          Built with
          <a
            class="font-medium text-slate-700 underline-offset-2 hover:underline dark:text-slate-300"
            href="https://chiragpatel273.github.io/ngnova-ui/"
            target="_blank"
            rel="noopener"
            >NgNova UI</a
          >.
        </p>
      </main>

      <aside
        class="relative hidden overflow-hidden bg-blue-600 p-12 text-white lg:flex lg:flex-col lg:justify-end dark:bg-blue-950"
        aria-label="Customer story"
      >
        <div
          class="absolute -end-32 -top-32 size-[28rem] rounded-full bg-white/10 blur-2xl"
          aria-hidden="true"
        ></div>
        <div
          class="absolute -bottom-40 -start-24 size-[24rem] rounded-full bg-sky-300/20 blur-3xl"
          aria-hidden="true"
        ></div>
        <div class="relative grid max-w-lg gap-8">
          <dl class="grid grid-cols-3 gap-6">
            @for (stat of stats; track stat.label) {
              <div>
                <dt class="text-sm text-blue-100">{{ stat.label }}</dt>
                <dd class="mt-1 text-3xl font-semibold tracking-tight">{{ stat.value }}</dd>
              </div>
            }
          </dl>
          <figure class="rounded-2xl bg-white/10 p-6 ring-1 ring-white/15 backdrop-blur">
            <div class="flex gap-1 text-amber-300" aria-label="5 out of 5 stars" role="img">
              @for (star of [1, 2, 3, 4, 5]; track star) {
                <ng-icon name="heroStarSolid" size="16" aria-hidden="true" />
              }
            </div>
            <blockquote class="mt-4 text-lg leading-relaxed">
              “We replaced three spreadsheets and a support inbox with {{ appName }}. Fulfillment is
              twice as fast and nobody asks where an order is anymore.”
            </blockquote>
            <figcaption class="mt-6 flex items-center gap-3">
              <ui-avatar label="Priya Raman" size="md" />
              <span>
                <span class="block font-semibold">Priya Raman</span>
                <span class="block text-sm text-blue-100">Head of Operations, Lumen Goods</span>
              </span>
            </figcaption>
          </figure>
        </div>
      </aside>
    </div>
    <ui-toast position="bottom-end" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInPage {
  private readonly router = inject(Router);
  private readonly toast = inject(UiToastService);

  protected readonly appName = APP_NAME;
  protected readonly error = fieldError;
  protected readonly signingIn = signal(false);
  protected readonly stats = [
    { label: 'Orders shipped', value: '2.4M' },
    { label: 'Teams', value: '1,200+' },
    { label: 'Uptime', value: '99.99%' },
  ];

  private readonly model = signal({ email: 'maya@northstar.app', password: '', remember: true });
  protected readonly signInForm = form(this.model, (path) => {
    required(path.email, { message: 'Enter your email address.' });
    email(path.email, { message: 'Enter a valid email address.' });
    required(path.password, { message: 'Enter your password.' });
    minLength(path.password, 8, { message: 'Passwords have at least 8 characters.' });
  });

  protected async signIn(event: Event): Promise<void> {
    event.preventDefault();
    await submit(this.signInForm, async () => {
      this.signingIn.set(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      this.signingIn.set(false);
      await this.router.navigateByUrl('/');
      return undefined;
    });
  }

  protected notConnected(feature: string): void {
    this.toast.info(`${feature} is not connected`, 'Wire it to your auth provider.');
  }
}
