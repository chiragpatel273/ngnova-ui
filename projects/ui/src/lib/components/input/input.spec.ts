import { Component, EnvironmentInjector, createEnvironmentInjector, signal } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import type { ValidationErrors } from '@angular/forms';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { UiInputComponent } from '../../../../input/src/input';
import { UI_INPUT_LABELS, provideUiInputLabels } from '../../../../input/src/input-labels';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, UiInputComponent],
  template: `<ui-input label="Email" helperText="Use work email" [formControl]="control" />`,
})
class HostComponent {
  control = new FormControl('hello@example.com');
}

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, UiInputComponent],
  template: `
    <ui-input
      label="Name"
      maxLength="10"
      clearable
      [formControl]="control"
      [validationMessages]="{ required: 'Name is required.' }"
    >
      <span uiInputPrefix>@</span>
      <span uiInputSuffix>.com</span>
    </ui-input>
  `,
})
class RichHostComponent {
  control = new FormControl('', { nonNullable: true, validators: [Validators.required] });
}

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, UiInputComponent],
  template: `
    <ui-input
      label="Password"
      type="password"
      labelMode="floating"
      counterMode="words"
      counterMax="3"
      intent="warning"
      revealable
      [formControl]="control"
      (submitted)="submittedValue = $event"
    />
  `,
})
class PremiumHostComponent {
  control = new FormControl('alpha beta gamma delta', { nonNullable: true });
  submittedValue = '';
}

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, UiInputComponent],
  template: `
    <ui-input
      label="Search"
      [formControl]="control"
      (valueChange)="valueChanges.set(valueChanges() + 1)"
    />
  `,
})
class ValueChangeHostComponent {
  control = new FormControl('initial', { nonNullable: true });
  readonly valueChanges = signal(0);
}

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, UiInputComponent],
  template: `
    <ui-input label="Code" [formControl]="control" [validationMessages]="validationMessages" />
  `,
})
class LabelsHostComponent {
  errors: ValidationErrors | null = null;
  validationMessages: Record<string, string> = {};
  readonly control = new FormControl('', { nonNullable: true, validators: () => this.errors });
}

