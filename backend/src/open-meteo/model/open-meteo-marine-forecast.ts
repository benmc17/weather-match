export interface OpenMeteoMarineForecast {
    latitude: number;
    longitude: number;
    generationtime_ms: number;
    utc_offset_seconds: number;
    timezone: string;
    timezone_abbreviation: string;
    elevation: number;
    daily_units: {
        time: string;
        wave_height_max: string;
    };
    daily: {
        time: string[];
        wave_height_max: number[];
    };
}