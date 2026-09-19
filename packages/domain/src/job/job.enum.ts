export type JobStatus = 'ACTIVE' | 'POSSIBLY_CLOSED' | 'CLOSED';
export type WorkMode = 'REMOTE' | 'HYBRID' | 'ONSITE' | 'UNKNOWN';
export type EmploymentType =
  | 'FULL_TIME'
  | 'PART_TIME'
  | 'CONTRACT'
  | 'INTERNSHIP'
  | 'TEMPORARY'
  | 'UNKNOWN';
export type Seniority =
  | 'INTERN'
  | 'JUNIOR'
  | 'MID'
  | 'SENIOR'
  | 'STAFF'
  | 'PRINCIPAL'
  | 'UNKNOWN';
export type JobProvider =
  | 'GREENHOUSE'
  | 'ASHBY'
  | 'LEVER'
  | 'WORKDAY'
  | 'CUSTOM';

export const JOB_STATUSES: readonly JobStatus[] = [
  'ACTIVE',
  'POSSIBLY_CLOSED',
  'CLOSED',
] as const;

export const WORK_MODES: readonly WorkMode[] = [
  'REMOTE',
  'HYBRID',
  'ONSITE',
  'UNKNOWN',
] as const;

export const EMPLOYMENT_TYPES: readonly EmploymentType[] = [
  'FULL_TIME',
  'PART_TIME',
  'CONTRACT',
  'INTERNSHIP',
  'TEMPORARY',
  'UNKNOWN',
] as const;

export const SENIORITIES: readonly Seniority[] = [
  'INTERN',
  'JUNIOR',
  'MID',
  'SENIOR',
  'STAFF',
  'PRINCIPAL',
  'UNKNOWN',
] as const;

export const JOB_PROVIDERS: readonly JobProvider[] = [
  'GREENHOUSE',
  'ASHBY',
  'LEVER',
  'WORKDAY',
  'CUSTOM',
] as const;