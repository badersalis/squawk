import type { Job } from '../job/job.entity.js';
import type { SavedJob } from './saved-job.entity.js';

export interface SavedJobWithJob {
  savedJob: SavedJob;
  job: Job;
}

export interface SavedJobRepository {
  find(input: { userId: string; jobId: string }): Promise<SavedJob | null>;
  listByUser(userId: string): Promise<SavedJobWithJob[]>;
  create(input: { userId: string; jobId: string }): Promise<SavedJob>;
  delete(input: { userId: string; jobId: string }): Promise<void>;
}