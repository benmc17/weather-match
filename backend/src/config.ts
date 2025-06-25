import dotenv from 'dotenv';
dotenv.config()

export const config = {
    port: process.env.PORT ?? 8081,
    openMeteoWeatherHost: process.env.OPEN_METEO_WEATHER_HOST ?? 'http://localhost:8080',
    openMeteoMarineHost: process.env.OPEN_METEO_MARINE_HOST ?? 'http://localhost:8080',
    weatherThresholds: {
        temperatureLowC: parseInt(process.env.THRESHOLD_TEMPERATURE_LOW_C ?? "-5"),
        temperatureHighC: parseInt(process.env.THRESHOLD_TEMPERATURE_HIGH_C ?? "35"),
        pricipitationMm: parseInt(process.env.THRESHOLD_PRECIPITATION_MM ?? "10"),
        windSpeedKmh: parseInt(process.env.THRESHOLD_WINDSPEED_KMH ?? "20"),
        snowfallCm: parseInt(process.env.THRESHOLD_SNOWFALL_CM ?? "5"),
        sunshineDurationSec: parseInt(process.env.THRESHOLD_SUNSHINE_DURATION_SEC ?? "21600") // 6 hours in seconds,
    },
    elevationThresholds: {
        lowElevationM: parseInt(process.env.THRESHOLD_LOW_ELEVATION_M ?? "10"),
        highElevationM: parseInt(process.env.THRESHOLD_HIGH_ELEVATION_M ?? "1500"),
    }
};