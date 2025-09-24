import { test, expect } from '@playwright/test';
import { PEOPLE_DATA } from '../../data/people';
import { CharacterCardComponent } from '../../ui/character_card_component';
import { SearchComponent } from '../../ui/search-component';

let searchPage: SearchComponent;
let characterCard: CharacterCardComponent;
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
    characterCard = new CharacterCardComponent(page);

    await searchPage.goto();
    await expect(searchPage.header).toHaveText('The Star Wars Search');
    await searchPage.clickPeopleRadioButton();
});

test.describe('@mock search @people @smoke', () => {
    test('@positive Luke Skywalker - 200', async () => {
        const LUKE = PEOPLE_DATA.luke;

        await searchPage.search(LUKE.name);

        const apiResp = await searchPage.page.waitForResponse(res =>
            res.url().includes('/api/people/?name=Luke%20Skywalker') && res.request().method() === 'GET'
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

        await expect(characterCard.name).toHaveText(properties.name);

        await expect.soft(characterCard.genderLabel).toBeVisible();
        await expect.soft(characterCard.genderValue).toContainText(properties.gender, { ignoreCase: true });

        await expect.soft(characterCard.birthYearLabel).toBeVisible();
        await expect.soft(characterCard.birthYearValue).toContainText(properties.birth_year);

        await expect.soft(characterCard.eyeColorLabel).toBeVisible();
        await expect(characterCard.eyeColorValue).toContainText(properties.eye_color);

        await expect.soft(characterCard.skinColorLabel).toBeVisible();
        await expect.soft(characterCard.skinColorValue).toContainText(properties.skin_color);

        expect(test.info().errors).toHaveLength(0);
    });
});
