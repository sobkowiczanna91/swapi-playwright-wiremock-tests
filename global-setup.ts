import { FullConfig } from '@playwright/test';
import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';
import path from 'node:path';

let container: StartedTestContainer;

async function globalSetup(config: FullConfig) {
  const mappingsDir = path.resolve(__dirname, 'tests/mocks/wiremock');

    container = await new GenericContainer('wiremock/wiremock:2.35.0')
        .withExposedPorts(8080)
        .withBindMounts([{ source: mappingsDir, target: '/home/wiremock' }])
        .withWaitStrategy(Wait.forHttp('/__admin', 8080))
        .start();

  const port = container.getMappedPort(8080);
  const host = container.getHost();
  const mockBase = `http://${host}:${port}/api`;

  process.env.MOCK_SWAPI_BASE = mockBase;
  (global as any).__wiremock_container__ = container;
}

export default globalSetup;
