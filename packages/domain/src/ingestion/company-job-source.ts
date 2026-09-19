import type { JobProvider } from '../job/job.enums.js';

export interface CompanyJobSourceProps {
  id: string;
  companyId: string;
  provider: JobProvider;
  /** Provider-specific identifier (Greenhouse board token, etc.). */
  externalIdentifier: string;
  baseUrl: string | null;
  enabled: boolean;
  lastSuccessfulSyncAt: Date | null;
  lastAttemptedSyncAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}