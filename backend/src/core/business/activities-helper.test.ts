/* eslint-disable @typescript-eslint/no-explicit-any */
import { Activity, ActivityRanking, Geography, WeatherCondition } from "../model";
import { determineHighestSuitabilityScores, rankActivities } from "./activities-helper";

describe('ActivitiesHelper', () => {
    describe('determineHighestSuitabilityScores', () => {
        it('should return an empty array when no activities are provided', () => {
            const result = determineHighestSuitabilityScores([], [WeatherCondition.SUNNY, WeatherCondition.RAINING]);
            expect(result).toEqual([]);
        })

        it('should return an empty array when the activities array is null', () => {
            const result = determineHighestSuitabilityScores(null as any, [WeatherCondition.SUNNY, WeatherCondition.RAINING]);
            expect(result).toEqual([]);
        })

        it('should return an empty array when no weather conditions are provided', () => {
            const activities = [
                new Activity("Test Activity", [{ weather: WeatherCondition.COLD, suitabilityScore: 1 }], [Geography.FLAT_INLAND])
            ];

            const result = determineHighestSuitabilityScores(activities, []);
            expect(result).toEqual([])
        })

        it('should return an empty array when weather conditions array is null', () => {
            const activities = [
                new Activity("Test Activity", [{ weather: WeatherCondition.COLD, suitabilityScore: 1 }], [Geography.FLAT_INLAND])
            ];

            const result = determineHighestSuitabilityScores(activities, null as any);
            expect(result).toEqual([])
        })

        it('should return the highest suitability scores for an activity based on weather conditions', () => {
            const activities = [
                new Activity("Test Activity 1", [
                    { weather: WeatherCondition.COMFORTABLE, suitabilityScore: 1 },
                    { weather: WeatherCondition.RAINING, suitabilityScore: 8 },
                    { weather: WeatherCondition.SNOWING, suitabilityScore: 5 },
                    { weather: WeatherCondition.SUNNY, suitabilityScore: 9 },
                    { weather: WeatherCondition.WINDY, suitabilityScore: 2 }
                ], [Geography.FLAT_INLAND]),
            ];

            const result = determineHighestSuitabilityScores(activities, [WeatherCondition.SNOWING, WeatherCondition.RAINING]);
            expect(result).toEqual([
                { activity: activities[0], suitabilityScore: 8 },
            ])
        })

        it('should return the suitability scores for each activity in descending order', () => {
            const activities = [
                new Activity("Test Activity 1", [
                    { weather: WeatherCondition.COMFORTABLE, suitabilityScore: 1 },
                    { weather: WeatherCondition.RAINING, suitabilityScore: 8 }
                ], [Geography.FLAT_INLAND]),
                new Activity("Test Activity 2", [
                    { weather: WeatherCondition.SNOWING, suitabilityScore: 10 },
                    { weather: WeatherCondition.COLD, suitabilityScore: 1 }
                ], [Geography.FLAT_INLAND]),
                new Activity("Test Activity 3", [
                    { weather: WeatherCondition.WINDY, suitabilityScore: 1 },
                    { weather: WeatherCondition.RAINING, suitabilityScore: 4 }
                ], [Geography.FLAT_INLAND]),
            ];

            const result = determineHighestSuitabilityScores(activities, [WeatherCondition.SNOWING, WeatherCondition.RAINING]);
            expect(result).toEqual([
                { activity: activities[1], suitabilityScore: 10 },
                { activity: activities[0], suitabilityScore: 8 },
                { activity: activities[2], suitabilityScore: 4 },
            ])
        })

        it('should return a 0 suitability score if the weather conditions are not suitable for the activity', () => {
            const activities = [
                new Activity("Test Activity 1", [
                    { weather: WeatherCondition.COMFORTABLE, suitabilityScore: 1 },
                    { weather: WeatherCondition.RAINING, suitabilityScore: 8 }
                ], [Geography.FLAT_INLAND])
            ];

            const result = determineHighestSuitabilityScores(activities, [WeatherCondition.SNOWING]);
            expect(result).toEqual([
                { activity: activities[0], suitabilityScore: 0 },
            ])
        })
    })

    describe('rankActivities', () => {
        it('should return an empty array when no activities are provided', () => {
            const result = rankActivities([], [WeatherCondition.SUNNY, WeatherCondition.RAINING]);
            expect(result).toEqual([]);
        })

        it('should return an empty array when the activities array is null', () => {
            const result = rankActivities(null as any, [WeatherCondition.SUNNY, WeatherCondition.RAINING]);
            expect(result).toEqual([]);
        })

        it('should return an empty array when no weather conditions are provided', () => {
            const activities = [
                new Activity("Test Activity", [{ weather: WeatherCondition.COLD, suitabilityScore: 1 }], [Geography.FLAT_INLAND])
            ];

            const result = rankActivities(activities, []);
            expect(result).toEqual([])
        })

        it('should return an empty array when weather conditions array is null', () => {
            const activities = [
                new Activity("Test Activity", [{ weather: WeatherCondition.COLD, suitabilityScore: 1 }], [Geography.FLAT_INLAND])
            ];

            const result = rankActivities(activities, null as any);
            expect(result).toEqual([])
        })

        it('should return activites ranked by their suitability scores', () => {
            const activities = [
                new Activity("Test Activity 1", [
                    { weather: WeatherCondition.COMFORTABLE, suitabilityScore: 1 },
                    { weather: WeatherCondition.RAINING, suitabilityScore: 8 }
                ], [Geography.FLAT_INLAND]),
                new Activity("Test Activity 2", [
                    { weather: WeatherCondition.SNOWING, suitabilityScore: 10 },
                    { weather: WeatherCondition.COLD, suitabilityScore: 1 }
                ], [Geography.FLAT_INLAND]),
                new Activity("Test Activity 3", [
                    { weather: WeatherCondition.WINDY, suitabilityScore: 1 },
                    { weather: WeatherCondition.RAINING, suitabilityScore: 4 }
                ], [Geography.FLAT_INLAND]),
            ];

            const result = rankActivities(activities, [WeatherCondition.SNOWING, WeatherCondition.RAINING]);
            expect(result).toEqual([
                new ActivityRanking(activities[1].name, 1, 10),
                new ActivityRanking(activities[0].name, 2, 8),
                new ActivityRanking(activities[2].name, 3, 4),
            ])
        })
    })
});