import type { FieldState } from '@angular/forms/signals';

/** First validation message for a field once the user has interacted with it. */
export function fieldError(state: FieldState<unknown>): string {
  return state.touched() ? (state.errors()[0]?.message ?? '') : '';
}
