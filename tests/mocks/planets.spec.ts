import { test, expect } from '@playwright/test';
import { PLANETS_DATA } from '../../data/planets';
import { PlanetCardComponent } from '../../ui/planet_card_component';
import { SearchComponent } from '../../ui/search-component';

let searchPage: SearchComponent;
let planetCard: PlanetCardComponent;
const mockBase = process.env.MOCK_SWAPI_BASE;

test.beforeEach(async ({ page }) => {
    await page.route('https://swapi.tech/api/**', async (route, request) => {
        const orig = new URL(request.url());
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

    searchPage = new SearchComponent(page);
    planetCard = new PlanetCardComponent(page);

    await searchPage.goto();
    await expect(searchPage.header).toHaveText('The Star Wars Search');
    await searchPage.clickPlanetsRadioButton();
});

test.describe('@mock search @planets @smoke', () => {
    test('@positive Tatooine - 200', async () => {
        const TATOOINE = PLANETS_DATA.tatooine;

        await searchPage.search(TATOOINE.name);

        const apiResp = await searchPage.page.waitForResponse(res =>
            res.url().includes('/api/planets/?name=Tatooine') && res.request().method() === 'GET'
        );

        await apiResp.body();
        const bodyText = await apiResp.text();
        console.log('WireMock response:', bodyText);

        let result;
        try {
            result = JSON.parse(bodyText).result;
        } catch (e) {
            throw new Error(`WireMock incorrect JSON ${bodyText}`);
        }

        const properties = result[0].properties;

        await expect(planetCard.name).toHaveText(properties.name);
        await expect.soft(planetCard.populationLabel).toBeVisible();
        await expect.soft(planetCard.populationValue).toContainText(properties.population);

        await expect.soft(planetCard.climateLabel).toBeVisible();
        await expect.soft(planetCard.climateValue).toContainText(properties.climate);

        await expect.soft(planetCard.gravityLabel).toBeVisible();
        await expect.soft(planetCard.gravityValue).toContainText(properties.gravity);

        expect(test.info().errors).toHaveLength(0);
    });
});
