export type OpenMeteoWeatherForecast = {
    latitude: number;
    longitude: number;
    generationtime_ms: number;
    utc_offset_seconds: number;
    timezone: string;
    timezone_abbreviation: string;
    elevation: number;
    daily_units: {
        time: string;
        temperature_2m_max: string;
        precipitation_sum: string;
        windspeed_10m_max: string;
        rain_sum: string;
        snowfall_sum: string;
    };
    daily: {
        time: string[];
        temperature_2m_mean: number[];
        precipitation_sum: number[];
        windspeed_10m_mean: number[];
        rain_sum: number[];
        snowfall_sum: number[];
        sunshine_duration: number[];
    };
}