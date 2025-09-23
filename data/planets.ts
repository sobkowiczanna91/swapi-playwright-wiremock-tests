export type Planet = {
    name: string;
    population: string;
    climate: string;
    gravity: string;
};

export const PLANETS_DATA = {
    tatooine: {
        name: 'Tatooine',
        population: '200000',
        climate: 'arid',
        gravity: '1 standard',
    },
} as const;
