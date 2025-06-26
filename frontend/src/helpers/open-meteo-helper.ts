import { OpenMeteoLocation } from './open-meteo-location';
import { config } from '../config'

export const searchForLocation = async (location: string): Promise<OpenMeteoLocation[]> => {
    const params = new URLSearchParams({
        name: location,
        count: "5",
        language: "en",
        format: "json",
    });

    const res = await fetch(
        `${config.openMeteoApiHost}/v1/search?${params.toString()}`
    );
    const data = await res.json();
    return data.results || [];
}