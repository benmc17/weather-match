import { WeatherData } from "../core/model";
import { WeatherDataProviderPort } from "../core/ports";
import { config } from "../config";
import axios from "axios";
import { OpenMeteoMarineForecast, OpenMeteoWeatherForecast } from "./model";

export class OpenMeteoAdapter implements WeatherDataProviderPort {
    private static readonly weatherParameters = "temperature_2m_mean,precipitation_sum,windspeed_10m_mean,rain_sum,snowfall_sum,sunshine_duration"
    private static readonly marineParameters = "wave_height_max"

    async getWeatherForecast(lat: number, long: number, timeframeDays: number): Promise<WeatherData> {
        const baseUrl = `${config.openMeteoWeatherHost}/v1/forecast`;
        const params = new URLSearchParams({
            latitude: lat.toString(),
            longitude: long.toString(),
            daily: OpenMeteoAdapter.weatherParameters,
            timezone: "auto",
            forecast_days: timeframeDays.toString()
        });
        const url = `${baseUrl}?${params.toString()}`;
        const response = await this.getRequest<OpenMeteoWeatherForecast>(url);

        return new WeatherData(
            response.daily.temperature_2m_mean,
            response.daily.windspeed_10m_mean,
            response.daily.precipitation_sum,
            response.daily.snowfall_sum,
            response.daily.sunshine_duration,
            response.elevation
        );
    }

    async getWaveHeights(lat: number, long: number, timeframeDays: number): Promise<number[]> {
        const baseUrl = `${config.openMeteoMarineHost}/v1/marine`;
        const params = new URLSearchParams({
            latitude: lat.toString(),
            longitude: long.toString(),
            daily: OpenMeteoAdapter.marineParameters,
            timezone: "auto",
            forecast_days: timeframeDays.toString()
        });
        const url = `${baseUrl}?${params.toString()}`;
        const response = await this.getRequest<OpenMeteoMarineForecast>(url);
    
        return response.daily.wave_height_max || [];
    }

    private async getRequest<T>(url: string): Promise<T> {
        try {
            const response = await axios.get(url);
            return response.data as T;
        } catch (error: any) {
            throw new Error(`Error fetching Open Meteo API data: ${error}`);
        }
    }
}