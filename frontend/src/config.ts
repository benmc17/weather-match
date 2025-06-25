import dotenv from 'dotenv';
dotenv.config()

export const config = {
    activityRankingApiHost: process.env.ACTIVITY_RANKING_API_HOST ?? "http://localhost:8081",
    timeframeDays: parseInt(process.env.TIMEFRAME_DAYS ?? "7"),
    port: process.env.PORT ?? 3000
};