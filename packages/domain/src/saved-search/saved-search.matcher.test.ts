import { describe, expect, it } from 'vitest';
import { Company } from '../company/company.entity.js';
import { Job } from '../job/job.entity.js';
import { matchesSavedSearch } from './saved-search.matcher.js';

const company = Company.hydrate({
  id: 'c1', name: 'Acme', slug: 'acme', description: null,
  websiteUrl: null, careersUrl: null, logoUrl: null, industry: 'Fintech',
  locations: [], status: 'ACTIVE',
  createdAt: new Date(), updatedAt: new Date(),
});

const baseJob = Job.hydrate({
  id: 'j1', companyId: 'c1', title: 'Senior Backend Engineer',
  slug: 'senior-backend-engineer', description: 'distributed systems',
  department: 'Engineering', employmentType: 'FULL_TIME', seniority: 'SENIOR',
  workMode: 'REMOTE', locations: [], applicationUrl: 'https://x.test/a',
  sourceProvider: 'GREENHOUSE', externalId: 'e1', sourceUpdatedAt: null,
  publishedAt: null, firstSeenAt: new Date(), lastSeenAt: new Date(),
  closedAt: null, status: 'ACTIVE', providerMetadata: null,
  createdAt: new Date(), updatedAt: new Date(),
});

describe('matchesSavedSearch', () => {
  it('matches on keywords against title and description', () => {
    expect(matchesSavedSearch({ keywords: ['backend'] }, baseJob, company)).toBe(true);
    expect(matchesSavedSearch({ keywords: ['frontend'] }, baseJob, company)).toBe(false);
  });

  it('matches on work mode', () => {
    expect(matchesSavedSearch({ workMode: ['REMOTE'] }, baseJob, company)).toBe(true);
    expect(matchesSavedSearch({ workMode: ['ONSITE'] }, baseJob, company)).toBe(false);
  });

  it('ANDs different criteria, ORs within one', () => {
    expect(
      matchesSavedSearch(
        { workMode: ['REMOTE', 'HYBRID'], seniority: ['SENIOR'] },
        baseJob,
        company,
      ),
    ).toBe(true);
    expect(
      matchesSavedSearch(
        { workMode: ['ONSITE'], seniority: ['SENIOR'] },
        baseJob,
        company,
      ),
    ).toBe(false);
  });

  it('empty criteria matches everything', () => {
    expect(matchesSavedSearch({}, baseJob, company)).toBe(true);
  });
});