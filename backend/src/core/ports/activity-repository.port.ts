import { Activity, Geography, WeatherCondition } from "../model";

export interface ActivityRepositoryPort {
    getActivities(geography: Geography, weatherConditions: WeatherCondition[]): Activity[];
}