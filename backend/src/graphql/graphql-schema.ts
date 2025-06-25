import { ActivityRankingPort } from "../core/ports";
import { GraphQLEnumType, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";

const GeographyEnum = new GraphQLEnumType({
    name: 'GeographyEnum',
    values: {
        MOUNTAINOUS: { value: 'MOUNTAINOUS' },
        COASTAL: { value: 'COASTAL' },
        FLAT_INLAND: { value: 'FLAT_INLAND' }
    }
});

const WeatherConditionEnum = new GraphQLEnumType({
    name: 'WeatherConditionEnum',
    values: {
        RAINING: { value: 'RAINING' },
        SNOWING: { value: 'SNOWING' },
        COLD: { value: 'COLD' },
        SUNNY: { value: 'SUNNY' },
        HOT: { value: 'HOT' },
        WINDY: { value: 'WINDY' },
        COMFORTABLE: { value: 'COMFORTABLE' }
    }
});

const LocationType = new GraphQLObjectType({
    name: 'LocationType',
    fields: {
        lat: { type: new GraphQLNonNull(GraphQLFloat)  },
        long: { type: new GraphQLNonNull(GraphQLFloat)  },
        geography: { type: new GraphQLNonNull(GeographyEnum) },
        weatherConditions: { type: new GraphQLNonNull(new GraphQLList(WeatherConditionEnum)) },
    }
})

const ActivityRankingType = new GraphQLObjectType({
    name: 'ActivityRankingType',
    fields: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        rank: { type: new GraphQLNonNull(GraphQLInt) },
        suitabilityScore: { type: new GraphQLNonNull(GraphQLFloat) },
    }
})

const RankedActivitiesType = new GraphQLObjectType({
    name: 'RankActivitiesType',
    fields: {
        activities: { type: new GraphQLNonNull(new GraphQLList(ActivityRankingType)) },
        location: { type: new GraphQLNonNull(LocationType) }
    }
})

export const createSchema = (activeRankingService: ActivityRankingPort): GraphQLSchema => {
    const RootQuery = new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
            rankByWeather: {
                type: new GraphQLNonNull(RankedActivitiesType),
                args: {
                    lat: { type: new GraphQLNonNull(GraphQLFloat) },
                    long: { type: new GraphQLNonNull(GraphQLFloat) },
                    timeframeDays: { type: new GraphQLNonNull(GraphQLInt) }
                },
                resolve: async (_, {lat, long, timeframeDays}: { lat: number, long: number, timeframeDays: number }) =>
                    await activeRankingService.rankByWeather(lat, long, timeframeDays)
            }
        }
    })

    return new GraphQLSchema({
        query: RootQuery,
        types: [RankedActivitiesType, ActivityRankingType, LocationType, WeatherConditionEnum, GeographyEnum],
    })
}
