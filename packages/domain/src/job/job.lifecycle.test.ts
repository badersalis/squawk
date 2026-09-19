import { describe, expect, it } from 'vitest';
import { applyLifecycleTransition, DEFAULT_CLOSE_AFTER_MISSES } from './job.lifecycle.js';

const at = new Date('2026-01-01T00:00:00Z');

describe('applyLifecycleTransition', () => {
  it('SEEN keeps the job ACTIVE', () => {
    const d = applyLifecycleTransition({ status: 'ACTIVE', closedAt: null }, { type: 'SEEN', at });
    expect(d.status).toBe('ACTIVE');
    expect(d.closedAt).toBeNull();
  });

  it('first miss moves ACTIVE → POSSIBLY_CLOSED', () => {
    const d = applyLifecycleTransition(
      { status: 'ACTIVE', closedAt: null },
      { type: 'MISSED', at, consecutiveMisses: 1 },
    );
    expect(d.status).toBe('POSSIBLY_CLOSED');
    expect(d.closedAt).toBeNull();
  });

  it('threshold miss moves POSSIBLY_CLOSED → CLOSED', () => {
    const d = applyLifecycleTransition(
      { status: 'POSSIBLY_CLOSED', closedAt: null },
      { type: 'MISSED', at, consecutiveMisses: DEFAULT_CLOSE_AFTER_MISSES },
    );
    expect(d.status).toBe('CLOSED');
    expect(d.closedAt).toEqual(at);
  });

  it('reappearing revives a POSSIBLY_CLOSED job', () => {
    const d = applyLifecycleTransition(
      { status: 'POSSIBLY_CLOSED', closedAt: null },
      { type: 'REAPPEARED', at },
    );
    expect(d.status).toBe('ACTIVE');
    expect(d.closedAt).toBeNull();
  });
});