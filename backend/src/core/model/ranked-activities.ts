import { ActivityRanking } from "./activity-ranking";
import { Location } from "./location";

export class RankedActivities {
    readonly activities: ActivityRanking[];
    readonly location: Location;

    constructor(activities: ActivityRanking[], location: Location) {
        this.activities = activities;
        this.location = location
    }
}