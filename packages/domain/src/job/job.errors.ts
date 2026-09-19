import { DomainError } from '../shared/domain-error.js';

export class JobNotFoundError extends DomainError {
  readonly code = 'JOB_NOT_FOUND';
  readonly httpStatus = 404;

  constructor(identifier: string) {
    super('Job not found', { context: { identifier } });
  }
}

export class DuplicateJobError extends DomainError {
  readonly code = 'DUPLICATE_JOB';
  readonly httpStatus = 409;

  constructor(companyId: string, provider: string, externalId: string) {
    super('Job already exists for this company and provider', {
      context: { companyId, provider, externalId },
    });
  }
}