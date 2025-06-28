import { config } from '../../../config'

export async function POST(request: Request) {
    const body = await request.json();
    const { lat, long, timeframeDays } = body;

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
    return new Response(JSON.stringify(data.data.rankByWeather), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}