FROM alpine:3.18.2 as base

RUN apk add --update --no-cache nodejs yarn

LABEL fly_launch_runtime="NodeJS/Prisma"

WORKDIR /app

ENV NODE_ENV=production

# Separate build stage to reduce size of final image
FROM base as build

# Install dependencies
COPY --link package.json yarn.lock .
RUN yarn install --production=false

# Generate Prisma Client
COPY --link prisma .
RUN yarn exec prisma generate

# Copy application code
COPY --link . .

# Bundle typescript to JS
RUN yarn build

# Remove development dependencies
RUN yarn install --production=true

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Run migrations & start the server
CMD yarn exec prisma migrate deploy && node dist/index.js
