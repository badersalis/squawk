import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  GenericContainer,
  Network,
  Wait,
  type StartedNetwork,
  type StartedTestContainer,
} from 'testcontainers';

const currentDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(currentDir, '../../..');

// Proves the actual value of the caching layer: real Redis + real Schedule +
// real Search, wired together, then Schedule is stopped and Search still
// answers from cache — the read path survives the dependency it fronts.
describe('search service itinerary caching (integration)', () => {
  let network: StartedNetwork;
  let redis: StartedTestContainer;
  let schedule: StartedTestContainer;
  let search: StartedTestContainer;
  let searchBaseUrl: string;

  beforeAll(async () => {
    network = await new Network().start();

    redis = await new GenericContainer('redis:7-alpine')
      .withNetwork(network)
      .withNetworkAliases('redis')
      .withExposedPorts(6379)
      .withWaitStrategy(Wait.forLogMessage('Ready to accept connections'))
      .start();

    const scheduleImage = await GenericContainer.fromDockerfile(
      repoRoot,
      'apps/schedule/Dockerfile',
    ).build();
    schedule = await scheduleImage
      .withNetwork(network)
      .withNetworkAliases('schedule')
      .withExposedPorts(3000)
      .withWaitStrategy(Wait.forHttp('/api/health', 3000).forStatusCode(200))
      .start();

    const searchImage = await GenericContainer.fromDockerfile(
      repoRoot,
      'apps/search/Dockerfile',
    ).build();
    search = await searchImage
      .withNetwork(network)
      .withEnvironment({
        SCHEDULE_SERVICE_URL: 'http://schedule:3000',
        REDIS_URL: 'redis://redis:6379',
      })
      .withExposedPorts(3002)
      .withWaitStrategy(Wait.forHttp('/api/health', 3002).forStatusCode(200))
      .start();

    searchBaseUrl = `http://${search.getHost()}:${search.getMappedPort(3002)}`;
  }, 600_000);

  afterAll(async () => {
    // schedule is deliberately stopped mid-suite; ignore a redundant stop here.
    await Promise.allSettled([search?.stop(), schedule?.stop(), redis?.stop()]);
    await network?.stop();
  });

  it('serves the OpenAPI docs UI', async () => {
    const response = await fetch(`${searchBaseUrl}/api/docs`);
    expect(response.status).toBe(200);
    expect(await response.text()).toContain('swagger-ui');
  });

  it('finds the non-stop JFK-LAX itinerary from live Schedule data', async () => {
    const response = await fetch(
      `${searchBaseUrl}/api/v1/itineraries?origin=JFK&destination=LAX`,
    );
    expect(response.status).toBe(200);
    const itineraries = await response.json();
    expect(itineraries).toHaveLength(1);
    expect(itineraries[0].flights[0].id).toBe('flt_aa100');
  });

  it('keeps answering from cache after Schedule goes down', async () => {
    await schedule.stop();

    const response = await fetch(
      `${searchBaseUrl}/api/v1/itineraries?origin=JFK&destination=LAX`,
    );
    expect(response.status).toBe(200);
    const itineraries = await response.json();
    expect(itineraries[0].flights[0].id).toBe('flt_aa100');
  });

  it('fails a fresh query once Schedule is down and cache is empty', async () => {
    // A dead network alias takes longer than fetch's default to fail than a
    // live but erroring one would, hence the longer timeout here.
    const response = await fetch(
      `${searchBaseUrl}/api/v1/itineraries?origin=JFK&destination=JFK`,
    );
    expect(response.status).toBeGreaterThanOrEqual(500);
  }, 15_000);
});
