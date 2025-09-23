import {expect, request, test} from '@playwright/test';
import {PEOPLE_DATA} from "../../data/people";
import {BASE_URL, PEOPLE} from "../../api/endpoints";

test.describe('@api GET @people @smoke', () => {
    test('@positive Luke Skywalker - 200', async () => {
        const apiRequestContext = await request.newContext();
        const LUKE = PEOPLE_DATA.luke;
        const apiResponse = await apiRequestContext.get(`${BASE_URL}${PEOPLE}`, {params: {name: LUKE.name}});

        expect(apiResponse.status()).toBe(200);

        await apiResponse.body();
        const responseJson = await apiResponse.json();
        console.log('[people] responseJson:', JSON.stringify(responseJson, null, 2));

        expect(await responseJson.result.length).toBe(1);

        const properties = await responseJson.result[0].properties;

        expect.soft(properties.name).toBe(LUKE.name);
        expect.soft(String(properties.gender).toLowerCase()).toBe(LUKE.gender);
        expect.soft(properties.birth_year).toBe(LUKE.birth_year);
        expect.soft(String(properties.eye_color).toLowerCase()).toBe(LUKE.eye_color);
        expect.soft(String(properties.skin_color).toLowerCase()).toBe(LUKE.skin_color);
        expect(test.info().errors).toHaveLength(0);

        await apiResponse.dispose();
    });

    test('@negative not existing - 200 ', async () => {
        const apiRequestContext = await request.newContext();
        const nonExistingName = "nonExistingCharacter";
        const apiResponse = await apiRequestContext.get(`${BASE_URL}${PEOPLE}`, {params: {name: nonExistingName}});

        expect(apiResponse.status()).toBe(200);

        await apiResponse.body();
        const responseJson = await apiResponse.json();
        console.log('[people] responseJson:', JSON.stringify(responseJson, null, 2));

        expect(await responseJson.result.length).toBe(0);

        await apiResponse.dispose();
    });

});
