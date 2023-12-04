FROM node:18 AS base

RUN yarn global add pnpm

ARG APP_BACKEND DISABLE_RESERVATION

ENV APP_BACKEND=${APP_BACKEND} DISABLE_RESERVATION=${DISABLE_RESERVATION}

ENV NITRO_HOST=0.0.0.0 NITRO_PORT=3000 NITRO_PRESET=node_cluster

FROM base AS deps

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN pnpm build

FROM node:16 AS runner

WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nuxtjs

COPY --from=builder /app/package.json ./package.json

COPY --from=builder --chown=nuxtjs:nodejs /app/.output/ ./.output/

USER nuxtjs

CMD ["node",".output/server/index.mjs"]
