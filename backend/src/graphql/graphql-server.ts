import express from 'express';
import cors from 'cors';
import { config } from '../config';
import { createHandler } from 'graphql-http/lib/use/express';
import { GraphQLSchema } from 'graphql';
import playground from 'graphql-playground-middleware-express';

export const startGraphQLServer = (schema: GraphQLSchema) => {
    const app = express();

    app.use(cors({
        origin: '*', // In production this should be set to the hostname of the UI
        methods: ['GET', 'POST', 'PUT', 'OPTIONS']
    }));  
    
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.set('etag', false)
    app.set('x-powered-by', false)

    app.use(function(req, res, next) {
        res.setHeader('cache-control', 'no-cache, no-store, must-revalidate')
        res.setHeader('pragma', 'no-cache')
        res.setHeader('expires', '-1')
        next();
    });

    app.use('/graphql', createHandler({ schema }));
    app.get('/playground', playground({ endpoint: '/graphql' }));

    app.listen(config.port, () => {
        console.log(`🚀 Activity Ranking API is running on port http://localhost:${config.port}/graphql`);
        console.log(`🎮 Playground is running on port http://localhost:${config.port}/playground`);
    });
}