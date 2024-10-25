FROM node:lts-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build

# ======= API Gateway =======
FROM base AS api-gateway
WORKDIR /app/services/api-gateway
# Copy the built dist folder, package.json, service .env, and node_modules from the build stage
COPY --from=build /usr/src/app/services/api-gateway/package.json ./package.json
COPY --from=build /usr/src/app/services/api-gateway/dist ./dist
COPY --from=build /usr/src/app/services/api-gateway/.env ./.env
COPY --from=build /usr/src/app/services/api-gateway/node_modules ./node_modules

# Copy shared nats.env
COPY --from=build /usr/src/app/nats.env ../../nats.env

# Copy shared lib
COPY --from=build /usr/src/app/shared ../../shared

# Root node_modules are required. Childs are symlinks.
COPY --from=build /usr/src/app/node_modules ../../node_modules

EXPOSE 3030

# Start the application in production mode
CMD ["pnpm", "start:prod"]
# ============================

# ======= User Service =======
FROM base AS user-service
WORKDIR /app/services/user

# Copy the built dist folder, package.json, and node_modules from the build stage
COPY --from=build /usr/src/app/services/user/package.json ./package.json
COPY --from=build /usr/src/app/services/user/dist ./dist
COPY --from=build /usr/src/app/services/user/node_modules ./node_modules

# Copy shared nats.env
COPY --from=build /usr/src/app/nats.env ../../nats.env

# Copy shared lib
COPY --from=build /usr/src/app/shared ../../shared

# Root node_modules are required as childs are symlinks
COPY --from=build /usr/src/app/node_modules ../../node_modules

# Start the application in production mode
CMD ["pnpm", "start:prod"]
# ============================

# ===== Hubspot Service ======
FROM base AS hubspot-service
WORKDIR /app/services/hubspot

# Copy the built dist folder, package.json, service .env, and node_modules from the build stage
COPY --from=build /usr/src/app/services/hubspot/package.json ./package.json
COPY --from=build /usr/src/app/services/hubspot/dist ./dist
COPY --from=build /usr/src/app/services/hubspot/node_modules ./node_modules
COPY --from=build /usr/src/app/services/hubspot/.env .env

# Copy shared nats.env
COPY --from=build /usr/src/app/nats.env ../../nats.env

# Copy shared lib
COPY --from=build /usr/src/app/shared ../../shared

# Root node_modules are required as childs are symlinks
COPY --from=build /usr/src/app/node_modules ../../node_modules

# Start the application in production mode
CMD ["pnpm", "start:prod"]
# ============================
