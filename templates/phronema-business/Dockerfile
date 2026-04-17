FROM node:22-slim AS base

RUN corepack enable && corepack prepare pnpm@10.28.0 --activate
WORKDIR /app

# ---- Install dependencies ----
FROM base AS deps

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/ packages/
COPY templates/ templates/
COPY demos/ demos/
COPY docs/package.json docs/package.json
COPY e2e/fixture/package.json e2e/fixture/package.json

RUN sed -i '/slidev/d' pnpm-workspace.yaml
RUN pnpm install --frozen-lockfile

# ---- Build ----
FROM deps AS build

COPY . .
RUN sed -i '/slidev/d' pnpm-workspace.yaml

# Point SQLite to a persistent data directory
RUN sed -i 's|file:./data.db|file:./data/data.db|' templates/phronema-business/astro.config.mjs

# Build all packages then the template
RUN pnpm build && pnpm --filter @phronema-labs/emdash-starter-business build

# Bundle into a standalone deployment
RUN pnpm --filter @phronema-labs/emdash-starter-business deploy /deploy --prod --legacy

# Copy build output and seed data
RUN cp -r /app/templates/phronema-business/dist /deploy/dist
RUN cp -r /app/templates/phronema-business/seed /deploy/seed
RUN cp /app/templates/phronema-business/astro.config.mjs /deploy/astro.config.mjs

# ---- Runtime ----
FROM node:22-slim

WORKDIR /app
COPY --from=build /deploy .

RUN mkdir -p data uploads \
    && ln -s /app/node_modules/.pnpm/node_modules/kysely /app/node_modules/kysely

# Seed the database at build time so the container starts ready
RUN npx emdash init && npx emdash seed \
    && cp /app/data.db /app/data/data.db

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

CMD ["node", "./dist/server/entry.mjs"]
