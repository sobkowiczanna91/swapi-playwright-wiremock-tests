import {test, expect} from '@playwright/test';
import {SearchComponent} from "../../ui/search-component";
import {PlanetCardComponent} from "../../ui/planet_card_component";
import {CharacterCardComponent} from "../../ui/character_card_component";
import {NoResultsComponent} from "../../ui/no_results_component";
import {PLANETS_DATA} from "../../data/planets";

let searchPage: SearchComponent;

test.beforeEach(async ({page}) => {
    searchPage = new SearchComponent(page);
    await searchPage.goto();
    await expect(searchPage.header).toHaveText("The Star Wars Search");
    await searchPage.clickPlanetsRadioButton();
});

test.describe('@regression search planet by name', () => {
    test('positive full name - Tatooine', async () => {
        const TATOOINE = PLANETS_DATA.tatooine;

        await searchPage.search(TATOOINE.name);
        const planetCard = new PlanetCardComponent(searchPage.page);

        await expect(planetCard.name).toHaveText(TATOOINE.name);

        await expect.soft(planetCard.populationLabel).toBeVisible();
        await expect.soft(planetCard.populationValue).toContainText(TATOOINE.population);
        await expect.soft(planetCard.climateLabel).toBeVisible();
        await expect.soft(planetCard.climateValue).toContainText(TATOOINE.climate, {ignoreCase: true});
        await expect.soft(planetCard.gravityLabel).toBeVisible();
        await expect.soft(planetCard.gravityValue).toContainText(TATOOINE.gravity, {ignoreCase: true});

        expect(test.info().errors).toHaveLength(0);
    });

    test('@positive search by Enter key', async () => {
        const TATOOINE = PLANETS_DATA.tatooine;
        await searchPage.searchInput.fill(TATOOINE.name);
        await searchPage.searchInput.press('Enter');

        const planetCardComponent = new PlanetCardComponent(searchPage.page);
        await expect(planetCardComponent.name).toHaveText(TATOOINE.name);
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
