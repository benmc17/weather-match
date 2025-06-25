import { Geography, WeatherCondition, Activity } from "../core/model";
import { ActivityRepositoryPort } from "../core/ports";

// This would be in a database in a real world scenario and cached in a distributed cache.
const activities: Activity[] = [
    new Activity(
        "Skiing", 
        [
            { weather: WeatherCondition.SNOWING, suitabilityScore: 10 }, 
            { weather: WeatherCondition.COLD, suitabilityScore: 10 }, 
            { weather: WeatherCondition.SUNNY, suitabilityScore: 7 }, 
            { weather: WeatherCondition.HOT, suitabilityScore: 0 }, 
            { weather: WeatherCondition.COMFORTABLE, suitabilityScore: 5 }
        ], 
        [ Geography.MOUNTAINOUS ]
    ),
    new Activity(
        "Surfing", 
        [
            { weather: WeatherCondition.RAINING, suitabilityScore: 5 }, 
            { weather: WeatherCondition.SUNNY, suitabilityScore: 8 }, 
            { weather: WeatherCondition.HOT, suitabilityScore: 8 }, 
            { weather: WeatherCondition.WINDY, suitabilityScore: 10 }, 
            { weather: WeatherCondition.COMFORTABLE, suitabilityScore: 2 }
        ], 
        [ Geography.COASTAL ]
    ),
    new Activity(
        "Outdoor sightseeing", 
        [
            { weather: WeatherCondition.RAINING, suitabilityScore: 1 }, 
            { weather: WeatherCondition.SNOWING, suitabilityScore: 1 }, 
            { weather: WeatherCondition.COLD, suitabilityScore: 2 }, 
            { weather: WeatherCondition.SUNNY, suitabilityScore: 10 }, 
            { weather: WeatherCondition.HOT, suitabilityScore: 10 }, 
            { weather: WeatherCondition.WINDY, suitabilityScore: 5 }, 
            { weather: WeatherCondition.COMFORTABLE, suitabilityScore: 8 }
        ], 
        [ Geography.FLAT_INLAND, Geography.COASTAL, Geography.MOUNTAINOUS ]
    ),
    new Activity(
        "Indoor sightseeing", 
        [
            { weather: WeatherCondition.RAINING, suitabilityScore: 10 }, 
            { weather: WeatherCondition.SNOWING, suitabilityScore: 10 }, 
            { weather: WeatherCondition.COLD, suitabilityScore: 10 }, 
            { weather: WeatherCondition.SUNNY, suitabilityScore: 1 }, 
            { weather: WeatherCondition.HOT, suitabilityScore: 1 }, 
            { weather: WeatherCondition.WINDY, suitabilityScore: 8 }, 
            { weather: WeatherCondition.COMFORTABLE, suitabilityScore: 5 }
        ], 
        [ Geography.FLAT_INLAND, Geography.COASTAL, Geography.MOUNTAINOUS ]
    ),
];

export class ActivityRepository implements ActivityRepositoryPort {
    getActivities(geography: Geography, weatherConditions: WeatherCondition[]): Activity[] {
        if (!weatherConditions?.length) {
            return []
        }

        // This would be a database query in a real world scenario and cached in a distributed cache.
        const filteredActivities = activities.filter(activity => activity.suitableGeography.includes(geography));
        return filteredActivities.filter(
            activity => weatherConditions.every(condition =>
                activity.suitableWeather.some(s => s.weather === condition)
            )
        );
    }
}