import {test, expect} from '@playwright/test';
import {SearchComponent} from "../../ui/search-component";
import {NoResultsComponent} from "../../ui/no_results_component";
import {CharacterCardComponent} from "../../ui/character_card_component";
import {PEOPLE_DATA} from "../../data/people";

let searchPage: SearchComponent;

test.beforeEach(async ({page}) => {
    searchPage = new SearchComponent(page);
    await searchPage.goto();
    await expect(searchPage.header).toHaveText("The Star Wars Search");
    await searchPage.clickPeopleRadioButton();
});

test.describe('@regression search people by name', () => {
    /**
     * @allure.label owner Anna Sobkowicz
     * @allure.label severity normal
     * @allure.feature Search People
     * @allure.tag Search, People
     * @allure.issue SEARCH-001
     * @allure.description Tests cover searching for people by full and partial names, including search initiation
     * via the Enter key. They also handle scenarios where no results are found.
     */
    for (const p of Object.values(PEOPLE_DATA)) {
        test(`@positive full name - ${p.name}`, async () => {
            await searchPage.search(p.name);

            const characterCardComponent = new CharacterCardComponent(searchPage.page);
            await expect(characterCardComponent.name).toHaveText(p.name);

            await expect.soft(characterCardComponent.genderLabel).toBeVisible();
            await expect.soft(characterCardComponent.genderValue).toContainText(p.gender, {ignoreCase: true});

            await expect.soft(characterCardComponent.birthYearLabel).toBeVisible();
            await expect.soft(characterCardComponent.birthYearValue).toContainText(p.birth_year);

            await expect.soft(characterCardComponent.eyeColorLabel).toBeVisible();
            await expect.soft(characterCardComponent.eyeColorValue).toContainText(p.eye_color, {ignoreCase: true});

            await expect.soft(characterCardComponent.skinColorLabel).toBeVisible();
            await expect.soft(characterCardComponent.skinColorValue).toContainText(p.skin_color, {ignoreCase: true});

            expect(test.info().errors).toHaveLength(0);
        });
    }

    test('@positive search by Enter key', async () => {
        const LUKE = PEOPLE_DATA.luke;
        await searchPage.searchInput.fill(LUKE.name);
        await searchPage.searchInput.press('Enter');

        const characterCardComponent = new CharacterCardComponent(searchPage.page);
        await expect(characterCardComponent.name).toHaveText(LUKE.name);
    });

    test('@positive partial name', async () => {
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

    test('@negative', async () => {
        await searchPage.search("NonExistingCharacter");

        const noResultsComponent = new NoResultsComponent(searchPage.page);
        await noResultsComponent.waitForNotFound();

        await expect(noResultsComponent.message).toBeVisible();
    });

});
