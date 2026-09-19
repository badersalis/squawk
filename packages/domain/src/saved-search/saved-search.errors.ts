import { DomainError } from '../shared/domain-error.js';

export class SavedSearchNotFoundError extends DomainError {
  readonly code = 'SAVED_SEARCH_NOT_FOUND';
  readonly httpStatus = 404;

  constructor(identifier: string) {
    super('Saved search not found', { context: { identifier } });
  }
}