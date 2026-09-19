import type { Company } from './company.entity.js';
import type { CompanyStatus } from './company.status.js';

export interface CompanySearchCriteria {
  query?: string;
  industry?: string;
  location?: string;
  status?: CompanyStatus;
  page: number;
  limit: number;
}

export interface CompanySearchResult {
  items: Company[];
  total: number;
}

/** Port implemented by the Drizzle adapter in the API layer. */
export interface CompanyRepository {
  findById(id: string): Promise<Company | null>;
  findBySlug(slug: string): Promise<Company | null>;
  search(criteria: CompanySearchCriteria): Promise<CompanySearchResult>;
  save(company: Company): Promise<Company>;
  update(company: Company): Promise<Company>;
  delete(id: string): Promise<void>;
  countActiveJobs(companyId: string): Promise<number>;
}