import { WeatherData, WeatherCondition } from "../model";
import { config } from "../../config";

const average = (values: number[]): number => {
    if (values.length === 0) return 0;

    return values.reduce((acc, value) => acc + value, 0) / values.length;
}

const determineWeatherConditions = (weatherData: WeatherData): WeatherCondition[] => {
    if (!weatherData) {
        throw new Error("Weather data is required to determine weather conditions.");
    }

    if (!weatherData.temperatures.length || 
        !weatherData.windSpeeds.length || 
        !weatherData.precipitation.length || 
        !weatherData.snowfall.length || 
        !weatherData.sunshineDuration.length
    ) {
        return [];
    }

    const averageRainfall = average(weatherData.precipitation);
    const averageSnowfall = average(weatherData.snowfall); 
    const averageTemperature = average(weatherData.temperatures);
    const averageWindSpeed = average(weatherData.windSpeeds);
    const averageSunshineDuration = average(weatherData.sunshineDuration);

    const weatherConditions: WeatherCondition[] = [];

    if (averageRainfall >= config.weatherThresholds.pricipitationMm) {
        weatherConditions.push(WeatherCondition.RAINING);
    }

    if (averageSnowfall >= config.weatherThresholds.snowfallCm) {
        weatherConditions.push(WeatherCondition.SNOWING);
    }

    if (averageTemperature >= config.weatherThresholds.temperatureHighC) {
        weatherConditions.push(WeatherCondition.HOT);
    }

    if (averageTemperature <= config.weatherThresholds.temperatureLowC) {
        weatherConditions.push(WeatherCondition.COLD);
    }

    if (averageWindSpeed >= config.weatherThresholds.windSpeedKmh) {
        weatherConditions.push(WeatherCondition.WINDY);
    }

    if (averageSunshineDuration >= config.weatherThresholds.sunshineDurationSec) {
        weatherConditions.push(WeatherCondition.SUNNY);
    }

    if (weatherConditions.length === 0) {
        weatherConditions.push(WeatherCondition.COMFORTABLE);
    }

    return weatherConditions
}

export { determineWeatherConditions, average };