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
    },
}));
import { WeatherCondition, WeatherData } from "../model";
import { determineWeatherConditions, average } from "./weather-conditions-helper";

describe('WeatherConditionsHelper', () => {
    describe('determineWeatherConditions', () => {
        it('should throw an error when no weather data is provided', () => {
            expect(() => determineWeatherConditions(null as any)).toThrow("Weather data is required to determine weather conditions.");
        })

        it('should return an empty array when no weather conditions are met', () => {
            const temperatures: number[] = []
            const windSpeeds: number[] = []
            const precipitation: number[] = []
            const snowfall: number[] = []
            const sunshineDuration: number[] = [];
            const elevation = 1;

            const weatherData = new WeatherData(
                temperatures,
                windSpeeds,
                precipitation,
                snowfall,
                sunshineDuration,
                elevation
            );

            const result = determineWeatherConditions(weatherData);
            expect(result).toEqual([]);
        });

        it('should return weather conditions as "comfortable" when none of the thresholds are met', () => {
            const weatherData = new WeatherData(
                [-1, 5, 3, 15, 25, 0],
                [10, 15, 8, 19, 20, 23],
                [15, 25, 5, 2, 0, 0],
                [0, 10, 0, 4, 0, 1],
                [21000, 21100, 21900, 20000, 21120, 21000],
                1
            );

            const result = determineWeatherConditions(weatherData);
            expect(result).toEqual([WeatherCondition.COMFORTABLE]);
        });

        it.each([
            [
                new WeatherData(
                    [-5],
                    [15],
                    [5],
                    [0],
                    [21000],
                    1
                ),
                [WeatherCondition.COLD]
            ],
            [
                new WeatherData(
                    [35],
                    [15],
                    [5],
                    [0],
                    [21000],
                    1
                ),
                [WeatherCondition.HOT]
            ],
            [
                new WeatherData(
                    [34],
                    [15],
                    [10],
                    [0],
                    [21000],
                    1
                ),
                [WeatherCondition.RAINING]
            ],
            [
                new WeatherData(
                    [34],
                    [15],
                    [9],
                    [5],
                    [21000],
                    1
                ),
                [WeatherCondition.SNOWING]
            ],
            [
                new WeatherData(
                    [34], 
                    [20],
                    [9],
                    [4],
                    [21000],
                    1
                ),
                [WeatherCondition.WINDY]
            ],
            [
                new WeatherData(
                    [34], 
                    [15],
                    [9],
                    [4],
                    [21600],
                    1
                ),
                [WeatherCondition.SUNNY]
            ],
            [
                new WeatherData(
                    [-5, -9, -5, -5, -8, 0],
                    [15, 15, 15, 15, 15, 15],
                    [5, 5, 5, 5, 5, 5],
                    [0, 0, 0, 0, 0, 0],
                    [21000, 21000, 21000, 21000, 21000, 21000],
                    1
                ),
                [WeatherCondition.COLD]
            ],
            [
                new WeatherData(
                    [35, 28, 37, 38, 35, 40],
                    [15, 15, 15, 15, 15, 15],
                    [5, 5, 5, 5, 5, 5],
                    [0, 0, 0, 0, 0, 0],
                    [21000, 21000, 21000, 21000, 21000, 21000],
                    1
                ),
                [WeatherCondition.HOT]
            ],
            [
                new WeatherData(
                    [34, 34, 34, 34, 34, 34],
                    [15, 15, 15, 15, 15, 15],
                    [5, 10, 2, 15, 22, 21],
                    [0, 0, 0, 0, 0, 0],
                    [21000, 21000, 21000, 21000, 21000, 21000],
                    1
                ),
                [WeatherCondition.RAINING]
            ],
            [
                new WeatherData(
                    [34, 34, 34, 34, 34, 34],
                    [15, 15, 15, 15, 15, 15],
                    [5, 5, 5, 5, 5, 5],
                    [5, 15, 20, 1, 0, 2],
                    [21000, 21000, 21000, 21000, 21000, 21000],
                    1
                ),
                [WeatherCondition.SNOWING]
            ],
            [
                new WeatherData(
                    [34, 34, 34, 34, 34, 34],
                    [15, 20, 26, 15, 34, 10],
                    [5, 5, 5, 5, 5, 5],
                    [0, 0, 0, 0, 0, 0],
                    [21000, 21000, 21000, 21000, 21000, 21000],
                    1
                ),
                [WeatherCondition.WINDY]
            ],
            [
                new WeatherData(
                    [34, 34, 34, 34, 34, 34],
                    [15, 15, 15, 15, 15, 15],
                    [5, 5, 5, 5, 5, 5],
                    [0, 0, 0, 0, 0, 0],
                    [20000, 25200, 20000, 21600, 21000, 21823],
                    1
                ),
                [WeatherCondition.SUNNY]
            ],
            [
                new WeatherData(
                    [-5, -9, -5, -5, -8, 0],
                    [15, 20, 26, 15, 34, 10],
                    [5, 10, 2, 15, 22, 21],
                    [5, 15, 20, 1, 0, 2],
                    [20000, 25200, 20000, 21600, 21000, 21823],
                    1
                ),
                [
                    WeatherCondition.RAINING,
                    WeatherCondition.SNOWING,
                    WeatherCondition.COLD, 
                    WeatherCondition.WINDY, 
                    WeatherCondition.SUNNY,
                ]
            ]
        ])('should return the correct weather condition when a threshold has been met', (weatherData: WeatherData, expectedConditions: WeatherCondition[]) => {
            const result = determineWeatherConditions(weatherData);
            expect(result).toEqual(expectedConditions);
        });
    });

    describe('average', () => {
        it.each([
            [[], 0],
            [[1], 1],
            [[1, 2, 3], 2],
            [[1, 2, 3, 4, 5], 3],
            [[-1, -2, -3], -2],
            [[-1, 0, 1], 0],
            [[10, 20, 30, 40], 25]
        ])('should calculate the average of an array of numbers %s average %s', (values: number[], expected: number) => {
            const result = average(values);
            expect(result).toBe(expected);
        }); 
    });
})