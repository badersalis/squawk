// ---------------------------------------------------------------------------
// @company-first/domain — public API
//
// This is the ONLY entrypoint other packages are allowed to import from.
// Internal paths (src/**) are not part of the public surface.
// ---------------------------------------------------------------------------

// shared
export type { Location } from './shared/location.js';
export { locationFromRaw, locationsEqual } from './shared/location.js';

export { slugify, isValidSlug } from './shared/slug.js';

export { isHttpUrl, assertHttpUrl } from './shared/url.js';

export { DomainError } from './shared/domain-error.js';

// company
export type { CompanyProps } from './company/company.entity.js';
export { Company } from './company/company.entity.js';
export type { CompanyStatus } from './company/company.status.js';
export { COMPANY_STATUSES, isCompanyStatus } from './company/company.status.js';
export type { CompanyRepository, CompanySearchCriteria, CompanySearchResult } from './company/company.repository.js';
export {
  CompanyNotFoundError,
  CompanySlugTakenError,
} from './company/company.errors.js';

// job
export type { JobProps } from './job/job.entity.js';
export { Job } from './job/job.entity.js';
export type {
  JobStatus,
  WorkMode,
  EmploymentType,
  Seniority,
  JobProvider,
} from './job/job.enums.js';
export {
  JOB_STATUSES,
  WORK_MODES,
  EMPLOYMENT_TYPES,
  SENIORITIES,
  JOB_PROVIDERS,
} from './job/job.enums.js';
export {
  applyLifecycleTransition,
  closeExpiredJobs,
  reviveJobIfReappeared,
  DEFAULT_CLOSE_AFTER_MISSES,
  type LifecycleEvent,
  type LifecycleDecision,
} from './job/job.lifecycle.js';
export type { JobRepository, JobSearchCriteria, JobSearchResult } from './job/job.repository.js';
export {
  JobNotFoundError,
  DuplicateJobError,
} from './job/job.errors.js';

// user
export type { UserProps } from './user/user.entity.js';
export { User } from './user/user.entity.js';
export type { UserRepository } from './user/user.repository.js';
export {
  UserNotFoundError,
  EmailAlreadyRegisteredError,
} from './user/user.errors.js';

// follow
export type { FollowProps } from './follow/follow.entity.js';
export { Follow } from './follow/follow.entity.js';
export type { FollowRepository, FollowedCompany } from './follow/follow.repository.js';
export {
  AlreadyFollowingError,
  NotFollowingError,
} from './follow/follow.errors.js';

// saved-job
export type { SavedJobProps } from './saved-job/saved-job.entity.js';
export { SavedJob } from './saved-job/saved-job.entity.js';
export type { SavedJobRepository, SavedJobWithJob } from './saved-job/saved-job.repository.js';
export {
  AlreadySavedJobError,
  NotSavedJobError,
} from './saved-job/saved-job.errors.js';

// saved-search
export type { SavedSearchProps } from './saved-search/saved-search.entity.js';
export { SavedSearch } from './saved-search/saved-search.entity.js';
export type { SavedSearchCriteria } from './saved-search/saved-search.criteria.js';
export { EMPTY_CRITERIA } from './saved-search/saved-search.criteria.js';
export { matchesSavedSearch } from './saved-search/saved-search.matcher.js';
export type { SavedSearchRepository } from './saved-search/saved-search.repository.js';
export { SavedSearchNotFoundError } from './saved-search/saved-search.errors.js';

// ingestion
export type { JobSource } from './ingestion/job-source.port.js';
export type { RawJob } from './ingestion/raw-job.js';
export {
  normalizeWorkMode,
  normalizeEmploymentType,
  normalizeSeniority,
  normalizeLocation,
  normalizeLocations,
} from './ingestion/normalizer.js';

// notification
export type {
  Notification,
  NotificationType,
} from './notification/notification.js';
export type { NotificationSender } from './notification/notification-sender.port.js';