# syntax=docker/dockerfile:1
FROM node:20-alpine AS base

# The lockfile is format 6.0, which pnpm 9+ refuses; keep pnpm on 8.
RUN npm install -g pnpm@8.15.9

ARG APP_BACKEND DISABLE_RESERVATION

# Node's default heap limit inside a container (~2 GB) is below what Nuxt/Rollup
# needs for this app. Without an explicit limit the build dies with:
#   FATAL ERROR: Ineffective mark-compacts near heap limit
#   Allocation failed - JavaScript heap out of memory
# Raise the build arg if the image is built on a machine with more memory.
ARG NODE_MAX_OLD_SPACE_SIZE=8192

ENV APP_BACKEND=${APP_BACKEND} \
    DISABLE_RESERVATION=${DISABLE_RESERVATION} \
    NUXT_TELEMETRY_DISABLED=1 \
    NODE_OPTIONS="--max-old-space-size=${NODE_MAX_OLD_SPACE_SIZE}"

ENV NITRO_HOST=0.0.0.0 \
    NITRO_PORT=3000 \
    NITRO_PRESET=node_cluster

FROM base AS deps

WORKDIR /app

COPY package.json pnpm-lock.yaml .npmrc ./

# The registry token is mounted only for this step and never stored in a layer:
#   docker build --secret id=npm_token,env=NPM_ACTIN_TOKEN .
RUN --mount=type=secret,id=npm_token,required=true \
    NPM_ACTIN_TOKEN="$(cat /run/secrets/npm_token)" pnpm install --frozen-lockfile

FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN pnpm build

FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nuxtjs

COPY --from=builder /app/package.json ./package.json
COPY --from=builder --chown=nuxtjs:nodejs /app/.output/ ./.output/

USER nuxtjs

EXPOSE 3000

CMD ["node", "./.output/server/index.mjs"]
