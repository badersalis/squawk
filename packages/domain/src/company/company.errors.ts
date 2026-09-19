import { DomainError } from '../shared/domain-error.js';

export class CompanyNotFoundError extends DomainError {
  readonly code = 'COMPANY_NOT_FOUND';
  readonly httpStatus = 404;

  constructor(identifier: string) {
    super('Company not found', { context: { identifier } });
  }
}

export class CompanySlugTakenError extends DomainError {
  readonly code = 'COMPANY_SLUG_TAKEN';
  readonly httpStatus = 409;

  constructor(slug: string) {
    super('A company with this slug already exists', { context: { slug } });
  }
}