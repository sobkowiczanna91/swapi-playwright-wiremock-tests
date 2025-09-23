import {test, expect, request} from '@playwright/test';
import {PEOPLE_DATA} from "../data_people";

const BASE_URL = process.env.SWAPI_TECH_BASE ?? 'https://www.swapi.tech/api';
const PEOPLE_ENDPOINT = '/people';

test('@smoke GET people - Luke Skywalker fields match', async () => {
    const apiRequestContext = await request.newContext();
    const LUKE = PEOPLE_DATA.luke;
    const apiResponse = await apiRequestContext.get(`${BASE_URL}${PEOPLE_ENDPOINT}`, {params: {name: LUKE.name}});

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
