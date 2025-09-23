import {test, expect} from '@playwright/test';
import {SearchComponent} from "../../pages/search-component";

test.beforeEach(async ({ page }) => {
    const mockBase = process.env.MOCK_SWAPI_BASE!;
    await page.route('https://swapi.dev/api/**', async (route, request) => {
        const orig = new URL(request.url());
        const rewritten = `${mockBase}${orig.pathname}${orig.search}`;
        const resp = await page.request.fetch(rewritten, {
            method: request.method(),
            headers: request.headers(),
            data: request.postData()
        });
        await route.fulfill({
            status: resp.status(),
            headers: resp.headers(),
            body: await resp.body()
        });
    });

    await page.goto('/');

});

//todo: add tests