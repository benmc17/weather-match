'use server'

import { config } from '../config'
import { ActivityRankingResponse } from './get-activity-ranking-response'

export const getActivityRanking = async (formData: FormData): Promise<ActivityRankingResponse> => {
    const lat = formData.get("lat")
    const long = formData.get("long")
    const timeframeDays = config.timeframeDays;

    const query = `
        query GetRankByWeather($lat: Float!, $long: Float!, $timeframeDays: Int!) {
            rankByWeather(lat: $lat, long: $long, timeframeDays: $timeframeDays) {
                activities {
                    name
                    rank
                    suitabilityScore
                }
                location {
                    lat
                    long
                    geography
                    weatherConditions
                }
            }
        }
    `;

    const variables = { lat: Number(lat), long: Number(long), timeframeDays: Number(timeframeDays) };

    const response = await fetch(`${config.activityRankingApiHost}/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, variables }),
    });

    const data = await response.json()
    return data.data.rankByWeather
}