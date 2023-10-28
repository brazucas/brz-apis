FROM node:18-alpine as base

WORKDIR /var/www
COPY package.json yarn.lock ./

FROM base as build
RUN yarn
COPY ./ ./
RUN yarn build

FROM base as production
ENV NODE_ENV=production
RUN yarn install --frozen-lockfile
COPY --chown=node:node ./ ./
COPY --chown=node:node --from=build /var/www/dist ./dist
USER node
CMD ["yarn", "start"]

FROM base as development
ENV NODE_ENV=development
RUN yarn
COPY ./ ./
CMD ["yarn", "start:dev"]