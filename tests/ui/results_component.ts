import { Locator, Page } from '@playwright/test';

export class NoResultsComponent {
    readonly page: Page;
    readonly message: Locator;

    constructor(page: Page) {
        this.page = page;
        this.message = page.locator("//div[normalize-space(.)='Not found.']");
    }

    async waitForNotFound(): Promise<void> {
        await this.message.waitFor({ state: 'visible' });
    }
}
