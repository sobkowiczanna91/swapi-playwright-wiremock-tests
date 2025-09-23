import {test, expect} from '@playwright/test';
import {SearchComponent} from "../../pages/search-component";
import {NoResultsComponent} from "../../pages/no_results_component";
import {CharacterCardComponent} from "../../pages/character_card_component";

let searchPage: SearchComponent;

test.beforeEach(async ({page}) => {
    searchPage = new SearchComponent(page);
    await searchPage.goto();
    await expect(searchPage.header).toHaveText("The Star Wars Search");
    await searchPage.clickPeopleRadioButton();
});

test.describe('@regression search character by name', () => {
    const LUKE = "Luke Skywalker";

    test('positive full name', async () => {

        await searchPage.search(LUKE);

        const characterCardComponent = new CharacterCardComponent(searchPage.page);
        await expect(characterCardComponent.name).toHaveText(LUKE);

        await expect.soft(characterCardComponent.genderLabel).toBeVisible();
        await expect.soft(characterCardComponent.genderValue).toContainText('male');

        await expect.soft(characterCardComponent.birthYearLabel).toBeVisible();
        await expect.soft(characterCardComponent.birthYearValue).toContainText('19BBY');

        await expect.soft(characterCardComponent.eyeColorLabel).toBeVisible();
        await expect.soft(characterCardComponent.eyeColorValue).toContainText('blue');

        await expect.soft(characterCardComponent.skinColorLabel).toBeVisible();
        await expect.soft(characterCardComponent.skinColorValue).toContainText('fair');

        expect(test.info().errors).toHaveLength(0);
    });

    test('positive partial name', async () => {
        const LU = "Lu";
        await searchPage.search(LU);

        const characterCardComponent = new CharacterCardComponent(searchPage.page);
        await characterCardComponent.waitForNameToBe(LU);

        await characterCardComponent.name.all().then(async (nameHeadings) => {
            expect(nameHeadings.length).toBeGreaterThan(0);
            for (const heading of nameHeadings) {
                await expect.soft(heading).toContainText(LU);
            }
            expect(test.info().errors).toHaveLength(0);
        });
    });

    test('negative', async () => {
        await searchPage.search("NonExistingCharacter");

        const noResultsComponent = new NoResultsComponent(searchPage.page);
        await noResultsComponent.waitForNotFound();

        await expect(noResultsComponent.message).toBeVisible();
    });

});
