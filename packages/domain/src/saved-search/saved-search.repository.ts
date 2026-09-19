import type { SavedSearch } from './saved-search.entity.js';

export interface SavedSearchRepository {
  findById(id: string): Promise<SavedSearch | null>;
  listByUser(userId: string): Promise<SavedSearch[]>;
  /** All saved searches that have not been notified since `since`. */
  listPendingNotification(since: Date): Promise<SavedSearch[]>;
  create(search: SavedSearch): Promise<SavedSearch>;
  update(search: SavedSearch): Promise<SavedSearch>;
  delete(id: string): Promise<void>;
  markNotified(id: string, at: Date): Promise<void>;
}