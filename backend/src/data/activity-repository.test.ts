import { Geography, WeatherCondition } from "../core/model";
import { ActivityRepository } from "./activity-repository";

describe('ActivityRepository', () => {
    let activityRepository: ActivityRepository;

    beforeEach(() => {
        activityRepository = new ActivityRepository();
    });

    describe('getActivities', () => {
        it.each([
            [
                Geography.MOUNTAINOUS,
                [WeatherCondition.SNOWING, WeatherCondition.COLD],
                ["Skiing", "Outdoor sightseeing", "Indoor sightseeing"]
            ],
            [
                Geography.MOUNTAINOUS,
                [WeatherCondition.SNOWING, WeatherCondition.COLD, WeatherCondition.WINDY],
                ["Outdoor sightseeing", "Indoor sightseeing"]
            ],
            [
                Geography.COASTAL,
                [WeatherCondition.SUNNY, WeatherCondition.HOT, WeatherCondition.WINDY],
                ["Surfing", "Outdoor sightseeing", "Indoor sightseeing"]
            ],
            [
                Geography.COASTAL,
                [WeatherCondition.SUNNY, WeatherCondition.HOT, WeatherCondition.COLD],
                ["Outdoor sightseeing", "Indoor sightseeing"]
            ],
            [
                Geography.FLAT_INLAND,
                [WeatherCondition.RAINING, WeatherCondition.SNOWING, WeatherCondition.COLD],
                ["Outdoor sightseeing", "Indoor sightseeing"]
            ],
            [
                Geography.FLAT_INLAND,
                [],
                []
            ]
        ])('should return activities for geography %s and weather conditions %s', 
            (geography: Geography, weatherConditions: WeatherCondition[], expectedActivities: string[]) => {
        
            const activities = activityRepository.getActivities(geography, weatherConditions);
            expect(activities).toHaveLength(expectedActivities.length);
            expect(activities.map(activity => activity.name)).toEqual(expectedActivities);
        });
    })
});