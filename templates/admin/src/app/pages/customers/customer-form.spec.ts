import { Component, signal } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type { CustomerDraft } from '../../core/models';
import { CustomerForm } from './customer-form';

@Component({
  imports: [CustomerForm],
  template: `<app-customer-form
    [open]="open()"
    [saveAction]="save"
    (openChange)="open.set($event)"
  />`,
})
class Host {
  readonly open = signal(true);
  readonly saved: CustomerDraft[] = [];
  readonly save = async (draft: CustomerDraft): Promise<void> => {
    this.saved.push(draft);
  };
}

function type(fixture: ComponentFixture<Host>, label: string, value: string): void {
  const input = Array.from(document.querySelectorAll<HTMLInputElement>('input')).find((element) =>
    element.labels?.[0]?.textContent?.includes(label),
  );
  if (!input) throw new Error(`No input labelled ${label}`);
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('blur'));
  fixture.detectChanges();
}

function clickButton(fixture: ComponentFixture<Host>, text: string): void {
  const button = Array.from(document.querySelectorAll('button')).find(
    (element) => element.textContent?.trim() === text,
  );
  if (!button) throw new Error(`No button "${text}"`);
  button.click();
  fixture.detectChanges();
}

describe('CustomerForm', () => {
  let fixture: ComponentFixture<Host>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('shows validation messages and does not save an empty form', async () => {
    clickButton(fixture, 'Add customer');
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.saved).toEqual([]);
    expect(document.body.textContent).toContain('Enter the customer’s name.');
    expect(document.body.textContent).toContain('Enter an email address.');
  });

  it('saves a valid customer and closes', async () => {
    type(fixture, 'Full name', 'Grace Hopper');
    type(fixture, 'Email', 'grace@example.com');
    type(fixture, 'Company', 'Navy Labs');

    clickButton(fixture, 'Add customer');
    await fixture.whenStable();

    expect(fixture.componentInstance.saved).toHaveLength(1);
    expect(fixture.componentInstance.saved[0]).toMatchObject({
      name: 'Grace Hopper',
      email: 'grace@example.com',
      company: 'Navy Labs',
      plan: 'Starter',
    });
    expect(fixture.componentInstance.open()).toBe(false);
  });
});
