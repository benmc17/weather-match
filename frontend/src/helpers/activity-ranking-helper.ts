import { config } from '../config'
import { ActivityRankingResponse } from './get-activity-ranking-response';

export const getActivityRanking = async (lat: number, long: number): Promise<ActivityRankingResponse> => {
    const res = await fetch('/api/get-activity-ranking',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ lat, long, timeframeDays: config.timeframeDays })
        }
    );
    const data = await res.json();
    return data || {};
}