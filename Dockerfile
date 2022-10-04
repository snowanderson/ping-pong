FROM node:18-alpine as base

WORKDIR /usr/src/app

COPY package*.json ./

FROM base as dev

RUN npm ci

COPY . .

FROM dev as build

ENV NODE_ENV production

RUN npm run build
RUN npm ci --only=production && npm cache clean --force

FROM node:18-alpine as prod

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]
