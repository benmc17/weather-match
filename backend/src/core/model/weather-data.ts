export class WeatherData {
    readonly temperatures: number[];
    readonly windSpeeds: number[];
    readonly precipitation: number[];
    readonly snowfall: number[];
    readonly sunshineDuration: number[];
    readonly elevation: number;

    constructor(temperatures: number[], windSpeeds: number[], precipitation: number[], snowfall: number[], sunshineDuration: number[], elevation: number) {
        this.temperatures = temperatures;
        this.windSpeeds = windSpeeds;
        this.precipitation = precipitation;
        this.snowfall = snowfall;
        this.sunshineDuration = sunshineDuration;
        this.elevation = elevation;
    }
}