import { InjectionToken } from '@angular/core';

/**
 * Simulated network latency for the mock services, in milliseconds. Tests provide 0. Delete this
 * token once the services call a real API.
 */
export const API_LATENCY = new InjectionToken<number>('API_LATENCY', {
  providedIn: 'root',
  factory: () => 450,
});

export function wait(milliseconds: number): Promise<void> {
  return milliseconds > 0
    ? new Promise((resolve) => setTimeout(resolve, milliseconds))
    : Promise.resolve();
}
