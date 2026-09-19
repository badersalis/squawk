import { DomainError } from '../shared/domain-error.js';

export class UserNotFoundError extends DomainError {
  readonly code = 'USER_NOT_FOUND';
  readonly httpStatus = 404;

  constructor(identifier: string) {
    super('User not found', { context: { identifier } });
  }
}

export class EmailAlreadyRegisteredError extends DomainError {
  readonly code = 'EMAIL_ALREADY_REGISTERED';
  readonly httpStatus = 409;

  constructor(email: string) {
    super('Email is already registered', { context: { email } });
  }
}