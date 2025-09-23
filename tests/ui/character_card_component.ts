import {Page, Locator} from '@playwright/test';
import {getLabelLocator, getValueLocator} from "./utils/locator_helper";

const GENDER = 'Gender:';
const BIRTH_YEAR = 'Birth year:';
const EYE_COLOR = 'Eye color:';
const SKIN_COLOR = 'Skin color:';

export class CharacterCardComponent {
    readonly page: Page;
    readonly name: Locator;
    readonly genderLabel: Locator;
    readonly genderValue: Locator;
    readonly birthYearLabel: Locator;
    readonly birthYearValue: Locator;
    readonly eyeColorLabel: Locator;
    readonly eyeColorValue: Locator;
    readonly skinColorLabel: Locator;
    readonly skinColorValue: Locator;

    constructor(page: Page) {
        this.page = page;
        this.name = page.locator('h6');
        this.genderLabel = this.page.locator(getLabelLocator(GENDER));
        this.genderValue = this.page.locator(getValueLocator(GENDER));
        this.birthYearLabel = this.page.locator(getLabelLocator(BIRTH_YEAR));
        this.birthYearValue = this.page.locator(getValueLocator(BIRTH_YEAR));
        this.eyeColorLabel = this.page.locator(getLabelLocator(EYE_COLOR));
        this.eyeColorValue = this.page.locator(getValueLocator(EYE_COLOR));
        this.skinColorLabel = this.page.locator(getLabelLocator(SKIN_COLOR));
        this.skinColorValue = this.page.locator(getValueLocator(SKIN_COLOR));
    }

}