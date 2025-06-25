import { Geography } from "./geography";
import { WeatherCondition } from "./weather-condition";

export class Activity {
    readonly name: string;
    readonly suitableWeather: { weather: WeatherCondition, suitabilityScore: number }[];
    readonly suitableGeography: Geography[];

    constructor(name: string, suitableWeather: { weather: WeatherCondition, suitabilityScore: number }[], suitableGeography: Geography[]) {
        this.name = name;
        this.suitableWeather = suitableWeather;
        this.suitableGeography = suitableGeography;
    }
}