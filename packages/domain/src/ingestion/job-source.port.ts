import type { CompanyJobSourceProps } from './company-job-source.js';
import type { JobProvider } from '../job/job.enums.js';
import type { RawJob } from './raw-job.js';

/**
 * Port implemented by every provider adapter.
 *
 * The domain calls `fetchJobs` with a persisted source description and
 * receives provider-shaped raw jobs. All transport concerns (HTTP,
 * pagination, auth, rate limits) are the adapter's responsibility.
 */
export interface JobSource {
  readonly provider: JobProvider;
  fetchJobs(source: CompanyJobSourceProps): Promise<RawJob[]>;
}