describe('UiInputComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent, RichHostComponent, PremiumHostComponent, ValueChangeHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('works as a ControlValueAccessor', () => {
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('hello@example.com');

    input.value = 'team@example.com';
    input.dispatchEvent(new Event('input'));

    expect(fixture.componentInstance.control.value).toBe('team@example.com');
  });

  it('does not emit valueChange from reactive form writes, but emits for user input', () => {
    const valueChangeFixture = TestBed.createComponent(ValueChangeHostComponent);
    valueChangeFixture.detectChanges();

    valueChangeFixture.componentInstance.control.setValue('programmatic');
    valueChangeFixture.detectChanges();

    expect(valueChangeFixture.componentInstance.valueChanges()).toBe(0);

    const input = valueChangeFixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'typed';
    input.dispatchEvent(new Event('input'));
    valueChangeFixture.detectChanges();

    expect(valueChangeFixture.componentInstance.control.value).toBe('typed');
    expect(valueChangeFixture.componentInstance.valueChanges()).toBe(1);
  });

  it('syncs disabled state from Angular forms to the native input', () => {
    fixture.componentInstance.control.disable();
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.disabled).toBe(true);

    fixture.componentInstance.control.enable();
    fixture.detectChanges();

    expect(input.disabled).toBe(false);
  });

  it('keeps aria-describedby aligned with a custom input id', () => {
    const inputFixture = TestBed.createComponent(UiInputComponent);
    inputFixture.componentInstance.inputId = 'email-field';
    inputFixture.componentInstance.helperText = 'Use work email';
    inputFixture.detectChanges();

    const input = inputFixture.nativeElement.querySelector('input') as HTMLInputElement;
    const message = inputFixture.nativeElement.querySelector('p') as HTMLParagraphElement;

    expect(input.getAttribute('aria-describedby')).toBe('email-field-message');
    expect(message.id).toBe('email-field-message');
  });

  it('emits native-aligned focus and blur outputs', () => {
    const inputFixture = TestBed.createComponent(UiInputComponent);
    let focused = false;
    let blurred = false;
    inputFixture.nativeElement.addEventListener('focus', () => {
      focused = true;
    });
    inputFixture.nativeElement.addEventListener('blur', () => {
      blurred = true;
    });
    inputFixture.detectChanges();

    const input = inputFixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new FocusEvent('focus'));
    input.dispatchEvent(new FocusEvent('blur'));

    expect(focused).toBe(true);
    expect(blurred).toBe(true);
  });

  it('projects prefix and suffix content', () => {
    const richFixture = TestBed.createComponent(RichHostComponent);
    richFixture.detectChanges();

    expect(richFixture.nativeElement.textContent).toContain('@');
    expect(richFixture.nativeElement.textContent).toContain('.com');
  });

  it('shows a counter and clears the value', () => {
    const richFixture = TestBed.createComponent(RichHostComponent);
    richFixture.componentInstance.control.setValue('alice');
    richFixture.detectChanges();

    expect(richFixture.nativeElement.textContent).toContain('5 / 10');

    richFixture.nativeElement.querySelector('button').click();
    richFixture.detectChanges();

    expect(richFixture.componentInstance.control.value).toBe('');
  });

  it('uses Angular validation state for error messages', () => {
    const richFixture = TestBed.createComponent(RichHostComponent);
    richFixture.componentInstance.control.markAsTouched();
    richFixture.detectChanges();

    const input = richFixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(richFixture.nativeElement.textContent).toContain('Name is required.');
  });

  it('supports floating labels, warning intent, and word counters', () => {
    const premiumFixture = TestBed.createComponent(PremiumHostComponent);
    premiumFixture.detectChanges();

    const input = premiumFixture.nativeElement.querySelector('input') as HTMLInputElement;
    const label = premiumFixture.nativeElement.querySelector('label') as HTMLLabelElement;

    expect(input.type).toBe('password');
    expect(label.className).toContain('top-1');
    expect(premiumFixture.nativeElement.textContent).toContain('4 / 3');
    expect(premiumFixture.nativeElement.textContent).toContain('Show');
  });

  it('toggles password visibility and emits submitted value', () => {
    const premiumFixture = TestBed.createComponent(PremiumHostComponent);
    premiumFixture.detectChanges();

    const input = premiumFixture.nativeElement.querySelector('input') as HTMLInputElement;
    const button = premiumFixture.nativeElement.querySelector('button') as HTMLButtonElement;

    button.click();
    premiumFixture.detectChanges();

    expect(input.type).toBe('text');
    expect(button.getAttribute('aria-pressed')).toBe('true');

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    premiumFixture.detectChanges();

    expect(premiumFixture.componentInstance.submittedValue).toBe('alpha beta gamma delta');
  });
});

