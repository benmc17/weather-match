import { ActivityRankingService } from "./core/business/activity-ranking-service";
import { startGraphQLServer } from "./graphql/graphql-server";
import { createSchema } from "./graphql/graphql-schema";
import { OpenMeteoAdapter } from "./open-meteo/open-meteo-adapter";
import { ActivityRepository } from "./data/activity-repository";

const startApplication = () => {
    const openMeteoAdapter = new OpenMeteoAdapter()
    const activityRepository = new ActivityRepository()
    const activityRankingService = new ActivityRankingService(openMeteoAdapter, activityRepository)
    const graphQLSchema = createSchema(activityRankingService)
    
    console.log('Starting GraphQL Server')
    startGraphQLServer(graphQLSchema);
}

console.log(`
  __        __         _   _               
  \\ \\      / /__  __ _| |_| |__   ___ _ __ 
   \\ \\ /\\ / / _ \\/ _\` | __| '_ \\ / _ \\ '__|
    \\ V  V /  __/ (_| | |_| | | |  __/ |   
     \\/\\_/\\_/\\___|\\__,_|\\__|_| |_|\\___|_|   
  |  \\/  | __ _| |_ ___| |__   ___ _ __    
  | |\\/| |/ _\` | __/ __| '_ \\ / _ \\ '__|   
  | |  | | (_| | || (__| | | |  __/ |      
  |_|  |_|\\__,_|\\__\\___|_| |_|\\___|_|      
`);

try {
    startApplication()
} catch (error: unknown) {
    console.error(`Failed to start the Activity Ranking API: ${error}`);
}