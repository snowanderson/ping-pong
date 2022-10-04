# Ping Pong forms API [![Test](https://github.com/snowanderson/shop-api/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/snowanderson/ping-pong/actions/workflows/test.yml)

## Pre-requisites

- Docker

## Running the app

```bash
# development
docker compose up dev

# production mode
docker compose up prod
```

Once started, the graphQL and its documentation are available at http://localhost:3000/graphql

## Running tests

```bash
# unit tests
docker-compose run dev npm run test
# e2e tests
docker-compose run dev npm run test:e2e
# test coverage
docker-compose run dev npm run test:cov
```

