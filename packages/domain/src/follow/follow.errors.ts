import { DomainError } from '../shared/domain-error.js';

export class AlreadyFollowingError extends DomainError {
  readonly code = 'ALREADY_FOLLOWING';
  readonly httpStatus = 409;

  constructor(userId: string, companyId: string) {
    super('You already follow this company', {
      context: { userId, companyId },
    });
  }
}

export class NotFollowingError extends DomainError {
  readonly code = 'NOT_FOLLOWING';
  readonly httpStatus = 404;

  constructor(userId: string, companyId: string) {
    super('You do not follow this company', {
      context: { userId, companyId },
    });
  }
}