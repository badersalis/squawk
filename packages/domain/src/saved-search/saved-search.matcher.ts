import type { Company } from '../company/company.entity.js';
import type { Job } from '../job/job.entity.js';
import type { SavedSearchCriteria } from './saved-search.criteria.js';

/**
 * Pure matching function. Given a saved search's criteria and a (job,
 * company) pair, decide whether the job qualifies.
 *
 * Semantics:
 *   - Every present criterion is ANDed with the others.
 *   - Within a single criterion, the values are ORed.
 *   - Empty arrays and undefined fields are ignored.
 *   - Unknown / unmappable values in criteria never cause a crash.
 */
export function matchesSavedSearch(
  criteria: SavedSearchCriteria,
  job: Job,
  company: Company,
): boolean {
  if (criteria.companyIds?.length) {
    if (!criteria.companyIds.includes(job.companyId)) return false;
  }

  if (criteria.industries?.length) {
    const industry = company.industry;
    if (!industry) return false;
    if (!criteria.industries.some((i) => i.toLowerCase() === industry.toLowerCase())) {
      return false;
    }
  }

  if (criteria.workMode?.length) {
    if (!criteria.workMode.includes(job.workMode)) return false;
  }

  if (criteria.employmentType?.length) {
    if (!criteria.employmentType.includes(job.employmentType)) return false;
  }

  if (criteria.seniority?.length) {
    if (!criteria.seniority.includes(job.seniority)) return false;
  }

  if (criteria.locations?.length) {
    if (!matchesAnyLocation(criteria.locations, job.locations, company.locations)) {
      return false;
    }
  }

  if (criteria.keywords?.length) {
    if (!matchesAnyKeyword(criteria.keywords, job)) return false;
  }

  return true;
}

function matchesAnyLocation(
  wanted: readonly string[],
  jobLocations: readonly { raw: string; city: string | null; countryCode: string | null }[],
  companyLocations: readonly { raw: string; city: string | null; countryCode: string | null }[],
): boolean {
  const haystack = [...jobLocations, ...companyLocations].map((l) =>
    `${l.raw} ${l.city ?? ''} ${l.countryCode ?? ''}`.toLowerCase(),
  );
  return wanted.some((needle) =>
    haystack.some((h) => h.includes(needle.toLowerCase())),
  );
}

function matchesAnyKeyword(keywords: readonly string[], job: Job): boolean {
  const haystack = [
    job.title,
    job.description,
    job.department ?? '',
  ]
    .join(' ')
    .toLowerCase();
  return keywords.some((k) => haystack.includes(k.toLowerCase()));
}