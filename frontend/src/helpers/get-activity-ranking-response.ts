export interface ActivityRankingResponse {
    activities: {
        name: string
        rank: number
        suitabilityScore: number
    }[]
    location: {
        lat: number;
        long: number;
        geography: string;
        weatherConditions: string[];
    }
}