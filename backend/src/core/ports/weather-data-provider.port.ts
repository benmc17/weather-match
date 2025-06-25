import { WeatherData } from "../model";

export interface WeatherDataProviderPort {
    getWeatherForecast(lat: number, long: number, timeframeDays: number): Promise<WeatherData>;
    getWaveHeights(lat: number, long: number, timeframeDays: number): Promise<number[]>
}