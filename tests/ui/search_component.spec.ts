import {test, expect} from '@playwright/test';
import {SearchComponent} from "../../ui/search-component";

let searchPage: SearchComponent;

test.beforeEach(async ({page}) => {
    searchPage = new SearchComponent(page);
    await searchPage.goto();
});

test.describe('@smoke mandatory page components', () => {
    test('header', async () => {
        await expect(searchPage.header).toHaveText("The Star Wars Search");
    })

    test('search', async () => {
        await expect.soft(searchPage.searchInput).toBeVisible();
        await expect.soft(searchPage.searchButton).toBeVisible();
        await expect.soft(searchPage.searchButton).toBeEnabled();
        await expect.soft(searchPage.searchButton).toHaveText('Search');
        expect(test.info().errors).toHaveLength(0);
    })

    test('people radio button', async () => {
        await expect.soft(searchPage.peopleLabel).toBeVisible();
        await expect.soft(searchPage.peopleLabel).toHaveText('People');
        await expect.soft(searchPage.peopleRadioButton).toBeVisible();
        await expect.soft(searchPage.peopleRadioButton).toBeEnabled();
        expect(test.info().errors).toHaveLength(0);
    })

    test('planets radio button', async () => {
        await expect.soft(searchPage.planetsLabel).toBeVisible();
        await expect.soft(searchPage.planetsLabel).toHaveText('Planets');
        await expect.soft(searchPage.planetsRadioButton).toBeVisible();
        await expect.soft(searchPage.planetsRadioButton).toBeEnabled();
        expect(test.info().errors).toHaveLength(0);
    })
});
