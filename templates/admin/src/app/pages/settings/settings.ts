import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { email, form, FormField, required, submit } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroTrash, heroUserPlus } from '@ng-icons/heroicons/outline';
import { UiAvatarComponent } from '@ngnova/ui/avatar';
import { UiButtonComponent, UiButtonIconStartDirective } from '@ngnova/ui/button';
import { UiCheckboxComponent } from '@ngnova/ui/checkbox';
import { UiComboboxComponent } from '@ngnova/ui/combobox';
import type { UiComboboxOption } from '@ngnova/ui/combobox';
import { UiConfirmationService } from '@ngnova/ui/confirmation';
import { UiDividerComponent } from '@ngnova/ui/divider';
import { UiFileUploadComponent } from '@ngnova/ui/file-upload';
import { UiInputComponent } from '@ngnova/ui/input';
import { UiModalComponent } from '@ngnova/ui/modal';
import { UiRadioGroupComponent } from '@ngnova/ui/radio';
import type { UiRadioOption } from '@ngnova/ui/radio';
import { UiSelectComponent } from '@ngnova/ui/select';
import type { UiSelectOption } from '@ngnova/ui/select';
import { UiSwitchComponent } from '@ngnova/ui/switch';
import { UiTabsComponent } from '@ngnova/ui/tabs';
import type { UiTabItem } from '@ngnova/ui/tabs';
import { UiTagComponent } from '@ngnova/ui/tag';
import { UiTextareaComponent } from '@ngnova/ui/textarea';
import { UiToastService } from '@ngnova/ui/toast';
import { UiTooltipDirective } from '@ngnova/ui/tooltip';

import type { TeamMember } from '../../core/models';
import { PreferencesService } from '../../core/preferences.service';
import type { DirectionPreference, ThemePreference } from '../../core/preferences.service';
import { TeamService } from '../../core/team.service';
import { fieldError } from '../../shared/form-errors';
import { PageHeader } from '../../shared/page-header';

const TABS: readonly UiTabItem[] = [
  { value: 'profile', label: 'Profile' },
  { value: 'team', label: 'Team' },
  { value: 'notifications', label: 'Notifications' },
  { value: 'appearance', label: 'Appearance' },
];

const TIMEZONES: readonly UiSelectOption[] = [
  { label: 'Pacific Time (UTC−08:00)', value: 'America/Los_Angeles' },
  { label: 'Eastern Time (UTC−05:00)', value: 'America/New_York' },
  { label: 'London (UTC+00:00)', value: 'Europe/London' },
  { label: 'Berlin (UTC+01:00)', value: 'Europe/Berlin' },
  { label: 'Dubai (UTC+04:00)', value: 'Asia/Dubai' },
  { label: 'India (UTC+05:30)', value: 'Asia/Kolkata' },
  { label: 'Singapore (UTC+08:00)', value: 'Asia/Singapore' },
];

const ROLES: readonly UiComboboxOption[] = [
  { label: 'Admin', value: 'Admin' },
  { label: 'Editor', value: 'Editor' },
  { label: 'Viewer', value: 'Viewer' },
];

const THEMES: readonly UiRadioOption[] = [
  { label: 'Light', value: 'light', helperText: 'Bright surfaces for daytime work.' },
  { label: 'Dark', value: 'dark', helperText: 'Low-glare surfaces for long sessions.' },
  { label: 'System', value: 'system', helperText: 'Follow your operating system.' },
];

const DIRECTIONS: readonly UiRadioOption[] = [
  {
    label: 'Left to right',
    value: 'ltr',
    helperText: 'English, French, German, and most languages.',
  },
  { label: 'Right to left', value: 'rtl', helperText: 'Arabic, Hebrew, Persian, and Urdu.' },
];

