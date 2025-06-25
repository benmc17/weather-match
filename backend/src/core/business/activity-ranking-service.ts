import { config } from "../../config";
import { Location, Geography, RankedActivities } from "../model";
import { ActivityRankingPort, WeatherDataProviderPort, ActivityRepositoryPort } from "../ports";
import { rankActivities } from "./activities-helper";
import { determineWeatherConditions } from "./weather-conditions-helper";

export class ActivityRankingService implements ActivityRankingPort {
    private readonly weatherDataProvider: WeatherDataProviderPort;
    private readonly activityRepository: ActivityRepositoryPort;

    constructor(weatherDataProvider: WeatherDataProviderPort, activityRepository: ActivityRepositoryPort) {
        this.weatherDataProvider = weatherDataProvider;
        this.activityRepository = activityRepository;
    }

    async rankByWeather(lat: number, long: number, timeframeDays: number): Promise<RankedActivities> {
        const weatherData = await this.weatherDataProvider.getWeatherForecast(lat, long, timeframeDays);
        const weatherConditions = determineWeatherConditions(weatherData);
        const geography = await this.getGeographicLocataion(lat, long, weatherData.elevation);
        const activities = this.activityRepository.getActivities(geography, weatherConditions);
        const rankedActivities = rankActivities(activities, weatherConditions);
        
        return new RankedActivities(
            rankedActivities, 
            new Location(lat, long, geography, weatherConditions)
        );
    }

    private async getGeographicLocataion(lat: number, long: number, elevation: number): Promise<Geography> {
        if (elevation <= config.elevationThresholds.lowElevationM) {
            // This could be improved by using a dedicated API to check coastal areas, this is a bit of a workaround
            const waveHeights = await this.weatherDataProvider.getWaveHeights(lat, long, 1);

            if (waveHeights[0]) {
                return Geography.COASTAL;
            }
        }

        if (elevation >= config.elevationThresholds.highElevationM) {
            // This could be checked with an API that provided this service
            return Geography.MOUNTAINOUS;
        }

        return Geography.FLAT_INLAND;
    }
}