import { Page, Route, Request } from '@playwright/test';

export async function routeSwapiApiCalls(page: Page) {
    await page.route('https://swapi.tech/api/**', async (route: Route, request: Request) => {
        const orig = new URL(request.url());
        const mockBase = process.env.MOCK_SWAPI_BASE;
        const rewritten = `${mockBase}${orig.pathname.replace(/^\/api/, '')}${orig.search}`;
        const resp = await page.request.fetch(rewritten, {
            method: request.method(),
            headers: request.headers(),
            data: request.postData(),
        });
        await route.fulfill({
            status: resp.status(),
            headers: resp.headers(),
            body: await resp.body(),
        });
    });
}
