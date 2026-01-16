ARG NODE_VERSION=24.11.1
FROM node:${NODE_VERSION}-slim AS base

# The web Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update this Dockerfile, the Dockerfile in the web workspace and copy that over to Dockerfile in the docs.

FROM base AS prepare
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# Set working directory
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# Enable `pnpm add --global` on Alpine Linux
ENV PNPM_HOME=/usr/local/bin
ENV PATH=$PNPM_HOME:$PATH

# Add global packages
RUN pnpm add --global @upleveled/preflight@latest turbo

COPY . .
RUN turbo prune api --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate
# First install dependencies (as they change less often)
COPY --from=prepare /app/out/json/ .
RUN pnpm install

# Build the project and its dependencies
COPY --from=prepare /app/out/full/ .

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN pnpm turbo build

FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs

RUN mkdir -p /app/data && \
    chown -R expressjs:expressjs /app/data && \
    chmod -R 755 /app/data

USER expressjs
COPY --from=builder /app .

CMD node apps/api/dist/index.js
