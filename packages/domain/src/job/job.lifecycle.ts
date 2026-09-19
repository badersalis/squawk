import type { JobStatus } from './job.enums.js';

/**
 * Number of consecutive syncs a job must be missing before we transition
 * it from POSSIBLY_CLOSED to CLOSED. Configurable at the application layer;
 * the domain default is 2.
 */
export const DEFAULT_CLOSE_AFTER_MISSES = 2;

export type LifecycleEvent =
  | { type: 'SEEN'; at: Date }
  | { type: 'MISSED'; at: Date; consecutiveMisses: number; closeAfterMisses?: number }
  | { type: 'REAPPEARED'; at: Date };

export interface LifecycleDecision {
  status: JobStatus;
  closedAt: Date | null;
  reason: string;
}

/**
 * Pure function implementing the ACTIVE → POSSIBLY_CLOSED → CLOSED state
 * machine. No IO, no clock, no randomness. Fully unit-testable.
 */
export function applyLifecycleTransition(
  current: { status: JobStatus; closedAt: Date | null },
  event: LifecycleEvent,
): LifecycleDecision {
  switch (event.type) {
    case 'SEEN':
      return {
        status: 'ACTIVE',
        closedAt: null,
        reason: 'present in source',
      };

    case 'REAPPEARED':
      return {
        status: 'ACTIVE',
        closedAt: null,
        reason: 'reappeared after being marked POSSIBLY_CLOSED',
      };

    case 'MISSED': {
      const threshold = event.closeAfterMisses ?? DEFAULT_CLOSE_AFTER_MISSES;
      if (current.status === 'CLOSED') {
        return {
          status: 'CLOSED',
          closedAt: current.closedAt,
          reason: 'already closed; nothing to do',
        };
      }
      if (event.consecutiveMisses >= threshold) {
        return {
          status: 'CLOSED',
          closedAt: event.at,
          reason: `missed ${event.consecutiveMisses} syncs (threshold ${threshold})`,
        };
      }
      return {
        status: 'POSSIBLY_CLOSED',
        closedAt: null,
        reason: `missed ${event.consecutiveMisses} sync(s); below threshold ${threshold}`,
      };
    }
  }
}

/** Convenience for a batch of jobs sharing the same lifecycle event. */
export function closeExpiredJobs(
  jobs: ReadonlyArray<{ status: JobStatus; closedAt: Date | null }>,
  at: Date,
  closeAfterMisses: number = DEFAULT_CLOSE_AFTER_MISSES,
): LifecycleDecision[] {
  return jobs.map((j) =>
    applyLifecycleTransition(j, {
      type: 'MISSED',
      at,
      consecutiveMisses: closeAfterMisses,
      closeAfterMisses,
    }),
  );
}

/** Explicit "job was missing last time and is back now" transition. */
export function reviveJobIfReappeared(
  current: { status: JobStatus; closedAt: Date | null },
  at: Date,
): LifecycleDecision {
  return applyLifecycleTransition(current, { type: 'REAPPEARED', at });
}