import { Geography, WeatherCondition } from "../model";

export class Location {
    readonly lat: number;
    readonly long: number;
    readonly geography: Geography;
    readonly weatherConditions: WeatherCondition[];

    constructor(lat: number, long: number, geography: Geography, weatherConditions: WeatherCondition[]) {
        this.lat = lat;
        this.long = long;
        this.geography = geography;
        this.weatherConditions = weatherConditions;
    }
}