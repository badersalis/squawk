export type NotificationType =
  | 'NEW_JOBS_FROM_FOLLOWED_COMPANY'
  | 'NEW_JOBS_MATCHING_SAVED_SEARCH';

export interface Notification {
  /** Stable id used by the sender for deduplication. */
  id: string;
  userId: string;
  type: NotificationType;
  payload: {
    jobIds: string[];
    companyIds?: string[];
    savedSearchId?: string;
  };
  createdAt: Date;
}