@Component({
  selector: 'app-settings-page',
  imports: [
    FormField,
    NgIcon,
    PageHeader,
    UiAvatarComponent,
    UiButtonComponent,
    UiButtonIconStartDirective,
    UiCheckboxComponent,
    UiComboboxComponent,
    UiDividerComponent,
    UiFileUploadComponent,
    UiInputComponent,
    UiModalComponent,
    UiRadioGroupComponent,
    UiSelectComponent,
    UiSwitchComponent,
    UiTabsComponent,
    UiTagComponent,
    UiTextareaComponent,
    UiTooltipDirective,
  ],
  viewProviders: [provideIcons({ heroTrash, heroUserPlus })],
  template: `
    <app-page-header
      title="Settings"
      description="Manage your profile, team, and workspace preferences."
    />

    <ui-tabs
      class="mt-6 block"
      variant="underline"
      ariaLabel="Settings sections"
      [tabs]="tabs"
      [active]="activeTab()"
      (activeChange)="selectTab($event)"
    >
      <div class="pt-6">
        @switch (activeTab()) {
          @case ('profile') {
            <form
              class="grid gap-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:grid-cols-[14rem_minmax(0,1fr)] dark:border-slate-800 dark:bg-slate-900"
              novalidate
              (submit)="saveProfile($event)"
            >
              <div>
                <h2 class="text-sm font-semibold text-slate-900 dark:text-white">Public profile</h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  How teammates see you across the workspace.
                </p>
              </div>
              <div class="grid gap-5">
                <div class="flex items-center gap-4">
                  <ui-avatar
                    size="lg"
                    [label]="profileModel().name || 'Maya Chen'"
                    [src]="avatarUrl()"
                    alt="Profile photo"
                  />
                  <ui-file-upload
                    class="min-w-0 flex-1"
                    accept="image/png,image/jpeg,image/webp"
                    [maxFileSize]="2 * 1024 * 1024"
                    [maxFiles]="1"
                    ariaLabel="Profile photo"
                    chooseLabel="Upload photo"
                    dropLabel="or drop an image here"
                    helperText="PNG, JPG, or WebP up to 2 MB."
                    (filesChange)="setAvatar($event)"
                  />
                </div>
                <div class="grid gap-4 sm:grid-cols-2">
                  <ui-input
                    label="Full name"
                    autocomplete="name"
                    [errorText]="error(profileForm.name())"
                    [formField]="profileForm.name"
                  />
                  <ui-input
                    label="Email"
                    type="email"
                    autocomplete="email"
                    [errorText]="error(profileForm.email())"
                    [formField]="profileForm.email"
                  />
                  <ui-input
                    label="Job title"
                    autocomplete="organization-title"
                    [formField]="profileForm.title"
                  />
                  <ui-select
                    label="Time zone"
                    [options]="timezones"
                    [formField]="profileForm.timezone"
                  />
                  <ui-textarea
                    class="sm:col-span-2"
                    label="Bio"
                    [rows]="3"
                    [maxLength]="200"
                    helperText="A sentence or two about what you work on."
                    [formField]="profileForm.bio"
                  />
                </div>
                <div class="flex justify-end gap-2">
                  <ui-button variant="ghost" (pressed)="resetProfile()">Reset</ui-button>
                  <ui-button type="submit" [loading]="savingProfile()" loadingLabel="Saving profile"
                    >Save profile</ui-button
                  >
                </div>
              </div>
            </form>
          }
          @case ('team') {
            <section
              class="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
              aria-labelledby="team-heading"
            >
              <div class="flex flex-wrap items-center justify-between gap-3 p-5">
                <div>
                  <h2
                    id="team-heading"
                    class="text-sm font-semibold text-slate-900 dark:text-white"
                  >
                    Team members
                  </h2>
                  <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {{ team.members().length }} people have access to this workspace.
                  </p>
                </div>
                <ui-button size="sm" data-testid="invite-member" (pressed)="inviteOpen.set(true)">
                  <ng-icon uiButtonIconStart name="heroUserPlus" size="16" aria-hidden="true" />
                  Invite member
                </ui-button>
              </div>
              <ul
                class="divide-y divide-slate-100 border-t border-slate-200 dark:divide-slate-800 dark:border-slate-800"
              >
                @for (member of team.members(); track member.id) {
                  <li class="flex items-center gap-3 px-5 py-3">
                    <ui-avatar size="sm" [label]="member.name" />
                    <span class="min-w-0 flex-1">
                      <span
                        class="block truncate text-sm font-medium text-slate-900 dark:text-white"
                        >{{ member.name }}</span
                      >
                      <span class="block truncate text-xs text-slate-500 dark:text-slate-400">{{
                        member.email
                      }}</span>
                    </span>
                    @if (member.status === 'Invited') {
                      <ui-tag size="sm" variant="warning">Invited</ui-tag>
                    }
                    <ui-tag size="sm" [variant]="member.role === 'Owner' ? 'info' : 'default'">{{
                      member.role
                    }}</ui-tag>
                    @if (member.role !== 'Owner') {
                      <button
                        type="button"
                        class="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-2 focus-visible:outline-blue-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
                        [uiTooltip]="'Remove ' + member.name"
                        [attr.aria-label]="'Remove ' + member.name"
                        (click)="removeMember(member)"
                      >
                        <ng-icon name="heroTrash" size="16" aria-hidden="true" />
                      </button>
                    } @else {
                      <span class="size-8" aria-hidden="true"></span>
                    }
                  </li>
                }
              </ul>
            </section>
          }
          @case ('notifications') {
            <form
              class="grid gap-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900"
              (submit)="saveNotifications($event)"
            >
              <div class="grid gap-4 lg:grid-cols-[14rem_minmax(0,1fr)]">
                <div>
                  <h2 class="text-sm font-semibold text-slate-900 dark:text-white">Email alerts</h2>
                  <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Sent as soon as something happens.
                  </p>
                </div>
                <div class="grid gap-4">
                  <ui-switch
                    label="New orders"
                    helperText="Every paid order."
                    [formField]="notificationForm.orders"
                  />
                  <ui-switch
                    label="Refunds and disputes"
                    helperText="When money leaves your account."
                    [formField]="notificationForm.refunds"
                  />
                  <ui-switch
                    label="New customers"
                    helperText="When an account is created."
                    [formField]="notificationForm.customers"
                  />
                </div>
              </div>
              <ui-divider />
              <div class="grid gap-4 lg:grid-cols-[14rem_minmax(0,1fr)]">
                <div>
                  <h2 class="text-sm font-semibold text-slate-900 dark:text-white">Digests</h2>
                  <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Summaries delivered on a schedule.
                  </p>
                </div>
                <div class="grid gap-3">
                  <ui-checkbox
                    label="Weekly performance report"
                    [formField]="notificationForm.weekly"
                  />
                  <ui-checkbox
                    label="Monthly billing summary"
                    [formField]="notificationForm.monthly"
                  />
                  <ui-checkbox
                    label="Product news and tips"
                    [formField]="notificationForm.product"
                  />
                </div>
              </div>
              <div class="flex justify-end">
                <ui-button type="submit">Save preferences</ui-button>
              </div>
            </form>
          }
          @case ('appearance') {
            <section
              class="grid gap-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900"
              aria-label="Appearance"
            >
              <div class="grid gap-4 lg:grid-cols-[14rem_minmax(0,1fr)]">
                <div>
                  <h2 class="text-sm font-semibold text-slate-900 dark:text-white">Theme</h2>
                  <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Applies immediately and is saved in this browser.
                  </p>
                </div>
                <ui-radio-group
                  label="Color theme"
                  [options]="themes"
                  [formField]="appearanceForm.theme"
                />
              </div>
              <ui-divider />
              <div class="grid gap-4 lg:grid-cols-[14rem_minmax(0,1fr)]">
                <div>
                  <h2 class="text-sm font-semibold text-slate-900 dark:text-white">
                    Text direction
                  </h2>
                  <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Every NgNova UI component mirrors for right-to-left languages.
                  </p>
                </div>
                <ui-radio-group
                  label="Layout direction"
                  [options]="directions"
                  [formField]="appearanceForm.direction"
                />
              </div>
            </section>
          }
        }
      </div>
    </ui-tabs>

    <ui-modal size="sm" [open]="inviteOpen()" (openChange)="inviteOpen.set($event)">
      <span uiModalHeader>Invite a team member</span>
      <form class="grid gap-4" novalidate (submit)="sendInvite($event)">
        <ui-input
          label="Email address"
          type="email"
          placeholder="name@company.com"
          [errorText]="error(inviteForm.email())"
          [formField]="inviteForm.email"
        />
        <ui-combobox
          label="Role"
          placeholder="Choose a role"
          [options]="roles"
          [errorText]="error(inviteForm.role())"
          [formField]="inviteForm.role"
        />
      </form>
      <ng-container uiModalFooter>
        <ui-button variant="ghost" (pressed)="inviteOpen.set(false)">Cancel</ui-button>
        <ui-button [loading]="inviting()" loadingLabel="Sending invitation" (pressed)="sendInvite()"
          >Send invite</ui-button
        >
      </ng-container>
    </ui-modal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPage {
  protected readonly team = inject(TeamService);
  private readonly preferences = inject(PreferencesService);
  private readonly confirmation = inject(UiConfirmationService);
  private readonly toast = inject(UiToastService);
  private readonly router = inject(Router);

  /** Bound from `?tab=`. */
  readonly tab = input<string>();

  protected readonly tabs = TABS;
  protected readonly timezones = TIMEZONES;
  protected readonly roles = ROLES;
  protected readonly themes = THEMES;
  protected readonly directions = DIRECTIONS;
  protected readonly error = fieldError;

  protected readonly activeTab = linkedSignal(() =>
    TABS.some((item) => item.value === this.tab()) ? (this.tab() as string) : 'profile',
  );

  private readonly savedProfile = {
    name: 'Maya Chen',
    email: 'maya@northstar.app',
    title: 'Head of Operations',
    timezone: 'America/Los_Angeles',
    bio: 'Keeps orders moving and customers happy.',
  };
  protected readonly profileModel = signal({ ...this.savedProfile });
  protected readonly profileForm = form(this.profileModel, (path) => {
    required(path.name, { message: 'Enter your name.' });
    required(path.email, { message: 'Enter your email address.' });
    email(path.email, { message: 'Enter a valid email address.' });
  });
  protected readonly savingProfile = signal(false);
  protected readonly avatarUrl = signal('');

  protected readonly notificationModel = signal({
    orders: true,
    refunds: true,
    customers: false,
    weekly: true,
    monthly: true,
    product: false,
  });
  protected readonly notificationForm = form(this.notificationModel);

  protected readonly appearanceModel = linkedSignal(() => ({
    theme: this.preferences.theme() as string,
    direction: this.preferences.direction() as string,
  }));
  protected readonly appearanceForm = form(this.appearanceModel);

  protected readonly inviteOpen = signal(false);
  protected readonly inviting = signal(false);
  private readonly inviteModel = signal({ email: '', role: '' });
  protected readonly inviteForm = form(this.inviteModel, (path) => {
    required(path.email, { message: 'Enter an email address.' });
    email(path.email, { message: 'Enter a valid email address.' });
    required(path.role, { message: 'Choose a role.' });
  });

  constructor() {
    // Appearance choices apply as soon as they are picked.
    effect(() => {
      const { theme, direction } = this.appearanceModel();
      this.preferences.theme.set(theme as ThemePreference);
      this.preferences.direction.set(direction as DirectionPreference);
    });
    effect(() => {
      if (this.inviteOpen()) {
        this.inviteModel.set({ email: '', role: '' });
        this.inviteForm().reset();
      }
    });
  }

  protected selectTab(tab: string): void {
    this.activeTab.set(tab);
    void this.router.navigate([], { queryParams: { tab }, replaceUrl: true });
  }

  protected setAvatar(files: readonly File[]): void {
    const previous = this.avatarUrl();
    if (previous) URL.revokeObjectURL(previous);
    this.avatarUrl.set(files[0] ? URL.createObjectURL(files[0]) : '');
  }

  protected resetProfile(): void {
    this.profileModel.set({ ...this.savedProfile });
    this.profileForm().reset();
  }

  protected async saveProfile(event: Event): Promise<void> {
    event.preventDefault();
    await submit(this.profileForm, async () => {
      this.savingProfile.set(true);
      await new Promise((resolve) => setTimeout(resolve, 400));
      this.savingProfile.set(false);
      Object.assign(this.savedProfile, this.profileModel());
      this.toast.success('Profile saved');
      return undefined;
    });
  }

  protected saveNotifications(event: Event): void {
    event.preventDefault();
    this.toast.success('Notification preferences saved');
  }

  protected async sendInvite(event?: Event): Promise<void> {
    event?.preventDefault();
    await submit(this.inviteForm, async () => {
      this.inviting.set(true);
      try {
        const { email: address, role } = this.inviteModel();
        await this.team.invite(address, role as TeamMember['role']);
        this.inviteOpen.set(false);
        this.toast.success('Invitation sent', `${address} can join as ${role}.`);
      } finally {
        this.inviting.set(false);
      }
      return undefined;
    });
  }

  protected async removeMember(member: TeamMember): Promise<void> {
    const result = await this.confirmation.confirm({
      title: `Remove ${member.name}?`,
      message: 'They will lose access to this workspace immediately.',
      confirmLabel: 'Remove',
      intent: 'danger',
    });
    if (!result.confirmed) return;
    await this.team.remove(member.id);
    this.toast.success(`${member.name} was removed`);
  }
}
