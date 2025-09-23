import {test, expect} from '@playwright/test';
import {SearchComponent} from "../../pages/search-component";

let searchPage: SearchComponent;

test.beforeEach(async ({page}) => {
    searchPage = new SearchComponent(page);
    await searchPage.goto();
});

test.describe('@regression search planet by name', () => {
    test('positive full name', async () => {
        await expect(searchPage.header).toHaveText("The Star Wars Search");
    });

    test('positive partial name', async () => {
        await expect(searchPage.header).toHaveText("The Star Wars Search");
    });

    test('negative', async () => {
        await expect(searchPage.header).toHaveText("The Star Wars Search");
    });

});
