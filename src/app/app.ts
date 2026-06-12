import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  UiBadgeComponent,
  UiButtonComponent,
  UiCardComponent,
  UiInputComponent,
  UiModalComponent,
  UiTextareaComponent,
} from '@ngnova/ui';

@Component({
  selector: 'app-root',
  imports: [
    ReactiveFormsModule,
    UiBadgeComponent,
    UiButtonComponent,
    UiCardComponent,
    UiInputComponent,
    UiModalComponent,
    UiTextareaComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly modalOpen = signal(false);
  protected readonly email = new FormControl('developer@example.com', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
  protected readonly username = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
  });
  protected readonly bio = new FormControl('Angular library author', {
    nonNullable: true,
    validators: [Validators.maxLength(120)],
  });
}
