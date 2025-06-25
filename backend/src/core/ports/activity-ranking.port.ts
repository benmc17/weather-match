import { RankedActivities } from "../model/ranked-activities";

export interface ActivityRankingPort {
    rankByWeather(lat: number, long: number, timeframeDays: number): Promise<RankedActivities>;
}