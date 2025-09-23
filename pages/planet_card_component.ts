import {Page, Locator} from '@playwright/test';
import {getLabelLocator, getValueLocator} from "../tests/frontend/utils/locator_helper";

const POPULATION = 'Population';
const CLIMATE = 'Climate';
const GRAVITY = 'Gravity';

export class PlanetCardComponent {
    readonly page: Page;
    readonly name: Locator;
    readonly populationLabel: Locator;
    readonly populationValue: Locator;
    readonly climateLabel: Locator;
    readonly climateValue: Locator;
    readonly gravityLabel: Locator;
    readonly gravityValue: Locator;

    constructor(page: Page) {
        this.page = page;
        this.name = page.locator('h6');
        this.populationLabel = this.page.locator(getLabelLocator(POPULATION));
        this.populationValue = this.page.locator(getValueLocator(POPULATION));
        this.climateLabel = this.page.locator(getLabelLocator(CLIMATE));
        this.climateValue = this.page.locator(getValueLocator(CLIMATE));
        this.gravityLabel = this.page.locator(getLabelLocator(GRAVITY));
        this.gravityValue = this.page.locator(getValueLocator(GRAVITY));
    }
}
