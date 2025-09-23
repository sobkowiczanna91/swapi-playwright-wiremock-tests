export type Person = {
    name: string;
    gender: string;
    birth_year: string;
    eye_color: string;
    skin_color: string;
};

export const PEOPLE_DATA: Record<'luke' | 'vader', Person> = {
    luke: {
        name: 'Luke Skywalker',
        gender: 'male',
        birth_year: '19BBY',
        eye_color: 'blue',
        skin_color: 'fair',
    },
    vader: {
        name: 'Darth Vader',
        gender: 'male',
        birth_year: '41.9BBY',
        eye_color: 'yellow',
        skin_color: 'white',
    }
};
