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

    const peopleCases = [
        {name: "Darth Vader", gender: "male", birthYear: "41.9BBY", eyeColor: "yellow", skinColor: "white"},
        {name: "Luke Skywalker", gender: "male", birthYear: "19BBY", eyeColor: "blue", skinColor: "fair"},
    ] as const;

    for (const p of peopleCases) {
        test(`positive full name - ${p.name}`, async () => {
            await searchPage.search(p.name);

            const characterCardComponent = new CharacterCardComponent(searchPage.page);
            await expect(characterCardComponent.name).toHaveText(p.name);

            await expect.soft(characterCardComponent.genderLabel).toBeVisible();
            await expect.soft(characterCardComponent.genderValue).toContainText(p.gender);

            await expect.soft(characterCardComponent.birthYearLabel).toBeVisible();
            await expect.soft(characterCardComponent.birthYearValue).toContainText(p.birthYear);

            await expect.soft(characterCardComponent.eyeColorLabel).toBeVisible();
            await expect.soft(characterCardComponent.eyeColorValue).toContainText(p.eyeColor);

            await expect.soft(characterCardComponent.skinColorLabel).toBeVisible();
            await expect.soft(characterCardComponent.skinColorValue).toContainText(p.skinColor);

            expect(test.info().errors).toHaveLength(0);
        });
    }

    test('positive partial name', async () => {
        const LU = "Lu";
        await searchPage.search(LU);

        const characterCardComponent = new CharacterCardComponent(searchPage.page);
        await characterCardComponent.waitForNameToBe(LU);

        await characterCardComponent.name.all().then(async (nameHeadings) => {
            expect(nameHeadings.length).toBeGreaterThan(0);
            for (const heading of nameHeadings) {
                await expect.soft(heading).toContainText(LU, {ignoreCase: true});
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
