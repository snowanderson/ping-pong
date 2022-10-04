# Ping Pong forms API [![Test](https://github.com/snowanderson/shop-api/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/snowanderson/ping-pong/actions/workflows/test.yml)

## Pre-requisites

- Docker (if using Docker only development or if using MongoDB through Docker)
- NodeJS (if not fully using Docker. Tested in `v16.17.0`)

## Running the app

### Through Docker :

```bash
# development
docker compose up dev
```

### Using NodeJS locally:

```bash
# Install dependencies
npm ci

# Create .env file
cp .env.example .env

# You might require to update the .env content
# for the app to works (MONGO_URL might be mongodb://root:password@localhost/)

# Run in watching mode
npm run start:dev
```

Once started, the graphQL and its documentation are available at http://localhost:3000/graphql

## Running tests

### Through Docker:

```bash
# unit tests
docker-compose run dev npm run test
# e2e tests
docker-compose run dev npm run test:e2e
# test coverage
docker-compose run dev npm run test:cov
```

### Using NodeJS locally:

```bash
# unit tests
npm run test
# e2e tests
npm run test:e2e
# test coverage
npm run test:cov
```