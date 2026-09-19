import type { Follow } from './follow.entity.js';

export interface FollowedCompany {
  companyId: string;
  followedAt: Date;
}

export interface FollowRepository {
  find(input: { userId: string; companyId: string }): Promise<Follow | null>;
  listFollowedCompanies(userId: string): Promise<FollowedCompany[]>;
  create(input: { userId: string; companyId: string }): Promise<Follow>;
  delete(input: { userId: string; companyId: string }): Promise<void>;
  /** Used by the notification fan-out to know who follows a company. */
  listFollowerIds(companyId: string): Promise<string[]>;
}