describe('UiInputComponent labels', () => {
  const FRENCH_BUTTON_LABELS = {
    clear: 'Effacer la saisie',
    clearText: 'Effacer',
    showPassword: 'Afficher le mot de passe',
    showText: 'Afficher',
    hidePassword: 'Masquer le mot de passe',
    hideText: 'Masquer',
  };

  function renderMessage(
    errors: ValidationErrors,
    validationMessages: Record<string, string> = {},
  ): string | undefined {
    const fixture = TestBed.createComponent(LabelsHostComponent);
    fixture.componentInstance.errors = errors;
    fixture.componentInstance.validationMessages = validationMessages;
    fixture.componentInstance.control.markAsTouched();
    fixture.detectChanges();
    const message = (fixture.nativeElement.querySelector('p') as HTMLParagraphElement | null)
      ?.textContent;
    fixture.destroy();
    return message?.trim();
  }

  function renderPasswordButtons(): ComponentFixture<UiInputComponent> {
    const fixture = TestBed.createComponent(UiInputComponent);
    fixture.componentRef.setInput('type', 'password');
    fixture.componentRef.setInput('clearable', true);
    fixture.componentRef.setInput('revealable', true);
    fixture.componentInstance.writeValue('secret');
    return fixture;
  }

  function buttons(fixture: ComponentFixture<UiInputComponent>): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('button'));
  }

  it('defaults to English labels without a provider', () => {
    TestBed.configureTestingModule({ imports: [LabelsHostComponent] });

    expect(renderMessage({ email: true })).toBe('Enter a valid email address.');
    expect(renderMessage({ custom: true })).toBe('Enter a valid value.');
    expect(TestBed.inject(UI_INPUT_LABELS).clear).toBe('Clear input');
  });

  it('uses provided labels for the clear and password buttons', () => {
    TestBed.configureTestingModule({ providers: [provideUiInputLabels(FRENCH_BUTTON_LABELS)] });
    const fixture = renderPasswordButtons();
    fixture.detectChanges();
    const [clearButton, revealButton] = buttons(fixture);

    expect(clearButton.getAttribute('aria-label')).toBe('Effacer la saisie');
    expect(clearButton.textContent?.trim()).toBe('Effacer');
    expect(revealButton.getAttribute('aria-label')).toBe('Afficher le mot de passe');
    expect(revealButton.textContent?.trim()).toBe('Afficher');

    revealButton.click();
    fixture.detectChanges();

    expect(revealButton.getAttribute('aria-label')).toBe('Masquer le mot de passe');
    expect(revealButton.textContent?.trim()).toBe('Masquer');
  });

  it('uses provided validation messages merged over the defaults and the fallback', () => {
    TestBed.configureTestingModule({
      imports: [LabelsHostComponent],
      providers: [
        provideUiInputLabels({
          validationMessages: { required: 'Ce champ est obligatoire.' },
          invalidValue: 'Saisissez une valeur valide.',
        }),
      ],
    });

    expect(renderMessage({ required: true })).toBe('Ce champ est obligatoire.');
    expect(renderMessage({ email: true })).toBe('Enter a valid email address.');
    expect(renderMessage({ custom: true })).toBe('Saisissez une valeur valide.');
  });

  it('lets explicit inputs win over provided labels', () => {
    TestBed.configureTestingModule({
      imports: [LabelsHostComponent],
      providers: [
        provideUiInputLabels({
          ...FRENCH_BUTTON_LABELS,
          validationMessages: { required: 'Ce champ est obligatoire.' },
        }),
      ],
    });

    expect(renderMessage({ required: true }, { required: 'Code is required.' })).toBe(
      'Code is required.',
    );

    const fixture = renderPasswordButtons();
    fixture.componentRef.setInput('clearLabel', 'Reset code');
    fixture.componentRef.setInput('showPasswordLabel', 'Reveal code');
    fixture.detectChanges();
    const [clearButton, revealButton] = buttons(fixture);

    expect(clearButton.getAttribute('aria-label')).toBe('Reset code');
    expect(clearButton.textContent?.trim()).toBe('Reset code');
    expect(revealButton.getAttribute('aria-label')).toBe('Reveal code');
    expect(revealButton.textContent?.trim()).toBe('Reveal code');
  });

  it('merges nested providers per validation key', () => {
    TestBed.configureTestingModule({
      providers: [
        provideUiInputLabels({
          validationMessages: { required: 'Obligatoire.' },
          clear: 'Effacer',
        }),
      ],
    });
    const child = createEnvironmentInjector(
      [provideUiInputLabels({ validationMessages: { email: 'Adresse invalide.' } })],
      TestBed.inject(EnvironmentInjector),
    );
    const labels = child.get(UI_INPUT_LABELS);

    expect(labels.clear).toBe('Effacer');
    expect(labels.validationMessages['required']).toBe('Obligatoire.');
    expect(labels.validationMessages['email']).toBe('Adresse invalide.');
    expect(labels.validationMessages['minlength']).toBe('The value is too short.');
    child.destroy();
  });
});
