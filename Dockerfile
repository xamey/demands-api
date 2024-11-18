ARG BUN_VERSION=1.1.34
ARG NODE_VERSION=22.11.0
FROM imbios/bun-node:${BUN_VERSION}-${NODE_VERSION}-slim

# Set production environment
ENV NODE_ENV="production"

# Bun app lives here
WORKDIR /app

# Copy app files to app directory
COPY . .

# Install node modules
RUN bun install

# Run bun:migration:create if DB_CREATE is set
RUN if [ "$DB_CREATE" = "true" ]; then bun run migration:create; fi
# Run bun:migration:run if DB_RUN is set
RUN if [ "$DB_RUN" = "true" ]; then bun run migration:run; fi
# Run bun:migration:seed if DB_SEED is set
RUN if [ "$DB_SEED" = "true" ]; then bun run migration:seed; fi
# Run bun:migration:drop if DB_DROP is set
RUN if [ "$DB_DROP" = "true" ]; then bun run migration:drop; fi

RUN apt-get -y update; apt-get -y install curl

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "bun", "run", "dev" ]