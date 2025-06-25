/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock("../../config", () => ({
    config: {
        weatherThresholds: {
            temperatureLowC: -5,
            temperatureHighC: 35,
            pricipitationMm: 10,
            windSpeedKmh: 20,
            snowfallCm: 5,
            sunshineDurationSec: 21600
        },
        elevationThresholds: {
            lowElevationM: 10,
            highElevationM: 1500,
        }
    },
}));
import { Activity, Geography, WeatherCondition, WeatherData } from "../model";
import { ActivityRepositoryPort, WeatherDataProviderPort } from "../ports";
import { ActivityRankingService } from "./activity-ranking-service";

describe('ActivitiesRankingService', () => {
    let activityRankingService: ActivityRankingService;
    let weatherDataProvider: jest.Mocked<WeatherDataProviderPort>;
    let activityRepository: jest.Mocked<ActivityRepositoryPort>;

    beforeEach(() => {
        weatherDataProvider = {
            getWeatherForecast: jest.fn(),
            getWaveHeights: jest.fn()
        } as unknown as jest.Mocked<WeatherDataProviderPort>;

        activityRepository = {
            getActivities: jest.fn(),
        } as unknown as jest.Mocked<ActivityRepositoryPort>;

        activityRankingService = new ActivityRankingService(weatherDataProvider, activityRepository);
    });

    describe('rankByWeather', () => {
        it('should throw an error when no weather data is provided', async () => {
            weatherDataProvider.getWeatherForecast.mockResolvedValue(null as any);
            await expect(activityRankingService.rankByWeather(0, 0, 1)).rejects.toThrow("Weather data is required to determine weather conditions.");
        });

        it('should return ranked activities based on weather conditions', async () => {
            const weatherData = new WeatherData(
                [-5, -9, -5, -5, -8, 0],
                [15, 10, 5, 5, 6, 3],
                [5, 0, 2, 15, 2, 1],
                [5, 15, 20, 1, 0, 2],
                [20000, 25200, 20000, 21600, 21000, 21823],
                15
            )

            const activities = [
                new Activity("Test Activity 1", [
                    { weather: WeatherCondition.RAINING, suitabilityScore: 8 },
                    { weather: WeatherCondition.COLD, suitabilityScore: 5 }
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

            const lat = 50.12345;
            const long = 8.12345;
            const timeframeDays = 7;

            weatherDataProvider.getWeatherForecast.mockResolvedValue(weatherData);
            activityRepository.getActivities.mockReturnValue(activities);

            const result = await activityRankingService.rankByWeather(lat, long, timeframeDays);
            expect(result).toBeDefined();
            expect(result.activities.length).toBe(3);

            expect(result.activities[0]).toEqual({
                name: "Test Activity 2",
                rank: 1,
                suitabilityScore: 10
            });
            expect(result.activities[1]).toEqual({
                name: "Test Activity 1",
                rank: 2,
                suitabilityScore: 5
            });
            expect(result.activities[2]).toEqual({
                name: "Test Activity 3",
                rank: 3,
                suitabilityScore: 0
            });
        });

        it('should return location information', async () => {
            const weatherData = new WeatherData(
                [-5, -9, -5, -5, -8, 0],
                [15, 20, 26, 15, 34, 10],
                [5, 10, 2, 15, 22, 21],
                [5, 15, 20, 1, 0, 2],
                [20000, 25200, 20000, 21600, 21000, 21823],
                15
            )

            const activities = [
                new Activity("Test Activity 1", [
                    { weather: WeatherCondition.RAINING, suitabilityScore: 8 },
                    { weather: WeatherCondition.COLD, suitabilityScore: 5 }
                ], [Geography.FLAT_INLAND]),
            ];

            const lat = 50.12345;
            const long = 8.12345;
            const timeframeDays = 7;

            weatherDataProvider.getWeatherForecast.mockResolvedValue(weatherData);
            activityRepository.getActivities.mockReturnValue(activities);

            const result = await activityRankingService.rankByWeather(lat, long, timeframeDays);
            expect(result).toBeDefined();
            expect(result.location).toBeDefined();
            expect(result.location.lat).toBe(lat);
            expect(result.location.long).toBe(long);
            expect(result.location.geography).toBe(Geography.FLAT_INLAND);
            expect(result.location.weatherConditions).toEqual([
                WeatherCondition.RAINING,
                WeatherCondition.SNOWING,
                WeatherCondition.COLD, 
                WeatherCondition.WINDY, 
                WeatherCondition.SUNNY,
            ]);
        });

        it('should retrieve the weather forecast from the weather data provider', async () => {
            const weatherData = new WeatherData(
                [-5, -9, -5, -5, -8, 0],
                [15, 10, 5, 5, 6, 3],
                [5, 0, 2, 15, 2, 1],
                [5, 15, 20, 1, 0, 2],
                [20000, 25200, 20000, 21600, 21000, 21823],
                15
            )

            const activities = [
                new Activity("Test Activity 1", [
                    { weather: WeatherCondition.RAINING, suitabilityScore: 8 },
                    { weather: WeatherCondition.COLD, suitabilityScore: 5 }
                ], [Geography.FLAT_INLAND]),
            ];

            const lat = 50.12345;
            const long = 8.12345;
            const timeframeDays = 7;

            weatherDataProvider.getWeatherForecast.mockResolvedValue(weatherData);
            activityRepository.getActivities.mockReturnValue(activities);

            await activityRankingService.rankByWeather(lat, long, timeframeDays);
            expect(weatherDataProvider.getWeatherForecast).toHaveBeenCalledWith(lat, long, timeframeDays);
        });

        it('should retrieve the activites from the activity repository', async () => {
            const weatherData = new WeatherData(
                [-5, -9, -5, -5, -8, 0],
                [15, 10, 5, 5, 6, 3],
                [5, 0, 2, 15, 2, 1],
                [5, 15, 20, 1, 0, 2],
                [20000, 25200, 20000, 21600, 21000, 21823],
                15
            )

            const activities = [
                new Activity("Test Activity 1", [
                    { weather: WeatherCondition.RAINING, suitabilityScore: 8 },
                    { weather: WeatherCondition.COLD, suitabilityScore: 5 }
                ], [Geography.FLAT_INLAND]),
            ];

            const lat = 50.12345;
            const long = 8.12345;
            const timeframeDays = 7;

            weatherDataProvider.getWeatherForecast.mockResolvedValue(weatherData);
            activityRepository.getActivities.mockReturnValue(activities);

            await activityRankingService.rankByWeather(lat, long, timeframeDays);
            expect(activityRepository.getActivities).toHaveBeenCalledWith(
                Geography.FLAT_INLAND, 
                [WeatherCondition.SNOWING, WeatherCondition.COLD, WeatherCondition.SUNNY]
            );
        });

        it.each([
            [
                5, 
                [0, 0, 0, 0, 0, 0], 
                Geography.FLAT_INLAND
            ],
            [
                10, 
                [0, 0, 0, 0, 0, 0], 
                Geography.FLAT_INLAND
            ],
            [
                5,
                [20000, 25200, 20000, 21600, 21000, 21823],
                Geography.COASTAL
            ],
            [
                -10,
                [20000, 25200, 20000, 21600, 21000, 21823],
                Geography.COASTAL
            ],
            [
                -15,
                [20000, 25200, 20000, 21600, 21000, 21823],
                Geography.COASTAL
            ]
        ])('should determine if low elevation locations are coastal', async (elevation: number, waveHeights: number[], geography: Geography) => {
            const weatherData = new WeatherData(
                [-5, -9, -5, -5, -8, 0],
                [15, 10, 5, 5, 6, 3],
                [5, 0, 2, 15, 2, 1],
                [5, 15, 20, 1, 0, 2],
                [20000, 25200, 20000, 21600, 21000, 21823],
                elevation
            )

            const activities = [
                new Activity("Test Activity 1", [
                    { weather: WeatherCondition.RAINING, suitabilityScore: 8 },
                    { weather: WeatherCondition.COLD, suitabilityScore: 5 }
                ], [Geography.FLAT_INLAND]),
            ];

            const lat = 50.12345;
            const long = 8.12345;
            const timeframeDays = 7;

            weatherDataProvider.getWeatherForecast.mockResolvedValue(weatherData);
            weatherDataProvider.getWaveHeights.mockResolvedValue(waveHeights);
            activityRepository.getActivities.mockReturnValue(activities);

            const result = await activityRankingService.rankByWeather(lat, long, timeframeDays);
            expect(result.location.geography).toBe(geography);
            expect(weatherDataProvider.getWaveHeights).toHaveBeenCalledWith(lat, long, 1);
        });

        it.each([
            [
                15, 
                Geography.FLAT_INLAND
            ],
            [
                2000, 
                Geography.MOUNTAINOUS
            ]
        ])('should determine geography based on elevation', async (elevation: number, geography: Geography) => {
            const weatherData = new WeatherData(
                [-5, -9, -5, -5, -8, 0],
                [15, 10, 5, 5, 6, 3],
                [5, 0, 2, 15, 2, 1],
                [5, 15, 20, 1, 0, 2],
                [20000, 25200, 20000, 21600, 21000, 21823],
                elevation
            )

            const activities = [
                new Activity("Test Activity 1", [
                    { weather: WeatherCondition.RAINING, suitabilityScore: 8 },
                    { weather: WeatherCondition.COLD, suitabilityScore: 5 }
                ], [Geography.FLAT_INLAND]),
            ];

            const lat = 50.12345;
            const long = 8.12345;
            const timeframeDays = 7;

            weatherDataProvider.getWeatherForecast.mockResolvedValue(weatherData);
            activityRepository.getActivities.mockReturnValue(activities);

            const result = await activityRankingService.rankByWeather(lat, long, timeframeDays);
            expect(result.location.geography).toBe(geography);
        });
    });
});