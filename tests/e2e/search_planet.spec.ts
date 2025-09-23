// TypeScript
import {test, expect} from '@playwright/test';
import {SearchComponent} from "../../pages/search-component";
import {PlanetCardComponent} from "../../pages/planet_card_component";
import {CharacterCardComponent} from "../../pages/character_card_component";
import {NoResultsComponent} from "../../pages/no_results_component";

let searchPage: SearchComponent;

test.beforeEach(async ({page}) => {
    searchPage = new SearchComponent(page);
    await searchPage.goto();
    await expect(searchPage.header).toHaveText("The Star Wars Search");
    await searchPage.clickOnPlanetsRadioButton();
});

test.describe('@regression search planet by name', () => {
    test('positive full name - Tatooine', async () => {
        const TATOOINE = "Tatooine";

        await searchPage.search(TATOOINE);

        const planetCard = new PlanetCardComponent(searchPage.page);

        await expect(planetCard.name).toHaveText(TATOOINE);

        await expect.soft(planetCard.populationLabel).toBeVisible();
        await expect.soft(planetCard.populationValue).toContainText("200000");

        await expect.soft(planetCard.climateLabel).toBeVisible();
        await expect.soft(planetCard.climateValue).toContainText("arid");

        await expect.soft(planetCard.gravityLabel).toBeVisible();
        await expect.soft(planetCard.gravityValue).toContainText("1 standard");

        expect(test.info().errors).toHaveLength(0);
    });

    test('positive partial name', async () => {
        const PARTIAL = "to";
        await searchPage.search(PARTIAL);

        const characterCardComponent = new CharacterCardComponent(searchPage.page);
        await characterCardComponent.waitForNameToBe(PARTIAL);

        await characterCardComponent.name.all().then(async (nameHeadings) => {
            expect(nameHeadings.length).toBeGreaterThan(0);
            for (const heading of nameHeadings) {
                await expect.soft(heading).toContainText(PARTIAL, {ignoreCase: true});
            }
            expect(test.info().errors).toHaveLength(0);
        });
    });

    test('negative', async () => {
        await searchPage.search("NonExistingPlanet");

        const noResultsComponent = new NoResultsComponent(searchPage.page);
        await noResultsComponent.waitForNotFound();

        await expect(noResultsComponent.message).toBeVisible();
    });
});
