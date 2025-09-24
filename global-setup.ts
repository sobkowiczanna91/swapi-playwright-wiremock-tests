import { FullConfig } from '@playwright/test';
import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';
import fetch from 'node-fetch';

let container: StartedTestContainer;

async function registerMapping(adminUrl: string, mapping: any) {
    const res = await fetch(`${adminUrl}/mappings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mapping),
    });
    if (!res.ok) {
        const t = await res.text().catch(() => '');
        throw new Error(`WireMock mapping failed: ${res.status} ${t}`);
    }
}

async function globalSetup(config: FullConfig) {
    container = await new GenericContainer('wiremock/wiremock:2.35.0')
        .withExposedPorts(8080)
        .withWaitStrategy(Wait.forHttp('/__admin', 8080)).withStartupTimeout(120_000)
        .start();

    const host = container.getHost();
    const port = container.getMappedPort(8080);
    const admin = `http://${host}:${port}/__admin`;
    const mockBase = `http://${host}:${port}/api`;
    console.log(`[wiremock] starting at ${mockBase}`);

    await registerMapping(admin, {
        priority: 1,
        request: {
            method: "GET",
            urlPathPattern: "/api/people/?",
            queryParameters: {
                name: {
                    equalTo: "Luke Skywalker"
                }
            }
        },
        response: {
            status: 200,
            jsonBody: {
                result: [
                    {
                        properties: {
                            name: "Luke Skywalker",
                            gender: "male",
                            birth_year: "19BBY",
                            eye_color: "blue",
                            skin_color: "fair"
                        }
                    }
                ]
            }
        }
    });

    await registerMapping(admin, {
        priority: 1,
        request: {
            method: "GET",
            urlPathPattern: "/api/planets/?",
            queryParameters: {
                name: {
                    equalTo: "Tatooine"
                }
            }
        },
        response: {
            status: 200,
            jsonBody: {
                result: [
                    {
                        properties: {
                            name: "Tatooine",
                            population: "200000",
                            climate: "arid",
                            gravity: "1 standard"
                        }
                    }
                ]
            }
        }
    });

    const check = await fetch(`${mockBase}/people?name=${encodeURIComponent('Luke Skywalker')}`);
    console.log('[wiremock] sample GET /people?name=Luke%20Skywalker ->', check.status);
    console.log('[wiremock] sample body:', (await check.text()).slice(0, 200));

    process.env.MOCK_SWAPI_BASE = mockBase;
    (global as any).__wiremock_container__ = container;

    console.log(`[wiremock] admin: ${admin}`);
    console.log(`[wiremock] base:  ${mockBase}`);
}

export default globalSetup;
