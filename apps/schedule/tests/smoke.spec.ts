import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { StartedTestContainer } from 'testcontainers';
import { startServiceContainer } from '@squawk/testing';

const currentDir = dirname(fileURLToPath(import.meta.url));

// Builds and runs the service's actual Dockerfile — the same artifact that
// ships — rather than importing the app in-process, so this proves the
// container boots and answers, not just that the source compiles.
describe('schedule service smoke test', () => {
  let container: StartedTestContainer;
  let baseUrl: string;

  beforeAll(async () => {
    container = await startServiceContainer({
      context: join(currentDir, '../../..'),
      dockerfile: 'apps/schedule/Dockerfile',
      port: 3000,
      healthPath: '/api/health',
    });
    baseUrl = `http://${container.getHost()}:${container.getMappedPort(3000)}`;
  }, 300_000);

  afterAll(async () => {
    await container?.stop();
  });

  it('answers a health check', async () => {
    const response = await fetch(`${baseUrl}/api/health`);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.status).toBe('ok');
  });

  it('answers the seeded flights read endpoint', async () => {
    const response = await fetch(`${baseUrl}/api/flights`);
    expect(response.status).toBe(200);
    const flights = await response.json();
    expect(Array.isArray(flights)).toBe(true);
    expect(flights.length).toBeGreaterThan(0);
    expect(flights[0]).toHaveProperty('flightNumber');
  });
});
