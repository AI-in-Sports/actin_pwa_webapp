FROM node:16 AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:16 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG EXPRESS_BACKEND ELASTIC_APM
ENV EXPRESS_BACKEND=${EXPRESS_BACKEND} ELASTIC_APM=${ELASTIC_APM} NITRO_PRESET=node_cluster
RUN yarn build

FROM node:16 AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nuxtjs

COPY --from=builder /app/package.json ./package.json

COPY --from=builder --chown=nuxtjs:nodejs /app/.output/ ./.output/

USER nuxtjs

EXPOSE 3000

ARG EXPRESS_BACKEND ELASTIC_APM
ENV EXPRESS_BACKEND=${EXPRESS_BACKEND} ELASTIC_APM=${ELASTIC_APM} NITRO_HOST=0.0.0.0 NITRO_PORT=3000

CMD ["node",".output/server/index.mjs"]
