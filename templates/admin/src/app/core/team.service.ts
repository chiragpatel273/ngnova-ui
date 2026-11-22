import { inject, Injectable, signal } from '@angular/core';

import { API_LATENCY, wait } from './api-latency';
import { MOCK_TEAM } from './mock-data';
import type { TeamMember } from './models';

@Injectable({ providedIn: 'root' })
export class TeamService {
  private readonly latency = inject(API_LATENCY);
  private readonly state = signal<readonly TeamMember[]>(MOCK_TEAM);

  readonly members = this.state.asReadonly();

  async invite(email: string, role: TeamMember['role']): Promise<TeamMember> {
    await wait(this.latency);
    const member: TeamMember = {
      id: `USR-${Date.now()}`,
      name: email
        .split('@')[0]
        .replace(/[._-]+/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase()),
      email,
      role,
      status: 'Invited',
    };
    this.state.update((members) => [...members, member]);
    return member;
  }

  async remove(id: string): Promise<void> {
    await wait(this.latency);
    this.state.update((members) => members.filter((member) => member.id !== id));
  }
}
