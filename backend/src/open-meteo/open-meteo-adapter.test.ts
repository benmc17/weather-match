jest.mock("../config", () => ({
    config: {
        openMeteoWeatherHost: 'http://weather-api:8080',
        openMeteoMarineHost: 'http://marine-api:8080',
    },
}));
import axios from 'axios';
import { OpenMeteoAdapter } from "./open-meteo-adapter";
import { WeatherData } from '../core/model';
import { OpenMeteoMarineForecast, OpenMeteoWeatherForecast } from './model';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const testWeatherForecast: OpenMeteoWeatherForecast = {
    latitude: 48.8566,
    longitude: 2.3522,
    generationtime_ms: 12.3,
    utc_offset_seconds: 7200,
    timezone: "Europe/Paris",
    timezone_abbreviation: "CEST",
    elevation: 35,
    daily_units: {
        time: "iso8601",
        temperature_2m_max: "°C",
        precipitation_sum: "mm",
        windspeed_10m_max: "km/h",
        rain_sum: "mm",
        snowfall_sum: "cm",
    },
    daily: {
        time: [
            "2024-06-01",
            "2024-06-02",
            "2024-06-03",
            "2024-06-04",
            "2024-06-05",
            "2024-06-06",
            "2024-06-07"
        ],
        temperature_2m_mean: [20, 21, 19, 18, 22, 23, 21],
        precipitation_sum: [0, 1.2, 0, 0.5, 0, 0, 2.1],
        windspeed_10m_mean: [10, 12, 8, 9, 11, 13, 10],
        rain_sum: [0, 1.2, 0, 0.5, 0, 0, 2.1],
        snowfall_sum: [0, 0, 0, 0, 0, 0, 0],
        sunshine_duration: [600, 720, 800, 500, 900, 850, 700],
    },
}

const testMarineForecast: OpenMeteoMarineForecast = {
    latitude: 56.7917,
    longitude: -6.1250,
    generationtime_ms: 0.04,
    utc_offset_seconds: 3600,
    timezone: "Europe/London",
    timezone_abbreviation: "GMT+1",
    elevation: 0,
    daily_units: {
        time: "iso8601",
        wave_height_max: "m"
    },
    daily: {
        time: [
            "2025-06-24",
            "2025-06-25",
            "2025-06-26",
            "2025-06-27",
            "2025-06-28",
            "2025-06-29",
            "2025-06-30"
        ],
        wave_height_max: [0.96, 0.70, 1.04, 1.14, 1.46, 1.02, 0.60]
    }
};

describe('ActivityRepository', () => {
    let openMeteoAdapter: OpenMeteoAdapter;

    beforeEach(() => {
        openMeteoAdapter = new OpenMeteoAdapter();
        mockedAxios.get.mockClear();
    })

    describe('getWeatherForecast', () => {
        it('should fetch weather forecast data', async () => {
            const lat = 48.8566;
            const long = 2.3522;
            const timeframeDays = 7;

            mockedAxios.get.mockResolvedValue({
                data: testWeatherForecast,
                status: 200,
                statusText: 'OK',
            });

            const weatherData = await openMeteoAdapter.getWeatherForecast(lat, long, timeframeDays);
            expect(weatherData).toEqual(new WeatherData(
                testWeatherForecast.daily.temperature_2m_mean,
                testWeatherForecast.daily.windspeed_10m_mean,
                testWeatherForecast.daily.precipitation_sum,
                testWeatherForecast.daily.snowfall_sum,
                testWeatherForecast.daily.sunshine_duration,
                testWeatherForecast.elevation
            ));
        })

        it('should call the Open Meteo API', async () => {
            const lat = 48.8566;
            const long = 2.3522;
            const timeframeDays = 7;

            mockedAxios.get.mockResolvedValue({
                data: testWeatherForecast,
                status: 200,
                statusText: 'OK',
            });

            const expectedUrl = `http://weather-api:8080/v1/forecast?latitude=${lat}&longitude=${long}&daily=temperature_2m_mean%2Cprecipitation_sum%2Cwindspeed_10m_mean%2Crain_sum%2Csnowfall_sum%2Csunshine_duration&timezone=auto&forecast_days=${timeframeDays}`;

            await openMeteoAdapter.getWeatherForecast(lat, long, timeframeDays);
            expect(mockedAxios.get).toHaveBeenCalledWith(expectedUrl)
        })

        it('should throw an error if the API call fails', async () => {
            const lat = 48.8566;
            const long = 2.3522;
            const timeframeDays = 7;
            const errorMessage = 'API Error';

            mockedAxios.get.mockRejectedValue(new Error(errorMessage));

            await expect(openMeteoAdapter.getWeatherForecast(lat, long, timeframeDays))
                .rejects.toThrow(`Error fetching Open Meteo API data: Error: ${errorMessage}`);
        })
    })

    describe('getWaveHeights', () => {
        it('should fetch wave heights data', async () => {
            const lat = 48.8566;
            const long = 2.3522;
            const timeframeDays = 7;

            mockedAxios.get.mockResolvedValue({
                data: testMarineForecast,
                status: 200,
                statusText: 'OK',
            });

            const marineForecastData = await openMeteoAdapter.getWaveHeights(lat, long, timeframeDays);
            expect(marineForecastData).toEqual(testMarineForecast.daily.wave_height_max);
        })

        it('should call the Open Meteo API', async () => {
            const lat = 48.8566;
            const long = 2.3522;
            const timeframeDays = 7;

            mockedAxios.get.mockResolvedValue({
                data: testMarineForecast,
                status: 200,
                statusText: 'OK',
            });

            const expectedUrl = `http://marine-api:8080/v1/marine?latitude=${lat}&longitude=${long}&daily=wave_height_max&timezone=auto&forecast_days=${timeframeDays}`;

            await openMeteoAdapter.getWaveHeights(lat, long, timeframeDays);
            expect(mockedAxios.get).toHaveBeenCalledWith(expectedUrl)
        })

        it('should throw an error if the API call fails', async () => {
            const lat = 48.8566;
            const long = 2.3522;
            const timeframeDays = 7;
            const errorMessage = 'API Error';

            mockedAxios.get.mockRejectedValue(new Error(errorMessage));

            await expect(openMeteoAdapter.getWaveHeights(lat, long, timeframeDays))
                .rejects.toThrow(`Error fetching Open Meteo API data: Error: ${errorMessage}`);
        })
    })
})