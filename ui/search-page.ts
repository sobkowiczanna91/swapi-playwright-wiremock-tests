import { Page, Locator } from '@playwright/test';

export class SearchPage {
    readonly page: Page;
    readonly header: Locator;
    readonly searchInput: Locator;
    readonly peopleRadioButton: Locator;
    readonly peopleLabel: Locator;
    readonly planetsRadioButton: Locator;
    readonly planetsLabel: Locator;
    readonly searchButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = page.locator('h1');
        this.peopleRadioButton = page.locator('[id="people"]');
        this.peopleLabel = page.locator('[for="people"]');
        this.planetsRadioButton = page.locator('[id="planets"]');
        this.planetsLabel = page.locator('[for="planets"]');
        this.searchInput = page.locator('[type="search"]');
        this.searchButton = page.locator('[type="submit"]');
    }

    async goto() {
        await this.page.goto("/");
    }

    async search(query: string) {
        await this.searchInput.fill(query);
        await this.searchButton.click();
    }

    async clickPeopleRadioButton() {
        await this.peopleRadioButton.click();
    }

    async clickOnPlanetsRadioButton() {
        await this.planetsRadioButton.click();
    }
}
