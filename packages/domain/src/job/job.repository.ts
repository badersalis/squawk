import type { Job } from './job.entity.js';
import type {
  EmploymentType,
  JobStatus,
  Seniority,
  WorkMode,
} from './job.enums.js';

export interface JobSearchCriteria {
  query?: string;
  companyIds?: string[];
  industry?: string;
  location?: string;
  workMode?: WorkMode[];
  employmentType?: EmploymentType[];
  seniority?: Seniority[];
  status?: JobStatus;
  page: number;
  limit: number;
  sort?: 'newest' | 'published' | 'relevance';
}

export interface JobSearchResult {
  items: Job[];
  total: number;
}

export interface JobRepository {
  findById(id: string): Promise<Job | null>;
  /** Idempotency lookup by (companyId, provider, externalId). */
  findByIdentity(input: {
    companyId: string;
    provider: string;
    externalId: string;
  }): Promise<Job | null>;
  search(criteria: JobSearchCriteria): Promise<JobSearchResult>;
  /** Insert or update in one round trip; relies on a unique constraint. */
  upsert(job: Job): Promise<Job>;
  /** Bulk fetch of jobs belonging to a company. */
  findByCompany(companyId: string, includeClosed?: boolean): Promise<Job[]>;
  updateLifecycle(input: {
    id: string;
    status: JobStatus;
    closedAt: Date | null;
    lastSeenAt?: Date;
  }): Promise<void>;
}