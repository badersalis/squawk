import type {
  EmploymentType,
  Seniority,
  WorkMode,
} from '../job/job.enums.js';

/**
 * Criteria are intentionally a plain object stored as JSONB at the
 * persistence layer. New fields can be added without a migration; the
 * matcher ignores anything it does not recognize.
 *
 * Unknown fields are preserved on write so future versions of the matcher
 * can act on them.
 */
export interface SavedSearchCriteria {
  keywords?: string[];
  companyIds?: string[];
  industries?: string[];
  locations?: string[];
  workMode?: WorkMode[];
  employmentType?: EmploymentType[];
  seniority?: Seniority[];
}

export const EMPTY_CRITERIA: SavedSearchCriteria = Object.freeze({});