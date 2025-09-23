import {expect, request, test} from '@playwright/test';
import {BASE_URL, PLANETS} from "../../api/endpoints";
import {PLANETS_DATA} from "../../data/planets";

test.describe('@api GET @planet @smoke', () => {
    test('@positive Tatooine - 200', async () => {
        const apiRequestContext = await request.newContext();
        const TATOOINE = PLANETS_DATA.tatooine;
        const apiResponse = await apiRequestContext.get(`${BASE_URL}${PLANETS}`, {params: {name: TATOOINE.name}});

        expect(apiResponse.status()).toBe(200);

        await apiResponse.body();
        const responseJson = await apiResponse.json();
        console.log('[planet] responseJson:', JSON.stringify(responseJson, null, 2));

        expect(await responseJson.result.length).toBe(1);

        const properties = await responseJson.result[0].properties;

        expect.soft(properties.name).toBe(TATOOINE.name);
        expect.soft(String(properties.population).toLowerCase()).toBe(TATOOINE.population);
        expect.soft(properties.climate).toBe(TATOOINE.climate);
        expect.soft(String(properties.gravity).toLowerCase()).toBe(TATOOINE.gravity);
        expect(test.info().errors).toHaveLength(0);

        await apiResponse.dispose();
    });

    test('@negative not existing - 200 ', async () => {
        const apiRequestContext = await request.newContext();
        const nonExistingName = "nonExistingCharacter";
        const apiResponse = await apiRequestContext.get(`${BASE_URL}${PLANETS}`, {params: {name: nonExistingName}});

        expect(apiResponse.status()).toBe(200);

        await apiResponse.body();
        const responseJson = await apiResponse.json();
        console.log('[people] responseJson:', JSON.stringify(responseJson, null, 2));

        expect(await responseJson.result.length).toBe(0);

        await apiResponse.dispose();
    });

});
