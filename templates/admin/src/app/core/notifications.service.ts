import { computed, Injectable, signal } from '@angular/core';

export interface AppNotification {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly minutesAgo: number;
  readonly link: string;
  readonly read: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly state = signal<readonly AppNotification[]>([
    {
      id: 'n1',
      title: 'Payout scheduled',
      detail: '$18,420 will reach your bank on Friday.',
      minutesAgo: 12,
      link: '/',
      read: false,
    },
    {
      id: 'n2',
      title: '3 orders need fulfillment',
      detail: 'They were paid more than 24 hours ago.',
      minutesAgo: 48,
      link: '/orders',
      read: false,
    },
    {
      id: 'n3',
      title: 'New enterprise customer',
      detail: 'Hooli upgraded to the Enterprise plan.',
      minutesAgo: 190,
      link: '/customers',
      read: true,
    },
  ]);

  readonly notifications = this.state.asReadonly();
  readonly unread = computed(() => this.state().filter((item) => !item.read).length);

  markRead(id: string): void {
    this.state.update((items) =>
      items.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
  }

  markAllRead(): void {
    this.state.update((items) => items.map((item) => ({ ...item, read: true })));
  }
}
