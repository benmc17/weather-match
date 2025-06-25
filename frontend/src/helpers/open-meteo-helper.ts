import { OpenMeteoLocation } from './open-meteo-location';

export const searchForLocation = async (location: string): Promise<OpenMeteoLocation[]> => {
    const params = new URLSearchParams({
        name: location,
        count: "5",
        language: "en",
        format: "json",
    });

    const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`
    );
    const data = await res.json();
    return data.results || [];
}