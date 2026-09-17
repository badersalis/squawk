import {
  GenericContainer,
  Wait,
  type StartedTestContainer,
} from 'testcontainers';

export interface ServiceContainerOptions {
  /** Docker build context, typically the monorepo root. */
  context: string;
  /** Dockerfile path relative to `context`. */
  dockerfile: string;
  port: number;
  healthPath: string;
}

/** Builds and boots a service's real Dockerfile, then waits until it answers its health check. */
export async function startServiceContainer(
  options: ServiceContainerOptions,
): Promise<StartedTestContainer> {
  const container = await GenericContainer.fromDockerfile(
    options.context,
    options.dockerfile,
  ).build();

  return container
    .withExposedPorts(options.port)
    .withWaitStrategy(
      Wait.forHttp(options.healthPath, options.port).forStatusCode(200),
    )
    .start();
}
