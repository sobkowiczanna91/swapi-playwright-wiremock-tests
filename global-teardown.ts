import {FullConfig} from '@playwright/test';
import type {StartedTestContainer} from 'testcontainers';

async function globalTeardown(config: FullConfig) {
    const container = (global as any).__wiremock_container__ as StartedTestContainer | undefined;
    if (container) {
        await container.stop();
    }
}

export default globalTeardown;
