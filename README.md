# Weather Matcher App
1. [Introduction](#introduction)
1. [Omitted Features and Future Enhancements](#omitted-features-and-future-enhancements)
1. [Quick Start](#quick-start)
1. [Application Design](#application-design)
    1. [Frontend: weather-matcher-ui](#frontend---weather--matcher--ui)
    1. [Backend: activity-ranking-api](#backend---activity--ranking--api)
    1. [Algorithm](#algorithm)
1. [Development Setup](#development-setup)
1. [Use of AI](#use-of-ai)


## Introduction
The Weather Matcher is an intelligent web application that ranks and recommends activities based on real-time weather conditions for any chosen location.

The system is formed of two applications:
- Activity Ranking API
- Weather Matcher UI

The API is a Node.JS/TypeScript application that uses Express and GraphQL.

The UI is a Next.JS/TypeScript application built with React.JS.

## Omitted Features and Future Enhancements
Several improvements and additional features could be included in the application should it be productionized, these include:
- Caching of requests, primarily those to Open Meteo (locations only - weather conditions need to be in real time).
- Logging should be improved using an appropriate logging solution to enable better observability.
- End to end and API tests. Testing of the integrated system including the backend API. Wiremock (or similar) would be required to emulate the Open Meteo API.
- Improved UI/UX design. Currently the UI design is limited and does not include essential elements such as accessibility considerations, internationalization, etc.
- Error handling could be improved, particularly around API responses and how this surfaces to the user.
- Improved algorithm. The current algorithm does a basic check for the maximum suitability score, this could be improved upon using detailed data with expert meteorological insight.
- The determination of a mountainous location, and therefore enable Skiing, is only done based on elevation and does not consider other considerations such as whether it is a Ski resort.
- Activities are currently hard coded in the repository, this could be improved upon by including a database and a caching mechanism.
- Test coverage of the UI. Currently test coverage of the React components is limited due to time constraints, in a production system this would need to be increased.

Most of the above features are for productionization of the application and were omitted due to time constraints, as it was judged that the core business logic and algorithm should take priority given the application will not be put into a production setting.

## Quick Start
The repository includes a `docker-compose.yaml` that contains the UI and API applications.

To start the applications:

1. Ensure you have installed the prerequisites:
    - Node.JS
    - NPM
    - PNPM
    - Docker

1. Navigate to the root of the project directory and run:
    ```
    docker compose up -d
    ```
1. It will likely take a few minutes to build and start the applications.
1. Once the applications are running, the following can be accessed for the GraphQL playground:
    ```
    http://localhost:8081/playground
    ```
1. Or the UI can be accessed here:
    ```
    http://localhost:3000
    ```

## Application Design
The project is split into `frontend` and `backend` applications:

### Frontend
The UI is a Next.JS application that broadly follows the atomic design pattern and utilizes atoms, molecules, organisms and templates. It is structured as a client-side application using React, and a server-side 'Backend for Frontend' (BFF) that proxies requests to the API.

### Backend
The backend API is a Node.JS application that uses Express for HTTP operations. It is designed to have a hexagonal architecture utilizing 'ports' and 'adapters' that ensure the core business logic is decoupled from external interfaces, such as API requests, database access (not relevant in this scenario) and the Express HTTP/GraphQL interface.

### Algorithm
The algorithm to rank the activities uses a 'suitability score' that is assigned to each weather condition for each activity. Should a certain weather condition not be appropriate entirely for that activity, it is omitted from the list.

In addition, each activity has a 'geography' which describes the terrain that is most appropriate. For example, skiing would be most appropriate in mountainous conditions.

There are three geography types: flat inland, coastal and mountainous. Mountainous terrain is determined by elevation and coastal locations are determined using elevation and the Open Meteo marine API.

## Development Setup
To run the applications locally perform the following steps:

1. In a terminal navigate to the `backend` directory.
1. (optional) To run the unit tests:
    ```
    pnpm test
    ```
1. Run the application in dev mode:
    ```
    pnpm dev
    ```
1. navigate to the `frontend` directory.
1. (optional) To run the unit tests:
    ```
    pnpm test
    ```
1. Run the application in dev mode:
    ```
    pnpm dev
    ```
1. Navigate to `http://localhost:3000` in a browser or `http://localhost:8081/playground` for the Graph QL playground.

## Use of AI
AI was used during the development of this application (OpenAI and GitHub CoPilot), these are the scenarios where AI was found to be most useful:
- Providing insight into the Open Meteo API and for suggestions on suitable thresholds for weather conditions.
- Suggesting test scenarios, producing boilerplate code and test data generation.
- Assisting with Node.JS GraphQL setup, configuration and code suggestions.
- Suggesting appropriate UI designs, primarily via CSS.

Code suggestions provided by the AI models was interpreted as a suggested approach and then after walking through the logic was only incorporated into the existing code base if appropriate.

Boilerplate code and unit test suggestions were thoroughly checked and compared against requirements to ensure accuracy and then appropriately altered to fit the application structure and coding style.