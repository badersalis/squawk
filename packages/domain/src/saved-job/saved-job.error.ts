import { DomainError } from '../shared/domain-error.js';

export class AlreadySavedJobError extends DomainError {
  readonly code = 'ALREADY_SAVED_JOB';
  readonly httpStatus = 409;

  constructor(userId: string, jobId: string) {
    super('Job is already saved', { context: { userId, jobId } });
  }
}

export class NotSavedJobError extends DomainError {
  readonly code = 'NOT_SAVED_JOB';
  readonly httpStatus = 404;

  constructor(userId: string, jobId: string) {
    super('Job is not saved', { context: { userId, jobId } });
  }
}