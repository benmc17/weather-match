import { Activity, ActivityRanking, WeatherCondition } from "../model";

const determineHighestSuitabilityScores = (activities: Activity[], weatherConditions: WeatherCondition[]): { activity: Activity, suitabilityScore: number }[] => {
    if (!activities?.length || !weatherConditions?.length) {
        return [];
    }
    
    const suitabilityScores = []

    // This algorithm could be improved by using a more complex scoring system, but for now we will just use the highest suitability score for each activity
    for (let activity of activities) {
        const suitableWeather = activity.suitableWeather.filter(s => weatherConditions.includes(s.weather));
        const highestScore = suitableWeather.reduce((max, current) => Math.max(max, current.suitabilityScore), 0);
        suitabilityScores.push({
            activity: activity,
            suitabilityScore: highestScore
        })
    }

    return suitabilityScores.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
}

const rankActivities = (activities: Activity[], weatherConditions: WeatherCondition[]): ActivityRanking[] => {
    if (!activities?.length || !weatherConditions?.length) {
        return [];
    }
    
    const highestSuitabilityScores = determineHighestSuitabilityScores(activities, weatherConditions);
    return highestSuitabilityScores.map(({ activity, suitabilityScore }, i) => new ActivityRanking(activity.name, i+1, suitabilityScore))
}

export { rankActivities, determineHighestSuitabilityScores };