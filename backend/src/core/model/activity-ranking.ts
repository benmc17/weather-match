export class ActivityRanking {
    readonly name: string;
    readonly rank: number;
    readonly suitabilityScore: number;

    constructor(name: string, rank: number, suitabilityScore: number) {
        this.name = name;
        this.rank = rank;
        this.suitabilityScore = suitabilityScore;
    }
}